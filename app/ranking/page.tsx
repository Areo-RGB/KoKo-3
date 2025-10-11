'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button as MovingBorderButton } from '@/components/ui/moving-border';
import { SelectNative } from '@/components/ui/select-native';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { sportsData } from '@/lib/data';
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
    Bent: '/assets/images/spieler-avatars/avatars-256/bent.webp',
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
    <div className="relative min-h-screen w-full overflow-hidden bg-[#020b1f]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#06173c] via-[#020b1f] to-[#00040c]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(57,148,255,0.35),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_12%,rgba(0,210,255,0.22),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_90%,rgba(15,51,116,0.65),transparent_58%)]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-10 px-4 py-12 sm:px-8">
        <div className="flex flex-col gap-3 text-sky-100">
          <span className="text-[0.7rem] uppercase tracking-[0.38em] text-sky-300/70">
            Elite-Spielanalyse
          </span>
          <h1 className="text-3xl font-semibold text-sky-50 sm:text-4xl">
            Leistungsranking
          </h1>
          <p className="max-w-2xl text-sm text-sky-200/75">
            Wähle unten eine Übung, um die Bestenliste mit Spielerstatistiken,
            Videos und Live-Highlights im Aero-Glas-Look anzuzeigen.
          </p>
        </div>

        <div className="relative max-w-sm overflow-hidden rounded-2xl border border-white/20 bg-white/10 px-4 pb-5 pt-6 text-sky-100 shadow-[0_30px_60px_-35px_rgba(14,147,255,0.85)] backdrop-blur-3xl">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-300 via-sky-500 to-blue-600" />
          <label
            htmlFor="exercise-select"
            className="mb-2 block text-xs font-semibold uppercase tracking-[0.32em] text-sky-200/80"
          >
            Übung auswählen
          </label>
          <SelectNative
            id="exercise-select"
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
            className="border-white/30 bg-white/10 text-sky-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] focus-visible:border-cyan-200 focus-visible:ring-cyan-300/40"
          >
            {sportsDataWithRanks.map((sport) => (
              <option key={sport.name} value={sport.name}>
                {sport.name}
              </option>
            ))}
          </SelectNative>
        </div>

        {selectedSport && (
          <Card className="relative overflow-hidden rounded-[28px] border border-white/20 bg-white/10 p-0 text-sky-100 shadow-[0_50px_90px_-45px_rgba(9,110,255,0.8)] backdrop-blur-[26px]">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-white/12 via-transparent to-sky-500/18" />
              <div className="absolute -top-28 left-10 h-72 w-72 rounded-full bg-sky-400/30 blur-[140px]" />
              <div className="absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-blue-900/40 blur-[150px]" />
            </div>
            <CardHeader className="relative flex flex-col gap-5 border-b border-white/10 bg-gradient-to-r from-white/10 via-[#0d2c63]/40 to-[#03122e]/80 px-8 py-7">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-sky-200/90 shadow-[0_0_6px_rgba(125,211,252,0.9)]" />
                    <span className="h-2 w-2 rounded-full bg-cyan-300/80 shadow-[0_0_6px_rgba(103,232,249,0.9)]" />
                    <span className="h-2 w-2 rounded-full bg-blue-500/80 shadow-[0_0_8px_rgba(59,130,246,0.95)]" />
                  </div>
                  <img
                    src="/assets/svg/DFB-Logo.svg"
                    alt="DFB Logo"
                    className="h-9 w-auto drop-shadow-[0_10px_20px_rgba(14,116,255,0.35)]"
                  />
                  <CardTitle className="text-center text-2xl font-semibold tracking-wide text-sky-50">
                    {selectedSport.name}
                  </CardTitle>
                </div>
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[0.65rem] uppercase tracking-[0.3em] text-cyan-100/80">
                  Aktiv
                </span>
              </div>
              <p className="max-w-xl text-xs leading-relaxed text-sky-200/70">
                Die Top-Platzierungen werden kontinuierlich synchronisiert.
                Tippe auf einen Spieler, um verfügbare Technik- und
                Leistungsclips im Overlay abzuspielen.
              </p>
            </CardHeader>
            <CardContent className="relative z-10 p-8">
              <div className="space-y-3">
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
                          handlePlayerClick(
                            participant.name,
                            selectedSport.name,
                          )
                        }
                        containerClassName={`h-auto w-full rounded-2xl ${
                          videoAvailable ? 'cursor-pointer' : ''
                        }`}
                        className={`group relative flex items-center justify-between rounded-2xl border border-white/30 bg-gradient-to-br from-sky-500/35 via-[#0b1e42]/80 to-[#020818]/95 px-5 py-4 text-sky-50 shadow-[0_25px_55px_-30px_rgba(14,137,255,0.95)] transition-all duration-300 backdrop-blur-3xl ${
                          videoAvailable
                            ? 'hover:border-cyan-200/70 hover:shadow-[0_30px_65px_-28px_rgba(41,190,255,0.95)]'
                            : 'hover:border-white/40'
                        }`}
                        borderRadius="1.25rem"
                        duration={3200}
                        borderClassName="opacity-80 bg-[radial-gradient(circle_at_18%_18%,rgba(14,202,255,0.65),transparent_52%)]"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 text-[0.85rem] font-bold text-[#031128] shadow-[0_0_18px_rgba(46,197,255,0.75)]">
                            {participant.rank}
                          </div>
                          <Avatar className="h-9 w-9 ring-2 ring-cyan-200/60 ring-offset-2 ring-offset-[#020b1f]">
                            <AvatarImage
                              src={getAvatarForName(participant.name)}
                              alt={participant.name}
                            />
                            <AvatarFallback>
                              {getInitials(participant.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-base font-semibold tracking-wide text-sky-50">
                            {participant.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-semibold tracking-widest text-cyan-100">
                            {participant.score}
                          </span>
                          {videoAvailable && (
                            <img
                              src="/assets/images/play.svg"
                              alt="Video abspielen"
                              className="h-5 w-5 drop-shadow-[0_0_12px_rgba(56,189,248,0.9)]"
                            />
                          )}
                        </div>
                      </MovingBorderButton>
                    );
                  }

                  return (
                    <div
                      key={`${selectedSport.name}-${participant.name}`}
                      onClick={() =>
                        handlePlayerClick(participant.name, selectedSport.name)
                      }
                      className={`group flex items-center justify-between rounded-2xl border border-white/12 bg-white/10 px-5 py-4 text-sky-100 shadow-[0_16px_45px_-35px_rgba(11,102,255,0.85)] backdrop-blur-2xl transition-all duration-300 ${
                        videoAvailable
                          ? 'cursor-pointer hover:border-cyan-200/70 hover:bg-[#081c3d]/75 hover:shadow-[0_22px_55px_-35px_rgba(41,190,255,0.85)]'
                          : 'hover:border-white/20 hover:bg-[#091937]/70'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/20 text-[0.8rem] font-semibold text-sky-900">
                          {participant.rank}
                        </div>
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={getAvatarForName(participant.name)}
                            alt={participant.name}
                          />
                          <AvatarFallback>
                            {getInitials(participant.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium tracking-wide text-sky-50">
                          {participant.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-semibold tracking-[0.3em] text-sky-100/90">
                          {participant.score}
                        </span>
                        {videoAvailable && (
                          <img
                            src="/assets/images/play.svg"
                            alt="Video abspielen"
                            className="h-5 w-5 drop-shadow-[0_0_10px_rgba(56,189,248,0.8)]"
                          />
                        )}
                      </div>
                    </div>
                  );
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
                    className="absolute inset-0 z-20 rounded-[28px] border border-white/10 bg-gradient-to-br from-[#02143a]/95 via-[#051f51]/90 to-[#030b1e]/96 backdrop-blur-xl shadow-[0_25px_70px_-40px_rgba(3,130,255,0.85)]"
                    onClick={handleVideoClick}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    {/* Close Button */}
                    <div className="absolute right-5 top-5 z-30">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPlayingVideo(null);
                        }}
                        className="rounded-full border border-white/30 bg-white/10 p-2 text-sky-100 shadow-[0_14px_35px_-25px_rgba(14,165,233,0.9)] transition-colors hover:bg-white/20"
                      >
                        <svg
                          className="h-5 w-5"
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
                    <div className="absolute bottom-1/5 left-1/2 z-30 -translate-x-1/2 transform">
                      <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sky-50 backdrop-blur-2xl shadow-[0_15px_45px_-28px_rgba(14,165,233,0.75)]">
                        <TextGenerateEffect
                          words={`${playingVideo.playerName} ${participant?.score || 'N/A'}`}
                          className="text-sm font-semibold tracking-[0.28em]"
                          duration={0.6}
                        />
                      </div>
                    </div>

                    {/* Video Player Container */}
                    <div className="relative h-full w-full overflow-hidden rounded-[28px]">
                      <video
                        src={playingVideo.videoUrl}
                        className="h-full w-full rounded-[28px] object-cover"
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
    </div>
  );
}
