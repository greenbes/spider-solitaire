// =============================================================================
// Data Types
// =============================================================================

export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs'

export type Rank =
  | 'A'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | 'J'
  | 'Q'
  | 'K'

export interface Card {
  suit: Suit
  rank: Rank
  faceUp: boolean
}

export interface Column {
  id: string
  cards: Card[]
}

export type Difficulty = 1 | 2 | 4

export interface Game {
  difficulty: Difficulty
  moves: number
  dealsRemaining: number
  foundationsCompleted: number
  columns: Column[]
}

// =============================================================================
// Component Props
// =============================================================================

export interface GameBoardPreferences {
  /** Highlight valid drop targets when dragging (default: false) */
  showValidDropTargets: boolean
  /** Automatically move completed suits to foundation (default: true) */
  autoMoveCompletedSuits: boolean
  /** Show celebration animation on suit completion (default: true) */
  showCelebration: boolean
}

export interface GameBoardProps {
  /** The current game state */
  game: Game
  /** User preferences for game board behavior */
  preferences: GameBoardPreferences
  /** Called when cards are moved from one column to another */
  onMoveCards?: (
    fromColumnId: string,
    cardIndex: number,
    toColumnId: string
  ) => void
  /** Called when player taps stock pile to deal cards */
  onDeal?: () => void
  /** Called when a suit is completed (King to Ace same-suit sequence) */
  onSuitCompleted?: (suit: Suit) => void
  /** Called when a face-down card is exposed and should flip */
  onCardFlip?: (columnId: string, cardIndex: number) => void
}
