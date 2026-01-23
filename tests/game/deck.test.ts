import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createDeck, shuffleDeck } from '../../src/game/deck'
import type { Suit } from '../../src/game/types'

// =============================================================================
// createDeck
// =============================================================================

describe('createDeck', () => {
  describe('card count', () => {
    it('returns 104 cards for difficulty 1', () => {
      const deck = createDeck(1)

      expect(deck).toHaveLength(104)
    })

    it('returns 104 cards for difficulty 2', () => {
      const deck = createDeck(2)

      expect(deck).toHaveLength(104)
    })

    it('returns 104 cards for difficulty 4', () => {
      const deck = createDeck(4)

      expect(deck).toHaveLength(104)
    })
  })

  describe('difficulty 1 (one suit)', () => {
    it('creates all spades', () => {
      const deck = createDeck(1)
      const suits = new Set(deck.map(c => c.suit))

      expect(suits.size).toBe(1)
      expect(suits.has('spades')).toBe(true)
    })

    it('has 8 of each rank', () => {
      const deck = createDeck(1)
      const rankCounts: Record<string, number> = {}

      deck.forEach(card => {
        rankCounts[card.rank] = (rankCounts[card.rank] || 0) + 1
      })

      expect(Object.keys(rankCounts)).toHaveLength(13) // 13 ranks
      Object.values(rankCounts).forEach(count => {
        expect(count).toBe(8)
      })
    })
  })

  describe('difficulty 2 (two suits)', () => {
    it('creates spades and hearts only', () => {
      const deck = createDeck(2)
      const suits = new Set(deck.map(c => c.suit))

      expect(suits.size).toBe(2)
      expect(suits.has('spades')).toBe(true)
      expect(suits.has('hearts')).toBe(true)
      expect(suits.has('diamonds')).toBe(false)
      expect(suits.has('clubs')).toBe(false)
    })

    it('has 52 spades and 52 hearts', () => {
      const deck = createDeck(2)
      const suitCounts: Record<Suit, number> = {
        spades: 0,
        hearts: 0,
        diamonds: 0,
        clubs: 0,
      }

      deck.forEach(card => {
        suitCounts[card.suit]++
      })

      expect(suitCounts.spades).toBe(52)
      expect(suitCounts.hearts).toBe(52)
    })

    it('has 4 of each rank per suit', () => {
      const deck = createDeck(2)
      const spadesRankCounts: Record<string, number> = {}

      deck
        .filter(c => c.suit === 'spades')
        .forEach(card => {
          spadesRankCounts[card.rank] = (spadesRankCounts[card.rank] || 0) + 1
        })

      Object.values(spadesRankCounts).forEach(count => {
        expect(count).toBe(4)
      })
    })
  })

  describe('difficulty 4 (four suits)', () => {
    it('creates all four suits', () => {
      const deck = createDeck(4)
      const suits = new Set(deck.map(c => c.suit))

      expect(suits.size).toBe(4)
      expect(suits.has('spades')).toBe(true)
      expect(suits.has('hearts')).toBe(true)
      expect(suits.has('diamonds')).toBe(true)
      expect(suits.has('clubs')).toBe(true)
    })

    it('has 26 of each suit', () => {
      const deck = createDeck(4)
      const suitCounts: Record<Suit, number> = {
        spades: 0,
        hearts: 0,
        diamonds: 0,
        clubs: 0,
      }

      deck.forEach(card => {
        suitCounts[card.suit]++
      })

      expect(suitCounts.spades).toBe(26)
      expect(suitCounts.hearts).toBe(26)
      expect(suitCounts.diamonds).toBe(26)
      expect(suitCounts.clubs).toBe(26)
    })

    it('has 2 of each rank per suit', () => {
      const deck = createDeck(4)
      const spadesRankCounts: Record<string, number> = {}

      deck
        .filter(c => c.suit === 'spades')
        .forEach(card => {
          spadesRankCounts[card.rank] = (spadesRankCounts[card.rank] || 0) + 1
        })

      Object.values(spadesRankCounts).forEach(count => {
        expect(count).toBe(2)
      })
    })
  })

  describe('card properties', () => {
    it('all cards start face-down', () => {
      const deck1 = createDeck(1)
      const deck2 = createDeck(2)
      const deck4 = createDeck(4)

      expect(deck1.every(c => c.faceUp === false)).toBe(true)
      expect(deck2.every(c => c.faceUp === false)).toBe(true)
      expect(deck4.every(c => c.faceUp === false)).toBe(true)
    })

    it('includes all 13 ranks', () => {
      const deck = createDeck(4)
      const ranks = new Set(deck.map(c => c.rank))

      expect(ranks.size).toBe(13)
      expect(ranks.has('A')).toBe(true)
      expect(ranks.has('2')).toBe(true)
      expect(ranks.has('10')).toBe(true)
      expect(ranks.has('J')).toBe(true)
      expect(ranks.has('Q')).toBe(true)
      expect(ranks.has('K')).toBe(true)
    })
  })
})

