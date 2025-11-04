'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  History,
  Trophy,
  Calendar,
  User,
  TrendingUp,
  Download,
  Trash2,
  Upload,
} from 'lucide-react';
import { FirebaseYoYoService, HistoricalResult, YoYoTestResult } from '@/lib/firebase-service';
import { formatDistance } from '@/lib/utils';

interface HistoricalResultsProps {
  onRefresh?: () => void;
}

export function HistoricalResults({ onRefresh }: HistoricalResultsProps) {
  const [testSessions, setTestSessions] = useState<YoYoTestResult[]>([]);
  const [historicalResults, setHistoricalResults] = useState<HistoricalResult[]>([]);
  const [bestPerformances, setBestPerformances] = useState<Record<string, { distance: number; date: string; sessionId: string }>>({});
  const [selectedAthlete, setSelectedAthlete] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from Firebase
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [sessions, historical, best] = await Promise.all([
        FirebaseYoYoService.getAllTestSessions(),
        FirebaseYoYoService.getAllHistoricalResults(),
        FirebaseYoYoService.getAthleteBestPerformances(),
      ]);

      setTestSessions(sessions);
      setHistoricalResults(historical);
      setBestPerformances(best);
    } catch (err) {
      console.error('Error loading historical data:', err);
      setError('Fehler beim Laden der historischen Daten');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = FirebaseYoYoService.subscribeToHistoricalResults((results) => {
      setHistoricalResults(results);
    });

    return () => unsubscribe();
  }, []);

  // Get unique athlete names
  const athleteNames = React.useMemo(() => {
    const names = new Set<string>();
    historicalResults.forEach(result => names.add(result.athleteName));
    return Array.from(names).sort();
  }, [historicalResults]);

  // Filter historical results based on selected athlete
  const filteredResults = React.useMemo(() => {
    if (selectedAthlete === 'all') {
      return historicalResults;
    }
    return historicalResults.filter(result => result.athleteName === selectedAthlete);
  }, [historicalResults, selectedAthlete]);

  // Export results to CSV
  const handleExportResults = () => {
    const csvContent = [
      ['Datum', 'Athlet', 'Distanz (m)', 'Status', 'Shuttle', 'Zeit'],
      ...filteredResults.map((result) => [
        new Date(result.timestamp).toLocaleDateString('de-DE'),
        result.athleteName,
        result.distance,
        result.status,
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
    a.download = `yoyo-historical-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Delete a test session
  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm('Möchten Sie diesen Test wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.')) {
      return;
    }

    try {
      await FirebaseYoYoService.deleteTestSession(sessionId);
      await loadData(); // Reload data
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Error deleting session:', err);
      setError('Fehler beim Löschen des Tests');
    }
  };

  // Import yoyoIr1 data (replaces all existing data)
  const handleImportYoYoIr1Data = async () => {
    if (!confirm('Möchten Sie die Yo-Yo IR1 Daten importieren und ALLE vorhandenen historischen Daten ersetzen? Diese Aktion kann nicht rückgängig gemacht werden.')) {
      return;
    }

    try {
      await FirebaseYoYoService.importYoYoIr1Data(true);
      await loadData(); // Reload data
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Error importing yoyoIr1 data:', err);
      setError('Fehler beim Importieren der Yo-Yo IR1 Daten');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">Lade historische Daten...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-destructive">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <History className="mr-2 h-4 w-4" />
              Gesamte Tests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{testSessions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <User className="mr-2 h-4 w-4" />
              Einzigartige Athleten
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{athleteNames.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="mr-2 h-4 w-4" />
              Gesamtergebnisse
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{historicalResults.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Upload className="mr-2 h-4 w-4" />
              Daten Import
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleImportYoYoIr1Data}
              variant="destructive"
              size="sm"
              className="w-full"
            >
              Daten ersetzen
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="history" className="w-full">
        <TabsList>
          <TabsTrigger value="history" className="flex items-center">
            <History className="mr-2 h-4 w-4" />
            Historie
          </TabsTrigger>
          <TabsTrigger value="best-performances" className="flex items-center">
            <Trophy className="mr-2 h-4 w-4" />
            Bestleistungen
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Testsitzungen
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Testhistorie</CardTitle>
                <div className="flex items-center space-x-2">
                  <Select value={selectedAthlete} onValueChange={setSelectedAthlete}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Athlet auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle Athleten</SelectItem>
                      {athleteNames.map((name) => (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleExportResults} variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Exportieren
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredResults.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Keine historischen Ergebnisse gefunden.
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredResults.map((result) => (
                    <div
                      key={result.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center space-x-3">
                        <div>
                          <div className="font-medium">{result.athleteName}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(result.timestamp).toLocaleDateString('de-DE')} {new Date(result.timestamp).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="font-semibold">{formatDistance(result.distance)}</div>
                          <div className="text-sm text-muted-foreground">
                            {result.status === 'completed' ? 'Abgeschlossen' :
                             result.status === 'dropped-out' ? `Shuttle ${result.dropOutShuttle}` :
                             result.status}
                          </div>
                        </div>
                        <Badge variant={result.status === 'completed' ? 'default' : 'secondary'}>
                          {result.status === 'completed' ? '✓' : result.status === 'dropped-out' ? '✗' : '-'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="best-performances" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bestleistungen je Athlet</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(bestPerformances).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Keine Bestleistungen gefunden.
                </div>
              ) : (
                <div className="space-y-2">
                  {Object.entries(bestPerformances)
                    .sort(([, a], [, b]) => b.distance - a.distance)
                    .map(([name, performance], index) => (
                      <div
                        key={name}
                        className="flex items-center justify-between p-3 rounded-lg border"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-lg font-bold text-muted-foreground">
                            {index + 1}.
                          </div>
                          <div>
                            <div className="font-medium">{name}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(performance.date).toLocaleDateString('de-DE')}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatDistance(performance.distance)}</div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Testsitzungen</CardTitle>
            </CardHeader>
            <CardContent>
              {testSessions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Keine Testsitzungen gefunden.
                </div>
              ) : (
                <div className="space-y-2">
                  {testSessions
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .map((session) => (
                      <div
                        key={session.id}
                        className="flex items-center justify-between p-3 rounded-lg border"
                      >
                        <div>
                          <div className="font-medium">
                            {new Date(session.timestamp).toLocaleDateString('de-DE')} {new Date(session.timestamp).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {session.participants ? session.participants.length : 0} Teilnehmer
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-right">
                            <div className="font-semibold">
                              Ø {session.participants && session.participants.length > 0 ? Math.round(
                                session.participants.reduce((sum, r) => sum + r.estimatedDistance, 0) /
                                session.participants.length,
                              ) : 0}m
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {session.participants ? session.participants.filter(r => r.status === 'completed').length : 0} abgeschlossen
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteSession(session.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
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