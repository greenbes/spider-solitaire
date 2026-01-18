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
  stock: Card[]
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

export type CardArt = 'classic' | 'modern' | 'minimal'

export type Theme = 'green-felt' | 'blue-felt' | 'wood' | 'dark'

export type CardSize = 'small' | 'medium' | 'large'

export interface GameBoardPreferences {
  showValidDropTargets: boolean
  autoMoveCompletedSuits: boolean
  showCelebration: boolean
  cardArt: CardArt
  theme: Theme
  cardSize: CardSize
}

export interface GameBoardProps {
  game: Game
  preferences: GameBoardPreferences
  onMoveCards?: (
    fromColumnId: string,
    cardIndex: number,
    toColumnId: string
  ) => void
  onDeal?: () => void
  onSuitCompleted?: (suit: Suit) => void
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

// =============================================================================
// Game State (for reducer)
// =============================================================================

export interface GameState {
  game: Game
  history: Game[]
  isWon: boolean
  gameStarted: boolean
}

export type GameAction =
  | { type: 'NEW_GAME'; payload: { difficulty: Difficulty } }
  | { type: 'MOVE_CARDS'; payload: { fromColumnId: string; cardIndex: number; toColumnId: string } }
  | { type: 'DEAL' }
  | { type: 'UNDO' }
  | { type: 'FLIP_CARD'; payload: { columnId: string } }
  | { type: 'COMPLETE_SUIT'; payload: { columnId: string; suit: Suit } }
