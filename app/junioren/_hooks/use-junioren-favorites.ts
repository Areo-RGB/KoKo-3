import { useState, useEffect } from 'react'

export interface UseJuniorenFavoritesReturn {
  favorites: Set<string>
  toggleFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
  favoriteCount: number
}

export function useJuniorenFavorites(): UseJuniorenFavoritesReturn {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  // Load favorites (migrate from old keys if present)
  useEffect(() => {
    try {
      const merged = new Set<string>()
      const keys = [
        'junior-favorites',
        'a-junior-favorites',
        'b-junior-favorites',
        'c-junior-favorites',
        'd-junior-favorites',
        'e-junior-favorites',
      ]
      keys.forEach((k) => {
        const raw =
          typeof window !== 'undefined' ? localStorage.getItem(k) : null
        if (raw) {
          try {
            const arr = JSON.parse(raw) as string[]
            arr.forEach((id) => merged.add(id))
          } catch {
            // Ignore invalid JSON
          }
        }
      })
      setFavorites(merged)
      // Save unified key
      localStorage.setItem(
        'junior-favorites',
        JSON.stringify(Array.from(merged)),
      )
    } catch {
      // Ignore localStorage errors
    }
  }, [])

  // Save favorites when changed (unified key)
  useEffect(() => {
    try {
      localStorage.setItem(
        'junior-favorites',
        JSON.stringify(Array.from(favorites)),
      )
    } catch {
      // Ignore localStorage errors
    }
  }, [favorites])

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(id)) {
        newFavorites.delete(id)
      } else {
        newFavorites.add(id)
      }
      return newFavorites
    })
  }

  const isFavorite = (id: string) => favorites.has(id)

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    favoriteCount: favorites.size,
  }
}