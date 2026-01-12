// =============================================================================
// Core Game Types
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
// User Preferences
// =============================================================================

export interface UserPreferences {
  toolbarPosition: 'top' | 'bottom'
  showStatistics: boolean
  cardSize: 'small' | 'medium' | 'large'
  highContrast: boolean
  cardArt: string
  theme: string
}

// =============================================================================
// Game Board Props
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

// =============================================================================
// Shell Types
// =============================================================================

export interface GameStats {
  moves: number
  suitsCompleted: number
}

export interface AppShellProps {
  children: React.ReactNode
  stats?: GameStats
  preferences?: UserPreferences
  canUndo?: boolean
  canDeal?: boolean
  isSettingsOpen?: boolean
  isNewGameOpen?: boolean
  onNewGame?: (difficulty: Difficulty) => void
  onUndo?: () => void
  onDeal?: () => void
  onOpenSettings?: () => void
  onCloseSettings?: () => void
  onOpenNewGame?: () => void
  onCloseNewGame?: () => void
  onPreferencesChange?: (preferences: UserPreferences) => void
}
