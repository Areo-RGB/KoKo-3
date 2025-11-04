'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Trophy,
  Download,
  History,
  Users,
  Timer,
  BarChart3,
} from 'lucide-react';

// Import our new components
import { useYoYoTimer } from './_hooks/use-yoyo-timer';
import { TimerDisplay } from './_components/timer-display';
import { TimerControls } from './_components/timer-controls';
import { AthleteSelection } from './_components/athlete-selection';
import { AthleteTracking } from './_components/athlete-tracking';
import { HistoricalResults } from './_components/historical-results';
import { TestVideo } from './_components/test-video';
import { formatDistance } from '@/lib/utils';

// Import existing types and data
import { AthleteResult, TestSession } from './_lib/yoyo-protocol';
import { players as availablePlayers } from './_lib/players';
import { FirebaseYoYoService } from '@/lib/firebase-service';

type RankingMap = Record<string, number>;

const DISTANCE_OPTIONS = [
  40, 80, 120, 160, 200, 240, 280, 320, 360, 400, 440, 480, 520, 560, 600, 640,
  680, 720, 760, 800, 840, 880, 920, 960, 1000, 1040, 1080, 1120, 1160, 1200,
  1240, 1280,
] as const;

const LOCAL_STORAGE_KEY = 'yo-yo-ranking';

