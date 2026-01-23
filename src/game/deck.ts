import type { Card, Suit, Difficulty } from './types'
import { SUITS, RANKS } from './constants'

/**
 * Get the suits to use based on difficulty level
 * - Difficulty 1: All spades
 * - Difficulty 2: Spades and hearts
 * - Difficulty 4: All four suits
 */
function getSuitsForDifficulty(difficulty: Difficulty): Suit[] {
  switch (difficulty) {
    case 1:
      return ['spades']
    case 2:
      return ['spades', 'hearts']
    case 4:
      return SUITS
  }
}

/**
 * Creates a deck of 104 cards (equivalent to 2 standard decks) filtered by difficulty
 * - Difficulty 1: 104 spade cards (8 of each rank)
 * - Difficulty 2: 52 spades + 52 hearts (4 of each rank per suit)
 * - Difficulty 4: 26 of each suit (2 of each rank per suit)
 */
export function createDeck(difficulty: Difficulty): Card[] {
  const suits = getSuitsForDifficulty(difficulty)
  const decksPerSuit = 8 / suits.length // Ensures 104 cards total
  const cards: Card[] = []

  for (let deck = 0; deck < decksPerSuit; deck++) {
    for (const suit of suits) {
      for (const rank of RANKS) {
        cards.push({ suit, rank, faceUp: false })
      }
    }
  }

  return cards
}

const SHUFFLE_PASSES = 3

/**
 * Fisher-Yates shuffle algorithm with multiple passes
 * Returns a new shuffled array without mutating the original
 */
export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck]
  for (let pass = 0; pass < SHUFFLE_PASSES; pass++) {
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
  }
  return shuffled
}
