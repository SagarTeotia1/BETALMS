export interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'gif' | 'glb' | 'pdf' | 'document';
  url: string;
  name: string;
  width?: number;
  height?: number;
  position: { x: number; y: number };
  scale: { x: number; y: number };
  rotation: number;
  annotations: Annotation[];
}

export interface Annotation {
  id: string;
  type: 'drawing' | 'text' | 'shape' | 'highlight' | 'arrow';
  data: any;
  position: { x: number; y: number };
  style: AnnotationStyle;
  mediaId: string;
}

export interface AnnotationStyle {
  color: string;
  strokeWidth: number;
  fontSize?: number;
  fontFamily?: string;
  opacity: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  mediaItems: MediaItem[];
  createdAt: Date;
  updatedAt: Date;
  instructorId: string;
}

export interface CanvasState {
  selectedTool: 'select' | 'draw' | 'text' | 'shape' | 'highlight' | 'arrow';
  selectedMedia: MediaItem | null;
  selectedAnnotation: Annotation | null;
  isDrawing: boolean;
  zoom: number;
  pan: { x: number; y: number };
}

export interface ToolbarState {
  color: string;
  strokeWidth: number;
  fontSize: number;
  fontFamily: string;
  opacity: number;
} 