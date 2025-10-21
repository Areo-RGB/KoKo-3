'use client';

import VideoPlayer from '@/app/video-player/_components/video-player';
import VideoThumbnail from '@/app/video-player/_components/video-thumbnail';
import { MobileVideoPlayer } from '@/app/video-player/_components/mobile-video-player';
import { MobileFooterNavEnhanced } from '@/components/layout/mobile-footer-nav-enhanced';
import {
  HierarchicalVideoData,
  Video,
  VideoData,
  hierarchicalVideoData,
} from '@/app/video-player/_lib/video-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import '@/app/mobile-styles.css';

const playlistTitleForVideo = (video: Video) => {
  const candidate = video.playlistTitle;
  if (typeof candidate === 'string' && candidate.trim().length > 0) {
    return candidate;
  }

  return video.title;
};

export default function VideoPlayerPage() {
  const [videoData] = useState<HierarchicalVideoData>(hierarchicalVideoData);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  // Set default category and subcategory on mount
  useEffect(() => {
    const [firstCategory] = videoData.categories;
    if (firstCategory !== undefined) {
      setSelectedCategory(firstCategory.name);
      const [firstSubcategory] = firstCategory.subcategories;
      setSelectedSubcategory(
        firstSubcategory !== undefined ? firstSubcategory.name : '',
      );
    }
  }, [videoData]);

  // Get filtered videos based on selected category and subcategory
  const getFilteredVideos = () => {
    if (selectedCategory.length > 0 && selectedSubcategory.length > 0) {
      const category = videoData.categories.find(
        (cat) => cat.name === selectedCategory,
      );
      if (category !== undefined) {
        const subcategory = category.subcategories.find(
          (sub) => sub.name === selectedSubcategory,
        );
        if (subcategory !== undefined) {
          return subcategory.videos;
        }
      }
    }

    return [];
  };

  const filteredVideos = getFilteredVideos();

  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video);
    setIsPlayerOpen(true);
  };

  const handleClosePlayer = () => {
    setIsPlayerOpen(false);
    setSelectedVideo(null);
  };

  // Handle category change
  const handleCategoryChange = (categoryName: string) => {
    setSelectedCategory(categoryName);

    // Reset subcategory to first one in the selected category
    const category = videoData.categories.find(
      (cat) => cat.name === categoryName,
    );
    if (category !== undefined && category.subcategories.length > 0) {
      setSelectedSubcategory(category.subcategories[0].name);
    } else {
      setSelectedSubcategory('');
    }
  };

  // Get subcategories for the selected category
  const getSubcategories = () => {
    if (selectedCategory.length === 0) return [];

    const category = videoData.categories.find(
      (cat) => cat.name === selectedCategory,
    );
    return category !== undefined ? category.subcategories : [];
  };

  const subcategories = getSubcategories();

  // Prepare data for the VideoPlayer component
  const videoDataForPlayer: VideoData | null =
    selectedVideo !== null
      ? {
          ...selectedVideo,
          category: selectedCategory,
          playlistTitle: playlistTitleForVideo(selectedVideo),
        }
      : null;
  if (videoData.categories.length === 0) {
    return (
      <div className="container max-w-7xl px-4 py-6 sm:p-6">
        <div className="py-12 text-center">
          <div className="text-muted-foreground mb-4">
            <div className="border-primary mx-auto h-16 w-16 animate-spin rounded-full border-4 border-t-transparent" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">
            Daten werden geladen...
          </h3>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Version */}
      <div className="md:hidden">
        {isPlayerOpen && selectedVideo ? (
          <MobileVideoPlayer
            videos={filteredVideos.map(v => ({
              id: v.id,
              title: v.title,
              duration: v.chapters.length > 0 ? `${v.chapters.length} Kapitel` : '0:00',
              url: v.videoUrl || '',
              thumbnail: undefined
            }))}
            currentVideoId={selectedVideo.id}
            onVideoSelect={(videoId) => {
              const video = filteredVideos.find(v => v.id === videoId);
              if (video) handleVideoSelect(video);
            }}
          />
        ) : (
          <div className="container mx-auto max-w-md px-4 py-6 pb-20">
            {/* Mobile Header */}
            <div className="mb-6">
              <h1 className="mb-2 text-xl font-bold">
                Fußball‑Trainingsvideos
              </h1>
              <p className="text-muted-foreground text-xs">
                Professionelle Trainingsinhalte
              </p>
            </div>

            {/* Mobile Category Dropdown */}
            <div className="mb-4">
              <Select
                value={selectedCategory}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="w-full h-12 mobile-input">
                  <SelectValue placeholder="Kategorie auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {videoData.categories.map((category) => (
                    <SelectItem key={category.name} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-2 flex justify-between items-center">
                <Badge variant="outline" className="text-xs">
                  {filteredVideos.length} Videos
                </Badge>
              </div>
            </div>

            {/* Mobile Subcategory Tabs */}
            {subcategories.length > 0 && (
              <div className="mb-6">
                <Tabs
                  value={selectedSubcategory}
                  onValueChange={setSelectedSubcategory}
                >
                  <TabsList className="w-full grid grid-cols-2 h-12">
                    {subcategories.slice(0, 4).map((subcategory) => (
                      <TabsTrigger
                        key={subcategory.name}
                        value={subcategory.name}
                        className="text-xs touch-optimized"
                      >
                        {subcategory.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            )}

            {/* Mobile Video Grid */}
            <div className="space-y-4">
              {filteredVideos.map((video) => {
                const videoForThumbnail: VideoData = {
                  ...video,
                  category: selectedCategory,
                  playlistTitle: playlistTitleForVideo(video),
                };
                return (
                  <Card
                    key={video.id}
                    className="group hover:border-primary/20 cursor-pointer touch-manipulation overflow-hidden border-2 transition-all duration-200 active:scale-[0.98]"
                    onClick={() => handleVideoSelect(video)}
                  >
                    <div className="flex gap-3 p-3">
                      <div className="relative w-28 h-16 flex-shrink-0">
                        <VideoThumbnail
                          video={videoForThumbnail}
                          className="rounded-lg w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="group-hover:text-primary mb-1 line-clamp-2 text-sm font-semibold transition-colors">
                          {video.title}
                        </h3>
                        <div className="flex flex-wrap gap-1 mb-2">
                          <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                            {selectedCategory}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-xs">
                          {video.chapters.length} Kapitel
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="touch-optimized h-8 w-8 flex-shrink-0"
                      >
                        <Play className="h-3 w-3" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Mobile Empty State */}
            {filteredVideos.length === 0 && (
              <div className="py-12 text-center">
                <div className="text-muted-foreground mb-4">
                  <Play className="mx-auto h-12 w-12 opacity-50" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">
                  Keine Videos gefunden
                </h3>
                <p className="text-muted-foreground text-sm">
                  Wählen Sie eine andere Kategorie
                </p>
              </div>
            )}
          </div>
        )}
        <MobileFooterNavEnhanced />
      </div>

      {/* Desktop Version */}
      <div className="hidden md:block">
        <div className="container max-w-7xl px-4 py-6 sm:p-6">
          {/* Header */}
          <div className="mb-4 sm:mb-6 lg:mb-8">
            <h1 className="mb-2 text-xl font-bold sm:text-2xl lg:text-3xl">
              Fußball‑Trainingsvideos
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm lg:text-base">
              Professionelle Trainingsinhalte zur Fähigkeitsentwicklung und
              Leistungssteigerung
            </p>
          </div>

          {/* Category Dropdown */}
          <div className="mb-4 flex flex-col items-stretch gap-3 sm:mb-6 sm:flex-row sm:items-center sm:gap-4">
            <div className="flex-1">
              <Select
                value={selectedCategory}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="w-full h-10 text-sm sm:h-10 sm:text-base sm:w-64">
                  <SelectValue placeholder="Kategorie auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {videoData.categories.map((category) => (
                    <SelectItem key={category.name} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Badge variant="outline" className="self-start sm:ml-auto">
              {filteredVideos.length} Videos
            </Badge>
          </div>

          {/* Subcategory Tabs */}
          {subcategories.length > 0 && (
            <div className="mb-6">
              <Tabs
                value={selectedSubcategory}
                onValueChange={setSelectedSubcategory}
              >
                <TabsList>
                  {subcategories.map((subcategory) => (
                    <TabsTrigger key={subcategory.name} value={subcategory.name}>
                      {subcategory.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          )}

          {/* Video Grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {filteredVideos.map((video) => {
              const videoForThumbnail: VideoData = {
                ...video,
                category: selectedCategory,
                playlistTitle: playlistTitleForVideo(video),
              };
              return (
                <Card
                  key={video.id}
                  className="group hover:border-primary/20 cursor-pointer touch-manipulation overflow-hidden border-2 p-0 transition-all duration-200 hover:shadow-lg"
                  onClick={() => handleVideoSelect(video)}
                >
                  <VideoThumbnail
                    video={videoForThumbnail}
                    className="rounded-t-lg"
                  />
                  <CardHeader className="pb-2 px-3 pt-3 sm:pb-3 sm:px-4 sm:pt-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="group-hover:text-primary mb-1 line-clamp-2 text-sm font-semibold transition-colors sm:text-base lg:text-lg">
                          {video.title}
                        </h3>
                        <div className="mb-2 flex flex-wrap items-center gap-1">
                          <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                            {selectedCategory}
                          </Badge>
                          <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                            {selectedSubcategory}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 touch-manipulation p-1.5 opacity-60 transition-opacity group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 h-7 w-7 sm:h-8 sm:w-8"
                      >
                        <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {video.chapters.length} Kapitel
                    </p>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredVideos.length === 0 && (
            <div className="py-12 text-center">
              <div className="text-muted-foreground mb-4">
                <Play className="mx-auto h-16 w-16 opacity-50" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">
                Keine Videos gefunden
              </h3>
              <p className="text-muted-foreground">
                Wählen Sie eine andere Kategorie oder schauen Sie später erneut
                vorbei.
              </p>
            </div>
          )}
        </div>

        {/* Desktop Video Player Overlay */}
        {isPlayerOpen && videoDataForPlayer && (
          <div className="bg-background fixed inset-0 z-50 h-full w-full">
            <VideoPlayer
              initialVideo={videoDataForPlayer}
              onClose={handleClosePlayer}
              className="h-full"
            />
          </div>
        )}
      </div>
    </>
  );
}
