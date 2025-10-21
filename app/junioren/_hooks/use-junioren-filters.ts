import { useState, useMemo, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AGE_GROUPS, CATEGORIES } from '../_lib/constants'
import type { TrainingSession } from '../_lib/types'

export interface UseJuniorenFiltersReturn {
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedCategory: string | null
  setSelectedCategory: (category: string | null) => void
  selectedAgeGroup: string | null
  setSelectedAgeGroup: (ageGroup: string | null) => void
  expandedCategories: Set<string>
  toggleCategoryExpansion: (category: string) => void
  expandedWarmupGroups: Set<string>
  toggleWarmupGroupExpansion: (group: string) => void
  filteredAndGrouped: Record<string, TrainingSession[]>
  totalCount: number
  isWarmupSelected: boolean
}

export function useJuniorenFilters(sessions: TrainingSession[]): UseJuniorenFiltersReturn {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  )
  const [expandedWarmupGroups, setExpandedWarmupGroups] = useState<Set<string>>(
    new Set(['Beweglichkeit', 'Koordination']),
  )

  // Handle URL-based age group selection
  useEffect(() => {
    const age = searchParams.get('age')
    if (age && AGE_GROUPS.includes(age as any)) {
      setSelectedAgeGroup(age)
      router.replace('/junioren', { scroll: false })
    }
  }, [selectedAgeGroup, router, searchParams])

  const allCategories = useMemo(() => Object.keys(CATEGORIES), [])

  const filteredAndGrouped = useMemo(() => {
    let filtered = sessions

    // Filter by age group
    if (selectedAgeGroup) {
      filtered = filtered.filter((session) => session.ageGroup === selectedAgeGroup)
    }

    // Filter by category (exclude Aufwärmen here)
    if (selectedCategory && selectedCategory !== 'aufwaermen') {
      filtered = filtered.filter((session) => session.category === selectedCategory)
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter((session) =>
        session.title.toLowerCase().includes(term) ||
        (session.description?.toLowerCase().includes(term) || false),
      )
    }

    // Group by category
    const grouped = filtered.reduce((acc, session) => {
      if (!acc[session.category]) {
        acc[session.category] = []
      }
      acc[session.category].push(session)
      return acc
    }, {} as Record<string, TrainingSession[]>)

    // Sort categories by predefined order
    const orderedGrouped: Record<string, TrainingSession[]> = {}
    allCategories.forEach((category) => {
      if (grouped[category]) {
        orderedGrouped[category] = grouped[category]
      }
    })

    return orderedGrouped
  }, [sessions, selectedAgeGroup, selectedCategory, searchTerm, allCategories])

  const totalCount = useMemo(
    () => Object.values(filteredAndGrouped).reduce((sum, group) => sum + group.length, 0),
    [filteredAndGrouped],
  )

  const isWarmupSelected = selectedCategory === 'aufwaermen'

  const toggleCategoryExpansion = (category: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(category)) {
        newSet.delete(category)
      } else {
        newSet.add(category)
      }
      return newSet
    })
  }

  const toggleWarmupGroupExpansion = (group: string) => {
    setExpandedWarmupGroups((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(group)) {
        newSet.delete(group)
      } else {
        newSet.add(group)
      }
      return newSet
    })
  }

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedAgeGroup,
    setSelectedAgeGroup,
    expandedCategories,
    toggleCategoryExpansion,
    expandedWarmupGroups,
    toggleWarmupGroupExpansion,
    filteredAndGrouped,
    totalCount,
    isWarmupSelected,
  }
}