'use client';

import VideoPlayer from '@/app/video-player/_components/video-player';
import VideoThumbnail from '@/app/video-player/_components/video-thumbnail';
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

export default function VideoPlayerPage() {
  const [videoData] = useState<HierarchicalVideoData>(hierarchicalVideoData);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  // Set default category and subcategory on mount
  useEffect(() => {
    if (videoData && videoData.categories.length > 0) {
      const firstCategory = videoData.categories[0];
      setSelectedCategory(firstCategory.name);
      if (firstCategory.subcategories.length > 0) {
        setSelectedSubcategory(firstCategory.subcategories[0].name);
      }
    }
  }, [videoData]);

  // Get filtered videos based on selected category and subcategory
  const getFilteredVideos = () => {
    if (!videoData) return [];

    if (selectedCategory && selectedSubcategory) {
      const category = videoData.categories.find(
        (cat) => cat.name === selectedCategory,
      );
      if (category) {
        const subcategory = category.subcategories.find(
          (sub) => sub.name === selectedSubcategory,
        );
        if (subcategory) {
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
    if (videoData) {
      const category = videoData.categories.find(
        (cat) => cat.name === categoryName,
      );
      if (category && category.subcategories.length > 0) {
        setSelectedSubcategory(category.subcategories[0].name);
      } else {
        setSelectedSubcategory('');
      }
    }
  };

  // Get subcategories for the selected category
  const getSubcategories = () => {
    if (!videoData || !selectedCategory) return [];

    const category = videoData.categories.find(
      (cat) => cat.name === selectedCategory,
    );
    return category ? category.subcategories : [];
  };

  const subcategories = getSubcategories();

  // Prepare data for the VideoPlayer component, ensuring it matches the VideoData type
  const videoDataForPlayer: VideoData | null = selectedVideo
    ? {
        ...selectedVideo,
        category: selectedCategory,
        playlistTitle: selectedVideo.playlistTitle || selectedVideo.title,
      }
    : null;

  if (!videoData) {
    return (
      <div className="container max-w-7xl px-4 py-6 sm:p-6">
        <div className="py-12 text-center">
          <div className="text-muted-foreground mb-4">
            <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
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
      <div className="container max-w-7xl px-4 py-6 sm:p-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="mb-2 text-2xl font-bold sm:text-3xl">
            Fußball‑Trainingsvideos
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Professionelle Trainingsinhalte zur Fähigkeitsentwicklung und
            Leistungssteigerung
          </p>
        </div>

        {/* Category Dropdown */}
        <div className="mb-4 flex flex-col items-stretch gap-3 sm:mb-6 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex-1">
            {videoData && (
              <Select
                value={selectedCategory}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="w-full sm:w-64">
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
            )}
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {filteredVideos.map((video) => {
            const videoForThumbnail: VideoData = {
              ...video,
              category: selectedCategory,
              playlistTitle: video.playlistTitle || video.title,
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
                <CardHeader className="pb-3 sm:pb-3">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="group-hover:text-primary mb-1 line-clamp-2 text-base font-semibold transition-colors sm:text-lg">
                        {video.title}
                      </h3>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {selectedCategory}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {selectedSubcategory}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 touch-manipulation p-2 opacity-60 transition-opacity group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    {video.chapters.length} Kapitel
                  </p>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {videoData && filteredVideos.length === 0 && (
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

      {/* Video Player Overlay */}
      {isPlayerOpen && videoDataForPlayer && (
        <div className="fixed inset-0 z-50 h-full w-full bg-background">
          <VideoPlayer
            initialVideo={videoDataForPlayer}
            onClose={handleClosePlayer}
            className="h-full"
          />
        </div>
      )}
    </>
  );
}
