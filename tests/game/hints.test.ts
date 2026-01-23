import { describe, it, expect, beforeEach } from 'vitest'
import { getHint, hasValidMoves } from '../../src/game/hints'
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
// getHint
// =============================================================================

describe('getHint', () => {
  describe('finding moves', () => {
    it('returns a hint when valid move exists', () => {
      const game = createGameWithColumns([
        [createFaceUpCard('spades', '5')],
        [createFaceUpCard('hearts', '6')],
      ])

      const hint = getHint(game)

      expect(hint).not.toBeNull()
      expect(hint?.fromColumnId).toBe('col-0')
      expect(hint?.cardIndex).toBe(0)
      expect(hint?.toColumnId).toBe('col-1')
    })

    it('returns null when no valid moves exist', () => {
      // All columns have only Kings - no moves possible except to empty
      // But moving King to empty from single-card column has score 0
      const game = createGameWithColumns([
        [createFaceUpCard('spades', 'K')],
        [createFaceUpCard('hearts', 'K')],
      ])

      const hint = getHint(game)

      expect(hint).toBeNull()
    })

    it('returns null for empty game', () => {
      const game = createGame({ columns: [] })

      const hint = getHint(game)

      expect(hint).toBeNull()
    })

    it('returns null when all columns are empty', () => {
      const game = createGameWithColumns([[], [], []])

      const hint = getHint(game)

      expect(hint).toBeNull()
    })
  })

  describe('move scoring priorities', () => {
    it('prioritizes same-suit moves that reveal cards', () => {
      const game = createGameWithColumns([
        // Column 0: face-down card, then face-up 5
        [createFaceDownCard('clubs', 'Q'), createFaceUpCard('spades', '5')],
        // Column 1: same-suit 6 (moving 5 here reveals Q and builds same-suit)
        [createFaceUpCard('spades', '6')],
        // Column 2: different-suit 6 (could move here but worse)
        [createFaceUpCard('hearts', '6')],
      ])

      const hint = getHint(game)

      expect(hint).not.toBeNull()
      expect(hint?.toColumnId).toBe('col-1') // Prefers same-suit + reveals
    })

    it('prioritizes same-suit building over just revealing', () => {
      const game = createGameWithColumns([
        // Column 0: face-up 5 (no card to reveal)
        [createFaceUpCard('spades', '5')],
        // Column 1: same-suit 6
        [createFaceUpCard('spades', '6')],
        // Column 2: different-suit 6
        [createFaceUpCard('hearts', '6')],
      ])

      const hint = getHint(game)

      expect(hint).not.toBeNull()
      expect(hint?.toColumnId).toBe('col-1') // Prefers same-suit
    })

    it('prioritizes revealing face-down cards over regular moves', () => {
      const game = createGameWithColumns([
        // Column 0: face-down + face-up 5
        [createFaceDownCard('clubs', 'Q'), createFaceUpCard('spades', '5')],
        // Column 1: different-suit 6 (reveals card)
        [createFaceUpCard('hearts', '6')],
      ])

      const hint = getHint(game)

      expect(hint).not.toBeNull()
      expect(hint?.fromColumnId).toBe('col-0')
      expect(hint?.toColumnId).toBe('col-1')
    })

    it('prioritizes King to empty that reveals card', () => {
      const game = createGameWithColumns([
        // Column 0: face-down card, then King
        [createFaceDownCard('hearts', 'Q'), createFaceUpCard('spades', 'K')],
        // Column 1: empty
        [],
      ])

      const hint = getHint(game)

      expect(hint).not.toBeNull()
      expect(hint?.fromColumnId).toBe('col-0')
      expect(hint?.cardIndex).toBe(1)
      expect(hint?.toColumnId).toBe('col-1')
    })
  })

  describe('avoiding useless moves', () => {
    it('avoids moving entire column to empty column (score 0)', () => {
      // Moving a single-card King to empty accomplishes nothing
      const game = createGameWithColumns([
        [createFaceUpCard('spades', 'K')],
        [],
      ])

      const hint = getHint(game)

      // Should not suggest this useless move
      expect(hint).toBeNull()
    })

    it('allows move if it benefits the game', () => {
      // Moving partial column to empty is still valuable if it reveals card
      const game = createGameWithColumns([
        [
          createFaceDownCard('hearts', 'A'),
          createFaceUpCard('spades', 'K'),
          createFaceUpCard('spades', 'Q'),
        ],
        [],
      ])

      const hint = getHint(game)

      expect(hint).not.toBeNull()
      expect(hint?.cardIndex).toBe(1) // Move K-Q sequence
      expect(hint?.toColumnId).toBe('col-1')
    })
  })

  describe('sequence moves', () => {
    it('finds move for same-suit sequence', () => {
      const game = createGameWithColumns([
        createDescendingSequence('spades', '5', 3), // 5-4-3
        [createFaceUpCard('hearts', '6')],
      ])

      const hint = getHint(game)

      expect(hint).not.toBeNull()
      expect(hint?.fromColumnId).toBe('col-0')
      expect(hint?.cardIndex).toBe(0) // Move entire sequence
    })

    it('finds partial sequence move when full sequence cannot move', () => {
      const game = createGameWithColumns([
        [
          createFaceUpCard('spades', '7'),
          createFaceUpCard('hearts', '6'), // Breaks same-suit sequence
          createFaceUpCard('hearts', '5'),
          createFaceUpCard('hearts', '4'),
        ],
        [createFaceUpCard('diamonds', '5')], // Can receive 4
      ])

      const hint = getHint(game)

      expect(hint).not.toBeNull()
      // Should suggest moving just the 4 (index 3)
      expect(hint?.cardIndex).toBe(3)
    })

    it('prefers longer same-suit sequences', () => {
      // This tests that the scoring considers sequence length
      const game = createGameWithColumns([
        createDescendingSequence('spades', '6', 4), // 6-5-4-3
        [createFaceUpCard('spades', '7')],
        [createFaceUpCard('hearts', '4')], // Could move just the 3 here
      ])

      const hint = getHint(game)

      expect(hint).not.toBeNull()
      // Should prefer moving entire sequence (longer)
      expect(hint?.cardIndex).toBe(0)
      expect(hint?.toColumnId).toBe('col-1')
    })
  })

  describe('hint properties', () => {
    it('returns hint without score property', () => {
      const game = createGameWithColumns([
        [createFaceUpCard('spades', '5')],
        [createFaceUpCard('hearts', '6')],
      ])

      const hint = getHint(game)

      expect(hint).not.toBeNull()
      expect(hint).toHaveProperty('fromColumnId')
      expect(hint).toHaveProperty('cardIndex')
      expect(hint).toHaveProperty('toColumnId')
      expect(hint).not.toHaveProperty('score')
    })
  })
})

