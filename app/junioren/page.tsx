'use client'

import { Suspense } from 'react'
import { CacheControl } from '@/app/junioren/_components/cache-control'
import { JuniorenFilters } from '@/app/junioren/_components/junioren-filters'
import { TrainingList } from '@/app/junioren/_components/training-list'
import { useJuniorenData } from '@/app/junioren/_hooks/use-junioren-data'
import { useJuniorenFavorites } from '@/app/junioren/_hooks/use-junioren-favorites'
import { useJuniorenFilters } from '@/app/junioren/_hooks/use-junioren-filters'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle, RefreshCw } from 'lucide-react'

function JuniorenTrainingPageContent() {
  const { sessions, isLoading, loadError, refreshSessions } = useJuniorenData()
  const favorites = useJuniorenFavorites()
  const filters = useJuniorenFilters(sessions)

  if (loadError) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-6 sm:py-8">
        <Card className="border-destructive">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-destructive">
                  Fehler beim Laden
                </h2>
                <p className="text-muted-foreground">{loadError}</p>
              </div>
              <Button onClick={refreshSessions} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Erneut versuchen
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-foreground mb-2 text-2xl font-bold sm:text-3xl lg:text-4xl">
          Junioren Training
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
          Trainingssammlung für A–E Junioren
        </p>
      </div>

      {/* Cache Control */}
      <CacheControl
        selectedAgeGroup={filters.selectedAgeGroup}
        allSessions={sessions}
      />

      {/* Filters */}
      <Card className="mb-4 sm:mb-6">
        <CardContent className="p-4 sm:p-6">
          <JuniorenFilters filters={filters} totalCount={filters.totalCount} />
        </CardContent>
      </Card>

      {/* Training List */}
      {isLoading ? (
        <div className="text-center py-8">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">Lade Trainingseinheiten...</p>
        </div>
      ) : (
        <TrainingList
          filteredAndGrouped={filters.filteredAndGrouped}
          filters={filters}
          favorites={favorites}
        />
      )}
    </div>
  )
}

export default function JuniorenPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto max-w-7xl px-4 py-6 sm:py-8">
          <div className="text-center py-8">
            <RefreshCw className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
            <p className="mt-2 text-muted-foreground">Lade Seite...</p>
          </div>
        </div>
      }
    >
      <JuniorenTrainingPageContent />
    </Suspense>
  )
}