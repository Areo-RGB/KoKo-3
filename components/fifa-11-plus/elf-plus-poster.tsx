'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Play } from 'lucide-react';
import Image from 'next/image';
import type { Drill } from './types';

interface ElfPlusPosterProps {
  drills: Drill[];
}

const ElfPlusPoster: React.FC<ElfPlusPosterProps> = ({ drills }) => {
  const [selectedVideo, setSelectedVideo] = useState<Drill | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleDrillClick = (drill: Drill) => {
    setSelectedVideo(drill);
    setIsVideoPlaying(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleCloseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsVideoPlaying(false);
    setSelectedVideo(null);
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">
            FIFA 11+ Elf Plus - Warm-up Training
          </h1>
          <p className="text-gray-600 mt-2">
            Klicken Sie auf eine Übung, um das Video abzuspielen
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Poster Image */}
          <div className="relative">
            <Card>
              <CardContent className="p-6">
                <div className="relative aspect-[3/4] bg-white rounded-lg overflow-hidden">
                  <Image
                    src="/16991-Elf-Plus-Plakat.html"
                    alt="FIFA 11+ Elf Plus Poster"
                    fill
                    className="object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/api/placeholder/800/1066';
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Drills Grid */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Übungen - Videos
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {drills.map((drill) => (
                <Card
                  key={drill.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                  onClick={() => handleDrillClick(drill)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Play className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm text-gray-900 truncate">
                          {drill.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {drill.level && `Level ${drill.level}`}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                      {drill.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && isVideoPlaying && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedVideo.name}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseVideo}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="relative aspect-video bg-black">
              <video
                ref={videoRef}
                key={selectedVideo.id}
                className="w-full h-full"
                controls
                playsInline
                src={selectedVideo.videoUrl}
              >
                Your browser does not support the video tag.
              </video>
            </div>

            <div className="p-4 border-t">
              <p className="text-sm text-gray-600">
                {selectedVideo.description}
              </p>
              {selectedVideo.level && (
                <p className="text-xs text-gray-500 mt-1">
                  Schwierigkeit: Level {selectedVideo.level}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElfPlusPoster;