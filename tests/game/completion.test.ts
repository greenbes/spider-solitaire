import { describe, it, expect, beforeEach } from 'vitest'
import { detectCompletedSuit, removeCompletedSuit, isWinCondition } from '../../src/game/completion'
import {
  createCard,
  createFaceUpCard,
  createFaceDownCard,
  createColumn,
  createCompleteSuitSequence,
  createDescendingSequence,
  createGame,
  createGameWithColumns,
  resetColumnIdCounter,
} from '../factories/game'
import type { Suit } from '../../src/game/types'

beforeEach(() => {
  resetColumnIdCounter()
})

// =============================================================================
// detectCompletedSuit
// =============================================================================

describe('detectCompletedSuit', () => {
  describe('detecting complete suits', () => {
    it('detects K-A spades sequence', () => {
      const column = createColumn(createCompleteSuitSequence('spades'))

      expect(detectCompletedSuit(column)).toBe('spades')
    })

    it('detects K-A hearts sequence', () => {
      const column = createColumn(createCompleteSuitSequence('hearts'))

      expect(detectCompletedSuit(column)).toBe('hearts')
    })

    it('detects K-A diamonds sequence', () => {
      const column = createColumn(createCompleteSuitSequence('diamonds'))

      expect(detectCompletedSuit(column)).toBe('diamonds')
    })

    it('detects K-A clubs sequence', () => {
      const column = createColumn(createCompleteSuitSequence('clubs'))

      expect(detectCompletedSuit(column)).toBe('clubs')
    })

    it('detects completed suit with cards before it', () => {
      const cardsBeforeSequence = [
        createFaceDownCard('hearts', 'K'),
        createFaceUpCard('hearts', '3'),
      ]
      const completeSequence = createCompleteSuitSequence('spades')
      const column = createColumn([...cardsBeforeSequence, ...completeSequence])

      expect(detectCompletedSuit(column)).toBe('spades')
    })

    it('ignores cards before the last 13', () => {
      // Put a different suit's King before - should not affect detection
      const extraCards = [createFaceUpCard('hearts', 'K')]
      const completeSequence = createCompleteSuitSequence('spades')
      const column = createColumn([...extraCards, ...completeSequence])

      expect(detectCompletedSuit(column)).toBe('spades')
    })
  })

  describe('incomplete sequences', () => {
    it('returns null for column with fewer than 13 cards', () => {
      const column = createColumn(createDescendingSequence('spades', 'K', 12))

      expect(detectCompletedSuit(column)).toBeNull()
    })

    it('returns null for empty column', () => {
      const column = createColumn([])

      expect(detectCompletedSuit(column)).toBeNull()
    })

    it('returns null when sequence does not start with King', () => {
      const column = createColumn(createDescendingSequence('spades', 'Q', 12))

      expect(detectCompletedSuit(column)).toBeNull()
    })

    it('returns null for wrong order', () => {
      // Create 13 cards but in wrong order
      const cards = [
        createFaceUpCard('spades', 'A'), // Wrong - should be K
        ...createDescendingSequence('spades', 'K', 12),
      ]
      const column = createColumn(cards)

      expect(detectCompletedSuit(column)).toBeNull()
    })

    it('returns null for missing card in sequence', () => {
      // K, Q, J, 10, 9, 8, 7, 6, 5, 4, 3, 3, A (missing 2, duplicate 3)
      const cards = createCompleteSuitSequence('spades')
      cards[11] = createFaceUpCard('spades', '3') // Replace 2 with another 3
      const column = createColumn(cards)

      expect(detectCompletedSuit(column)).toBeNull()
    })
  })

  describe('suit validation', () => {
    it('returns null for mixed suits in sequence', () => {
      const cards = createCompleteSuitSequence('spades')
      cards[6] = createFaceUpCard('hearts', '7') // Mixed suit
      const column = createColumn(cards)

      expect(detectCompletedSuit(column)).toBeNull()
    })

    it('returns null when first card is different suit', () => {
      const cards = createCompleteSuitSequence('spades')
      cards[0] = createFaceUpCard('hearts', 'K') // Different suit
      const column = createColumn(cards)

      expect(detectCompletedSuit(column)).toBeNull()
    })

    it('returns null when last card is different suit', () => {
      const cards = createCompleteSuitSequence('spades')
      cards[12] = createFaceUpCard('hearts', 'A') // Different suit
      const column = createColumn(cards)

      expect(detectCompletedSuit(column)).toBeNull()
    })
  })

  describe('face-up validation', () => {
    it('returns null when King is face-down', () => {
      const cards = createCompleteSuitSequence('spades')
      cards[0] = createFaceDownCard('spades', 'K')
      const column = createColumn(cards)

      expect(detectCompletedSuit(column)).toBeNull()
    })

    it('returns null when any card in sequence is face-down', () => {
      const cards = createCompleteSuitSequence('spades')
      cards[5] = createFaceDownCard('spades', '8')
      const column = createColumn(cards)

      expect(detectCompletedSuit(column)).toBeNull()
    })

    it('returns null when Ace is face-down', () => {
      const cards = createCompleteSuitSequence('spades')
      cards[12] = createFaceDownCard('spades', 'A')
      const column = createColumn(cards)

      expect(detectCompletedSuit(column)).toBeNull()
    })
  })
})

