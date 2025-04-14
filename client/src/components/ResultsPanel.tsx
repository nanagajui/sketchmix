import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Tabs from './Tabs';
import AudioPlayer from './ui/audio-player';
import MusicVisualizer from './ui/music-visualizer';

export default function ResultsPanel() {
  const [activeTab, setActiveTab] = useState<'image' | 'emotion' | 'music'>('image');
  
  // Query the generated image
  const { data: imageUrl } = useQuery({
    queryKey: ['generatedImage'],
    enabled: false, // This query will be populated by the mutation in DrawingCanvas
    gcTime: Infinity, // Keep data for the session
  });
  
  // Query the emotional analysis
  const { data: emotionalAnalysis } = useQuery({
    queryKey: ['emotionalAnalysis'],
    enabled: false, // This query will be populated by the mutation in DrawingCanvas
    gcTime: Infinity, // Keep data for the session
  });
  
  // Query the music data
  const { data: musicData } = useQuery({
    queryKey: ['musicData'],
    enabled: false, // This query will be populated by the mutation in DrawingCanvas
    gcTime: Infinity, // Keep data for the session
  });
  
  // Handle download image
  const handleDownloadImage = () => {
    if (!imageUrl) return;
    
    const link = document.createElement('a');
    link.download = 'my-cartoon-drawing.png';
    link.href = imageUrl;
    link.click();
  };
  
  // Handle download music
  const handleDownloadMusic = () => {
    if (!musicData?.musicUrl) return;
    
    const link = document.createElement('a');
    link.download = 'generated-music.mp3';
    link.href = musicData.musicUrl;
    link.click();
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md h-full flex flex-col">
      <div className="border-b border-gray-200">
        <div className="flex">
          <button 
            className={`flex-1 px-4 py-3 font-medium ${activeTab === 'image' ? 'text-purple-500 border-b-2 border-purple-500' : 'text-gray-600 hover:text-purple-500 transition-colors'}`}
            onClick={() => setActiveTab('image')}
          >
            <i className="fas fa-image mr-2"></i> Image
          </button>
          <button 
            className={`flex-1 px-4 py-3 font-medium ${activeTab === 'emotion' ? 'text-purple-500 border-b-2 border-purple-500' : 'text-gray-600 hover:text-purple-500 transition-colors'}`}
            onClick={() => setActiveTab('emotion')}
          >
            <i className="fas fa-heart mr-2"></i> Emotion
          </button>
          <button 
            className={`flex-1 px-4 py-3 font-medium ${activeTab === 'music' ? 'text-purple-500 border-b-2 border-purple-500' : 'text-gray-600 hover:text-purple-500 transition-colors'}`}
            onClick={() => setActiveTab('music')}
          >
            <i className="fas fa-music mr-2"></i> Music
          </button>
        </div>
      </div>
      
      <div className="flex-grow flex flex-col">
        {/* Image Tab */}
        {activeTab === 'image' && (
          <div className="h-full flex flex-col">
            {!imageUrl ? (
              <div className="p-4 text-center flex-grow flex flex-col items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-64 w-64 text-gray-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-800 mb-2">No Image Generated Yet</h3>
                <p className="text-gray-600 max-w-md">Draw something on the canvas and click "Generate" to create a cartoon image from your artwork</p>
              </div>
            ) : (
              <div className="h-full flex flex-col">
                <div className="flex-grow p-4 flex items-center justify-center">
                  <img 
                    src={imageUrl} 
                    alt="Generated cartoon image" 
                    className="max-h-[400px] rounded-lg shadow-lg object-contain"
                  />
                </div>
                <div className="border-t border-gray-200 p-4 flex justify-between">
                  <div>
                    <span className="text-sm text-gray-600">
                      <i className="fas fa-info-circle mr-1"></i> Generated from your drawing
                    </span>
                  </div>
                  <div>
                    <button 
                      onClick={handleDownloadImage}
                      className="px-3 py-1 rounded border border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white transition-colors text-sm flex items-center"
                    >
                      <i className="fas fa-download mr-1"></i> Download
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Emotion Tab */}
        {activeTab === 'emotion' && (
          <div className="h-full flex flex-col">
            {!emotionalAnalysis ? (
              <div className="p-4 text-center flex-grow flex flex-col items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-64 w-64 text-gray-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-800 mb-2">No Emotional Analysis Yet</h3>
                <p className="text-gray-600 max-w-md">Generate an image first to see its emotional analysis</p>
              </div>
            ) : (
              <div className="h-full flex flex-col p-4 overflow-y-auto">
                <div className="flex-grow">
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Emotional Analysis</h3>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                      {emotionalAnalysis.description}
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-md font-medium text-gray-800 mb-3">Dominant Emotions</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {emotionalAnalysis.dominantEmotions.map((emotion, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">{emotion.name}</span>
                            <span className="text-xs text-gray-600">{emotion.percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`rounded-full h-2 ${index % 3 === 0 ? 'bg-purple-500' : index % 3 === 1 ? 'bg-blue-500' : 'bg-purple-600'}`}
                              style={{ width: `${emotion.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Music Tab */}
        {activeTab === 'music' && (
          <div className="h-full flex flex-col">
            {!musicData?.musicUrl ? (
              <div className="p-4 text-center flex-grow flex flex-col items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-64 w-64 text-gray-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                <h3 className="text-lg font-medium text-gray-800 mb-2">No Music Generated Yet</h3>
                <p className="text-gray-600 max-w-md">Generate an image and emotional analysis first to create matching music</p>
              </div>
            ) : (
              <div className="h-full flex flex-col p-4 overflow-y-auto">
                <div className="flex-grow">
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Generated Music</h3>
                    <p className="text-gray-600 mb-4">
                      Music created based on the emotional analysis of your drawing
                    </p>
                    
                    <div className="music-player bg-gray-50 rounded-lg p-4">
                      <MusicVisualizer className="mb-3" />
                      <AudioPlayer src={musicData.musicUrl} onDownload={handleDownloadMusic} />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-medium text-gray-800 mb-3">Music Attributes</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {musicData.attributes.map((attr, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">{attr.name}</span>
                            <span className="text-xs text-gray-600">{attr.value}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`rounded-full h-2 ${index % 4 === 0 ? 'bg-purple-500' : index % 4 === 1 ? 'bg-blue-500' : index % 4 === 2 ? 'bg-purple-600' : 'bg-blue-400'}`}
                              style={{ width: `${attr.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
