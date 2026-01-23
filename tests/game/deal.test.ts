import { describe, it, expect } from 'vitest'
import { dealInitialCards, dealFromStock } from '../../src/game/deal'
import { createDeck } from '../../src/game/deck'
import {
  createFaceUpCard,
  createFaceDownCard,
  createGame,
  createColumn,
} from '../factories/game'
import type { Card } from '../../src/game/types'

// =============================================================================
// dealInitialCards
// =============================================================================

describe('dealInitialCards', () => {
  describe('column distribution', () => {
    it('creates exactly 10 columns', () => {
      const deck = createDeck(1)
      const { columns } = dealInitialCards(deck)

      expect(columns).toHaveLength(10)
    })

    it('first 4 columns have 6 cards each', () => {
      const deck = createDeck(1)
      const { columns } = dealInitialCards(deck)

      expect(columns[0].cards).toHaveLength(6)
      expect(columns[1].cards).toHaveLength(6)
      expect(columns[2].cards).toHaveLength(6)
      expect(columns[3].cards).toHaveLength(6)
    })

    it('last 6 columns have 5 cards each', () => {
      const deck = createDeck(1)
      const { columns } = dealInitialCards(deck)

      expect(columns[4].cards).toHaveLength(5)
      expect(columns[5].cards).toHaveLength(5)
      expect(columns[6].cards).toHaveLength(5)
      expect(columns[7].cards).toHaveLength(5)
      expect(columns[8].cards).toHaveLength(5)
      expect(columns[9].cards).toHaveLength(5)
    })

    it('total tableau cards equals 54', () => {
      const deck = createDeck(1)
      const { columns } = dealInitialCards(deck)

      const totalTableauCards = columns.reduce(
        (sum, col) => sum + col.cards.length,
        0
      )

      expect(totalTableauCards).toBe(54)
    })
  })

  describe('stock', () => {
    it('stock has 50 cards', () => {
      const deck = createDeck(1)
      const { stock } = dealInitialCards(deck)

      expect(stock).toHaveLength(50)
    })

    it('all stock cards are face-down', () => {
      const deck = createDeck(1)
      const { stock } = dealInitialCards(deck)

      expect(stock.every(c => c.faceUp === false)).toBe(true)
    })

    it('tableau + stock equals 104 cards', () => {
      const deck = createDeck(1)
      const { columns, stock } = dealInitialCards(deck)

      const totalTableauCards = columns.reduce(
        (sum, col) => sum + col.cards.length,
        0
      )

      expect(totalTableauCards + stock.length).toBe(104)
    })
  })

  describe('face-up cards', () => {
    it('only top card is face-up in each column', () => {
      const deck = createDeck(1)
      const { columns } = dealInitialCards(deck)

      columns.forEach(column => {
        const cards = column.cards
        // All cards except the last should be face-down
        for (let i = 0; i < cards.length - 1; i++) {
          expect(cards[i].faceUp).toBe(false)
        }
        // Top card should be face-up
        expect(cards[cards.length - 1].faceUp).toBe(true)
      })
    })

    it('each column has exactly 1 face-up card', () => {
      const deck = createDeck(1)
      const { columns } = dealInitialCards(deck)

      columns.forEach(column => {
        const faceUpCount = column.cards.filter(c => c.faceUp).length
        expect(faceUpCount).toBe(1)
      })
    })
  })

  describe('column IDs', () => {
    it('columns have sequential IDs from col-0 to col-9', () => {
      const deck = createDeck(1)
      const { columns } = dealInitialCards(deck)

      columns.forEach((column, index) => {
        expect(column.id).toBe(`col-${index}`)
      })
    })
  })

  describe('card distribution', () => {
    it('uses cards from the deck in order', () => {
      const deck = createDeck(4) // Use 4-suit for variety
      const { columns } = dealInitialCards(deck)

      // First column's first card should match deck's first card
      expect(columns[0].cards[0].suit).toBe(deck[0].suit)
      expect(columns[0].cards[0].rank).toBe(deck[0].rank)
    })

    it('does not mutate the original deck', () => {
      const deck = createDeck(1)
      const originalFirstCard = { ...deck[0] }

      dealInitialCards(deck)

      expect(deck[0]).toEqual(originalFirstCard)
    })
  })
})

// =============================================================================
// dealFromStock
// =============================================================================

