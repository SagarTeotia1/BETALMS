'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Toolbar from './Toolbar';
import MediaLibrary from './MediaLibrary';
import { MediaItem, Annotation, CanvasState, ToolbarState } from '@/types';

// Dynamically import Canvas to avoid SSR issues
const Canvas = dynamic(() => import('./SimpleCanvas'), { ssr: false });

interface EditorProps {
  lessonId?: string;
  onSave?: (lesson: any) => void;
}

const Editor: React.FC<EditorProps> = ({ lessonId, onSave }) => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [canvasState, setCanvasState] = useState<CanvasState>({
    selectedTool: 'select',
    selectedMedia: null,
    selectedAnnotation: null,
    isDrawing: false,
    zoom: 1,
    pan: { x: 0, y: 0 },
  });
  const [toolbarState, setToolbarState] = useState<ToolbarState>({
    color: '#ff0000',
    strokeWidth: 2,
    fontSize: 16,
    fontFamily: 'Arial',
    opacity: 1,
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex h-screen bg-gray-100 items-center justify-center">
        <p className="text-gray-500">Loading editor...</p>
      </div>
    );
  }

  const handleMediaAdd = (media: MediaItem) => {
    console.log('Adding media item to editor:', media);
    setMediaItems(prev => {
      const newItems = [...prev, media];
      console.log('Updated media items:', newItems);
      return newItems;
    });
  };

  const handleMediaDelete = (mediaId: string) => {
    setMediaItems(prev => prev.filter(item => item.id !== mediaId));
  };

  const handleMediaSelect = (media: MediaItem) => {
    setCanvasState(prev => ({ ...prev, selectedMedia: media }));
  };

  const handleCanvasStateChange = (newState: Partial<CanvasState>) => {
    setCanvasState(prev => ({ ...prev, ...newState }));
  };

  const handleToolbarStateChange = (newState: Partial<ToolbarState>) => {
    setToolbarState(prev => ({ ...prev, ...newState }));
  };

  const handleAnnotationAdd = (annotation: Annotation) => {
    setMediaItems(prev => prev.map(media => {
      if (media.id === annotation.mediaId) {
        return {
          ...media,
          annotations: [...media.annotations, annotation],
        };
      }
      return media;
    }));
  };

  const handleAnnotationUpdate = (annotation: Annotation) => {
    setMediaItems(prev => prev.map(media => {
      if (media.id === annotation.mediaId) {
        return {
          ...media,
          annotations: media.annotations.map(ann => 
            ann.id === annotation.id ? annotation : ann
          ),
        };
      }
      return media;
    }));
  };

  const handleAnnotationDelete = (annotationId: string) => {
    setMediaItems(prev => prev.map(media => ({
      ...media,
      annotations: media.annotations.filter(ann => ann.id !== annotationId),
    })));
  };

  const handleSave = () => {
    const lesson = {
      id: lessonId || `lesson-${Date.now()}`,
      title: 'Untitled Lesson',
      description: 'Lesson description',
      mediaItems,
      createdAt: new Date(),
      updatedAt: new Date(),
      instructorId: 'instructor-1',
    };
    onSave?.(lesson);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <h2 className="text-lg font-semibold">Lesson Editor</h2>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Save Lesson
          </button>
        </div>
        <Toolbar
          canvasState={canvasState}
          toolbarState={toolbarState}
          onCanvasStateChange={handleCanvasStateChange}
          onToolbarStateChange={handleToolbarStateChange}
        />
        <div className="flex-1 relative">
          <Canvas
            mediaItems={mediaItems}
            canvasState={canvasState}
            toolbarState={toolbarState}
            onCanvasStateChange={handleCanvasStateChange}
            onAnnotationAdd={handleAnnotationAdd}
            onAnnotationUpdate={handleAnnotationUpdate}
            onAnnotationDelete={handleAnnotationDelete}
          />
        </div>
      </div>

      {/* Media Library Sidebar */}
      <MediaLibrary
        mediaItems={mediaItems}
        onMediaAdd={handleMediaAdd}
        onMediaDelete={handleMediaDelete}
        onMediaSelect={handleMediaSelect}
      />
    </div>
  );
};

export default Editor; 