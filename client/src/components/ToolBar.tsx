import React, { useState } from 'react';
import ColorPicker from './ui/color-picker';

interface ToolBarProps {
  currentTool: 'brush' | 'eraser';
  setTool: (tool: 'brush' | 'eraser') => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  currentColor: string;
  setColor: (color: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  clearCanvas: () => void;
}

export default function ToolBar({
  currentTool,
  setTool,
  brushSize,
  setBrushSize,
  currentColor,
  setColor,
  canUndo,
  canRedo,
  undo,
  redo,
  clearCanvas
}: ToolBarProps) {
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 p-3 flex flex-wrap gap-2">
      <div className="tool-group flex items-center space-x-1">
        <button 
          className={`tool-btn p-2 rounded transition-all hover:bg-gray-100 border border-transparent flex items-center justify-center ${currentTool === 'brush' ? 'bg-purple-100 border-purple-500' : ''}`}
          onClick={() => setTool('brush')}
        >
          <i className={`fas fa-paint-brush ${currentTool === 'brush' ? 'text-purple-500' : 'text-gray-700'}`}></i>
        </button>
        <button 
          className={`tool-btn p-2 rounded transition-all hover:bg-gray-100 border border-transparent flex items-center justify-center ${currentTool === 'eraser' ? 'bg-purple-100 border-purple-500' : ''}`}
          onClick={() => setTool('eraser')}
        >
          <i className={`fas fa-eraser ${currentTool === 'eraser' ? 'text-purple-500' : 'text-gray-700'}`}></i>
        </button>
      </div>
      
      <div className="h-6 border-r border-gray-200 mx-1"></div>
      
      <div className="flex items-center space-x-2">
        <label htmlFor="brush-size" className="text-xs text-gray-600">Size:</label>
        <input 
          type="range" 
          id="brush-size" 
          min="1" 
          max="50" 
          value={brushSize} 
          onChange={(e) => setBrushSize(parseInt(e.target.value))}
          className="w-20 h-4"
        />
      </div>
      
      <div className="h-6 border-r border-gray-200 mx-1"></div>
      
      <div className="color-selection flex items-center space-x-2 relative">
        <label className="text-xs text-gray-600">Color:</label>
        <div 
          className="w-6 h-6 rounded-full border border-gray-300 cursor-pointer"
          style={{ backgroundColor: currentColor }}
          onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
        ></div>
        
        {isColorPickerOpen && (
          <ColorPicker 
            currentColor={currentColor} 
            onColorChange={setColor} 
            onClose={() => setIsColorPickerOpen(false)}
          />
        )}
      </div>
      
      <div className="ml-auto">
        <button 
          className={`p-2 rounded transition-all hover:bg-gray-100 ${canUndo ? 'text-gray-600' : 'text-gray-300 cursor-not-allowed'}`}
          onClick={undo}
          disabled={!canUndo}
        >
          <i className="fas fa-undo"></i>
        </button>
        <button 
          className={`p-2 rounded transition-all hover:bg-gray-100 ${canRedo ? 'text-gray-600' : 'text-gray-300 cursor-not-allowed'}`}
          onClick={redo}
          disabled={!canRedo}
        >
          <i className="fas fa-redo"></i>
        </button>
        <button 
          className="p-2 rounded transition-all hover:bg-gray-100 text-gray-600"
          onClick={clearCanvas}
        >
          <i className="fas fa-trash-alt"></i>
        </button>
      </div>
    </div>
  );
}
