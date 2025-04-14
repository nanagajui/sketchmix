import { useEffect, useRef, useState } from 'react';
import { getCoordinates, drawLine } from '@/lib/utils/canvas';

type Tool = 'brush' | 'eraser';

export function useCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<Tool>('brush');
  const [brushSize, setBrushSize] = useState(5);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [history, setHistory] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const lastPositionRef = useRef<{x: number, y: number} | null>(null);

  // Set canvas size to match container
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      const container = canvasContainerRef.current;
      if (!canvas || !container) return;
      
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      
      // Redraw canvas content after resize
      if (currentStep >= 0) {
        const img = new Image();
        img.onload = function() {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
          }
        };
        img.src = history[currentStep];
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [currentStep, history]);

  // Save canvas state
  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Clear redo stack when new drawing occurs
    if (currentStep < history.length - 1) {
      setHistory(prev => prev.slice(0, currentStep + 1));
    }
    
    const state = canvas.toDataURL();
    setHistory(prev => [...prev, state]);
    setCurrentStep(prev => prev + 1);
  };

  // Start drawing
  const startDrawing = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    setIsDrawing(true);
    const [x, y] = getCoordinates(e, canvas);
    lastPositionRef.current = { x, y };
    
    // Create a snapshot before drawing
    saveCanvasState();
  };

  // Draw
  const draw = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || !isDrawing || !lastPositionRef.current) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const [currentX, currentY] = getCoordinates(e, canvas);
    
    drawLine(
      ctx, 
      lastPositionRef.current.x, 
      lastPositionRef.current.y, 
      currentX, 
      currentY, 
      brushSize, 
      currentTool === 'brush' ? currentColor : 'eraser'
    );
    
    lastPositionRef.current = { x: currentX, y: currentY };
  };

  // Stop drawing
  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      lastPositionRef.current = null;
    }
  };

  // Setup event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Touch events
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      startDrawing(e);
    });
    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      draw(e);
    });
    canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      stopDrawing();
    });
    
    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseout', stopDrawing);
      
      canvas.removeEventListener('touchstart', startDrawing as any);
      canvas.removeEventListener('touchmove', draw as any);
      canvas.removeEventListener('touchend', stopDrawing as any);
    };
  }, [isDrawing, currentTool, brushSize, currentColor]);

  // Undo
  const undo = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const img = new Image();
      img.onload = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = history[currentStep - 1];
    }
  };

  // Redo
  const redo = () => {
    if (currentStep < history.length - 1) {
      setCurrentStep(prev => prev + 1);
      
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const img = new Image();
      img.onload = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = history[currentStep + 1];
    }
  };

  // Clear canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveCanvasState();
  };

  // Set tool
  const setTool = (tool: Tool) => {
    setCurrentTool(tool);
  };

  // Set color
  const setColor = (color: string) => {
    setCurrentColor(color);
  };

  // Get canvas data URL
  const getCanvasDataUrl = (): string => {
    const canvas = canvasRef.current;
    if (!canvas) return '';
    
    return canvas.toDataURL('image/png');
  };

  // Check if canvas is empty
  const isCanvasEmpty = (): boolean => {
    const canvas = canvasRef.current;
    if (!canvas) return true;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return true;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    return !imageData.some(channel => channel !== 0);
  };

  return {
    canvasRef,
    canvasContainerRef,
    isDrawing,
    currentTool,
    brushSize,
    currentColor,
    history,
    currentStep,
    clearCanvas,
    undo,
    redo,
    setTool,
    setBrushSize,
    setColor,
    canUndo: currentStep > 0,
    canRedo: currentStep < history.length - 1,
    getCanvasDataUrl,
    isCanvasEmpty
  };
}
