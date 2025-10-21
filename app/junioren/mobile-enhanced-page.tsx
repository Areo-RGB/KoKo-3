'use client';

import { Suspense, useState } from 'react';
import { MobilePullToRefresh } from '@/components/ui/mobile-pull-to-refresh';
import { MobileBottomSheet } from '@/components/ui/mobile-bottom-sheet';
import { MobileFab } from '@/components/ui/mobile-fab';
import { MobileTrainingList } from '@/app/junioren/_components/mobile-training-card';
import { JuniorenFilters } from '@/app/junioren/_components/junioren-filters';
import { CacheControl } from '@/app/junioren/_components/cache-control';
import { useJuniorenData } from '@/app/junioren/_hooks/use-junioren-data';
import { useJuniorenFavorites } from '@/app/junioren/_hooks/use-junioren-favorites';
import { useJuniorenFilters } from '@/app/junioren/_hooks/use-junioren-filters';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Filter, Download, Share2, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import '@/app/mobile-styles.css'; // Import mobile styles

function MobileEnhancedJuniorenPageContent() {
  const { sessions, isLoading, loadError, refreshSessions } = useJuniorenData();
  const favorites = useJuniorenFavorites();
  const filters = useJuniorenFilters(sessions);
  const [showFilters, setShowFilters] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleRefresh = async () => {
    await refreshSessions();
  };

  const handleStartTraining = (session: any) => {
    // Navigate to training session or open training viewer
    console.log('Starting training:', session.title);
  };

  const fabActions = [
    {
      id: 'add',
      icon: <Plus className="h-4 w-4" />,
      label: 'Neues Training',
      onClick: () => console.log('Add new training'),
      color: 'primary' as const,
    },
    {
      id: 'download',
      icon: <Download className="h-4 w-4" />,
      label: 'Alle herunterladen',
      onClick: () => console.log('Download all'),
      color: 'secondary' as const,
    },
    {
      id: 'share',
      icon: <Share2 className="h-4 w-4" />,
      label: 'Teilen',
      onClick: () => console.log('Share collection'),
      color: 'secondary' as const,
    },
  ];

  if (loadError) {
    return (
      <div className="container mx-auto max-w-md px-4 py-6">
        <Card className="border-destructive">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-6xl mb-4">😞</div>
              <h2 className="text-lg font-semibold text-destructive mb-2">
                Fehler beim Laden
              </h2>
              <p className="text-muted-foreground mb-4">{loadError}</p>
              <Button onClick={refreshSessions} className="w-full">
                Erneut versuchen
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <MobilePullToRefresh onRefresh={handleRefresh} className="min-h-screen bg-background">
      <div className="container mx-auto max-w-md px-4 py-6 pb-24">
        {/* Enhanced Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Junioren Training
              </h1>
              <p className="text-muted-foreground">
                {filters.totalCount} Einheiten gefunden
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowSearch(!showSearch)}
                className="h-10 w-10 touch-optimized"
              >
                <Search className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilters(true)}
                className="h-10 w-10 touch-optimized"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          {showSearch && (
            <Card className="mb-4 animate-in slide-in-from-top-2 fade-in">
              <CardContent className="p-3">
                <input
                  type="text"
                  placeholder="Training suchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mobile-input w-full"
                  autoFocus
                />
              </CardContent>
            </Card>
          )}

          {/* Active Filters */}
          {(filters.selectedAgeGroup || filters.selectedCategory) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {filters.selectedAgeGroup && (
                <Badge variant="secondary" className="touch-optimized">
                  {filters.selectedAgeGroup}
                  <button
                    onClick={() => filters.setSelectedAgeGroup('')}
                    className="ml-2 text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {filters.selectedCategory && (
                <Badge variant="secondary" className="touch-optimized">
                  {filters.selectedCategory}
                  <button
                    onClick={() => filters.setSelectedCategory('')}
                    className="ml-2 text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Cache Control */}
        <CacheControl
          selectedAgeGroup={filters.selectedAgeGroup}
          allSessions={sessions}
        />

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="mobile-skeleton h-8 w-8 rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Lade Trainingseinheiten...</p>
          </div>
        ) : (
          /* Enhanced Training List */
          <MobileTrainingList
            sessions={Object.values(filters.filteredAndGrouped).flat()}
            favorites={favorites.favorites}
            onToggleFavorite={favorites.toggleFavorite}
            onStartTraining={handleStartTraining}
          />
        )}

        {/* Stats Overview */}
        {!isLoading && sessions.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mt-8">
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {sessions.length}
                </div>
                <div className="text-xs text-muted-foreground">Gesamt</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">
                  {favorites.favorites.size}
                </div>
                <div className="text-xs text-muted-foreground">Favoriten</div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* FAB */}
      <MobileFab
        actions={fabActions}
        position="bottom-right"
        size="md"
        label="Aktionen"
      />

      {/* Filters Bottom Sheet */}
      <MobileBottomSheet
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filter"
        height="half"
      >
        <div className="p-4">
          <JuniorenFilters filters={filters} totalCount={filters.totalCount} />
        </div>
      </MobileBottomSheet>
    </MobilePullToRefresh>
  );
}

export default function MobileEnhancedJuniorenPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto max-w-md px-4 py-6">
          <div className="text-center py-12">
            <div className="mobile-skeleton h-8 w-8 rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Lade Seite...</p>
          </div>
        </div>
      }
    >
      <MobileEnhancedJuniorenPageContent />
    </Suspense>
  );
}