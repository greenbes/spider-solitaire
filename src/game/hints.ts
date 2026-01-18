import type { Game, Hint, Column } from './types'
import { isValidMove, canMoveSameSequence } from './moves'

interface ScoredHint extends Hint {
  score: number
}

/**
 * Find all movable sequence start indices in a column
 * Returns indices where a valid same-suit sequence begins
 */
function findMovableSequenceStarts(column: Column): number[] {
  const starts: number[] = []

  for (let i = 0; i < column.cards.length; i++) {
    if (canMoveSameSequence(column, i)) {
      starts.push(i)
    }
  }

  return starts
}

/**
 * Check if moving cards would reveal a face-down card
 */
function wouldRevealCard(column: Column, cardIndex: number): boolean {
  if (cardIndex === 0) return false
  return !column.cards[cardIndex - 1].faceUp
}

/**
 * Check if the move builds same-suit (target card same suit as moving card)
 */
function isSameSuitBuild(column: Column, cardIndex: number, targetColumn: Column): boolean {
  if (targetColumn.cards.length === 0) return false
  const movingCard = column.cards[cardIndex]
  const targetCard = targetColumn.cards[targetColumn.cards.length - 1]
  return movingCard.suit === targetCard.suit
}

/**
 * Check if moving a King to an empty column
 */
function isKingToEmpty(column: Column, cardIndex: number, targetColumn: Column): boolean {
  return column.cards[cardIndex].rank === 'K' && targetColumn.cards.length === 0
}

/**
 * Calculate the length of the same-suit sequence being moved
 */
function getSequenceLength(column: Column, cardIndex: number): number {
  return column.cards.length - cardIndex
}

/**
 * Score a potential move (higher is better)
 *
 * Priorities:
 * 1. Same-suit building that reveals a card (100 + sequence length)
 * 2. Same-suit building (50 + sequence length)
 * 3. Reveals a face-down card (30 + sequence length)
 * 4. King to empty column (20)
 * 5. Any valid move (10 + sequence length)
 *
 * We avoid moves that just shuffle cards without benefit
 */
function scoreMove(
  fromColumn: Column,
  cardIndex: number,
  toColumn: Column
): number {
  let score = 0
  const sequenceLength = getSequenceLength(fromColumn, cardIndex)
  const sameSuit = isSameSuitBuild(fromColumn, cardIndex, toColumn)
  const revealsCard = wouldRevealCard(fromColumn, cardIndex)
  const kingToEmpty = isKingToEmpty(fromColumn, cardIndex, toColumn)

  // Avoid moving entire column to empty column (no benefit)
  if (cardIndex === 0 && toColumn.cards.length === 0) {
    return 0
  }

  if (sameSuit && revealsCard) {
    score = 100 + sequenceLength
  } else if (sameSuit) {
    score = 50 + sequenceLength
  } else if (revealsCard) {
    score = 30 + sequenceLength
  } else if (kingToEmpty && cardIndex > 0) {
    // Only valuable if it reveals a card
    score = 25
  } else if (toColumn.cards.length > 0) {
    // Regular move to non-empty column
    score = 10 + sequenceLength
  } else {
    // Move to empty column without revealing - low priority
    score = 5
  }

  return score
}

/**
 * Find all valid moves in the current game state
 */
function findAllValidMoves(game: Game): ScoredHint[] {
  const moves: ScoredHint[] = []

  for (const fromColumn of game.columns) {
    if (fromColumn.cards.length === 0) continue

    const sequenceStarts = findMovableSequenceStarts(fromColumn)

    for (const cardIndex of sequenceStarts) {
      const movingCard = fromColumn.cards[cardIndex]

      for (const toColumn of game.columns) {
        // Can't move to same column
        if (toColumn.id === fromColumn.id) continue

        // Check if move is valid
        if (!isValidMove(movingCard, toColumn)) continue

        const score = scoreMove(fromColumn, cardIndex, toColumn)

        // Only include moves with positive score
        if (score > 0) {
          moves.push({
            fromColumnId: fromColumn.id,
            cardIndex,
            toColumnId: toColumn.id,
            score,
          })
        }
      }
    }
  }

  return moves
}

/**
 * Get a hint for the best available move
 * Returns null if no beneficial moves are available
 */
export function getHint(game: Game): Hint | null {
  const moves = findAllValidMoves(game)

  if (moves.length === 0) {
    return null
  }

  // Sort by score descending and return the best move
  moves.sort((a, b) => b.score - a.score)

  const best = moves[0]

  // Return without the score
  return {
    fromColumnId: best.fromColumnId,
    cardIndex: best.cardIndex,
    toColumnId: best.toColumnId,
  }
}

/**
 * Check if any valid moves exist (for "no moves" detection)
 */
export function hasValidMoves(game: Game): boolean {
  return findAllValidMoves(game).length > 0
}
