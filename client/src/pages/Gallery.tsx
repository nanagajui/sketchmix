import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { ChevronLeft, RefreshCw, Download } from 'lucide-react';
import { Creation, EmotionData } from '@shared/schema';

// Ensure proper typing for emotionalAnalysis
type CreationWithAnalysis = Omit<Creation, 'emotionalAnalysis'> & {
  emotionalAnalysis: EmotionData;
};
import AudioPlayer from '@/components/ui/audio-player';

export default function Gallery() {
  const [selectedCreation, setSelectedCreation] = useState<CreationWithAnalysis | null>(null);
  
  const { data: creations = [], isLoading, isError, refetch } = useQuery<CreationWithAnalysis[]>({
    queryKey: ['/api/creations'],
    refetchOnWindowFocus: false,
  });
  
  const handleDownloadMusic = () => {
    if (!selectedCreation) return;
    
    const link = document.createElement('a');
    link.href = selectedCreation.musicUrl;
    link.download = `music-${selectedCreation.id}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleDownloadImage = (creation: CreationWithAnalysis) => {
    const link = document.createElement('a');
    link.href = creation.generatedImage;
    link.download = `image-${creation.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link href="/" className="flex items-center text-purple-600 hover:text-purple-800 transition-colors">
            <ChevronLeft className="mr-1" size={20} />
            <span>Back to Drawing</span>
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-center text-gray-800">Your Creations Gallery</h1>
        <button 
          onClick={() => refetch()}
          className="flex items-center text-purple-600 hover:text-purple-800"
        >
          <RefreshCw size={18} className="mr-1" />
          <span>Refresh</span>
        </button>
      </div>
      
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}
      
      {isError && (
        <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg">
          <p>Error loading your creations. Please try again later.</p>
        </div>
      )}
      
      {!isLoading && !isError && creations?.length === 0 && (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-600 mb-4">You haven't created anything yet!</p>
          <Link href="/" className="inline-block px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
            Create Your First Artwork
          </Link>
        </div>
      )}
      
      {selectedCreation && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Creation Details</h2>
              <button 
                onClick={() => setSelectedCreation(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Your Drawing</h3>
                <div className="bg-gray-100 rounded-lg p-2">
                  <img 
                    src={selectedCreation.drawingData} 
                    alt="Original Drawing" 
                    className="w-full h-auto rounded border"
                  />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">AI Generated Image</h3>
                <div className="bg-gray-100 rounded-lg p-2">
                  <img 
                    src={selectedCreation.generatedImage} 
                    alt="Generated Image" 
                    className="w-full h-auto rounded border"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Emotional Analysis</h3>
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="mb-3">{selectedCreation.emotionalAnalysis.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedCreation.emotionalAnalysis.dominantEmotions.map((emotion: {name: string, percentage: number}, i: number) => (
                    <div key={i} className="bg-white p-2 rounded shadow">
                      <div className="text-sm font-medium">{emotion.name}</div>
                      <div className="relative pt-1">
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                          <div 
                            style={{ width: `${emotion.percentage}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                          ></div>
                        </div>
                        <div className="text-xs text-right mt-1">{emotion.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Generated Music</h3>
              <div className="bg-gray-100 rounded-lg p-4">
                <AudioPlayer src={selectedCreation.musicUrl} onDownload={handleDownloadMusic} />
              </div>
            </div>
            
            <div className="text-right mt-6">
              <button 
                onClick={() => setSelectedCreation(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded mr-2 hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {creations?.map((creation: CreationWithAnalysis) => (
          <div key={creation.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative group cursor-pointer" onClick={() => setSelectedCreation(creation)}>
              <img 
                src={creation.generatedImage} 
                alt="Generated artwork" 
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Click to view details
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm text-gray-500">
                    Created: {formatDate(creation.createdAt)}
                  </p>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadImage(creation);
                  }}
                  className="text-purple-600 hover:text-purple-800 p-1"
                >
                  <Download size={18} />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-2">
                {creation.emotionalAnalysis.dominantEmotions.slice(0, 3).map((emotion: {name: string, percentage: number}, i: number) => (
                  <span 
                    key={i} 
                    className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                  >
                    {emotion.name}
                  </span>
                ))}
              </div>
              
              <button 
                onClick={() => setSelectedCreation(creation)}
                className="w-full mt-2 px-4 py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors text-sm"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}