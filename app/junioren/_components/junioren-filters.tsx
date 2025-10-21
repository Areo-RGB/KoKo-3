import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AGE_GROUPS, CATEGORIES } from '@/app/junioren/_lib/constants'
import type { UseJuniorenFiltersReturn } from '@/app/junioren/_hooks/use-junioren-filters'

interface JuniorenFiltersProps {
  filters: UseJuniorenFiltersReturn
  totalCount: number
}

export function JuniorenFilters({ filters, totalCount }: JuniorenFiltersProps) {
  const {
    searchTerm,
    setSearchTerm,
    selectedAgeGroup,
    setSelectedAgeGroup,
    selectedCategory,
    setSelectedCategory,
  } = filters

  return (
    <div className="mb-6">
      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Suche nach Themen, Übungen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Age Group Filter */}
      <div className="mb-4">
        <h3 className="mb-2 text-sm font-medium">Altersgruppe</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={!selectedAgeGroup ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedAgeGroup(null)}
          >
            Alle
          </Button>
          {Object.entries(AGE_GROUPS).map(([key, label]) => (
            <Button
              key={key}
              variant={selectedAgeGroup === key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedAgeGroup(key)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-4">
        <h3 className="mb-2 text-sm font-medium">Kategorie</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={!selectedCategory ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            Alle
          </Button>
          {Object.entries(CATEGORIES).map(([key, category]) => (
            <Button
              key={key}
              variant={selectedCategory === key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(key)}
            >
              {key}
            </Button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {totalCount} Training{totalCount !== 1 ? 's' : ''} gefunden
      </div>
    </div>
  )
}