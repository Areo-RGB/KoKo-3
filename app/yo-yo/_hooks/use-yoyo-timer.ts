'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AthleteResult,
  ShuttleInfo,
  TestSession,
  YOYO_IR1_PROTOCOL,
  formatTime,
  getCurrentShuttle,
  getNextShuttle,
} from '../_lib/yoyo-protocol';
import { FirebaseYoYoService } from '@/lib/firebase-service';

export interface UseYoYoTimerReturn {
  // Timer state
  elapsedTime: number;
  isRunning: boolean;
  isPaused: boolean;
  isResting: boolean;
  pauseTimeRemaining: number;
  formattedTime: string;

  // Test state
  currentShuttle: ShuttleInfo | null;
  nextShuttle: ShuttleInfo | null;
  shuttleIndex: number;

  // Test session
  testSession: TestSession | null;
  athletes: AthleteResult[];

  // Video state
  isVideoPlaying: boolean;

  // Timer controls
  startTest: () => void;
  pauseTest: () => void;
  resumeTest: () => void;
  resetTest: () => void;

  // Athlete management
  addAthlete: (id: string, name: string) => void;
  markFailure: (athleteId: string) => void;
  updateAthleteStatus: (
    athleteId: string,
    status: AthleteResult['status'],
  ) => void;

  // Audio controls
  playAudioSignal: () => void;
  enableAudio: boolean;
  setEnableAudio: (enabled: boolean) => void;

  // Video controls
  handleVideoEnd: () => void;
}

