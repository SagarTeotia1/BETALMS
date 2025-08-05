'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, Image, Video, File, FileText, Trash2 } from 'lucide-react';
import { MediaItem } from '@/types';
import { generateId, getFileType, formatFileSize } from '@/lib/utils';

interface MediaLibraryProps {
  mediaItems: MediaItem[];
  onMediaAdd: (media: MediaItem) => void;
  onMediaDelete: (mediaId: string) => void;
  onMediaSelect: (media: MediaItem) => void;
}

const MediaLibrary: React.FC<MediaLibraryProps> = ({
  mediaItems,
  onMediaAdd,
  onMediaDelete,
  onMediaSelect,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    console.log('File upload triggered, files:', files);
    
    if (!files) {
      console.log('No files selected');
      return;
    }

    console.log('Files selected:', files.length);
    setIsUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileType = getFileType(file.name);
        
        console.log('Processing file:', file.name, 'Type:', fileType, 'Size:', file.size);
        
        // In a real application, you would upload the file to a server
        // For now, we'll create a local URL
        const url = URL.createObjectURL(file);
        console.log('Created URL:', url);
        
        const mediaItem: MediaItem = {
          id: generateId(),
          type: fileType as 'image' | 'video' | 'gif' | 'glb' | 'pdf' | 'document',
          url,
          name: file.name,
          width: undefined,
          height: undefined,
          position: { x: 100 + i * 50, y: 100 + i * 50 },
          scale: { x: 1, y: 1 },
          rotation: 0,
          annotations: [],
        };

        console.log('Created media item:', mediaItem);
        onMediaAdd(mediaItem);
      }
    } catch (error) {
      console.error('Error processing files:', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'image':
      case 'gif':
        return <Image className="w-6 h-6" />;
      case 'video':
        return <Video className="w-6 h-6" />;
      case 'glb':
        return <File className="w-6 h-6" />;
      default:
        return <FileText className="w-6 h-6" />;
    }
  };

  return (
    <div className="bg-white border-l border-gray-200 w-80 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Media Library</h3>
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => {
              console.log('Test button clicked');
              const testMedia: MediaItem = {
                id: generateId(),
                type: 'image',
                url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlRlc3QgSW1hZ2U8L3RleHQ+PC9zdmc+',
                name: 'test-image.svg',
                width: 200,
                height: 200,
                position: { x: 100, y: 100 },
                scale: { x: 1, y: 1 },
                rotation: 0,
                annotations: [],
              };
              onMediaAdd(testMedia);
            }}
          >
            Test Add
          </Button>
          
          {/* Direct file upload button */}
          <Button 
            size="sm"
            onClick={() => {
              console.log('Direct upload button clicked');
              fileInputRef.current?.click();
            }}
            disabled={isUploading}
          >
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Upload Files'}
          </Button>
          
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,.glb,.gltf,.pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {mediaItems.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Upload className="w-8 h-8 mx-auto mb-2" />
            <p>No media uploaded yet</p>
            <p className="text-sm">Upload some files to get started</p>
          </div>
        ) : (
          mediaItems.map((media) => (
            <div
              key={media.id}
              className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => onMediaSelect(media)}
            >
              <div className="flex-shrink-0">
                {getMediaIcon(media.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {media.name}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {media.type}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onMediaDelete(media.id);
                }}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MediaLibrary; 