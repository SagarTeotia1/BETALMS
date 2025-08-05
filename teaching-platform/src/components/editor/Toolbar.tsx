'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  MousePointer, 
  Pen, 
  Type, 
  Square, 
  Highlighter, 
  ArrowRight,
  Palette,
  Eraser,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { CanvasState, ToolbarState } from '@/types';

interface ToolbarProps {
  canvasState: CanvasState;
  toolbarState: ToolbarState;
  onCanvasStateChange: (state: Partial<CanvasState>) => void;
  onToolbarStateChange: (state: Partial<ToolbarState>) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  canvasState,
  toolbarState,
  onCanvasStateChange,
  onToolbarStateChange,
}) => {
  const tools = [
    { id: 'select', icon: MousePointer, label: 'Select' },
    { id: 'draw', icon: Pen, label: 'Draw' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'shape', icon: Square, label: 'Shape' },
    { id: 'highlight', icon: Highlighter, label: 'Highlight' },
    { id: 'arrow', icon: ArrowRight, label: 'Arrow' },
  ];

  const colors = [
    '#ff0000', '#ff8000', '#ffff00', '#80ff00', 
    '#00ff00', '#00ff80', '#00ffff', '#0080ff',
    '#0000ff', '#8000ff', '#ff00ff', '#ff0080',
    '#000000', '#808080', '#ffffff'
  ];

  const strokeWidths = [1, 2, 4, 6, 8, 12];

  return (
    <div className="bg-white border-b border-gray-200 p-4 space-y-4">
      {/* Tools */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700">Tools:</span>
        {tools.map((tool) => (
          <Button
            key={tool.id}
            variant={canvasState.selectedTool === tool.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => onCanvasStateChange({ selectedTool: tool.id as any })}
            title={tool.label}
          >
            <tool.icon className="w-4 h-4" />
          </Button>
        ))}
      </div>

      {/* Color Picker */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700">Color:</span>
        <div className="flex space-x-1">
          {colors.map((color) => (
            <button
              key={color}
              className={`w-6 h-6 rounded border-2 ${
                toolbarState.color === color ? 'border-gray-800' : 'border-gray-300'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => onToolbarStateChange({ color })}
              title={color}
            />
          ))}
        </div>
        <input
          type="color"
          value={toolbarState.color}
          onChange={(e) => onToolbarStateChange({ color: e.target.value })}
          className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
        />
      </div>

      {/* Stroke Width */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700">Width:</span>
        <div className="flex space-x-1">
          {strokeWidths.map((width) => (
            <button
              key={width}
              className={`px-2 py-1 text-xs rounded border ${
                toolbarState.strokeWidth === width
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700'
              }`}
              onClick={() => onToolbarStateChange({ strokeWidth: width })}
            >
              {width}
            </button>
          ))}
        </div>
      </div>

      {/* Font Size */}
      {canvasState.selectedTool === 'text' && (
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Font Size:</span>
          <input
            type="range"
            min="8"
            max="72"
            value={toolbarState.fontSize}
            onChange={(e) => onToolbarStateChange({ fontSize: parseInt(e.target.value) })}
            className="w-24"
          />
          <span className="text-sm text-gray-600">{toolbarState.fontSize}px</span>
        </div>
      )}

      {/* Opacity */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700">Opacity:</span>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.1"
          value={toolbarState.opacity}
          onChange={(e) => onToolbarStateChange({ opacity: parseFloat(e.target.value) })}
          className="w-24"
        />
        <span className="text-sm text-gray-600">{Math.round(toolbarState.opacity * 100)}%</span>
      </div>

      {/* Canvas Controls */}
      <div className="flex items-center space-x-2 pt-2 border-t border-gray-200">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onCanvasStateChange({ zoom: Math.min(canvasState.zoom * 1.2, 5) })}
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onCanvasStateChange({ zoom: Math.max(canvasState.zoom / 1.2, 0.1) })}
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onCanvasStateChange({ zoom: 1, pan: { x: 0, y: 0 } })}
          title="Reset View"
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default Toolbar; 