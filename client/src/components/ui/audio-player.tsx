import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Download, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
  src: string;
  onDownload: () => void;
}

export default function AudioPlayer({ src, onDownload }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  
  // Reset player state when source changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setIsLoaded(false);
    setError(false);
    
    // Force reload if the audio element exists
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, [src]);
  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoaded(true);
      setError(false);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      audio.currentTime = 0;
    };
    
    const handleError = () => {
      console.error("Audio playback error:", src);
      setError(true);
      setIsPlaying(false);
    };
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [src]);
  
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || error) return;
    
    if (isPlaying) {
      audio.pause();
    } else {
      // Sometimes play() can fail silently, use a promise to catch errors
      audio.play().catch(err => {
        console.error("Playback error:", err);
        setError(true);
        setIsPlaying(false);
      });
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isMuted) {
      audio.volume = volume;
    } else {
      audio.volume = 0;
    }
    
    setIsMuted(!isMuted);
  };
  
  const handleProgressClick = (e: React.MouseEvent) => {
    const audio = audioRef.current;
    const progressBar = progressRef.current;
    if (!audio || !progressBar || error) return;
    
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  // Determine audio type based on src URL extension
  const getAudioType = (url: string): string => {
    const extension = url.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'mp3':
        return 'audio/mpeg';
      case 'wav':
        return 'audio/wav';
      case 'ogg':
        return 'audio/ogg';
      case 'aac':
        return 'audio/aac';
      case 'm4a':
        return 'audio/mp4';
      default:
        return 'audio/mpeg'; // Default fallback
    }
  };
  
  return (
    <div className="audio-controls flex flex-col">
      <div className="flex items-center">
        <button 
          className={`w-10 h-10 rounded-full ${error ? 'bg-gray-400' : 'bg-purple-500'} text-white flex items-center justify-center shadow ${error ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          onClick={togglePlay}
          disabled={error}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
        
        <audio ref={audioRef} preload="metadata">
          <source src={src} type={getAudioType(src)} />
          <source src={src} type="audio/mpeg" />
          <source src={src} type="audio/wav" />
          <source src={src} type="audio/aac" />
          Your browser does not support the audio element.
        </audio>
        
        <div className="ml-3 flex-grow">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600">{formatTime(currentTime)}</span>
            <span className="text-xs text-gray-600">{isLoaded ? formatTime(duration) : '--:--'}</span>
          </div>
          <div 
            ref={progressRef}
            className={`relative h-2 bg-gray-200 rounded-full ${error ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={!error ? handleProgressClick : undefined}
          >
            <div 
              className={`absolute top-0 left-0 h-full ${error ? 'bg-gray-400' : 'bg-purple-500'} rounded-full`}
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            ></div>
            <div 
              className={`absolute top-0 h-2 w-2 bg-white border-2 ${error ? 'border-gray-400' : 'border-purple-500'} rounded-full`}
              style={{ 
                left: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                transform: 'translateX(-50%)'
              }}
            ></div>
          </div>
        </div>
        
        <div className="ml-3 flex items-center">
          <button 
            className="p-2 text-gray-600"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <button 
            className={`ml-2 px-3 py-1 rounded border ${error ? 'border-gray-400 text-gray-400 cursor-not-allowed' : 'border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white cursor-pointer'} transition-colors text-sm flex items-center`}
            onClick={!error ? onDownload : undefined}
            disabled={error}
          >
            <Download size={16} className="mr-1" /> Download
          </button>
        </div>
      </div>
      
      {error && (
        <div className="mt-2 text-sm text-red-500">
          Unable to play this audio. The file may be unavailable or in an unsupported format.
        </div>
      )}
    </div>
  );
}
