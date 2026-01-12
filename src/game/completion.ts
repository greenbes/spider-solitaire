import type { Column, Game, Suit, Rank } from './types'
import { COMPLETE_SUIT_LENGTH } from './constants'

/**
 * Check if a column has a completed suit (K-Q-J-10-9-8-7-6-5-4-3-2-A of same suit)
 * Returns the suit if complete, null otherwise
 */
export function detectCompletedSuit(column: Column): Suit | null {
  if (column.cards.length < COMPLETE_SUIT_LENGTH) return null

  // Check the last 13 cards
  const lastCards = column.cards.slice(-COMPLETE_SUIT_LENGTH)

  // Must start with King
  if (lastCards[0].rank !== 'K') return null
  if (!lastCards[0].faceUp) return null

  const suit = lastCards[0].suit

  // Check sequence: K, Q, J, 10, 9, 8, 7, 6, 5, 4, 3, 2, A
  const expectedRanks: Rank[] = ['K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2', 'A']

  for (let i = 0; i < COMPLETE_SUIT_LENGTH; i++) {
    if (lastCards[i].rank !== expectedRanks[i]) return null
    if (lastCards[i].suit !== suit) return null
    if (!lastCards[i].faceUp) return null
  }

  return suit
}

/**
 * Remove completed suit from column
 */
export function removeCompletedSuit(game: Game, columnId: string): Game {
  const column = game.columns.find((c) => c.id === columnId)
  if (!column) {
    throw new Error('Invalid column')
  }

  const completedSuit = detectCompletedSuit(column)
  if (!completedSuit) {
    throw new Error('No completed suit')
  }

  const newColumns = game.columns.map((col) => {
    if (col.id === columnId) {
      return {
        ...col,
        cards: col.cards.slice(0, -COMPLETE_SUIT_LENGTH),
      }
    }
    return col
  })

  return {
    ...game,
    columns: newColumns,
    foundationsCompleted: game.foundationsCompleted + 1,
  }
}

/**
 * Check if game is won (8 suits completed)
 */
export function isWinCondition(game: Game): boolean {
  return game.foundationsCompleted === 8
}
