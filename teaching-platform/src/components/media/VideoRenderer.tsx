'use client';

import React from 'react';

interface VideoRendererProps {
  src: string;
  onLoad?: () => void;
  onError?: (error: string) => void;
}

const VideoRenderer: React.FC<VideoRendererProps> = ({ src, onLoad, onError }) => {
  const handleLoad = () => {
    onLoad?.();
  };

  const handleError = () => {
    onError?.('Failed to load video');
  };

  return (
    <video
      src={src}
      className="w-full h-full object-contain"
      controls
      onLoadedData={handleLoad}
      onError={handleError}
      draggable={false}
    >
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoRenderer; 