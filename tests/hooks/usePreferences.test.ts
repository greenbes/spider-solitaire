import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePreferences } from '../../src/hooks/usePreferences'
import type { UserPreferences } from '../../src/game/types'

const STORAGE_KEY = 'spider-solitaire-preferences'

const defaultPreferences: UserPreferences = {
  toolbarPosition: 'bottom',
  showStatistics: true,
  cardSize: 'large',
  highContrast: false,
  cardArt: 'classic',
  theme: 'green-felt',
}

// Create a mock localStorage
function createMockLocalStorage() {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
    get length() {
      return Object.keys(store).length
    },
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
  }
}

describe('usePreferences', () => {
  let mockLocalStorage: ReturnType<typeof createMockLocalStorage>

  beforeEach(() => {
    // Create fresh mock localStorage for each test
    mockLocalStorage = createMockLocalStorage()
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    })
  })

  describe('initial state', () => {
    it('returns default preferences when localStorage is empty', () => {
      const { result } = renderHook(() => usePreferences())

      expect(result.current.preferences).toEqual(defaultPreferences)
    })

    it('loads preferences from localStorage', () => {
      const storedPrefs: UserPreferences = {
        ...defaultPreferences,
        toolbarPosition: 'top',
        theme: 'dark',
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storedPrefs))

      const { result } = renderHook(() => usePreferences())

      expect(result.current.preferences.toolbarPosition).toBe('top')
      expect(result.current.preferences.theme).toBe('dark')
    })

    it('merges partial stored preferences with defaults', () => {
      // Store only some preferences
      const partialPrefs = { toolbarPosition: 'top' }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(partialPrefs))

      const { result } = renderHook(() => usePreferences())

      expect(result.current.preferences.toolbarPosition).toBe('top')
      // Other defaults should remain
      expect(result.current.preferences.showStatistics).toBe(true)
      expect(result.current.preferences.cardSize).toBe('large')
      expect(result.current.preferences.theme).toBe('green-felt')
    })

    it('handles corrupted localStorage gracefully', () => {
      localStorage.setItem(STORAGE_KEY, 'not valid json {{{')

      const { result } = renderHook(() => usePreferences())

      expect(result.current.preferences).toEqual(defaultPreferences)
    })
  })

  describe('updating preferences', () => {
    it('updates preferences state', () => {
      const { result } = renderHook(() => usePreferences())

      act(() => {
        result.current.updatePreferences({
          ...defaultPreferences,
          cardSize: 'small',
        })
      })

      expect(result.current.preferences.cardSize).toBe('small')
    })

    it('persists preferences to localStorage on change', () => {
      const { result } = renderHook(() => usePreferences())

      act(() => {
        result.current.updatePreferences({
          ...defaultPreferences,
          theme: 'blue-felt',
        })
      })

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
      expect(stored.theme).toBe('blue-felt')
    })

    it('preserves other preferences when updating one', () => {
      const { result } = renderHook(() => usePreferences())

      act(() => {
        result.current.updatePreferences({
          ...result.current.preferences,
          highContrast: true,
        })
      })

      expect(result.current.preferences.highContrast).toBe(true)
      expect(result.current.preferences.toolbarPosition).toBe('bottom')
      expect(result.current.preferences.cardSize).toBe('large')
    })
  })

  describe('localStorage persistence', () => {
    it('writes to localStorage on initial render', () => {
      renderHook(() => usePreferences())

      const stored = localStorage.getItem(STORAGE_KEY)
      expect(stored).not.toBeNull()
      expect(JSON.parse(stored!)).toEqual(defaultPreferences)
    })

    it('updates localStorage when preferences change', () => {
      const { result } = renderHook(() => usePreferences())

      act(() => {
        result.current.updatePreferences({
          ...defaultPreferences,
          cardArt: 'modern',
        })
      })

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
      expect(stored.cardArt).toBe('modern')
    })
  })

  describe('updatePreferences callback stability', () => {
    it('updatePreferences function maintains referential equality', () => {
      const { result, rerender } = renderHook(() => usePreferences())
      const firstCallback = result.current.updatePreferences

      rerender()

      expect(result.current.updatePreferences).toBe(firstCallback)
    })
  })
})