// =============================================================================
// removeCompletedSuit
// =============================================================================

describe('removeCompletedSuit', () => {
  describe('successful removal', () => {
    it('removes last 13 cards from column', () => {
      const game = createGameWithColumns([
        createCompleteSuitSequence('spades'),
      ])

      const result = removeCompletedSuit(game, 'col-0')

      expect(result.columns[0].cards).toHaveLength(0)
    })

    it('increments foundationsCompleted', () => {
      const game = createGameWithColumns([
        createCompleteSuitSequence('spades'),
      ])
      game.foundationsCompleted = 3

      const result = removeCompletedSuit(game, 'col-0')

      expect(result.foundationsCompleted).toBe(4)
    })

    it('preserves remaining cards in column', () => {
      const extraCards = [
        createFaceDownCard('hearts', 'Q'),
        createFaceUpCard('hearts', '5'),
      ]
      const game = createGameWithColumns([
        [...extraCards, ...createCompleteSuitSequence('spades')],
      ])

      const result = removeCompletedSuit(game, 'col-0')

      expect(result.columns[0].cards).toHaveLength(2)
      expect(result.columns[0].cards[0].rank).toBe('Q')
      expect(result.columns[0].cards[1].rank).toBe('5')
    })

    it('preserves other columns unchanged', () => {
      const game = createGameWithColumns([
        createCompleteSuitSequence('spades'),
        [createFaceUpCard('hearts', 'K')],
      ])

      const result = removeCompletedSuit(game, 'col-0')

      expect(result.columns[1].cards).toHaveLength(1)
      expect(result.columns[1].cards[0].rank).toBe('K')
    })
  })

  describe('error cases', () => {
    it('throws error for non-existent column', () => {
      const game = createGameWithColumns([
        createCompleteSuitSequence('spades'),
      ])

      expect(() => removeCompletedSuit(game, 'invalid')).toThrow('Invalid column')
    })

    it('throws error when no completed suit', () => {
      const game = createGameWithColumns([
        [createFaceUpCard('spades', 'K')],
      ])

      expect(() => removeCompletedSuit(game, 'col-0')).toThrow('No completed suit')
    })

    it('throws error for empty column', () => {
      const game = createGameWithColumns([[]])

      expect(() => removeCompletedSuit(game, 'col-0')).toThrow('No completed suit')
    })
  })

  describe('immutability', () => {
    it('does not mutate original game', () => {
      const game = createGameWithColumns([
        createCompleteSuitSequence('spades'),
      ])
      const originalFoundations = game.foundationsCompleted

      removeCompletedSuit(game, 'col-0')

      expect(game.foundationsCompleted).toBe(originalFoundations)
    })

    it('does not mutate original column cards', () => {
      const game = createGameWithColumns([
        createCompleteSuitSequence('spades'),
      ])
      const originalLength = game.columns[0].cards.length

      removeCompletedSuit(game, 'col-0')

      expect(game.columns[0].cards.length).toBe(originalLength)
    })
  })
})

// =============================================================================
// isWinCondition
// =============================================================================

describe('isWinCondition', () => {
  it('returns false when 0 foundations completed', () => {
    const game = createGame({ foundationsCompleted: 0 })

    expect(isWinCondition(game)).toBe(false)
  })

  it('returns false when 1 foundation completed', () => {
    const game = createGame({ foundationsCompleted: 1 })

    expect(isWinCondition(game)).toBe(false)
  })

  it('returns false when 7 foundations completed', () => {
    const game = createGame({ foundationsCompleted: 7 })

    expect(isWinCondition(game)).toBe(false)
  })

  it('returns true when 8 foundations completed', () => {
    const game = createGame({ foundationsCompleted: 8 })

    expect(isWinCondition(game)).toBe(true)
  })

  it('returns true even with remaining stock', () => {
    const game = createGame({
      foundationsCompleted: 8,
      stock: [createFaceDownCard('spades', 'A')],
      dealsRemaining: 1,
    })

    expect(isWinCondition(game)).toBe(true)
  })
})
