import { useState, useEffect } from 'react'
import type { TrainingSession } from '../_lib/types'

interface UseJuniorenDataReturn {
  sessions: TrainingSession[]
  isLoading: boolean
  loadError: string | null
  refreshSessions: () => Promise<void>
}

export function useJuniorenData(): UseJuniorenDataReturn {
  const [sessions, setSessions] = useState<TrainingSession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const loadSessions = async () => {
    let cancelled = false
    try {
      setIsLoading(true)
      setLoadError(null)
      const res = await fetch('/junioren/training-sessions.json', {
        cache: 'no-cache',
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = (await res.json()) as TrainingSession[]
      if (!cancelled) setSessions(data)
    } catch (error: unknown) {
      if (!cancelled) {
        const message =
          error instanceof Error && error.message
            ? error.message
            : 'Konnte Trainingsdaten nicht laden'
        setLoadError(message)
      }
    } finally {
      if (!cancelled) setIsLoading(false)
    }
  }

  useEffect(() => {
    loadSessions()
  }, [])

  return {
    sessions,
    isLoading,
    loadError,
    refreshSessions: loadSessions,
  }
}