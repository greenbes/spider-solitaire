import { useState, useEffect, useCallback } from 'react'
import type { UserPreferences } from '../game/types'

const STORAGE_KEY = 'spider-solitaire-preferences'

const defaultPreferences: UserPreferences = {
  toolbarPosition: 'bottom',
  showStatistics: true,
  cardSize: 'medium',
  highContrast: false,
  cardArt: 'classic',
  theme: 'green-felt',
}

export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    if (typeof window === 'undefined') return defaultPreferences

    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        return { ...defaultPreferences, ...JSON.parse(stored) }
      } catch {
        return defaultPreferences
      }
    }
    return defaultPreferences
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
  }, [preferences])

  const updatePreferences = useCallback((newPrefs: UserPreferences) => {
    setPreferences(newPrefs)
  }, [])

  return { preferences, updatePreferences }
}
