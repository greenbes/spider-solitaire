import { useEffect, useRef } from 'react'
import type { GameState, Difficulty, Suit, Rank } from '../game/types'
import { RANKS, SUITS, NUM_COLUMNS, INITIAL_DEALS, MAX_UNDO_HISTORY } from '../game/constants'

const STORAGE_KEY = 'spider-solitaire-game-state'
const SCHEMA_VERSION = 1

interface PersistedState {
  version: number
  state: GameState
}

function isDifficulty(value: unknown): value is Difficulty {
  return value === 1 || value === 2 || value === 4
}

function isRank(value: unknown): value is Rank {
  return typeof value === 'string' && (RANKS as readonly string[]).includes(value)
}

function isSuit(value: unknown): value is Suit {
  return typeof value === 'string' && (SUITS as readonly string[]).includes(value)
}

function isCard(value: unknown): boolean {
  if (value === null || typeof value !== 'object') return false
  const c = value as Record<string, unknown>
  return isSuit(c.suit) && isRank(c.rank) && typeof c.faceUp === 'boolean'
}

function isColumn(value: unknown): boolean {
  if (value === null || typeof value !== 'object') return false
  const c = value as Record<string, unknown>
  return typeof c.id === 'string' && Array.isArray(c.cards) && c.cards.every(isCard)
}

function isGame(value: unknown): boolean {
  if (value === null || typeof value !== 'object') return false
  const g = value as Record<string, unknown>
  return (
    isDifficulty(g.difficulty) &&
    typeof g.moves === 'number' &&
    typeof g.dealsRemaining === 'number' &&
    g.dealsRemaining >= 0 &&
    g.dealsRemaining <= INITIAL_DEALS &&
    typeof g.foundationsCompleted === 'number' &&
    g.foundationsCompleted >= 0 &&
    g.foundationsCompleted <= 8 &&
    Array.isArray(g.columns) &&
    g.columns.length === NUM_COLUMNS &&
    g.columns.every(isColumn) &&
    Array.isArray(g.stock) &&
    g.stock.every(isCard)
  )
}

function isGameState(value: unknown): value is GameState {
  if (value === null || typeof value !== 'object') return false
  const s = value as Record<string, unknown>
  return (
    isGame(s.game) &&
    Array.isArray(s.history) &&
    s.history.every(isGame) &&
    typeof s.isWon === 'boolean' &&
    typeof s.gameStarted === 'boolean'
  )
}

function trimHistory(state: GameState): GameState {
  if (state.history.length <= MAX_UNDO_HISTORY) {
    return state
  }

  return {
    ...state,
    history: state.history.slice(state.history.length - MAX_UNDO_HISTORY),
  }
}

/**
 * Load a previously saved game state. Returns null if nothing valid is stored.
 */
export function loadPersistedGameState(): GameState | null {
  if (typeof window === 'undefined') return null

  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as PersistedState
    if (parsed.version !== SCHEMA_VERSION) return null
    if (!isGameState(parsed.state)) return null
    // Only restore if a game was actually in progress
    if (!parsed.state.gameStarted || parsed.state.isWon) return null
    return trimHistory(parsed.state)
  } catch {
    return null
  }
}

/**
 * Persist game state to localStorage whenever it changes.
 * Skips persistence on the first render (state is already loaded from storage).
 */
export function useGamePersistence(state: GameState): void {
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    try {
      // Don't persist when game hasn't started; clear any stale data.
      if (!state.gameStarted) {
        localStorage.removeItem(STORAGE_KEY)
        return
      }
      const payload: PersistedState = {
        version: SCHEMA_VERSION,
        state: trimHistory(state),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch {
      // Storage errors (quota, unavailable) are non-fatal
    }
  }, [state])
}

/**
 * Remove persisted game state (e.g., on explicit reset or schema change).
 */
export function clearPersistedGameState(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // noop
  }
}
