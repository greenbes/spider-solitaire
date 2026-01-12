import type { Card, Column, Game } from './types'
import { RANK_ORDER } from './constants'

/**
 * Check if a single card can be placed on target column
 * Rules: Can place on any card one rank higher (any suit), or on empty column
 */
export function isValidMove(card: Card, targetColumn: Column): boolean {
  // Any card can go in empty column
  if (targetColumn.cards.length === 0) {
    return true
  }

  const topCard = targetColumn.cards[targetColumn.cards.length - 1]
  // Must place on card exactly one rank higher
  return RANK_ORDER[topCard.rank] === RANK_ORDER[card.rank] + 1
}

/**
 * Check if cards from index to end form a same-suit descending sequence
 * This determines if the sequence can be moved as a group
 */
export function canMoveSameSequence(column: Column, fromIndex: number): boolean {
  const cards = column.cards.slice(fromIndex)

  if (cards.length === 0) return false
  if (!cards[0].faceUp) return false
  if (cards.length === 1) return true

  const suit = cards[0].suit

  for (let i = 1; i < cards.length; i++) {
    // Must be same suit
    if (cards[i].suit !== suit) return false
    // Must be face-up
    if (!cards[i].faceUp) return false
    // Must be descending by one rank
    if (RANK_ORDER[cards[i - 1].rank] !== RANK_ORDER[cards[i].rank] + 1) {
      return false
    }
  }

  return true
}

/**
 * Execute a card move between columns
 * Returns new game state with updated columns and incremented move count
 */
export function moveCards(
  game: Game,
  fromColumnId: string,
  cardIndex: number,
  toColumnId: string
): Game {
  const fromCol = game.columns.find((c) => c.id === fromColumnId)
  const toCol = game.columns.find((c) => c.id === toColumnId)

  if (!fromCol || !toCol) {
    throw new Error('Invalid column')
  }

  if (!canMoveSameSequence(fromCol, cardIndex)) {
    throw new Error('Cannot move this sequence')
  }

  const movingCards = fromCol.cards.slice(cardIndex)

  if (!isValidMove(movingCards[0], toCol)) {
    throw new Error('Invalid move')
  }

  const newColumns = game.columns.map((col) => {
    if (col.id === fromColumnId) {
      return { ...col, cards: col.cards.slice(0, cardIndex) }
    }
    if (col.id === toColumnId) {
      return { ...col, cards: [...col.cards, ...movingCards] }
    }
    return col
  })

  return {
    ...game,
    columns: newColumns,
    moves: game.moves + 1,
  }
}

/**
 * Flip the top face-down card in a column if exposed
 */
export function flipTopCard(game: Game, columnId: string): Game {
  const column = game.columns.find((c) => c.id === columnId)
  if (!column || column.cards.length === 0) return game

  const topCard = column.cards[column.cards.length - 1]
  if (topCard.faceUp) return game // Already face-up

  const newColumns = game.columns.map((col) => {
    if (col.id === columnId) {
      const newCards = [...col.cards]
      newCards[newCards.length - 1] = { ...topCard, faceUp: true }
      return { ...col, cards: newCards }
    }
    return col
  })

  return { ...game, columns: newColumns }
}
