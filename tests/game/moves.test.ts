import { describe, it, expect, beforeEach } from 'vitest'
import { isValidMove, canMoveSameSequence, moveCards, flipTopCard } from '../../src/game/moves'
import {
  createCard,
  createFaceUpCard,
  createFaceDownCard,
  createColumn,
  createEmptyColumn,
  createDescendingSequence,
  createGame,
  createGameWithColumns,
  resetColumnIdCounter,
} from '../factories/game'

beforeEach(() => {
  resetColumnIdCounter()
})

// =============================================================================
// isValidMove
// =============================================================================

describe('isValidMove', () => {
  describe('empty column', () => {
    it('accepts any card on empty column', () => {
      const card = createFaceUpCard('spades', '5')
      const emptyColumn = createEmptyColumn()

      expect(isValidMove(card, emptyColumn)).toBe(true)
    })

    it('accepts King on empty column', () => {
      const king = createFaceUpCard('hearts', 'K')
      const emptyColumn = createEmptyColumn()

      expect(isValidMove(king, emptyColumn)).toBe(true)
    })

    it('accepts Ace on empty column', () => {
      const ace = createFaceUpCard('diamonds', 'A')
      const emptyColumn = createEmptyColumn()

      expect(isValidMove(ace, emptyColumn)).toBe(true)
    })
  })

  describe('placement on existing cards', () => {
    it('accepts card placed on one-rank-higher card', () => {
      const card = createFaceUpCard('spades', '5')
      const column = createColumn([createFaceUpCard('hearts', '6')])

      expect(isValidMove(card, column)).toBe(true)
    })

    it('accepts card of different suit on one-rank-higher card', () => {
      const card = createFaceUpCard('clubs', '3')
      const column = createColumn([createFaceUpCard('diamonds', '4')])

      expect(isValidMove(card, column)).toBe(true)
    })

    it('rejects card on same rank', () => {
      const card = createFaceUpCard('spades', '5')
      const column = createColumn([createFaceUpCard('hearts', '5')])

      expect(isValidMove(card, column)).toBe(false)
    })

    it('rejects card on lower rank', () => {
      const card = createFaceUpCard('spades', '5')
      const column = createColumn([createFaceUpCard('hearts', '4')])

      expect(isValidMove(card, column)).toBe(false)
    })

    it('rejects card on non-adjacent higher rank', () => {
      const card = createFaceUpCard('spades', '5')
      const column = createColumn([createFaceUpCard('hearts', '7')])

      expect(isValidMove(card, column)).toBe(false)
    })

    it('rejects card on much higher rank', () => {
      const card = createFaceUpCard('spades', '2')
      const column = createColumn([createFaceUpCard('hearts', 'K')])

      expect(isValidMove(card, column)).toBe(false)
    })
  })

  describe('edge cases with King and Ace', () => {
    it('accepts Ace on 2', () => {
      const ace = createFaceUpCard('spades', 'A')
      const column = createColumn([createFaceUpCard('hearts', '2')])

      expect(isValidMove(ace, column)).toBe(true)
    })

    it('rejects placing on Ace (nothing lower)', () => {
      const card = createFaceUpCard('spades', '2')
      const column = createColumn([createFaceUpCard('hearts', 'A')])

      expect(isValidMove(card, column)).toBe(false)
    })

    it('accepts Queen on King', () => {
      const queen = createFaceUpCard('spades', 'Q')
      const column = createColumn([createFaceUpCard('hearts', 'K')])

      expect(isValidMove(queen, column)).toBe(true)
    })

    it('accepts Jack on Queen', () => {
      const jack = createFaceUpCard('clubs', 'J')
      const column = createColumn([createFaceUpCard('diamonds', 'Q')])

      expect(isValidMove(jack, column)).toBe(true)
    })

    it('accepts 10 on Jack', () => {
      const ten = createFaceUpCard('hearts', '10')
      const column = createColumn([createFaceUpCard('spades', 'J')])

      expect(isValidMove(ten, column)).toBe(true)
    })
  })
})

// =============================================================================
// canMoveSameSequence
// =============================================================================

