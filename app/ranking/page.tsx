'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button as MovingBorderButton } from '@/components/ui/moving-border';
import { SelectNative } from '@/components/ui/select-native';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { sportsData } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  getSportsDataWithRanks,
  getVideoForPlayer,
  hasVideo,
} from '@/util/sports-utils';
import React, { useEffect, useMemo, useRef, useState } from 'react';

export default function HomePage() {
  // Get sports data with calculated ranks (compute once)
  const sportsDataWithRanks = useMemo(
    () => getSportsDataWithRanks(sportsData),
    [],
  );

  const [selectedExercise, setSelectedExercise] = useState<string>(
    sportsDataWithRanks[0].name,
  );

  // Memoize the selected sport lookup and its participants
  const selectedSport = useMemo(
    () => sportsDataWithRanks.find((s) => s.name === selectedExercise),
    [sportsDataWithRanks, selectedExercise],
  );
  const selectedParticipants = useMemo(
    () => selectedSport?.data ?? [],
    [selectedSport],
  );
  const [playingVideo, setPlayingVideo] = useState<{
    playerName: string;
    videoUrl: string;
    exerciseName: string;
  } | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [currentPlaybackRate, setCurrentPlaybackRate] = useState<number>(1);
  const [showRateIndicator, setShowRateIndicator] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const plyrRef = useRef<any>(null);
  const touchStartY = useRef<number>(0);
  const isSwiping = useRef<boolean>(false);

  const handlePlayerClick = (playerName: string, exerciseName: string) => {
    const videoUrl = getVideoForPlayer(
      playerName,
      exerciseName,
      sportsDataWithRanks,
    );
    if (videoUrl !== null) {
      setPlayingVideo({ playerName, videoUrl, exerciseName });
    }
  };

  // Avatar image URLs mirrored from the Fortschritt page
  const nameToAvatarUrl: Record<string, string> = {
    Behrat: '/assets/images/spieler-avatars/avatars-256/behrat.webp',
    Eray: '/assets/images/spieler-avatars/avatars-256/eray.webp',
    Erik: '/assets/images/spieler-avatars/avatars-256/erik.webp',
    Finley: '/assets/images/spieler-avatars/avatars-256/finley.webp',
    Jakob: '/assets/images/spieler-avatars/avatars-256/jakob.webp',
    Kayden: '/assets/images/spieler-avatars/avatars-256/kayden.webp',
    Lasse: '/assets/images/spieler-avatars/avatars-256/lasse.webp',
    Lennox: '/assets/images/spieler-avatars/avatars-256/lennox.webp',
    Levi: '/assets/images/spieler-avatars/avatars-256/levi.webp',
    Lion: '/assets/images/spieler-avatars/avatars-256/lion.webp',
    Metin: '/assets/images/spieler-avatars/avatars-256/metin.webp',
    Paul: '/assets/images/spieler-avatars/avatars-256/paul.webp',
    Silas: '/assets/images/spieler-avatars/avatars-256/silas.webp',
  };

  function getAvatarForName(name: string): string | undefined {
    if (nameToAvatarUrl[name]) return nameToAvatarUrl[name];
    const base = name.trim().toLowerCase().replace(/\s+/g, '-');
    return `/assets/images/spieler-avatars/avatars-256/${base}.webp`;
  }

  function getInitials(name: string): string {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('')
      .slice(0, 2);
  }

  const playerHasVideo = (
    playerName: string,
    exerciseName: string,
  ): boolean => {
    return hasVideo(playerName, exerciseName, sportsDataWithRanks);
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (plyrRef.current && !isSwiping.current) {
      if (isVideoPlaying) {
        plyrRef.current.pause();
      } else {
        plyrRef.current.play();
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    isSwiping.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const currentY = e.touches[0].clientY;
    const deltaY = touchStartY.current - currentY;
    const minSwipeDistance = 30;

    if (Math.abs(deltaY) > minSwipeDistance) {
      isSwiping.current = true;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isSwiping.current) return;

    const currentY = e.changedTouches[0].clientY;
    const deltaY = touchStartY.current - currentY;
    const swipeThreshold = 50;

    if (Math.abs(deltaY) >= swipeThreshold && plyrRef.current) {
      let newRate = currentPlaybackRate;

      if (deltaY > 0) {
        // Swipe up - increase rate
        newRate = Math.min(currentPlaybackRate + 0.1, 1);
      } else {
        // Swipe down - decrease rate
        newRate = Math.max(currentPlaybackRate - 0.1, 0.1);
      }

      // Round to avoid floating point precision issues
      newRate = Math.round(newRate * 10) / 10;

      if (newRate !== currentPlaybackRate) {
        plyrRef.current.speed = newRate;
        setCurrentPlaybackRate(newRate);

        // Show rate indicator temporarily
        setShowRateIndicator(true);
        setTimeout(() => setShowRateIndicator(false), 2000);
      }
    }

    // Reset swipe state
    setTimeout(() => {
      isSwiping.current = false;
    }, 100);
  };

  // Initialize and cleanup Plyr
  useEffect(() => {
    if (playingVideo && videoRef.current) {
      // Cleanup previous instance
      if (plyrRef.current) {
        plyrRef.current.destroy();
      }

      // Dynamically import and initialize Plyr
      import('plyr')
        .then(({ default: Plyr }) => {
          if (videoRef.current) {
            plyrRef.current = new Plyr(videoRef.current, {
              controls: [
                'play-large',
                'play',
                'progress',
                'current-time',
                'duration',
                'settings',
              ],
              autoplay: true,
              clickToPlay: true,
              fullscreen: { enabled: false },
              ratio: undefined,
              settings: ['speed'],
              speed: {
                selected: 1,
                options: [0.1, 0.25, 0.5, 0.75, 1],
              },
            });

            // Force Plyr container to stay within bounds
            const plyrContainer = videoRef.current?.closest('.plyr');
            if (plyrContainer) {
              (plyrContainer as HTMLElement).style.width = '100%';
              (plyrContainer as HTMLElement).style.height = '100%';
              (plyrContainer as HTMLElement).style.maxWidth = '100%';
              (plyrContainer as HTMLElement).style.maxHeight = '100%';
              (plyrContainer as HTMLElement).style.position = 'relative';
            }

            // Listen for play/pause/ended events
            plyrRef.current.on('play', () => {
              setIsVideoPlaying(true);
            });

            plyrRef.current.on('pause', () => {
              setIsVideoPlaying(false);
            });

            plyrRef.current.on('ended', () => {
              setIsVideoPlaying(false);
              setPlayingVideo(null);
              setCurrentPlaybackRate(1);
              setShowRateIndicator(false);
            });

            // Set initial playing state to true since autoplay is enabled
            setIsVideoPlaying(true);
            setCurrentPlaybackRate(1);
            setShowRateIndicator(false);
          }
        })
        .catch((error) => {
          console.error('Failed to load Plyr:', error);
        });
    }

    return () => {
      if (plyrRef.current) {
        plyrRef.current.destroy();
        plyrRef.current = null;
      }
    };
  }, [playingVideo]);

  return (
    <div className="mx-auto w-full px-4 py-8">
      <div className="mb-6">
        <SelectNative
          id="exercise-select"
          value={selectedExercise}
          onChange={(e) => setSelectedExercise(e.target.value)}
          className="max-w-md"
        >
          {sportsDataWithRanks.map((sport) => (
            <option key={sport.name} value={sport.name}>
              {sport.name}
            </option>
          ))}
        </SelectNative>
      </div>

      {selectedSport && (
        <Card className="relative mx-auto max-w-2xl overflow-hidden p-0">
          <CardHeader className="from-muted to-accent rounded-t-xl border-b bg-gradient-to-r px-6 py-6">
            <div className="flex items-center">
              <img
                src="/assets/svg/DFB-Logo.svg"
                alt="DFB Logo"
                className="h-8 w-auto"
              />
              <CardTitle className="text-foreground flex-grow text-center text-2xl font-semibold">
                {selectedSport.name}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-2">
              {selectedParticipants.map((participant) => {
                const videoAvailable = playerHasVideo(
                  participant.name,
                  selectedSport.name,
                );
                const isFirstRank = participant.rank === 1;

                if (isFirstRank) {
                  return (
                    <MovingBorderButton
                      key={`${selectedSport.name}-${participant.name}`}
                      as="div"
                      onClick={() =>
                        handlePlayerClick(participant.name, selectedSport.name)
                      }
                      containerClassName={`w-full h-auto ${videoAvailable ? 'cursor-pointer' : ''
                        }`}
                      className={`flex items-center justify-between rounded-lg px-4 py-3 transition-all duration-200 ${videoAvailable
                        ? 'bg-muted hover:bg-accent cursor-pointer'
                        : 'bg-muted hover:bg-accent'
                        }`}
                      borderRadius="var(--radius)"
                      duration={3000}
                      borderClassName="bg-[radial-gradient(hsl(var(--primary))_40%,transparent_60%)] opacity-[0.8]"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold">
                          {participant.rank}
                        </div>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={getAvatarForName(participant.name)} alt={participant.name} />
                          <AvatarFallback>{getInitials(participant.name)}</AvatarFallback>
                        </Avatar>
                        <span className="text-foreground font-medium">
                          {participant.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-foreground font-medium">
                          {participant.score}
                        </span>
                        {videoAvailable && (
                          <img
                            src="/assets/images/play.svg"
                            alt="Video abspielen"
                            className="h-5 w-5"
                          />
                        )}
                      </div>
                    </MovingBorderButton>
                  );
                } else {
                  return (
                    <div
                      key={`${selectedSport.name}-${participant.name}`}
                      onClick={() =>
                        handlePlayerClick(participant.name, selectedSport.name)
                      }
                      className={`flex items-center justify-between rounded-lg border px-4 py-3 transition-all duration-200 ${videoAvailable
                        ? 'border-border bg-muted hover:border-primary hover:bg-accent cursor-pointer'
                        : 'border-border bg-muted hover:border-primary hover:bg-accent'
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold">
                          {participant.rank}
                        </div>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={getAvatarForName(participant.name)} alt={participant.name} />
                          <AvatarFallback>{getInitials(participant.name)}</AvatarFallback>
                        </Avatar>
                        <span className="text-foreground font-medium">
                          {participant.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-foreground font-medium">
                          {participant.score}
                        </span>
                        {videoAvailable && (
                          <img
                            src="/assets/images/play.svg"
                            alt="Video abspielen"
                            className="h-5 w-5"
                          />
                        )}
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </CardContent>

          {/* Video Overlay */}
          {playingVideo &&
            playingVideo.exerciseName === selectedSport.name &&
            (() => {
              // Find the participant data for the playing video
              const participant = selectedParticipants.find(
                (p) => p.name === playingVideo.playerName,
              );

              return (
                <div
                  className="from-background/95 to-card/95 absolute inset-0 z-20 rounded-xl bg-gradient-to-br backdrop-blur-sm"
                  onClick={handleVideoClick}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  {/* Close Button */}
                  <div className="absolute top-4 right-4 z-30">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPlayingVideo(null);
                      }}
                      className="bg-background/80 text-muted-foreground hover:bg-background rounded-full p-2 shadow-lg transition-colors"
                    >
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Player Info Overlay */}
                  <div className="absolute bottom-1/6 left-1/2 z-30 -translate-x-1/2 transform">
                    <div className="bg-background/90 rounded-lg px-4 py-3 backdrop-blur-sm">
                      <TextGenerateEffect
                        words={`${playingVideo.playerName} ${participant?.score || 'N/A'}`}
                        className="text-foreground text-sm font-semibold"
                        duration={0.6}
                      />
                    </div>
                  </div>

                  {/* Video Player Container */}
                  <div className="relative h-full w-full overflow-hidden rounded-xl">
                    <video
                      src={playingVideo.videoUrl}
                      className="h-full w-full rounded-xl object-cover"
                      ref={videoRef}
                      controls
                      autoPlay
                      onEnded={() => setPlayingVideo(null)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Ihr Browser unterstützt das Video-Tag nicht.
                    </video>
                  </div>
                </div>
              );
            })()}
        </Card>
      )}
    </div>
  );
}
