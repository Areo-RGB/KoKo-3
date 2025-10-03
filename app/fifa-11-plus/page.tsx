'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React, { useMemo, useRef, useState } from 'react';
import PlaylistView from './_components/playlist-view';
import { VideoCacheButton } from './_components/video-cache-button';
import VideoPlayer from './_components/video-player';
import {
  MAIN_VIDEO_URL,
  PLAYLIST,
  WS_PLAYLIST,
  WS_VIDEO_URL,
} from './_lib/data';
import type { Playlist, Video } from './_lib/types';

interface FifaProgramViewProps {
  playlist: Playlist;
  videoUrl: string;
}

const FifaProgramView: React.FC<FifaProgramViewProps> = ({
  playlist,
  videoUrl,
}) => {
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const videoPlayerContainerRef = useRef<HTMLDivElement>(null);

  const handleVideoSelect = (video: Video) => {
    setCurrentVideo(video);
    videoPlayerContainerRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const currentVideoId = useMemo(() => currentVideo?.id ?? '', [currentVideo]);

  return (
    <div className="space-y-6">
      <div ref={videoPlayerContainerRef} className="w-full scroll-mt-20">
        {currentVideo ? (
          <VideoPlayer
            key={currentVideo.id}
            videoUrl={videoUrl}
            startTime={currentVideo.startTime}
          />
        ) : (
          <div className="bg-muted flex aspect-video items-center justify-center rounded-lg">
            <div className="p-4 text-center">
              <img
                src="/assets/svg/FIFA_Logo.svg"
                alt="FIFA Logo"
                className="mx-auto mb-4 h-auto w-48 opacity-80"
              />
              <p className="text-muted-foreground">
                Wählen Sie ein Video-Kapitel zum Abspielen.
              </p>
            </div>
          </div>
        )}
      </div>
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="mb-6">
            <h3 className="mb-2 text-lg font-semibold">
              FIFA 11+ Komplettes Programm
            </h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Das komplette FIFA 11+ Verletzungspräventionsprogramm mit Laufen,
              Kraft, Plyometrie und Gleichgewichtsübungen.
            </p>
            <VideoCacheButton playlist={playlist} videoUrl={videoUrl} />
          </div>
          <PlaylistView
            playlist={playlist}
            currentVideoId={currentVideoId}
            onVideoSelect={handleVideoSelect}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default function Fifa11PlusPage() {
  const tabs = [
    {
      id: 'fifa11-original',
      label: 'FIFA 11+ Original',
      content: (
        <FifaProgramView playlist={PLAYLIST} videoUrl={MAIN_VIDEO_URL} />
      ),
    },
    {
      id: 'fifa11-ws',
      label: 'FIFA 11+ World Soccer',
      content: (
        <FifaProgramView playlist={WS_PLAYLIST} videoUrl={WS_VIDEO_URL} />
      ),
    },
  ];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">FIFA 11+ Programm</h1>
        <p className="text-muted-foreground mt-2">
          Interaktiver Video-Player für die FIFA 11+
          Verletzungspräventionsprogramme.
        </p>
      </div>
      <Tabs defaultValue={tabs[0].id} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="mt-6">
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
