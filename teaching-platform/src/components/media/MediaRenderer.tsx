'use client';

import React from 'react';
import { MediaItem } from '@/types';
import ImageRenderer from './ImageRenderer';
import VideoRenderer from './VideoRenderer';

interface MediaRendererProps {
  media: MediaItem;
  onLoad?: () => void;
  onError?: (error: string) => void;
}

const MediaRenderer: React.FC<MediaRendererProps> = ({ media, onLoad, onError }) => {
  const renderMedia = () => {
    switch (media.type) {
      case 'image':
      case 'gif':
        return (
          <ImageRenderer
            src={media.url}
            alt={media.name}
            onLoad={onLoad}
            onError={onError}
          />
        );
      case 'video':
        return (
          <VideoRenderer
            src={media.url}
            onLoad={onLoad}
            onError={onError}
          />
        );
      case 'glb':
        return (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500 mb-2">3D Model</p>
              <p className="text-sm text-gray-400">{media.name}</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded">
            <p className="text-gray-500">Unsupported media type: {media.type}</p>
          </div>
        );
    }
  };

  return (
    <div className="relative w-full h-full">
      {renderMedia()}
    </div>
  );
};

export default MediaRenderer; 