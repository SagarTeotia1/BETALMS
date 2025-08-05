'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { MediaItem, Annotation, CanvasState } from '@/types';

interface SimpleCanvasProps {
  mediaItems: MediaItem[];
  canvasState: CanvasState;
  toolbarState?: any;
  onCanvasStateChange: (state: Partial<CanvasState>) => void;
  onAnnotationAdd: (annotation: Annotation) => void;
  onAnnotationUpdate: (annotation: Annotation) => void;
  onAnnotationDelete: (annotationId: string) => void;
}

const SimpleCanvas: React.FC<SimpleCanvasProps> = ({
  mediaItems,
  canvasState,
  toolbarState,
  onCanvasStateChange,
  onAnnotationAdd,
  onAnnotationUpdate,
  onAnnotationDelete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [mediaContext, setMediaContext] = useState<CanvasRenderingContext2D | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  // Helper functions for drawing shapes
  const drawArrow = (ctx: CanvasRenderingContext2D, start: { x: number; y: number }, end: { x: number; y: number }) => {
    const headLength = 15;
    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.lineTo(end.x - headLength * Math.cos(angle - Math.PI / 6), end.y - headLength * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(end.x, end.y);
    ctx.lineTo(end.x - headLength * Math.cos(angle + Math.PI / 6), end.y - headLength * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
    ctx.restore();
  };

  const drawRectangle = (ctx: CanvasRenderingContext2D, start: { x: number; y: number }, end: { x: number; y: number }) => {
    const width = end.x - start.x;
    const height = end.y - start.y;
    
    ctx.save();
    ctx.strokeRect(start.x, start.y, width, height);
    ctx.restore();
  };

  // Initialize canvas context and size
  useEffect(() => {
    const canvas = canvasRef.current;
    const mediaCanvas = mediaCanvasRef.current;
    if (!canvas || !mediaCanvas) return;

    const ctx = canvas.getContext('2d');
    const mediaCtx = mediaCanvas.getContext('2d');
    if (!ctx || !mediaCtx) return;

    // Set canvas size
    const width = window.innerWidth - 320;
    const height = window.innerHeight - 200;
    canvas.width = width;
    canvas.height = height;
    mediaCanvas.width = width;
    mediaCanvas.height = height;
    setCanvasSize({ width, height });

    // Set default context properties for drawing canvas
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 2;
    setContext(ctx);
    setMediaContext(mediaCtx);

    // Handle window resize
    const handleResize = () => {
      const newWidth = window.innerWidth - 320;
      const newHeight = window.innerHeight - 200;
      canvas.width = newWidth;
      canvas.height = newHeight;
      mediaCanvas.width = newWidth;
      mediaCanvas.height = newHeight;
      setCanvasSize({ width: newWidth, height: newHeight });
      
      // Re-set context properties after resize
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 2;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get mouse position relative to canvas
  const getMousePos = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, []);

  // Handle mouse down
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    console.log('Mouse down, selected tool:', canvasState.selectedTool);
    
    if (!context) return;
    
    const pos = getMousePos(e);
    console.log('Starting to draw at:', pos);
    
    // Handle different tools
    switch (canvasState.selectedTool) {
      case 'draw':
      case 'highlight':
        setIsDrawing(true);
        setLastPoint(pos);
        context.beginPath();
        context.moveTo(pos.x, pos.y);
        break;
      case 'arrow':
        // Draw arrow
        drawArrow(context, pos, { x: pos.x + 50, y: pos.y + 50 });
        break;
      case 'shape':
        // Draw rectangle
        drawRectangle(context, pos, { x: pos.x + 100, y: pos.y + 60 });
        break;
      default:
        // Default to drawing
        setIsDrawing(true);
        setLastPoint(pos);
        context.beginPath();
        context.moveTo(pos.x, pos.y);
    }
  }, [canvasState.selectedTool, context, getMousePos]);

  // Handle mouse move
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context || !lastPoint) return;

    const pos = getMousePos(e);
    
    console.log('Drawing to:', pos);
    
    // Draw line to current position
    context.lineTo(pos.x, pos.y);
    context.stroke();
    
    setLastPoint(pos);
  }, [isDrawing, context, lastPoint, getMousePos]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    if (isDrawing && lastPoint) {
      console.log('Finished drawing at:', lastPoint);
      
      // Create annotation from the drawn path
      const annotation: Annotation = {
        id: `annotation-${Date.now()}`,
        type: 'drawing',
        data: { 
          points: [lastPoint.x, lastPoint.y], // Simplified for now
          path: context?.getImageData(0, 0, canvasSize.width, canvasSize.height)
        },
        position: { x: 0, y: 0 },
        style: {
          color: context?.strokeStyle as string || '#ff0000',
          strokeWidth: context?.lineWidth || 2,
          opacity: 1,
        },
        mediaId: canvasState.selectedMedia?.id || '',
      };
      
      onAnnotationAdd(annotation);
    }
    
    setIsDrawing(false);
    setLastPoint(null);
  }, [isDrawing, lastPoint, context, canvasSize, canvasState.selectedMedia, onAnnotationAdd]);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    setIsDrawing(false);
    setLastPoint(null);
  }, []);

  // Update context properties when toolbar state changes
  useEffect(() => {
    if (context) {
      context.strokeStyle = toolbarState?.color || '#ff0000';
      context.lineWidth = toolbarState?.strokeWidth || 2;
      context.lineCap = 'round';
      context.lineJoin = 'round';
    }
  }, [context, toolbarState?.color, toolbarState?.strokeWidth]);

  // Render media items when they change (separate layer)
  useEffect(() => {
    if (!mediaContext || !mediaCanvasRef.current) return;

    console.log('Rendering media items:', mediaItems.length);
    
    // Clear only the media canvas
    mediaContext.clearRect(0, 0, mediaCanvasRef.current.width, mediaCanvasRef.current.height);
    
    // Draw each media item on the media canvas
    mediaItems.forEach((media, index) => {
      console.log('Drawing media item:', media.name, media.type);
      
      if (media.type === 'image' || media.type === 'gif') {
        const img = new Image();
        img.onload = () => {
          console.log('Image loaded:', media.name, img.width, img.height);
          
          // Calculate dimensions to fit within canvas - make images larger for better annotation
          const maxWidth = 600; // Even larger for better visibility
          const maxHeight = 500; // Even larger for better visibility
          let { width, height } = img;
          
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
          }
          
          // Center the image on the canvas
          const canvasWidth = mediaCanvasRef.current!.width;
          const canvasHeight = mediaCanvasRef.current!.height;
          const x = (canvasWidth - width) / 2;
          const y = (canvasHeight - height) / 2;
          
          mediaContext.save();
          mediaContext.translate(x, y);
          mediaContext.scale(media.scale.x, media.scale.y);
          mediaContext.rotate(media.rotation * Math.PI / 180);
          
          mediaContext.drawImage(img, 0, 0, width, height);
          mediaContext.restore();
          
          console.log('Image positioned at:', x, y, 'with size:', width, height);
        };
        img.onerror = (error) => {
          console.error('Error loading image:', media.name, error);
        };
        img.src = media.url;
      } else if (media.type === 'video') {
        // Draw video placeholder centered
        const canvasWidth = mediaCanvasRef.current!.width;
        const canvasHeight = mediaCanvasRef.current!.height;
        const videoWidth = 400;
        const videoHeight = 300;
        const x = (canvasWidth - videoWidth) / 2;
        const y = (canvasHeight - videoHeight) / 2;
        
        mediaContext.save();
        mediaContext.translate(x, y);
        mediaContext.fillStyle = '#e5e7eb';
        mediaContext.fillRect(0, 0, videoWidth, videoHeight);
        mediaContext.fillStyle = '#6b7280';
        mediaContext.font = '16px Arial';
        mediaContext.fillText(media.name, 10, 150);
        mediaContext.restore();
      }
    });
  }, [mediaContext, mediaItems]);

  // Handle zoom
  const handleWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const scaleBy = 1.02;
    const newZoom = e.deltaY > 0 ? canvasState.zoom / scaleBy : canvasState.zoom * scaleBy;
    onCanvasStateChange({ zoom: Math.max(0.1, Math.min(5, newZoom)) });
  }, [canvasState.zoom, onCanvasStateChange]);

  return (
    <div className="w-full h-full bg-gray-50 relative overflow-hidden">
      {/* Media canvas (background layer) */}
      <canvas
        ref={mediaCanvasRef}
        className="absolute inset-0 border border-gray-300"
        style={{
          transform: `scale(${canvasState.zoom})`,
          transformOrigin: '0 0',
          pointerEvents: 'none',
        }}
      />
      
      {/* Drawing canvas (foreground layer) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 border border-gray-300 cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
        style={{
          transform: `scale(${canvasState.zoom})`,
          transformOrigin: '0 0',
          pointerEvents: 'auto',
        }}
      />
      
             {/* Debug info */}
       <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
         Tool: {canvasState.selectedTool} | Drawing: {isDrawing ? 'Yes' : 'No'} | Context: {context ? 'Ready' : 'Not Ready'} | Color: {toolbarState?.color || 'N/A'} | Media: {mediaItems.length}
       </div>
       
       {/* Drawing instructions */}
       {mediaItems.length > 0 && (
         <div className="absolute bottom-2 left-2 bg-blue-500 text-white px-3 py-2 rounded text-sm">
           🎨 Draw on top of the image/video above!
         </div>
       )}
      
      {/* Drawing indicator */}
      {isDrawing && (
        <div className="absolute top-2 right-20 bg-red-500 text-white px-2 py-1 rounded text-xs animate-pulse">
          🎨 Drawing...
        </div>
      )}
      
             {/* Clear drawings button */}
       <button
         className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs"
         onClick={() => {
           if (context) {
             context.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
             console.log('Cleared all drawings');
           }
         }}
       >
         Clear Drawings
       </button>
       
       {/* Test drawing button */}
       <button
         className="absolute top-2 right-32 bg-blue-500 text-white px-2 py-1 rounded text-xs"
         onClick={() => {
           if (context) {
             context.beginPath();
             context.moveTo(100, 100);
             context.lineTo(200, 200);
             context.strokeStyle = '#ff0000';
             context.lineWidth = 5;
             context.stroke();
             console.log('Test drawing completed');
           }
         }}
       >
         Test Draw
       </button>
      
      {mediaItems.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-gray-500">
            <p className="text-lg mb-2">No media items</p>
            <p className="text-sm">Upload some files to get started</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleCanvas; 