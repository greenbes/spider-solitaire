import type { Card, Column, Game } from './types'
import { NUM_COLUMNS } from './constants'

/**
 * Initial deal: 54 cards to tableau, 50 to stock
 * - Columns 0-3: 6 cards each (only top face-up)
 * - Columns 4-9: 5 cards each (only top face-up)
 */
export function dealInitialCards(deck: Card[]): { columns: Column[]; stock: Card[] } {
  const columns: Column[] = []
  let cardIndex = 0

  for (let colIndex = 0; colIndex < NUM_COLUMNS; colIndex++) {
    const cardCount = colIndex < 4 ? 6 : 5
    const cards: Card[] = []

    for (let i = 0; i < cardCount; i++) {
      const card = { ...deck[cardIndex++] }
      // Only top card is face-up
      card.faceUp = i === cardCount - 1
      cards.push(card)
    }

    columns.push({ id: `col-${colIndex}`, cards })
  }

  // Remaining 50 cards go to stock (all face-down)
  const stock = deck.slice(54).map((c) => ({ ...c, faceUp: false }))

  return { columns, stock }
}

/**
 * Deal 10 cards from stock (one to each column, face-up)
 * Precondition: No columns are empty, stock has cards
 */
export function dealFromStock(game: Game): Game {
  if (game.stock.length < 10) {
    throw new Error('Not enough cards in stock')
  }
  if (game.columns.some((col) => col.cards.length === 0)) {
    throw new Error('Cannot deal when columns are empty')
  }

  const newStock = [...game.stock]
  const cardsToDeal = newStock.splice(0, 10)

  const newColumns = game.columns.map((col, index) => {
    const dealtCard = { ...cardsToDeal[index], faceUp: true }
    return {
      ...col,
      cards: [...col.cards, dealtCard],
    }
  })

  return {
    ...game,
    columns: newColumns,
    stock: newStock,
    dealsRemaining: game.dealsRemaining - 1,
  }
}