describe('canMoveSameSequence', () => {
  describe('valid sequences', () => {
    it('allows single face-up card', () => {
      const column = createColumn([createFaceUpCard('spades', '5')])

      expect(canMoveSameSequence(column, 0)).toBe(true)
    })

    it('allows same-suit descending sequence of 2 cards', () => {
      const column = createColumn([
        createFaceUpCard('spades', '5'),
        createFaceUpCard('spades', '4'),
      ])

      expect(canMoveSameSequence(column, 0)).toBe(true)
    })

    it('allows same-suit descending sequence of 5 cards', () => {
      const column = createColumn(createDescendingSequence('hearts', '9', 5))

      expect(canMoveSameSequence(column, 0)).toBe(true)
    })

    it('allows moving partial sequence from middle', () => {
      const column = createColumn([
        createFaceDownCard('spades', 'K'),
        createFaceUpCard('spades', '5'),
        createFaceUpCard('spades', '4'),
        createFaceUpCard('spades', '3'),
      ])

      expect(canMoveSameSequence(column, 1)).toBe(true)
    })

    it('allows moving just the last card', () => {
      const column = createColumn([
        createFaceUpCard('spades', '5'),
        createFaceUpCard('spades', '4'),
        createFaceUpCard('spades', '3'),
      ])

      expect(canMoveSameSequence(column, 2)).toBe(true)
    })
  })

  describe('invalid sequences', () => {
    it('rejects empty selection (index at end of column)', () => {
      const column = createColumn([createFaceUpCard('spades', '5')])

      expect(canMoveSameSequence(column, 1)).toBe(false)
    })

    it('rejects selection from empty column', () => {
      const column = createEmptyColumn()

      expect(canMoveSameSequence(column, 0)).toBe(false)
    })

    it('rejects starting from face-down card', () => {
      const column = createColumn([createFaceDownCard('spades', '5')])

      expect(canMoveSameSequence(column, 0)).toBe(false)
    })

    it('rejects sequence with face-down card in middle', () => {
      const column = createColumn([
        createFaceUpCard('spades', '5'),
        createFaceDownCard('spades', '4'),
        createFaceUpCard('spades', '3'),
      ])

      expect(canMoveSameSequence(column, 0)).toBe(false)
    })

    it('rejects mixed-suit sequence', () => {
      const column = createColumn([
        createFaceUpCard('spades', '5'),
        createFaceUpCard('hearts', '4'),
      ])

      expect(canMoveSameSequence(column, 0)).toBe(false)
    })

    it('rejects non-descending sequence (same rank)', () => {
      const column = createColumn([
        createFaceUpCard('spades', '5'),
        createFaceUpCard('spades', '5'),
      ])

      expect(canMoveSameSequence(column, 0)).toBe(false)
    })

    it('rejects ascending sequence', () => {
      const column = createColumn([
        createFaceUpCard('spades', '4'),
        createFaceUpCard('spades', '5'),
      ])

      expect(canMoveSameSequence(column, 0)).toBe(false)
    })

    it('rejects sequence with gap in ranks', () => {
      const column = createColumn([
        createFaceUpCard('spades', '5'),
        createFaceUpCard('spades', '3'),
      ])

      expect(canMoveSameSequence(column, 0)).toBe(false)
    })
  })

  describe('partial sequences with face-down cards before', () => {
    it('allows sequence after face-down cards', () => {
      const column = createColumn([
        createFaceDownCard('hearts', 'K'),
        createFaceDownCard('hearts', 'Q'),
        createFaceUpCard('spades', '5'),
        createFaceUpCard('spades', '4'),
      ])

      expect(canMoveSameSequence(column, 2)).toBe(true)
    })

    it('rejects trying to include face-down cards in sequence', () => {
      const column = createColumn([
        createFaceDownCard('spades', '6'),
        createFaceUpCard('spades', '5'),
        createFaceUpCard('spades', '4'),
      ])

      expect(canMoveSameSequence(column, 0)).toBe(false)
    })
  })
})

// =============================================================================
// moveCards
// =============================================================================