export function useYoYoTimer(): UseYoYoTimerReturn {
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [shuttleIndex, setShuttleIndex] = useState<number>(-1);
  const [testSession, setTestSession] = useState<TestSession | null>(null);
  const [athletes, setAthletes] = useState<AthleteResult[]>([]);
  const [enableAudio, setEnableAudio] = useState<boolean>(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);
  const lastShuttleIndexRef = useRef<number>(-1);
  const beepStateRef = useRef<'none' | 'start' | 'turn' | 'finish'>('none');
  const airHornRef = useRef<HTMLAudioElement | null>(null);
  const turnSoundRef = useRef<HTMLAudioElement | null>(null);
  const finishSoundRef = useRef<HTMLAudioElement | null>(null);

  const currentShuttle = getCurrentShuttle(elapsedTime);
  const nextShuttle = getNextShuttle(elapsedTime);
  const formattedTime = formatTime(elapsedTime);

  const isResting = !!(
    isRunning &&
    !isPaused &&
    currentShuttle &&
    nextShuttle &&
    elapsedTime > currentShuttle.endTime
  );

  const pauseTimeRemaining =
    isResting && nextShuttle ? nextShuttle.startTime - elapsedTime : 0;

  // --- FUNCTIONS MOVED UP TO FIX REFERENCE ERROR ---

  const pauseTest = useCallback(() => {
    if (isRunning && !isPaused) {
      setIsPaused(true);
      setIsVideoPlaying(false); // Pause video
      pausedTimeRef.current = elapsedTime;
      setTestSession((prev) => (prev ? { ...prev, status: 'paused' } : null));
    }
  }, [isRunning, isPaused, elapsedTime]);

  const completeTest = useCallback(async () => {
    setIsRunning(false);
    setIsVideoPlaying(false); // Stop video

    // Get the final distance for all athletes based on the last completed shuttle
    const finalDistance = shuttleIndex >= 0 ? YOYO_IR1_PROTOCOL[shuttleIndex]?.distance || 0 : 0;

    const finalAthletes = athletes.map((athlete) => {
      if (athlete.status === 'active' || athlete.status === 'warned') {
        return {
          ...athlete,
          status: 'completed' as const,
          completed: true,
          estimatedDistance: finalDistance
        };
      }
      return athlete;
    });

    setAthletes(finalAthletes);

    const completedSession = testSession ? {
      ...testSession,
      status: 'completed' as const,
      results: finalAthletes,
    } : null;

    setTestSession(completedSession);

    // Save results to Firebase when test is completed
    if (completedSession && finalAthletes.length > 0) {
      try {
        await FirebaseYoYoService.saveTestSession(completedSession, finalAthletes);
        console.log('Test results saved to Firebase successfully');
      } catch (error) {
        console.error('Error saving test results to Firebase:', error);
      }
    }
  }, [athletes, testSession, shuttleIndex]);

  const playBeep = useCallback(
    (type: 'short' | 'long' | 'finish' = 'short') => {
      if (!enableAudio) return;
      try {
        if (type === 'long') {
          // Use air-horn sound for shuttle start
          if (!airHornRef.current) {
            airHornRef.current = new Audio('/yo-yo/assets/sounds/air-horn.mp3');
            airHornRef.current.volume = 1.0;
          }
          airHornRef.current.currentTime = 0;
          airHornRef.current.play().catch((error) => {
            console.error('Error playing air-horn:', error);
          });
        } else if (type === 'finish') {
          // Use fanfare sound for shuttle finish
          if (!finishSoundRef.current) {
            finishSoundRef.current = new Audio('/yo-yo/assets/sounds/finish-fanfare-short.mp3');
            finishSoundRef.current.volume = 1.0;
          }
          finishSoundRef.current.currentTime = 0;
          finishSoundRef.current.play().catch((error) => {
            console.error('Error playing finish sound:', error);
          });
        } else {
          // Use turn sound for mid-shuttle signal
          if (!turnSoundRef.current) {
            turnSoundRef.current = new Audio('/yo-yo/assets/sounds/turn.mp3');
            turnSoundRef.current.volume = 1.0;
          }
          turnSoundRef.current.currentTime = 0;
          turnSoundRef.current.play().catch((error) => {
            console.error('Error playing turn sound:', error);
          });
        }
      } catch (error) {
        console.error('Error playing audio signal:', error);
      }
    },
    [enableAudio],
  );

  // --- END OF MOVED FUNCTIONS ---

  useEffect(() => {
    if (currentShuttle) {
      const newShuttleIndex = YOYO_IR1_PROTOCOL.findIndex(
        (shuttle) =>
          shuttle.level === currentShuttle.level &&
          shuttle.shuttle === currentShuttle.shuttle,
      );
      if (newShuttleIndex !== lastShuttleIndexRef.current) {
        setShuttleIndex(newShuttleIndex);
        lastShuttleIndexRef.current = newShuttleIndex;
        beepStateRef.current = 'none';
      }
    }
  }, [currentShuttle]);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const newElapsedTime =
          (now - startTimeRef.current) / 1000 + pausedTimeRef.current;
        setElapsedTime(newElapsedTime);

        if (enableAudio && currentShuttle) {
          const shuttleDuration =
            currentShuttle.endTime - currentShuttle.startTime;
          const turnTime = currentShuttle.startTime + shuttleDuration / 2;
          if (
            beepStateRef.current === 'none' &&
            newElapsedTime >= currentShuttle.startTime
          ) {
            playBeep('long');
            beepStateRef.current = 'start';
          } else if (
            beepStateRef.current === 'start' &&
            newElapsedTime >= turnTime
          ) {
            playBeep('short');
            beepStateRef.current = 'turn';
          } else if (
            beepStateRef.current === 'turn' &&
            newElapsedTime >= currentShuttle.endTime
          ) {
            playBeep('finish');
            beepStateRef.current = 'finish';
          }
        }

        setTestSession((prev) =>
          prev
            ? {
                ...prev,
                elapsedTime: newElapsedTime,
                currentShuttle: shuttleIndex,
              }
            : null,
        );

        if (
          currentShuttle &&
          !nextShuttle &&
          newElapsedTime > currentShuttle.endTime
        ) {
          pauseTest();
          completeTest();
        }
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [
    isRunning,
    isPaused,
    currentShuttle,
    nextShuttle,
    shuttleIndex,
    enableAudio,
    playBeep,
    completeTest,
    pauseTest,
  ]);

  const startTest = useCallback(() => {
    if (athletes.length === 0) return;
    const activeAthletes = athletes.map((a) => ({
      ...a,
      status: 'active' as const,
      warnings: 0,
    }));
    setAthletes(activeAthletes);
    const newSession: TestSession = {
      id: `test-${Date.now()}`,
      date: new Date(),
      participants: activeAthletes.map((a) => a.id),
      status: 'in-progress',
      results: activeAthletes,
      currentShuttle: -1,
      startTime: Date.now(),
      elapsedTime: 0,
    };
    setTestSession(newSession);
    setElapsedTime(0);
    setShuttleIndex(-1);
    setIsRunning(true);
    setIsPaused(false);
    setIsVideoPlaying(true); // Start video playback
    startTimeRef.current = Date.now();
    pausedTimeRef.current = 0;
    lastShuttleIndexRef.current = -1;
    beepStateRef.current = 'none';
  }, [athletes]);

  const resumeTest = useCallback(() => {
    if (isRunning && isPaused) {
      setIsPaused(false);
      setIsVideoPlaying(true); // Resume video
      startTimeRef.current = Date.now();
      setTestSession((prev) =>
        prev ? { ...prev, status: 'in-progress' } : null,
      );
    }
  }, [isRunning, isPaused]);

  const resetTest = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setIsVideoPlaying(false); // Stop video
    setElapsedTime(0);
    setShuttleIndex(-1);
    setTestSession(null);
    setAthletes([]);
    startTimeRef.current = 0;
    pausedTimeRef.current = 0;
    lastShuttleIndexRef.current = -1;
    beepStateRef.current = 'none';
  }, []);

  const addAthlete = useCallback(
    (id: string, name: string) => {
      const newAthlete: AthleteResult = {
        id,
        name,
        estimatedDistance: 0,
        completed: false,
        status: testSession ? ('active' as const) : ('waiting' as const),
        warnings: 0,
      };
      setAthletes((prev) => [...prev, newAthlete]);
      if (testSession) {
        setTestSession((prev) =>
          prev
            ? {
                ...prev,
                results: [...prev.results, newAthlete],
                participants: [...prev.participants, id],
              }
            : null,
        );
      }
    },
    [testSession],
  );

  const markFailure = useCallback(
    (athleteId: string) => {
      const athlete = athletes.find((a) => a.id === athleteId);
      if (!athlete) return;

      if (athlete.status === 'active') {
        // First warning
        const updatedAthlete = {
          ...athlete,
          status: 'warned' as const,
          warnings: 1,
        };
        setAthletes((prev) =>
          prev.map((a) => (a.id === athleteId ? updatedAthlete : a)),
        );
        setTestSession((prev) =>
          prev
            ? {
                ...prev,
                results: prev.results.map((r) =>
                  r.id === athleteId ? updatedAthlete : r,
                ),
              }
            : null,
        );
      } else if (athlete.status === 'warned') {
        // Second failure, drop out
        // Use the last completed shuttle distance, not the current one
        const lastCompletedShuttleIndex = shuttleIndex >= 0 ? shuttleIndex - 1 : -1;
        const estimatedDistance =
          lastCompletedShuttleIndex >= 0
            ? YOYO_IR1_PROTOCOL[lastCompletedShuttleIndex].distance
            : 0;

        const updatedAthlete = {
          ...athlete,
          status: 'dropped-out' as const,
          dropOutShuttle: shuttleIndex + 1, // The shuttle they failed at
          dropOutTime: elapsedTime,
          estimatedDistance,
          completed: false,
        };

        setAthletes((prev) =>
          prev.map((a) => (a.id === athleteId ? updatedAthlete : a)),
        );
        setTestSession((prev) =>
          prev
            ? {
                ...prev,
                results: prev.results.map((result) =>
                  result.id === athleteId ? updatedAthlete : result,
                ),
              }
            : null,
        );
      }
    },
    [shuttleIndex, elapsedTime, athletes],
  );

  const updateAthleteStatus = useCallback(
    (athleteId: string, status: AthleteResult['status']) => {
      setAthletes((prev) =>
        prev.map((athlete) =>
          athlete.id === athleteId ? { ...athlete, status } : athlete,
        ),
      );
      setTestSession((prev) =>
        prev
          ? {
              ...prev,
              results: prev.results.map((result) =>
                result.id === athleteId ? { ...result, status } : result,
              ),
            }
          : null,
      );
    },
    [],
  );

  // Update athlete distances dynamically during test (only when shuttle completes)
  useEffect(() => {
    if (isRunning && !isPaused && shuttleIndex >= 0) {
      // Use the PREVIOUS completed shuttle distance, not the current one
      // Athletes only get credit for shuttles they've completed
      const completedShuttleIndex = shuttleIndex - 1;
      const completedDistance = completedShuttleIndex >= 0
        ? YOYO_IR1_PROTOCOL[completedShuttleIndex]?.distance || 0
        : 0;

      setAthletes((prevAthletes) =>
        prevAthletes.map((athlete) => {
          // Only update distance for active, warned, or completed athletes
          // but not for those who have already dropped out
          if (
            athlete.status === 'active' ||
            athlete.status === 'warned' ||
            (athlete.status === 'completed' && !athlete.dropOutShuttle)
          ) {
            return {
              ...athlete,
              estimatedDistance: completedDistance,
            };
          }
          return athlete;
        }),
      );

      // Update test session results as well
      setTestSession((prevSession) =>
        prevSession
          ? {
              ...prevSession,
              results: prevSession.results.map((result) => {
                if (
                  result.status === 'active' ||
                  result.status === 'warned' ||
                  (result.status === 'completed' && !result.dropOutShuttle)
                ) {
                  return {
                    ...result,
                    estimatedDistance: completedDistance,
                  };
                }
                return result;
              }),
            }
          : null,
      );
    }
  }, [isRunning, isPaused, shuttleIndex]);

  const playAudioSignal = useCallback(() => {
    playBeep();
  }, [playBeep]);

  const handleVideoEnd = useCallback(() => {
    setIsVideoPlaying(false);
    // Optionally, you can pause the test when video ends
    // or let the test continue independently
    console.log('Video playback ended');
  }, []);

  return {
    elapsedTime,
    isRunning,
    isPaused,
    isResting,
    pauseTimeRemaining,
    formattedTime,
    currentShuttle,
    nextShuttle,
    shuttleIndex,
    testSession,
    athletes,
    isVideoPlaying,
    startTest,
    pauseTest,
    resumeTest,
    resetTest,
    addAthlete,
    markFailure,
    updateAthleteStatus,
    playAudioSignal,
    enableAudio,
    setEnableAudio,
    handleVideoEnd,
  };
}
