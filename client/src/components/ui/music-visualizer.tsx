import React, { useEffect, useRef, useState } from 'react';

interface MusicVisualizerProps {
  className?: string;
}

export default function MusicVisualizer({ className = '' }: MusicVisualizerProps) {
  const [barHeights, setBarHeights] = useState<number[]>(Array(20).fill(0).map(() => Math.floor(Math.random() * 25) + 5));
  const animationRef = useRef<number | null>(null);
  const isAnimatingRef = useRef(false);
  
  useEffect(() => {
    // Initialize with random heights
    setBarHeights(Array(20).fill(0).map(() => Math.floor(Math.random() * 20) + 5));
    
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  // Start or stop animation based on audio playing state
  useEffect(() => {
    const audioElements = document.querySelectorAll('audio');
    
    const handlePlay = () => {
      if (!isAnimatingRef.current) {
        isAnimatingRef.current = true;
        animateVisualizer();
      }
    };
    
    const handlePause = () => {
      isAnimatingRef.current = false;
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      
      // Reset to static random heights when paused
      setBarHeights(Array(20).fill(0).map(() => Math.floor(Math.random() * 20) + 5));
    };
    
    audioElements.forEach(audio => {
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('ended', handlePause);
    });
    
    return () => {
      audioElements.forEach(audio => {
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('ended', handlePause);
      });
    };
  }, []);
  
  const animateVisualizer = () => {
    // Generate new random heights for bars
    setBarHeights(prev => prev.map(() => Math.floor(Math.random() * 30) + 5));
    
    // Continue animation if still playing
    if (isAnimatingRef.current) {
      animationRef.current = requestAnimationFrame(() => {
        // Add a small delay between updates to make it look more natural
        setTimeout(animateVisualizer, 100);
      });
    }
  };
  
  return (
    <div className={`flex items-end h-10 w-full ${className}`}>
      {barHeights.map((height, index) => (
        <div 
          key={index}
          className="flex-1 mx-px rounded-t bg-purple-500"
          style={{ height: `${height}px` }}
        ></div>
      ))}
    </div>
  );
}
