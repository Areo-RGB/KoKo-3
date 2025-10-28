'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AthleteResult } from '../_lib/yoyo-protocol';
import {
  User,
  UserX,
  Clock,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';

interface AthleteTrackingProps {
  athletes: AthleteResult[];
  currentShuttle: number;
  onMarkFailure: (athleteId: string) => void;
  disabled?: boolean;
}

export function AthleteTracking({
  athletes,
  currentShuttle,
  onMarkFailure,
  disabled = false,
}: AthleteTrackingProps) {
  const getStatusIcon = (status: AthleteResult['status']) => {
    switch (status) {
      case 'active':
        return <User className="h-4 w-4 text-green-600" />;
      case 'warned':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'dropped-out':
        return <UserX className="h-4 w-4 text-red-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'waiting':
        return <Clock className="h-4 w-4 text-gray-600" />;
      default:
        return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: AthleteResult['status']) => {
    switch (status) {
      case 'active':
        return (
          <Badge
            variant="default"
            className="bg-green-500/20 text-green-600 dark:bg-green-500/30 dark:text-green-400"
          >
            Aktiv
          </Badge>
        );
      case 'warned':
        return (
          <Badge
            variant="default"
            className="bg-yellow-500/20 text-yellow-600 dark:bg-yellow-500/30 dark:text-yellow-400"
          >
            Verwarnt
          </Badge>
        );
      case 'dropped-out':
        return <Badge variant="destructive">Ausgeschieden</Badge>;
      case 'completed':
        return (
          <Badge
            variant="default"
            className="bg-primary/20 text-primary dark:bg-primary/30"
          >
            Abgeschlossen
          </Badge>
        );
      case 'waiting':
        return <Badge variant="secondary">Wartend</Badge>;
      default:
        return <Badge variant="outline">Unbekannt</Badge>;
    }
  };

  const getStatusColor = (status: AthleteResult['status']) => {
    switch (status) {
      case 'active':
        return 'border-green-500/30 bg-green-500/10';
      case 'warned':
        return 'border-yellow-500/30 bg-yellow-500/10';
      case 'dropped-out':
        return 'border-destructive/30 bg-destructive/10';
      case 'completed':
        return 'border-primary/30 bg-primary/10';
      case 'waiting':
        return 'border-muted-foreground/30 bg-muted/30';
      default:
        return 'border-muted-foreground/30 bg-muted/30';
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="mr-2 h-5 w-5" />
          Teilnehmer-Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        {athletes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Keine Teilnehmer für den Test ausgewählt.
          </div>
        ) : (
          <div className="space-y-3">
            {athletes.map((athlete) => (
              <div
                key={athlete.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${getStatusColor(
                  athlete.status,
                )}`}
              >
                <div className="flex items-center space-x-3">
                  {getStatusIcon(athlete.status)}
                  <div>
                    <div className="font-medium">{athlete.name}</div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      {getStatusBadge(athlete.status)}
                      {athlete.dropOutShuttle ? (
                        <span>
                          Shuttle {athlete.dropOutShuttle} ({athlete.estimatedDistance}
                          m)
                        </span>
                      ) : athlete.status === 'active' || athlete.status === 'warned' ? (
                        <span>
                          Nächster Shuttle: {currentShuttle + 1} ({athlete.estimatedDistance}m geschafft)
                        </span>
                      ) : athlete.estimatedDistance > 0 ? (
                        <span>
                          ({athlete.estimatedDistance}m)
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {athlete.estimatedDistance}m
                    </div>
                    {athlete.dropOutTime && (
                      <div className="text-xs text-muted-foreground">
                        {formatTime(athlete.dropOutTime)}
                      </div>
                    )}
                  </div>

                  {(athlete.status === 'active' ||
                    athlete.status === 'warned') &&
                    !disabled && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onMarkFailure(athlete.id)}
                        className={
                          athlete.status === 'active'
                            ? 'text-yellow-600 border-yellow-500/30 hover:bg-yellow-500/10'
                            : 'text-destructive border-destructive/30 hover:bg-destructive/10'
                        }
                      >
                        <XCircle className="mr-1 h-4 w-4" />
                        {athlete.status === 'active'
                          ? 'Verwarnen'
                          : 'Ausscheiden'}
                      </Button>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Statistics */}
        {athletes.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/30">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {athletes.filter((a) => a.status === 'active').length}
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  Aktiv
                </div>
              </div>
              <div className="bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/30">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {athletes.filter((a) => a.status === 'warned').length}
                </div>
                <div className="text-sm text-yellow-600 dark:text-yellow-400">
                  Verwarnt
                </div>
              </div>
              <div className="bg-destructive/10 rounded-lg p-3 border border-destructive/30">
                <div className="text-2xl font-bold text-destructive">
                  {athletes.filter((a) => a.status === 'dropped-out').length}
                </div>
                <div className="text-sm text-destructive">Ausgeschieden</div>
              </div>
              <div className="bg-primary/10 rounded-lg p-3 border border-primary/30">
                <div className="text-2xl font-bold text-primary">
                  {athletes.filter((a) => a.status === 'completed').length}
                </div>
                <div className="text-sm text-primary">Abgeschlossen</div>
              </div>
              <div className="bg-muted rounded-lg p-3 border border-muted-foreground/30">
                <div className="text-2xl font-bold text-muted-foreground">
                  {athletes.length > 0 ? Math.round(
                    athletes.reduce((sum, a) => sum + a.estimatedDistance, 0) /
                    athletes.length,
                  ) : 0}
                  m
                </div>
                <div className="text-sm text-muted-foreground">Ø Distanz</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
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
