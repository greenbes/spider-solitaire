import type { Game, GameState, GameAction, Difficulty } from './types'
import { createDeck, shuffleDeck } from './deck'
import { dealInitialCards, dealFromStock } from './deal'
import { isValidMove, canMoveSameSequence, moveCards, flipTopCard } from './moves'
import { detectCompletedSuit, removeCompletedSuit, isWinCondition } from './completion'
import { INITIAL_DEALS } from './constants'

export const initialGameState: GameState = {
  game: {
    difficulty: 4,
    moves: 0,
    dealsRemaining: INITIAL_DEALS,
    foundationsCompleted: 0,
    columns: [],
    stock: [],
  },
  history: [],
  isWon: false,
  gameStarted: false,
}

function createNewGame(difficulty: Difficulty): Game {
  const deck = shuffleDeck(createDeck(difficulty))
  const { columns, stock } = dealInitialCards(deck)

  return {
    difficulty,
    moves: 0,
    dealsRemaining: INITIAL_DEALS,
    foundationsCompleted: 0,
    columns,
    stock,
  }
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'NEW_GAME': {
      const game = createNewGame(action.payload.difficulty)
      return {
        game,
        history: [],
        isWon: false,
        gameStarted: true,
      }
    }

    case 'MOVE_CARDS': {
      const { fromColumnId, cardIndex, toColumnId } = action.payload

      // Validate move
      const fromCol = state.game.columns.find((c) => c.id === fromColumnId)
      const toCol = state.game.columns.find((c) => c.id === toColumnId)

      if (!fromCol || !toCol) return state
      if (!canMoveSameSequence(fromCol, cardIndex)) return state
      if (!isValidMove(fromCol.cards[cardIndex], toCol)) return state

      // Save current state for undo
      const newHistory = [...state.history, state.game]

      // Execute move
      let newGame = moveCards(state.game, fromColumnId, cardIndex, toColumnId)

      // Auto-flip exposed card in source column
      newGame = flipTopCard(newGame, fromColumnId)

      // Check for completed suit in target column
      const targetColumn = newGame.columns.find((c) => c.id === toColumnId)
      if (targetColumn) {
        const completedSuit = detectCompletedSuit(targetColumn)
        if (completedSuit) {
          newGame = removeCompletedSuit(newGame, toColumnId)
          // Flip any newly exposed card after suit removal
          newGame = flipTopCard(newGame, toColumnId)
        }
      }

      return {
        ...state,
        game: newGame,
        history: newHistory,
        isWon: isWinCondition(newGame),
      }
    }

    case 'DEAL': {
      const hasEmptyColumn = state.game.columns.some((c) => c.cards.length === 0)
      if (hasEmptyColumn || state.game.dealsRemaining === 0 || state.game.stock.length < 10) {
        return state // Cannot deal
      }

      const newHistory = [...state.history, state.game]
      let newGame = dealFromStock(state.game)

      // Check all columns for completed suits after deal
      for (const column of newGame.columns) {
        const completedSuit = detectCompletedSuit(column)
        if (completedSuit) {
          newGame = removeCompletedSuit(newGame, column.id)
          newGame = flipTopCard(newGame, column.id)
        }
      }

      return {
        ...state,
        game: newGame,
        history: newHistory,
        isWon: isWinCondition(newGame),
      }
    }

    case 'UNDO': {
      if (state.history.length === 0) return state

      const newHistory = [...state.history]
      const previousGame = newHistory.pop()!

      return {
        ...state,
        game: previousGame,
        history: newHistory,
        isWon: false, // Undoing means game is not won
      }
    }

    case 'FLIP_CARD': {
      const newGame = flipTopCard(state.game, action.payload.columnId)
      if (newGame === state.game) return state // No change

      return { ...state, game: newGame }
    }

    case 'COMPLETE_SUIT': {
      const column = state.game.columns.find((c) => c.id === action.payload.columnId)
      if (!column || !detectCompletedSuit(column)) return state

      const newHistory = [...state.history, state.game]
      let newGame = removeCompletedSuit(state.game, action.payload.columnId)
      newGame = flipTopCard(newGame, action.payload.columnId)

      return {
        ...state,
        game: newGame,
        history: newHistory,
        isWon: isWinCondition(newGame),
      }
    }

    default:
      return state
  }
}