describe('moveCards', () => {
  describe('successful moves', () => {
    it('moves single card between columns', () => {
      const game = createGameWithColumns([
        [createFaceUpCard('spades', '5')],
        [createFaceUpCard('hearts', '6')],
      ])

      const result = moveCards(game, 'col-0', 0, 'col-1')

      expect(result.columns[0].cards).toHaveLength(0)
      expect(result.columns[1].cards).toHaveLength(2)
      expect(result.columns[1].cards[1].rank).toBe('5')
    })

    it('moves sequence of cards', () => {
      const game = createGameWithColumns([
        createDescendingSequence('spades', '5', 3),
        [createFaceUpCard('hearts', '6')],
      ])

      const result = moveCards(game, 'col-0', 0, 'col-1')

      expect(result.columns[0].cards).toHaveLength(0)
      expect(result.columns[1].cards).toHaveLength(4)
    })

    it('moves cards to empty column', () => {
      const game = createGameWithColumns([
        [createFaceUpCard('spades', 'K')],
        [],
      ])

      const result = moveCards(game, 'col-0', 0, 'col-1')

      expect(result.columns[0].cards).toHaveLength(0)
      expect(result.columns[1].cards).toHaveLength(1)
    })

    it('increments move counter', () => {
      const game = createGameWithColumns([
        [createFaceUpCard('spades', '5')],
        [createFaceUpCard('hearts', '6')],
      ])
      game.moves = 5

      const result = moveCards(game, 'col-0', 0, 'col-1')

      expect(result.moves).toBe(6)
    })

    it('preserves other columns unchanged', () => {
      const game = createGameWithColumns([
        [createFaceUpCard('spades', '5')],
        [createFaceUpCard('hearts', '6')],
        [createFaceUpCard('clubs', 'K')],
      ])

      const result = moveCards(game, 'col-0', 0, 'col-1')

      expect(result.columns[2].cards).toEqual(game.columns[2].cards)
    })

    it('moves partial sequence leaving cards behind', () => {
      const game = createGameWithColumns([
        [
          createFaceUpCard('hearts', '8'),
          createFaceUpCard('spades', '5'),
          createFaceUpCard('spades', '4'),
        ],
        [createFaceUpCard('diamonds', '6')],
      ])

      const result = moveCards(game, 'col-0', 1, 'col-1')

      expect(result.columns[0].cards).toHaveLength(1)
      expect(result.columns[0].cards[0].rank).toBe('8')
      expect(result.columns[1].cards).toHaveLength(3)
    })
  })

  describe('error cases', () => {
    it('throws error for invalid source column', () => {
      const game = createGameWithColumns([
        [createFaceUpCard('spades', '5')],
      ])

      expect(() => moveCards(game, 'invalid', 0, 'col-0')).toThrow('Invalid column')
    })

    it('throws error for invalid target column', () => {
      const game = createGameWithColumns([
        [createFaceUpCard('spades', '5')],
      ])

      expect(() => moveCards(game, 'col-0', 0, 'invalid')).toThrow('Invalid column')
    })

    it('throws error when sequence cannot be moved', () => {
      const game = createGameWithColumns([
        [
          createFaceUpCard('spades', '5'),
          createFaceUpCard('hearts', '4'), // Mixed suit
        ],
        [createFaceUpCard('diamonds', '6')],
      ])

      expect(() => moveCards(game, 'col-0', 0, 'col-1')).toThrow('Cannot move this sequence')
    })

    it('throws error for invalid move destination', () => {
      const game = createGameWithColumns([
        [createFaceUpCard('spades', '5')],
        [createFaceUpCard('hearts', '3')], // Wrong rank
      ])

      expect(() => moveCards(game, 'col-0', 0, 'col-1')).toThrow('Invalid move')
    })
  })

  describe('immutability', () => {
    it('does not mutate original game', () => {
      const game = createGameWithColumns([
        [createFaceUpCard('spades', '5')],
        [createFaceUpCard('hearts', '6')],
      ])
      const originalColumns0Length = game.columns[0].cards.length

      moveCards(game, 'col-0', 0, 'col-1')

      expect(game.columns[0].cards.length).toBe(originalColumns0Length)
    })

    it('does not mutate original columns array', () => {
      const game = createGameWithColumns([
        [createFaceUpCard('spades', '5')],
        [createFaceUpCard('hearts', '6')],
      ])
      const originalColumnsRef = game.columns

      const result = moveCards(game, 'col-0', 0, 'col-1')

      expect(result.columns).not.toBe(originalColumnsRef)
    })
  })
})

// =============================================================================
// flipTopCard
// =============================================================================

describe('flipTopCard', () => {
  describe('flipping face-down cards', () => {
    it('flips face-down top card to face-up', () => {
      const game = createGameWithColumns([
        [createFaceDownCard('spades', '5')],
      ])

      const result = flipTopCard(game, 'col-0')

      expect(result.columns[0].cards[0].faceUp).toBe(true)
    })

    it('flips only the top card when multiple cards', () => {
      const game = createGameWithColumns([
        [
          createFaceDownCard('spades', '6'),
          createFaceDownCard('spades', '5'),
        ],
      ])

      const result = flipTopCard(game, 'col-0')

      expect(result.columns[0].cards[0].faceUp).toBe(false)
      expect(result.columns[0].cards[1].faceUp).toBe(true)
    })
  })

  describe('no-op cases', () => {
    it('returns same game if top card already face-up', () => {
      const game = createGameWithColumns([
        [createFaceUpCard('spades', '5')],
      ])

      const result = flipTopCard(game, 'col-0')

      expect(result).toBe(game)
    })

    it('returns same game for empty column', () => {
      const game = createGameWithColumns([[]])

      const result = flipTopCard(game, 'col-0')

      expect(result).toBe(game)
    })

    it('returns same game for non-existent column', () => {
      const game = createGameWithColumns([
        [createFaceDownCard('spades', '5')],
      ])

      const result = flipTopCard(game, 'invalid')

      expect(result).toBe(game)
    })
  })

  describe('immutability', () => {
    it('does not mutate original card', () => {
      const originalCard = createFaceDownCard('spades', '5')
      const game = createGameWithColumns([[originalCard]])

      flipTopCard(game, 'col-0')

      expect(originalCard.faceUp).toBe(false)
    })

    it('preserves other columns', () => {
      const game = createGameWithColumns([
        [createFaceDownCard('spades', '5')],
        [createFaceUpCard('hearts', 'K')],
      ])

      const result = flipTopCard(game, 'col-0')

      expect(result.columns[1]).toBe(game.columns[1])
    })
  })
})
