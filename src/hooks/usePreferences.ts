import { useState, useEffect, useCallback } from 'react'
import type {
  UserPreferences,
  Theme,
  CardArt,
  CardSize,
  ToolbarPosition,
} from '../game/types'

const STORAGE_KEY = 'spider-solitaire-preferences'

const VALID_THEMES: readonly Theme[] = ['green-felt', 'blue-felt', 'wood', 'dark']
const VALID_CARD_ARTS: readonly CardArt[] = ['classic', 'modern', 'minimal']
const VALID_CARD_SIZES: readonly CardSize[] = ['small', 'medium', 'large']
const VALID_TOOLBAR_POSITIONS: readonly ToolbarPosition[] = ['top', 'bottom']

const defaultPreferences: UserPreferences = {
  toolbarPosition: 'bottom',
  showStatistics: true,
  cardSize: 'large',
  highContrast: false,
  cardArt: 'classic',
  theme: 'green-felt',
}

function isOneOf<T extends string>(value: unknown, valid: readonly T[]): value is T {
  return typeof value === 'string' && (valid as readonly string[]).includes(value)
}

/**
 * Validate raw preference data from storage, falling back to defaults for any
 * invalid/missing fields. Accepts unknown to match the untrusted JSON input.
 */
function validatePreferences(raw: unknown): UserPreferences {
  if (raw === null || typeof raw !== 'object') {
    return defaultPreferences
  }

  const data = raw as Record<string, unknown>
  return {
    toolbarPosition: isOneOf(data.toolbarPosition, VALID_TOOLBAR_POSITIONS)
      ? data.toolbarPosition
      : defaultPreferences.toolbarPosition,
    showStatistics:
      typeof data.showStatistics === 'boolean'
        ? data.showStatistics
        : defaultPreferences.showStatistics,
    cardSize: isOneOf(data.cardSize, VALID_CARD_SIZES)
      ? data.cardSize
      : defaultPreferences.cardSize,
    highContrast:
      typeof data.highContrast === 'boolean'
        ? data.highContrast
        : defaultPreferences.highContrast,
    cardArt: isOneOf(data.cardArt, VALID_CARD_ARTS)
      ? data.cardArt
      : defaultPreferences.cardArt,
    theme: isOneOf(data.theme, VALID_THEMES)
      ? data.theme
      : defaultPreferences.theme,
  }
}

export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    if (typeof window === 'undefined') return defaultPreferences

    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        return validatePreferences(JSON.parse(stored))
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
