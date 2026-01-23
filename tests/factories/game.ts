/**
 * Test factories for creating game objects in tests.
 *
 * These factories provide convenient ways to create Cards, Columns, and Games
 * with sensible defaults that can be overridden as needed.
 */

import type { Card, Column, Game, Suit, Rank, Difficulty } from '../../src/game/types'
import { RANKS, RANK_ORDER } from '../../src/game/constants'

// =============================================================================
// Card Factories
// =============================================================================

/**
 * Create a single card with optional overrides.
 * Defaults to Ace of Spades, face-up.
 */
export function createCard(overrides: Partial<Card> = {}): Card {
  return {
    suit: 'spades',
    rank: 'A',
    faceUp: true,
    ...overrides,
  }
}

/**
 * Create a face-down card.
 */
export function createFaceDownCard(suit: Suit = 'spades', rank: Rank = 'A'): Card {
  return createCard({ suit, rank, faceUp: false })
}

/**
 * Create a face-up card.
 */
export function createFaceUpCard(suit: Suit = 'spades', rank: Rank = 'A'): Card {
  return createCard({ suit, rank, faceUp: true })
}

// =============================================================================
// Sequence Factories
// =============================================================================

/**
 * Create a descending sequence of cards (e.g., 5-4-3-2-A).
 * All cards are the same suit and face-up by default.
 */
export function createDescendingSequence(
  suit: Suit,
  startRank: Rank,
  length: number,
  faceUp: boolean = true
): Card[] {
  const startIndex = RANKS.indexOf(startRank)
  if (startIndex === -1) {
    throw new Error(`Invalid rank: ${startRank}`)
  }
  if (startIndex - length + 1 < 0) {
    throw new Error(`Cannot create sequence of ${length} starting from ${startRank}`)
  }

  const cards: Card[] = []
  for (let i = 0; i < length; i++) {
    cards.push(createCard({
      suit,
      rank: RANKS[startIndex - i],
      faceUp,
    }))
  }
  return cards
}

/**
 * Create a complete K-A sequence for a suit (13 cards).
 * Used for testing suit completion detection.
 */
export function createCompleteSuitSequence(suit: Suit, faceUp: boolean = true): Card[] {
  return createDescendingSequence(suit, 'K', 13, faceUp)
}

/**
 * Get the rank that is one higher than the given rank.
 * Returns null if the given rank is King (highest).
 */
export function getHigherRank(rank: Rank): Rank | null {
  const order = RANK_ORDER[rank]
  if (order === 13) return null // King is highest
  const higherRank = RANKS.find(r => RANK_ORDER[r] === order + 1)
  return higherRank ?? null
}

/**
 * Get the rank that is one lower than the given rank.
 * Returns null if the given rank is Ace (lowest).
 */
export function getLowerRank(rank: Rank): Rank | null {
  const order = RANK_ORDER[rank]
  if (order === 1) return null // Ace is lowest
  const lowerRank = RANKS.find(r => RANK_ORDER[r] === order - 1)
  return lowerRank ?? null
}

// =============================================================================
// Column Factories
// =============================================================================

let columnIdCounter = 0

/**
 * Create a column with the given cards.
 * Generates a unique ID if not provided.
 */
export function createColumn(cards: Card[] = [], id?: string): Column {
  return {
    id: id ?? `col-${columnIdCounter++}`,
    cards,
  }
}

/**
 * Create an empty column.
 */
export function createEmptyColumn(id?: string): Column {
  return createColumn([], id)
}

/**
 * Reset the column ID counter (useful between tests).
 */
export function resetColumnIdCounter(): void {
  columnIdCounter = 0
}

// =============================================================================
// Game Factories
// =============================================================================

/**
 * Create a game with optional overrides.
 * Defaults to difficulty 1, no moves, 5 deals remaining, empty columns and stock.
 */
export function createGame(overrides: Partial<Game> = {}): Game {
  return {
    difficulty: 1,
    moves: 0,
    dealsRemaining: 5,
    foundationsCompleted: 0,
    columns: [],
    stock: [],
    ...overrides,
  }
}

/**
 * Create a game with the specified number of empty columns.
 */
export function createGameWithEmptyColumns(numColumns: number = 10): Game {
  const columns = Array.from({ length: numColumns }, (_, i) =>
    createColumn([], `col-${i}`)
  )
  return createGame({ columns })
}

