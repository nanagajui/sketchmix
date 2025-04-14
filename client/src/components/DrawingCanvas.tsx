import React, { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { toast } from '@/hooks/use-toast';
import ToolBar from './ToolBar';
import { useCanvas } from '@/hooks/useCanvas';
import { queryClient } from '@/lib/queryClient';

export default function DrawingCanvas() {
  const [isGenerating, setIsGenerating] = useState(false);
  const {
    canvasRef,
    canvasContainerRef,
    clearCanvas,
    undo,
    redo,
    canUndo,
    canRedo,
    setBrushSize,
    setColor,
    setTool,
    currentTool,
    currentColor,
    brushSize,
    getCanvasDataUrl,
    isCanvasEmpty
  } = useCanvas();

  // Generate image mutation
  const generateImageMutation = useMutation({
    mutationFn: async (drawingData: string) => {
      const response = await apiRequest('POST', '/api/generate-image', { drawingData });
      return response.json();
    },
    onSuccess: (data) => {
      // Pass the generated image to the analyze image mutation
      analyzeImageMutation.mutate(data.imageUrl);
      // Update the imageUrl in the state
      queryClient.setQueryData(['generatedImage'], data.imageUrl);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to generate image: ${error.message}`,
        variant: 'destructive',
      });
      setIsGenerating(false);
    }
  });

  // Analyze image mutation
  const analyzeImageMutation = useMutation({
    mutationFn: async (imageUrl: string) => {
      const response = await apiRequest('POST', '/api/analyze-image', { imageUrl });
      return response.json();
    },
    onSuccess: (data) => {
      // Store the emotional analysis
      queryClient.setQueryData(['emotionalAnalysis'], data.analysis);
      
      // Generate music based on the emotional description
      generateMusicMutation.mutate(data.analysis.description);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to analyze image: ${error.message}`,
        variant: 'destructive',
      });
      setIsGenerating(false);
    }
  });

  // Generate music mutation
  const generateMusicMutation = useMutation({
    mutationFn: async (emotionalDescription: string) => {
      const response = await apiRequest('POST', '/api/generate-music', { emotionalDescription });
      return response.json();
    },
    onSuccess: (data) => {
      // Store the music URL and attributes
      queryClient.setQueryData(['musicData'], data);
      setIsGenerating(false);
      
      // Notify the user that everything is ready
      toast({
        title: 'Success!',
        description: 'Your drawing has been transformed into a cartoon image with matching music.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to generate music: ${error.message}`,
        variant: 'destructive',
      });
      setIsGenerating(false);
    }
  });

  // Handle generate button click
  const handleGenerate = async () => {
    // Get the canvas data URL
    const dataUrl = getCanvasDataUrl();
    
    if (!dataUrl) {
      toast({
        title: 'Empty Canvas',
        description: 'Please draw something on the canvas first!',
        variant: 'destructive',
      });
      return;
    }
    
    // Check if the canvas is mostly empty with just a few pixels
    if (isCanvasEmpty()) {
      toast({
        title: 'Almost Empty Canvas',
        description: 'Your drawing is too minimal. Please add more content!',
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: 'Starting Generation',
      description: 'Transforming your drawing into a cartoon image...',
    });
    
    setIsGenerating(true);
    
    try {
      // Start the generation pipeline
      generateImageMutation.mutate(dataUrl);
    } catch (error) {
      console.error('Error starting generation:', error);
      setIsGenerating(false);
      toast({
        title: 'Error',
        description: 'Failed to start the generation process. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Generate a surprise drawing
  const handleSurprise = () => {
    // Clear the canvas first
    clearCanvas();
    
    // Wait for the canvas to clear
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Choose a random template
      const surpriseTemplates = [
        // Simple house
        () => {
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 3;
          ctx.fillStyle = '#f59e0b';
          
          // House body
          ctx.beginPath();
          ctx.rect(canvas.width/2 - 80, canvas.height/2 - 60, 160, 120);
          ctx.stroke();
          
          // Roof
          ctx.beginPath();
          ctx.moveTo(canvas.width/2 - 100, canvas.height/2 - 60);
          ctx.lineTo(canvas.width/2, canvas.height/2 - 120);
          ctx.lineTo(canvas.width/2 + 100, canvas.height/2 - 60);
          ctx.closePath();
          ctx.stroke();
          
          // Door
          ctx.beginPath();
          ctx.rect(canvas.width/2 - 20, canvas.height/2 + 20, 40, 40);
          ctx.stroke();
          
          // Window
          ctx.beginPath();
          ctx.rect(canvas.width/2 - 60, canvas.height/2 - 40, 30, 30);
          ctx.stroke();
        },
        // Simple face
        () => {
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 3;
          
          // Face
          ctx.beginPath();
          ctx.arc(canvas.width/2, canvas.height/2, 80, 0, Math.PI * 2);
          ctx.stroke();
          
          // Eyes
          ctx.beginPath();
          ctx.arc(canvas.width/2 - 30, canvas.height/2 - 20, 10, 0, Math.PI * 2);
          ctx.arc(canvas.width/2 + 30, canvas.height/2 - 20, 10, 0, Math.PI * 2);
          ctx.fill();
          
          // Smile
          ctx.beginPath();
          ctx.arc(canvas.width/2, canvas.height/2 + 10, 40, 0.2, Math.PI - 0.2);
          ctx.stroke();
        },
        // Simple tree
        () => {
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 3;
          
          // Trunk
          ctx.beginPath();
          ctx.rect(canvas.width/2 - 15, canvas.height/2, 30, 100);
          ctx.fillStyle = '#b45309';
          ctx.fill();
          ctx.stroke();
          
          // Tree top
          ctx.beginPath();
          ctx.arc(canvas.width/2, canvas.height/2 - 30, 70, 0, Math.PI * 2);
          ctx.fillStyle = '#10b981';
          ctx.fill();
          ctx.stroke();
        }
      ];
      
      const randomTemplate = Math.floor(Math.random() * surpriseTemplates.length);
      surpriseTemplates[randomTemplate]();
    }, 100);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-['Poppins'] font-semibold text-gray-800">Drawing Canvas</h2>
        <p className="text-sm text-gray-600">Create your drawing to generate cartoon image and music</p>
      </div>
      
      <ToolBar 
        currentTool={currentTool}
        setTool={setTool}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        currentColor={currentColor}
        setColor={setColor}
        canUndo={canUndo}
        canRedo={canRedo}
        undo={undo}
        redo={redo}
        clearCanvas={clearCanvas}
      />
      
      <div 
        ref={canvasContainerRef}
        className="canvas-container relative bg-white w-full" 
        style={{ height: "460px", touchAction: "none" }}
      >
        <canvas 
          ref={canvasRef}
          className="w-full h-full border rounded cursor-crosshair shadow-inner"
        />
        
        {isGenerating && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
            <div className="text-white text-center">
              <i className="fas fa-spinner fa-spin text-3xl mb-3"></i>
              <p>Processing your drawing...</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-200 flex justify-between items-center">
        <div>
          <button 
            onClick={handleSurprise}
            className="px-3 py-2 rounded bg-white border border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white transition-colors flex items-center"
          >
            <i className="fas fa-magic mr-2"></i> Surprise Me
          </button>
        </div>
        <div>
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium shadow hover:shadow-md transition-shadow flex items-center ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isGenerating ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i> Generating...
              </>
            ) : (
              <>
                <i className="fas fa-bolt mr-2"></i> Generate
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
