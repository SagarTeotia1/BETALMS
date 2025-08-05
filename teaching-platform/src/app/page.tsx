'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Editor from '@/components/editor/Editor';
import { Plus, BookOpen, Users, Settings } from 'lucide-react';

export default function Home() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [lessons, setLessons] = useState<any[]>([]);

  const handleSaveLesson = (lesson: any) => {
    setLessons(prev => {
      const existingIndex = prev.findIndex(l => l.id === lesson.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = lesson;
        return updated;
      }
      return [...prev, lesson];
    });
    setIsEditorOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Teaching Platform</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Users className="w-4 h-4 mr-2" />
                Students
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isEditorOpen ? (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Create Interactive Lessons
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Build engaging lessons with images, videos, 3D models, and interactive annotations. 
                Draw, write, and teach directly on your media content.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex justify-center">
              <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="px-8">
                    <Plus className="w-5 h-5 mr-2" />
                    Create New Lesson
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl h-[90vh] p-0">
                  <Editor onSave={handleSaveLesson} />
                </DialogContent>
              </Dialog>
            </div>

            {/* Recent Lessons */}
            {lessons.length > 0 && (
              <div className="mt-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Lessons</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                    >
                      <h4 className="text-lg font-medium text-gray-900 mb-2">
                        {lesson.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        {lesson.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {lesson.mediaItems.length} media items
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditorOpen(true)}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
                Platform Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Multi-Media Support
                  </h4>
                  <p className="text-gray-600">
                    Upload and work with images, videos, GIFs, 3D models (GLB), and documents.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Interactive Annotations
                  </h4>
                  <p className="text-gray-600">
                    Draw, write text, add shapes, highlights, and arrows directly on your media.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Collaborative Teaching
                  </h4>
                  <p className="text-gray-600">
                    Share lessons with students and collaborate in real-time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Editor onSave={handleSaveLesson} />
        )}
      </main>
    </div>
  );
} 