/**
 * Create a game with columns containing specific cards.
 * Pass an array of card arrays, one per column.
 */
export function createGameWithColumns(columnCards: Card[][]): Game {
  const columns = columnCards.map((cards, i) =>
    createColumn(cards, `col-${i}`)
  )
  return createGame({ columns })
}

/**
 * Create a game that's close to winning (7 foundations completed).
 */
export function createAlmostWonGame(): Game {
  return createGame({
    foundationsCompleted: 7,
    columns: Array.from({ length: 10 }, (_, i) =>
      createColumn([], `col-${i}`)
    ),
  })
}

/**
 * Create a game in a won state (8 foundations completed).
 */
export function createWonGame(): Game {
  return createGame({
    foundationsCompleted: 8,
    columns: Array.from({ length: 10 }, (_, i) =>
      createColumn([], `col-${i}`)
    ),
    stock: [],
    dealsRemaining: 0,
  })
}

/**
 * Create a game with stock cards ready to deal.
 */
export function createGameWithStock(stockCards: Card[], dealsRemaining: number = 5): Game {
  const columns = Array.from({ length: 10 }, (_, i) =>
    createColumn([createFaceUpCard('spades', 'K')], `col-${i}`)
  )
  return createGame({
    columns,
    stock: stockCards,
    dealsRemaining,
  })
}

// =============================================================================
// Scenario Factories
// =============================================================================

/**
 * Create a game scenario where a valid move exists.
 * Column 0 has a 5, Column 1 has a 6 - the 5 can move onto the 6.
 */
export function createGameWithValidMove(): Game {
  return createGameWithColumns([
    [createFaceUpCard('spades', '5')],
    [createFaceUpCard('hearts', '6')],
  ])
}

/**
 * Create a game scenario with a valid same-suit sequence move.
 * Column 0 has 5-4-3, Column 1 has 6 (same suit) - sequence can move.
 */
export function createGameWithValidSequenceMove(): Game {
  return createGameWithColumns([
    createDescendingSequence('spades', '5', 3),
    [createFaceUpCard('spades', '6')],
  ])
}

/**
 * Create a game scenario with a mixed-suit sequence (invalid for moving).
 * Column 0 has 5♠-4♥-3♠ - cannot move as a sequence.
 */
export function createGameWithMixedSuitSequence(): Game {
  return createGameWithColumns([
    [
      createFaceUpCard('spades', '5'),
      createFaceUpCard('hearts', '4'),
      createFaceUpCard('spades', '3'),
    ],
    [createFaceUpCard('spades', '6')],
  ])
}

/**
 * Create a game scenario with a completed suit ready to be removed.
 */
export function createGameWithCompletedSuit(suit: Suit = 'spades'): Game {
  return createGameWithColumns([
    createCompleteSuitSequence(suit),
    [createFaceUpCard('hearts', 'K')],
  ])
}

/**
 * Create a game with no valid moves (stuck state).
 * All columns have Kings, no cards can move anywhere useful.
 */
export function createStuckGame(): Game {
  const columns = Array.from({ length: 10 }, (_, i) =>
    createColumn([createFaceUpCard('spades', 'K')], `col-${i}`)
  )
  return createGame({
    columns,
    stock: [],
    dealsRemaining: 0,
  })
}

/**
 * Create a game where dealing would be valid.
 * All columns have at least one card, stock has 10+ cards.
 */
export function createGameReadyToDeal(): Game {
  const columns = Array.from({ length: 10 }, (_, i) =>
    createColumn([createFaceUpCard('spades', 'A')], `col-${i}`)
  )
  const stock = Array.from({ length: 10 }, () =>
    createFaceDownCard('spades', '2')
  )
  return createGame({
    columns,
    stock,
    dealsRemaining: 1,
  })
}

/**
 * Create a game where dealing would be invalid (has empty column).
 */
export function createGameWithEmptyColumnForDeal(): Game {
  const columns = Array.from({ length: 10 }, (_, i) =>
    i === 0
      ? createColumn([], `col-${i}`)
      : createColumn([createFaceUpCard('spades', 'A')], `col-${i}`)
  )
  const stock = Array.from({ length: 10 }, () =>
    createFaceDownCard('spades', '2')
  )
  return createGame({
    columns,
    stock,
    dealsRemaining: 1,
  })
}