// =============================================================================
// shuffleDeck
// =============================================================================

describe('shuffleDeck', () => {
  describe('immutability', () => {
    it('returns a new array', () => {
      const deck = createDeck(1)
      const shuffled = shuffleDeck(deck)

      expect(shuffled).not.toBe(deck)
    })

    it('does not mutate the original deck', () => {
      const deck = createDeck(1)
      const originalFirstCard = { ...deck[0] }
      const originalLastCard = { ...deck[deck.length - 1] }
      const originalLength = deck.length

      shuffleDeck(deck)

      expect(deck.length).toBe(originalLength)
      expect(deck[0]).toEqual(originalFirstCard)
      expect(deck[deck.length - 1]).toEqual(originalLastCard)
    })
  })

  describe('preservation', () => {
    it('contains all original cards', () => {
      const deck = createDeck(4)
      const shuffled = shuffleDeck(deck)

      expect(shuffled).toHaveLength(deck.length)

      // Every card in original should be in shuffled
      deck.forEach(originalCard => {
        const found = shuffled.some(
          c => c.suit === originalCard.suit && c.rank === originalCard.rank
        )
        expect(found).toBe(true)
      })
    })

    it('preserves the same number of each card', () => {
      const deck = createDeck(4)
      const shuffled = shuffleDeck(deck)

      const countCards = (cards: typeof deck) => {
        const counts: Record<string, number> = {}
        cards.forEach(c => {
          const key = `${c.suit}-${c.rank}`
          counts[key] = (counts[key] || 0) + 1
        })
        return counts
      }

      expect(countCards(shuffled)).toEqual(countCards(deck))
    })
  })

  describe('randomness', () => {
    it('changes the order of cards (with mocked random)', () => {
      // Mock Math.random to return deterministic but varying values
      let callCount = 0
      const mockRandom = vi.spyOn(Math, 'random').mockImplementation(() => {
        // Return values that will definitely cause swaps
        callCount++
        return (callCount % 7) / 10 // 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.0, ...
      })

      const deck = createDeck(1)
      const shuffled = shuffleDeck(deck)

      // At least some cards should be in different positions
      let differentPositions = 0
      for (let i = 0; i < deck.length; i++) {
        if (deck[i].rank !== shuffled[i].rank || deck[i].suit !== shuffled[i].suit) {
          differentPositions++
        }
      }

      expect(differentPositions).toBeGreaterThan(0)

      mockRandom.mockRestore()
    })

    it('produces different results on successive calls', () => {
      // Note: This test has a tiny probability of failing if random produces identical results
      // In practice, this should never happen with 104 cards
      const deck = createDeck(1)
      const shuffled1 = shuffleDeck(deck)
      const shuffled2 = shuffleDeck(deck)

      // Count how many positions are different between the two shuffles
      let differentPositions = 0
      for (let i = 0; i < shuffled1.length; i++) {
        if (
          shuffled1[i].rank !== shuffled2[i].rank ||
          shuffled1[i].suit !== shuffled2[i].suit
        ) {
          differentPositions++
        }
      }

      // With 104 cards, two independent shuffles should almost certainly differ
      expect(differentPositions).toBeGreaterThan(0)
    })
  })

  describe('edge cases', () => {
    it('handles empty deck', () => {
      const shuffled = shuffleDeck([])

      expect(shuffled).toEqual([])
    })

    it('handles single card deck', () => {
      const singleCard = [{ suit: 'spades' as const, rank: 'A' as const, faceUp: false }]
      const shuffled = shuffleDeck(singleCard)

      expect(shuffled).toHaveLength(1)
      expect(shuffled[0]).toEqual(singleCard[0])
    })
  })
})
