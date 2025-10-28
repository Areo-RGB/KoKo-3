'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Users, UserPlus } from 'lucide-react';
import { players } from '../_lib/players';

interface Player {
  id: string;
  name: string;
  team?: string;
}

interface AthleteSelectionProps {
  selectedAthletes: string[];
  onAthleteSelectionChange: (athleteIds: string[]) => void;
  onAddAthlete: (id: string, name: string) => void;
  disabled?: boolean;
}

export function AthleteSelection({
  selectedAthletes,
  onAthleteSelectionChange,
  onAddAthlete,
  disabled = false
}: AthleteSelectionProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Players are now directly imported, no need to fetch
    setLoading(false);
    setError(null);
  }, []);

  const handleAthleteToggle = (athleteId: string, checked: boolean) => {
    if (checked) {
      onAthleteSelectionChange([...selectedAthletes, athleteId]);
    } else {
      onAthleteSelectionChange(
        selectedAthletes.filter(id => id !== athleteId)
      );
    }
  };

  const handleSelectAll = () => {
    const allPlayerIds = players.map(player => player.id);
    onAthleteSelectionChange(allPlayerIds);
  };

  const handleDeselectAll = () => {
    onAthleteSelectionChange([]);
  };

  if (loading) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="text-center">Lade Spieler...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="text-center text-red-600">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Teilnehmer auswählen
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              disabled={disabled}
            >
              Alle auswählen
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeselectAll}
              disabled={disabled}
            >
              Auswahl aufheben
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {players.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            Keine Spieler gefunden.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {players.map((player) => (
              <div
                key={player.id}
                className={`flex items-center space-x-2 p-3 rounded-md border ${selectedAthletes.includes(player.id)
                  ? 'bg-primary/10 border-primary/30'
                  : 'bg-secondary/30 border-secondary/50'
                  } ${disabled ? 'opacity-50' : ''}`}
              >
                <Checkbox
                  id={`athlete-${player.id}`}
                  checked={selectedAthletes.includes(player.id)}
                  onCheckedChange={(checked) =>
                    handleAthleteToggle(player.id, checked as boolean)
                  }
                  disabled={disabled}
                />
                <Label
                  htmlFor={`athlete-${player.id}`}
                  className="flex-1 cursor-pointer"
                >
                  <div>
                    <div className="font-medium">{player.name}</div>
                    {player.team && (
                      <div className="text-xs text-muted-foreground">
                        Team: {player.team}
                      </div>
                    )}
                  </div>
                </Label>
              </div>
            ))}
          </div>
        )}

        {selectedAthletes.length > 0 && (
          <div className="mt-4 p-3 bg-primary/10 rounded-md border border-primary/30">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-primary">
                {selectedAthletes.length} Teilnehmer ausgewählt
              </span>
              <Button
                size="sm"
                onClick={() => {
                  selectedAthletes.forEach(id => {
                    const player = players.find(p => p.id === id);
                    if (player) {
                      onAddAthlete(id, player.name);
                    }
                  });
                }}
                disabled={disabled}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Zur Testliste hinzufügen
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