describe('dealFromStock', () => {
  function createGameReadyToDeal(): ReturnType<typeof createGame> {
    // Create 10 columns each with at least one card
    const columns = Array.from({ length: 10 }, (_, i) =>
      createColumn([createFaceUpCard('spades', 'K')], `col-${i}`)
    )
    // Create stock with at least 10 cards
    const stock: Card[] = Array.from({ length: 10 }, (_, i) =>
      createFaceDownCard('hearts', '5')
    )
    return createGame({
      columns,
      stock,
      dealsRemaining: 5,
    })
  }

  describe('successful deal', () => {
    it('deals 1 card to each column', () => {
      const game = createGameReadyToDeal()
      const originalCardCounts = game.columns.map(c => c.cards.length)

      const result = dealFromStock(game)

      result.columns.forEach((col, index) => {
        expect(col.cards.length).toBe(originalCardCounts[index] + 1)
      })
    })

    it('removes 10 cards from stock', () => {
      const game = createGameReadyToDeal()

      const result = dealFromStock(game)

      expect(result.stock.length).toBe(game.stock.length - 10)
    })

    it('decrements dealsRemaining by 1', () => {
      const game = createGameReadyToDeal()

      const result = dealFromStock(game)

      expect(result.dealsRemaining).toBe(game.dealsRemaining - 1)
    })

    it('dealt cards are face-up', () => {
      const game = createGameReadyToDeal()

      const result = dealFromStock(game)

      result.columns.forEach(col => {
        const topCard = col.cards[col.cards.length - 1]
        expect(topCard.faceUp).toBe(true)
      })
    })

    it('deals cards in column order', () => {
      // Create a game with distinguishable stock cards
      const columns = Array.from({ length: 10 }, (_, i) =>
        createColumn([createFaceUpCard('clubs', 'K')], `col-${i}`)
      )
      const stockRanks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10'] as const
      const stock = stockRanks.map(rank => createFaceDownCard('hearts', rank))

      const game = createGame({ columns, stock, dealsRemaining: 1 })

      const result = dealFromStock(game)

      // Each column should receive the corresponding stock card
      result.columns.forEach((col, index) => {
        const topCard = col.cards[col.cards.length - 1]
        expect(topCard.rank).toBe(stockRanks[index])
      })
    })
  })

  describe('error cases', () => {
    it('throws error when stock has fewer than 10 cards', () => {
      const columns = Array.from({ length: 10 }, (_, i) =>
        createColumn([createFaceUpCard('spades', 'K')], `col-${i}`)
      )
      const stock = Array.from({ length: 9 }, () =>
        createFaceDownCard('hearts', '5')
      )
      const game = createGame({ columns, stock, dealsRemaining: 1 })

      expect(() => dealFromStock(game)).toThrow('Not enough cards in stock')
    })

    it('throws error when stock is empty', () => {
      const columns = Array.from({ length: 10 }, (_, i) =>
        createColumn([createFaceUpCard('spades', 'K')], `col-${i}`)
      )
      const game = createGame({ columns, stock: [], dealsRemaining: 0 })

      expect(() => dealFromStock(game)).toThrow('Not enough cards in stock')
    })

    it('throws error when any column is empty', () => {
      const columns = Array.from({ length: 10 }, (_, i) =>
        i === 0
          ? createColumn([], `col-${i}`) // Empty column
          : createColumn([createFaceUpCard('spades', 'K')], `col-${i}`)
      )
      const stock = Array.from({ length: 10 }, () =>
        createFaceDownCard('hearts', '5')
      )
      const game = createGame({ columns, stock, dealsRemaining: 1 })

      expect(() => dealFromStock(game)).toThrow('Cannot deal when columns are empty')
    })

    it('throws error when last column is empty', () => {
      const columns = Array.from({ length: 10 }, (_, i) =>
        i === 9
          ? createColumn([], `col-${i}`) // Last column empty
          : createColumn([createFaceUpCard('spades', 'K')], `col-${i}`)
      )
      const stock = Array.from({ length: 10 }, () =>
        createFaceDownCard('hearts', '5')
      )
      const game = createGame({ columns, stock, dealsRemaining: 1 })

      expect(() => dealFromStock(game)).toThrow('Cannot deal when columns are empty')
    })
  })

  describe('immutability', () => {
    it('does not mutate original game', () => {
      const game = createGameReadyToDeal()
      const originalStockLength = game.stock.length
      const originalDealsRemaining = game.dealsRemaining

      dealFromStock(game)

      expect(game.stock.length).toBe(originalStockLength)
      expect(game.dealsRemaining).toBe(originalDealsRemaining)
    })

    it('does not mutate original columns', () => {
      const game = createGameReadyToDeal()
      const originalFirstColumnLength = game.columns[0].cards.length

      dealFromStock(game)

      expect(game.columns[0].cards.length).toBe(originalFirstColumnLength)
    })

    it('returns new columns array', () => {
      const game = createGameReadyToDeal()

      const result = dealFromStock(game)

      expect(result.columns).not.toBe(game.columns)
    })

    it('returns new stock array', () => {
      const game = createGameReadyToDeal()

      const result = dealFromStock(game)

      expect(result.stock).not.toBe(game.stock)
    })
  })
})
