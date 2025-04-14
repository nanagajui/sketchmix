import React, { useEffect, useRef } from 'react';

interface ColorPickerProps {
  currentColor: string;
  onColorChange: (color: string) => void;
  onClose: () => void;
}

export default function ColorPicker({ currentColor, onColorChange, onClose }: ColorPickerProps) {
  const colorPickerRef = useRef<HTMLDivElement>(null);
  
  const colors = [
    '#000000', '#ffffff', '#ef4444', '#f59e0b', '#10b981', '#3b82f6',
    '#8b5cf6', '#ec4899', '#6b7280', '#374151', '#fde68a', '#b45309'
  ];
  
  // Close color picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  return (
    <div 
      ref={colorPickerRef}
      className="absolute mt-2 p-2 bg-white rounded-lg shadow-lg z-10"
      style={{ top: '100%', left: '0' }}
    >
      <div className="grid grid-cols-6 gap-1 mb-2">
        {colors.map((color) => (
          <div
            key={color}
            className={`relative w-5 h-5 rounded-full cursor-pointer transition-transform hover:scale-110 ${color === '#ffffff' ? 'border border-gray-200' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => {
              onColorChange(color);
              onClose();
            }}
          >
            {color === currentColor && (
              <div className="absolute -top-1 -left-1 -right-1 -bottom-1 border-2 border-purple-500 rounded-full"></div>
            )}
          </div>
        ))}
      </div>
      
      <input 
        type="color" 
        value={currentColor}
        onChange={(e) => onColorChange(e.target.value)}
        className="w-full h-8 cursor-pointer rounded"
      />
    </div>
  );
}
