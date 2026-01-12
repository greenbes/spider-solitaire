import type { Suit, Rank } from './types'

export const SUITS: Suit[] = ['spades', 'hearts', 'diamonds', 'clubs']

export const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

export const RANK_ORDER: Record<Rank, number> = {
  'A': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  'J': 11,
  'Q': 12,
  'K': 13,
}

export const NUM_COLUMNS = 10
export const CARDS_IN_DECK = 104 // 2 decks
export const COMPLETE_SUIT_LENGTH = 13
export const INITIAL_DEALS = 5
export const CARDS_PER_DEAL = 10
