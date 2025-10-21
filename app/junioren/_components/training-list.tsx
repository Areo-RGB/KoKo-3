import { CATEGORIES } from '@/app/junioren/_lib/constants'
import type { TrainingSession } from '@/app/junioren/_lib/types'
import type { UseJuniorenFiltersReturn } from '@/app/junioren/_hooks/use-junioren-filters'
import { TrainingCard } from './training-card'
import type { UseJuniorenFavoritesReturn } from '@/app/junioren/_hooks/use-junioren-favorites'

interface TrainingListProps {
  filteredAndGrouped: Record<string, TrainingSession[]>
  filters: UseJuniorenFiltersReturn
  favorites: UseJuniorenFavoritesReturn
}

export function TrainingList({
  filteredAndGrouped,
  filters,
  favorites,
}: TrainingListProps) {
  const { expandedCategories, toggleCategoryExpansion } = filters
  const { isFavorite, toggleFavorite } = favorites

  if (Object.keys(filteredAndGrouped).length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Keine Trainingseinheiten gefunden.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {Object.entries(filteredAndGrouped).map(([category, sessions]) => {
        const categoryInfo = CATEGORIES[category]
        const isExpanded = expandedCategories.has(category)

        return (
          <div key={category}>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              {category}
              <span className="text-sm text-muted-foreground">
                ({sessions.length})
              </span>
            </h2>

            <div className="space-y-4">
              {sessions.map((session) => (
                <TrainingCard
                  key={session.id}
                  session={session}
                  isExpanded={false} // Could be expanded based on local state
                  onToggleExpanded={() => {}} // Could be implemented
                  isFavorite={isFavorite(session.id)}
                  onToggleFavorite={() => toggleFavorite(session.id)}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}