export default function YoYoRankingPage() {
  // Use our custom hook for timer management
  const {
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
  } = useYoYoTimer();

  // Legacy state for manual distance entry (keeping existing functionality)
  const playerNames = React.useMemo(
    () => availablePlayers.map((player) => player.name),
    [],
  );
  const [armedPlayer, setArmedPlayer] = useState<string | null>(null);
  const [dialogPlayer, setDialogPlayer] = useState<string | null>(null);
  const [distanceInput, setDistanceInput] = useState<string>('');
  const [inputError, setInputError] = useState<string | null>(null);
  const [rankings, setRankings] = useState<RankingMap>({});
  const [activeTab, setActiveTab] = useState<string>('test-admin');
  const [selectedAthletes, setSelectedAthletes] = useState<string[]>(() => availablePlayers.map(player => player.id));
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Load existing rankings from localStorage
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!stored) return;

      const parsed = JSON.parse(stored) as unknown;
      if (!parsed || typeof parsed !== 'object') return;

      const validatedEntries = Object.entries(
        parsed as Record<string, unknown>,
      ).reduce<RankingMap>((accumulator, [name, value]) => {
        const numericValue = typeof value === 'number' ? value : Number(value);
        if (Number.isFinite(numericValue) && numericValue > 0) {
          accumulator[name] = numericValue;
        }
        return accumulator;
      }, {});

      setRankings(validatedEntries);
    } catch {
      // Ignore malformed cached data.
    }
  }, []);

  // Save rankings to localStorage
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      if (Object.keys(rankings).length === 0) {
        window.localStorage.removeItem(LOCAL_STORAGE_KEY);
      } else {
        window.localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify(rankings),
        );
      }
    } catch {
      // Ignore storage errors (e.g. quota exceeded, private mode).
    }
  }, [rankings]);

  const rankingList = React.useMemo(
    () =>
      Object.entries(rankings).sort(
        ([, aDistance], [, bDistance]) => bDistance - aDistance,
      ),
    [rankings],
  );

  const handleButtonClick = (name: string) => {
    if (armedPlayer === name) {
      setDialogPlayer(name);
      const existingDistance = rankings[name];
      const prefillValue =
        existingDistance !== undefined &&
          DISTANCE_OPTIONS.some((option) => option === existingDistance)
          ? String(existingDistance)
          : '';
      setDistanceInput(prefillValue);
      setInputError(null);
      return;
    }

    setArmedPlayer(name);
  };

  const handleResetRankings = () => {
    setRankings({});
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
    handleDialogClose();
  };

  const handleDialogClose = () => {
    setDialogPlayer(null);
    setDistanceInput('');
    setInputError(null);
    setArmedPlayer(null);
  };

  const handleDistanceSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!dialogPlayer) return;

    const rawValue = distanceInput.trim();
    if (!rawValue) {
      setInputError('Bitte eine Distanz eintragen.');
      return;
    }

    const numericValue = Number(rawValue);

    if (!Number.isFinite(numericValue) || numericValue <= 0) {
      setInputError('Bitte eine gültige Distanz in Metern angeben.');
      return;
    }

    setRankings((previous) => ({ ...previous, [dialogPlayer]: numericValue }));
    handleDialogClose();
  };

  const handleStartTest = () => {
    if (athletes.length > 0) {
      startTest();
    }
  };

  const handleExportResults = () => {
    if (testSession && testSession.results.length > 0) {
      const csvContent = [
        ['Name', 'Status', 'Distanz (m)', 'Shuttle', 'Zeit'],
        ...testSession.results.map((result) => [
          result.name,
          result.status,
          result.estimatedDistance,
          result.dropOutShuttle || '-',
          result.dropOutTime ? formatTime(result.dropOutTime) : '-',
        ]),
      ]
        .map((row) => row.join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `yoyo-test-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Finish test and save results to database
  const handleFinishTest = async () => {
    if (!testSession || testSession.results.length === 0) {
      setSaveError('Keine Testergebnisse zum Speichern vorhanden');
      return;
    }

    if (!confirm('Möchten Sie den Test beenden und die Ergebnisse in der Datenbank speichern?')) {
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      // Convert athletes to AthleteResult format for Firebase with all required properties
      const athleteResults = testSession.results.map((result) => {
        // For active and warned athletes, mark them as completed with their current distance
        if (result.status === 'active' || result.status === 'warned') {
          return {
            id: result.id,
            name: result.name,
            estimatedDistance: result.estimatedDistance || 0,
            status: 'completed' as const,
            dropOutShuttle: undefined, // They didn't drop out, they completed
            dropOutTime: undefined, // They didn't drop out, they completed
            completed: true,
            warnings: result.warnings || 0,
          };
        }

        // For athletes who already dropped out or completed, keep their original status
        return {
          id: result.id,
          name: result.name,
          estimatedDistance: result.estimatedDistance || 0,
          status: result.status || 'active',
          dropOutShuttle: result.dropOutShuttle,
          dropOutTime: result.dropOutTime,
          completed: result.completed || (result.status === 'completed'),
          warnings: result.warnings || 0,
        };
      });

      // Convert TestSession to match the expected format for Firebase
      const testSessionData = {
        id: testSession.id,
        date: testSession.date instanceof Date ? testSession.date : new Date(testSession.date),
        participants: testSession.participants || [],
        status: 'completed' as const, // Mark the test as completed
        results: athleteResults, // Use the updated athlete results
        currentShuttle: testSession.currentShuttle || 0,
        startTime: testSession.startTime,
        elapsedTime: testSession.elapsedTime || 0,
      };

      // Save to Firebase
      const sessionId = await FirebaseYoYoService.saveTestSession(testSessionData, athleteResults);

      // Reset test after successful save
      resetTest();

      // Show success message and switch to historical tab
      alert('Testergebnisse erfolgreich gespeichert!');
      setActiveTab('historical');

    } catch (error) {
      console.error('Error saving test results:', error);
      setSaveError('Fehler beim Speichern der Testergebnisse. Bitte versuchen Sie es erneut.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Yo-Yo IR1 Fitness Test</h1>
        <p className="text-muted-foreground text-sm">
          Verwalten Sie den Yo-Yo Intermittent Recovery Test Level 1 mit
          automatischer Zeitnahme und Teilnehmer-Tracking.
        </p>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="test-admin" className="flex items-center">
            <Timer className="mr-2 h-4 w-4" />
            Test-Administration
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center">
            <Trophy className="mr-2 h-4 w-4" />
            Ergebnisse & Ranking
          </TabsTrigger>
          <TabsTrigger value="historical" className="flex items-center">
            <History className="mr-2 h-4 w-4" />
            Historie
          </TabsTrigger>
        </TabsList>

        <TabsContent value="test-admin" className="space-y-6">
          {/* Test Video - For UI Testing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="mr-2 h-5 w-5">📹</div>
                Test-Video (UI-Updates)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                <TestVideo
                  isPlaying={isVideoPlaying}
                  onVideoEnd={handleVideoEnd}
                  className="w-full h-full"
                />
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                Das Video startet automatisch beim Testbeginn und hilft zu prüfen, ob die UI korrekt aktualisiert wird.
              </div>
            </CardContent>
          </Card>

          {/* Timer Display */}
          <TimerDisplay
            elapsedTime={elapsedTime}
            isRunning={isRunning}
            isPaused={isPaused}
            isResting={isResting}
            pauseTimeRemaining={pauseTimeRemaining}
            currentShuttle={currentShuttle}
            nextShuttle={nextShuttle}
            shuttleIndex={shuttleIndex}
          />

          {/* Timer Controls */}
          <TimerControls
            isRunning={isRunning}
            isPaused={isPaused}
            hasParticipants={athletes.length > 0}
            onStartTest={handleStartTest}
            onPauseTest={pauseTest}
            onResumeTest={resumeTest}
            onResetTest={resetTest}
            enableAudio={enableAudio}
            onToggleAudio={setEnableAudio}
            onPlayAudioSignal={playAudioSignal}
          />

          {/* Athlete Selection */}
          <AthleteSelection
            selectedAthletes={selectedAthletes}
            onAthleteSelectionChange={setSelectedAthletes}
            onAddAthlete={addAthlete}
            disabled={isRunning}
          />

          {/* Athlete Tracking */}
          <AthleteTracking
            athletes={athletes}
            currentShuttle={shuttleIndex}
            onMarkFailure={markFailure}
            disabled={!isRunning}
          />

          {/* Finish Test Button - Show when test has results but is still running */}
          {testSession && testSession.results && testSession.results.length > 0 && testSession.status !== 'completed' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="mr-2 h-5 w-5">🏁</div>
                  Test Beenden
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Der Test kann jederzeit beendet werden. Die bisherigen Ergebnisse werden gespeichert.
                    </p>
                    <p className="text-sm font-medium mt-1">
                      {testSession.results.length} Teilnehmer haben Ergebnisse erzielt.
                    </p>
                  </div>
                  <Button
                    onClick={handleFinishTest}
                    disabled={isSaving}
                    variant="default"
                    size="lg"
                  >
                    {isSaving ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Speichern...
                      </>
                    ) : (
                      <>
                        <div className="mr-2 h-4 w-4">💾</div>
                        Test beenden & Speichern
                      </>
                    )}
                  </Button>
                </div>
                {saveError && (
                  <div className="mt-4 p-3 rounded-md border border-destructive bg-destructive/10">
                    <div className="text-sm text-destructive">{saveError}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Test Results */}
          {testSession && (testSession.status === 'completed' || (testSession.results && testSession.results.length > 0)) && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Testergebnisse
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    {testSession.status !== 'completed' && (
                      <Button
                        onClick={handleFinishTest}
                        disabled={isSaving || testSession.results.length === 0}
                        variant="default"
                      >
                        {isSaving ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Speichern...
                          </>
                        ) : (
                          <>
                            <div className="mr-2 h-4 w-4" />
                            Test beenden & Speichern
                          </>
                        )}
                      </Button>
                    )}
                    <Button onClick={handleExportResults} variant="outline" disabled={testSession.results.length === 0}>
                      <Download className="mr-2 h-4 w-4" />
                      Exportieren
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {saveError && (
                  <div className="mb-4 p-3 rounded-md border border-destructive bg-destructive/10">
                    <div className="text-sm text-destructive">{saveError}</div>
                  </div>
                )}
                <div className="space-y-4">
                  {testSession.results
                    .sort((a, b) => b.estimatedDistance - a.estimatedDistance)
                    .map((result, index) => (
                      <div
                        key={result.id}
                        className="flex items-center justify-between p-3 rounded-md border"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-lg font-bold text-muted-foreground">
                            {index + 1}.
                          </div>
                          <div>
                            <div className="font-medium">{result.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {result.status === 'completed'
                                ? 'Test abgeschlossen'
                                : result.status === 'dropped-out'
                                  ? `Ausgeschieden bei Shuttle ${result.dropOutShuttle}`
                                  : 'Status unbekannt'}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold">
                            {formatDistance(result.estimatedDistance)}
                          </div>
                          {result.dropOutTime && (
                            <div className="text-sm text-muted-foreground">
                              {formatTime(result.dropOutTime)}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {/* Manual Distance Entry */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="mr-2 h-5 w-5" />
                Manuelle Distanz-Eintragung
              </CardTitle>
            </CardHeader>
            <CardContent>
              {playerNames.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Keine Spieler verfügbar.
                </p>
              ) : (
                <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {playerNames.map((name) => (
                    <Button
                      key={name}
                      type="button"
                      variant="outline"
                      aria-pressed={armedPlayer === name}
                      onClick={() => handleButtonClick(name)}
                      className={`justify-start text-left text-base font-medium ${armedPlayer === name &&
                        'border-red-500 text-red-600 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]'
                        }`}
                    >
                      {name}
                    </Button>
                  ))}
                </section>
              )}
            </CardContent>
          </Card>

          {/* Rankings */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Trophy className="mr-2 h-5 w-5" />
                  Ranking
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleResetRankings}
                  disabled={rankingList.length === 0}
                >
                  Zurücksetzen
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {rankingList.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Noch keine Distanzen erfasst.
                </p>
              ) : (
                <ol className="grid gap-2">
                  {rankingList.map(([name, distance], index) => (
                    <li
                      key={name}
                      className="bg-card flex items-center justify-between rounded-md border p-3"
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-muted-foreground font-medium">
                          {index + 1}.
                        </span>
                        <span>{name}</span>
                      </span>
                      <span className="font-semibold">
                        {formatDistance(distance)}
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historical" className="space-y-6">
          <HistoricalResults />
        </TabsContent>
      </Tabs>

      {/* Distance Entry Dialog */}
      <Dialog
        open={dialogPlayer !== null}
        onOpenChange={(open) => !open && handleDialogClose()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Distanz eintragen</DialogTitle>
            <DialogDescription>
              {dialogPlayer
                ? `${dialogPlayer} eine Distanz in Metern zuordnen.`
                : 'Trage eine Distanz in Metern ein.'}
            </DialogDescription>
          </DialogHeader>
          <form className="grid gap-4" onSubmit={handleDistanceSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="distance">Distanz (Meter)</Label>
              <Select
                value={distanceInput || undefined}
                onValueChange={(value) => {
                  setDistanceInput(value);
                  setInputError(null);
                }}
              >
                <SelectTrigger id="distance">
                  <SelectValue placeholder="Distanz auswählen" />
                </SelectTrigger>
                <SelectContent className="max-h-56">
                  {DISTANCE_OPTIONS.map((distance) => (
                    <SelectItem key={distance} value={String(distance)}>
                      {distance} m
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {inputError && (
                <p className="text-destructive text-sm">{inputError}</p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleDialogClose}
              >
                Abbrechen
              </Button>
              <Button type="submit">Speichern</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper function to format time
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`;
}