// =============================================================================
// hasValidMoves
// =============================================================================

describe('hasValidMoves', () => {
  describe('detecting valid moves', () => {
    it('returns true when moves exist', () => {
      const game = createGameWithColumns([
        [createFaceUpCard('spades', '5')],
        [createFaceUpCard('hearts', '6')],
      ])

      expect(hasValidMoves(game)).toBe(true)
    })

    it('returns true when move to empty column exists', () => {
      const game = createGameWithColumns([
        [createFaceDownCard('clubs', 'A'), createFaceUpCard('spades', 'K')],
        [],
      ])

      expect(hasValidMoves(game)).toBe(true)
    })

    it('returns true when sequence can move', () => {
      const game = createGameWithColumns([
        createDescendingSequence('spades', '5', 3),
        [createFaceUpCard('hearts', '6')],
      ])

      expect(hasValidMoves(game)).toBe(true)
    })
  })

  describe('detecting no valid moves', () => {
    it('returns false when no beneficial moves exist', () => {
      // Single Kings - moving to empty has score 0
      const game = createGameWithColumns([
        [createFaceUpCard('spades', 'K')],
        [createFaceUpCard('hearts', 'K')],
      ])

      expect(hasValidMoves(game)).toBe(false)
    })

    it('returns false for empty game', () => {
      const game = createGame({ columns: [] })

      expect(hasValidMoves(game)).toBe(false)
    })

    it('returns false when all columns are empty', () => {
      const game = createGameWithColumns([[], [], []])

      expect(hasValidMoves(game)).toBe(false)
    })

    it('returns false when only face-down cards exist', () => {
      const game = createGameWithColumns([
        [createFaceDownCard('spades', '5')],
        [createFaceDownCard('hearts', '6')],
      ])

      expect(hasValidMoves(game)).toBe(false)
    })
  })

  describe('stuck game detection', () => {
    it('returns false for typical stuck scenario', () => {
      // Cards that cannot connect - all Aces (cannot place anything on Ace)
      const game = createGameWithColumns([
        [createFaceUpCard('spades', 'A')],
        [createFaceUpCard('hearts', 'A')],
        [createFaceUpCard('diamonds', 'A')],
        [createFaceUpCard('clubs', 'A')],
      ])

      // No cards can be placed on Aces, and moving Ace to Ace is invalid
      expect(hasValidMoves(game)).toBe(false)
    })

    it('correctly identifies stuck when moves would have zero benefit', () => {
      // All single-card columns with Kings
      const game = createGameWithColumns([
        [createFaceUpCard('spades', 'K')],
        [createFaceUpCard('hearts', 'K')],
        [createFaceUpCard('diamonds', 'K')],
        [createFaceUpCard('clubs', 'K')],
        [],
        [],
      ])

      // Moving King to empty from single-card column has score 0 (no benefit)
      expect(hasValidMoves(game)).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('returns true even for low-value moves', () => {
      // A move that does not reveal or build same-suit
      const game = createGameWithColumns([
        [createFaceUpCard('spades', '5')],
        [createFaceUpCard('hearts', '6')],
      ])

      expect(hasValidMoves(game)).toBe(true)
    })

    it('considers all columns for potential moves', () => {
      // Only the last column has a valid move
      const game = createGameWithColumns([
        [createFaceUpCard('spades', 'A')],
        [createFaceUpCard('hearts', 'A')],
        [createFaceUpCard('diamonds', 'A')],
        [createFaceUpCard('clubs', '5')],
        [createFaceUpCard('spades', '6')], // Only valid move: 5 -> 6
      ])

      expect(hasValidMoves(game)).toBe(true)
    })
  })
})
