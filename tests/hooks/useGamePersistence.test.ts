import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import {
  useGamePersistence,
  loadPersistedGameState,
  clearPersistedGameState,
} from '../../src/hooks/useGamePersistence'
import type { GameState } from '../../src/game/types'
import {
  createGame,
  createFaceUpCard,
  createColumn,
  resetColumnIdCounter,
} from '../factories/game'

const STORAGE_KEY = 'spider-solitaire-game-state'

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

function makeValidGameState(overrides: Partial<GameState> = {}): GameState {
  const columns = Array.from({ length: 10 }, (_, i) =>
    createColumn([createFaceUpCard('spades', 'K')], `col-${i}`)
  )
  const game = createGame({ columns, difficulty: 2, dealsRemaining: 3 })
  return {
    game,
    history: [],
    isWon: false,
    gameStarted: true,
    ...overrides,
  }
}

describe('useGamePersistence', () => {
  beforeEach(() => {
    resetColumnIdCounter()
    Object.defineProperty(window, 'localStorage', {
      value: createMockLocalStorage(),
      writable: true,
    })
  })

  it('does not write on first render (would overwrite loaded state with same value)', () => {
    const state = makeValidGameState()
    renderHook(() => useGamePersistence(state))

    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('persists state on subsequent renders', () => {
    const state = makeValidGameState()
    const { rerender } = renderHook(
      ({ s }) => useGamePersistence(s),
      { initialProps: { s: state } }
    )

    const nextState = makeValidGameState({
      game: { ...state.game, moves: 5 },
    })
    rerender({ s: nextState })

    const stored = localStorage.getItem(STORAGE_KEY)
    expect(stored).not.toBeNull()
    const parsed = JSON.parse(stored!)
    expect(parsed.version).toBe(1)
    expect(parsed.state.game.moves).toBe(5)
  })

  it('clears storage when gameStarted becomes false', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 1, state: makeValidGameState() })
    )

    const state = makeValidGameState({ gameStarted: false })
    const { rerender } = renderHook(
      ({ s }) => useGamePersistence(s),
      { initialProps: { s: state } }
    )
    rerender({ s: { ...state } })

    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })
})

describe('loadPersistedGameState', () => {
  beforeEach(() => {
    resetColumnIdCounter()
    Object.defineProperty(window, 'localStorage', {
      value: createMockLocalStorage(),
      writable: true,
    })
  })

  it('returns null when nothing is stored', () => {
    expect(loadPersistedGameState()).toBeNull()
  })

  it('returns null for invalid JSON', () => {
    localStorage.setItem(STORAGE_KEY, 'garbage{{{')
    expect(loadPersistedGameState()).toBeNull()
  })

  it('returns null for wrong schema version', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 999, state: makeValidGameState() })
    )
    expect(loadPersistedGameState()).toBeNull()
  })

  it('returns null when gameStarted is false', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        state: makeValidGameState({ gameStarted: false }),
      })
    )
    expect(loadPersistedGameState()).toBeNull()
  })

  it('returns null when the game is won (start fresh)', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        state: makeValidGameState({ isWon: true }),
      })
    )
    expect(loadPersistedGameState()).toBeNull()
  })

  it('returns null when state structure is malformed', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 1, state: { game: 'not-an-object' } })
    )
    expect(loadPersistedGameState()).toBeNull()
  })

  it('returns null when column count is wrong', () => {
    const state = makeValidGameState()
    state.game.columns = state.game.columns.slice(0, 5)
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 1, state })
    )
    expect(loadPersistedGameState()).toBeNull()
  })

  it('returns null when difficulty is invalid', () => {
    const state = makeValidGameState()
    // @ts-expect-error intentional bad data
    state.game.difficulty = 3
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 1, state })
    )
    expect(loadPersistedGameState()).toBeNull()
  })

  it('returns null when a card has invalid suit', () => {
    const state = makeValidGameState()
    // @ts-expect-error intentional bad data
    state.game.columns[0].cards[0].suit = 'stars'
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 1, state })
    )
    expect(loadPersistedGameState()).toBeNull()
  })

  it('restores a valid game state', () => {
    const state = makeValidGameState({
      game: {
        ...makeValidGameState().game,
        moves: 42,
        foundationsCompleted: 3,
      },
    })
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 1, state })
    )

    const loaded = loadPersistedGameState()
    expect(loaded).not.toBeNull()
    expect(loaded!.game.moves).toBe(42)
    expect(loaded!.game.foundationsCompleted).toBe(3)
    expect(loaded!.gameStarted).toBe(true)
  })
})

describe('clearPersistedGameState', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: createMockLocalStorage(),
      writable: true,
    })
  })

  it('removes persisted state', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, state: {} }))
    clearPersistedGameState()
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('is a no-op when nothing is stored', () => {
    expect(() => clearPersistedGameState()).not.toThrow()
  })
})
