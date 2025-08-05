'use client';

import React from 'react';

interface ImageRendererProps {
  src: string;
  alt: string;
  onLoad?: () => void;
  onError?: (error: string) => void;
}

const ImageRenderer: React.FC<ImageRendererProps> = ({ src, alt, onLoad, onError }) => {
  const handleLoad = () => {
    onLoad?.();
  };

  const handleError = () => {
    onError?.('Failed to load image');
  };

  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-contain"
      onLoad={handleLoad}
      onError={handleError}
      draggable={false}
    />
  );
};

export default ImageRenderer; 