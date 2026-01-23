import { describe, it, expect, beforeEach } from 'vitest'
import { gameReducer, initialGameState } from '../../src/game/reducer'
import type { GameState, GameAction, Game } from '../../src/game/types'
import {
  createFaceUpCard,
  createFaceDownCard,
  createColumn,
  createCompleteSuitSequence,
  createDescendingSequence,
  createGame,
  createGameWithColumns,
  resetColumnIdCounter,
} from '../factories/game'

beforeEach(() => {
  resetColumnIdCounter()
})

function createGameState(game: Game, overrides: Partial<GameState> = {}): GameState {
  return {
    game,
    history: [],
    isWon: false,
    gameStarted: true,
    ...overrides,
  }
}

// =============================================================================
// NEW_GAME
// =============================================================================

describe('NEW_GAME action', () => {
  it('creates initial game state with correct structure', () => {
    const action: GameAction = { type: 'NEW_GAME', payload: { difficulty: 4 } }

    const result = gameReducer(initialGameState, action)

    expect(result.game.difficulty).toBe(4)
    expect(result.game.moves).toBe(0)
    expect(result.game.dealsRemaining).toBe(5)
    expect(result.game.foundationsCompleted).toBe(0)
    expect(result.game.columns).toHaveLength(10)
    expect(result.game.stock).toHaveLength(50)
  })

  it('clears history on new game', () => {
    const stateWithHistory = {
      ...initialGameState,
      history: [initialGameState.game, initialGameState.game],
    }
    const action: GameAction = { type: 'NEW_GAME', payload: { difficulty: 1 } }

    const result = gameReducer(stateWithHistory, action)

    expect(result.history).toEqual([])
  })

  it('sets isWon to false', () => {
    const stateWon = { ...initialGameState, isWon: true }
    const action: GameAction = { type: 'NEW_GAME', payload: { difficulty: 2 } }

    const result = gameReducer(stateWon, action)

    expect(result.isWon).toBe(false)
  })

  it('sets gameStarted to true', () => {
    const action: GameAction = { type: 'NEW_GAME', payload: { difficulty: 4 } }

    const result = gameReducer({ ...initialGameState, gameStarted: false }, action)

    expect(result.gameStarted).toBe(true)
  })

  it('creates different decks for different difficulties', () => {
    const action1: GameAction = { type: 'NEW_GAME', payload: { difficulty: 1 } }
    const action4: GameAction = { type: 'NEW_GAME', payload: { difficulty: 4 } }

    const result1 = gameReducer(initialGameState, action1)
    const result4 = gameReducer(initialGameState, action4)

    // Difficulty 1 should have only spades
    const allCards1 = [...result1.game.columns.flatMap(c => c.cards), ...result1.game.stock]
    const suits1 = new Set(allCards1.map(c => c.suit))
    expect(suits1.size).toBe(1)

    // Difficulty 4 should have all suits
    const allCards4 = [...result4.game.columns.flatMap(c => c.cards), ...result4.game.stock]
    const suits4 = new Set(allCards4.map(c => c.suit))
    expect(suits4.size).toBe(4)
  })
})

// =============================================================================
// MOVE_CARDS
// =============================================================================

describe('MOVE_CARDS action', () => {
  describe('valid moves', () => {
    it('moves cards and updates state', () => {
      const game = createGameWithColumns([
        [createFaceUpCard('spades', '5')],
        [createFaceUpCard('hearts', '6')],
      ])
      const state = createGameState(game)
      const action: GameAction = {
        type: 'MOVE_CARDS',
        payload: { fromColumnId: 'col-0', cardIndex: 0, toColumnId: 'col-1' },
      }

      const result = gameReducer(state, action)

      expect(result.game.columns[0].cards).toHaveLength(0)
      expect(result.game.columns[1].cards).toHaveLength(2)
    })

    it('pushes current game to history', () => {
      const game = createGameWithColumns([
        [createFaceUpCard('spades', '5')],
        [createFaceUpCard('hearts', '6')],
      ])
      const state = createGameState(game)
      const action: GameAction = {
        type: 'MOVE_CARDS',
        payload: { fromColumnId: 'col-0', cardIndex: 0, toColumnId: 'col-1' },
      }

      const result = gameReducer(state, action)

      expect(result.history).toHaveLength(1)
      expect(result.history[0]).toEqual(game)
    })

    it('auto-flips exposed face-down card', () => {
      const game = createGameWithColumns([
        [createFaceDownCard('clubs', 'K'), createFaceUpCard('spades', '5')],
        [createFaceUpCard('hearts', '6')],
      ])
      const state = createGameState(game)
      const action: GameAction = {
        type: 'MOVE_CARDS',
        payload: { fromColumnId: 'col-0', cardIndex: 1, toColumnId: 'col-1' },
      }

      const result = gameReducer(state, action)

      expect(result.game.columns[0].cards[0].faceUp).toBe(true)
    })

    it('auto-detects and removes completed suit', () => {
      // Create a scenario where moving completes a suit
      // Cards are added to the END, so moving an Ace completes K-Q-J-10-9-8-7-6-5-4-3-2 + A
      const almostComplete = createCompleteSuitSequence('spades').slice(0, 12) // K-Q-J-10-9-8-7-6-5-4-3-2 (no A)
      const game = createGameWithColumns([
        [createFaceUpCard('spades', 'A')], // Moving this will complete the suit (A goes on 2)
        almostComplete,
      ])
      const state = createGameState(game)
      const action: GameAction = {
        type: 'MOVE_CARDS',
        payload: { fromColumnId: 'col-0', cardIndex: 0, toColumnId: 'col-1' },
      }

      const result = gameReducer(state, action)

      expect(result.game.foundationsCompleted).toBe(1)
      expect(result.game.columns[1].cards).toHaveLength(0)
    })

    it('sets isWon when 8 foundations completed', () => {
      // Start with 7 foundations, completing one more wins
      // Moving Ace completes K-Q-J-10-9-8-7-6-5-4-3-2 + A
      const almostComplete = createCompleteSuitSequence('spades').slice(0, 12) // K through 2
      const game = createGameWithColumns([
        [createFaceUpCard('spades', 'A')],
        almostComplete,
      ])
      game.foundationsCompleted = 7
      const state = createGameState(game)
      const action: GameAction = {
        type: 'MOVE_CARDS',
        payload: { fromColumnId: 'col-0', cardIndex: 0, toColumnId: 'col-1' },
      }

      const result = gameReducer(state, action)

      expect(result.game.foundationsCompleted).toBe(8)
      expect(result.isWon).toBe(true)
    })
  })

  describe('invalid moves return unchanged state', () => {
    it('returns same state for invalid column', () => {
      const game = createGameWithColumns([
        [createFaceUpCard('spades', '5')],
      ])
      const state = createGameState(game)
      const action: GameAction = {
        type: 'MOVE_CARDS',
        payload: { fromColumnId: 'invalid', cardIndex: 0, toColumnId: 'col-0' },
      }

      const result = gameReducer(state, action)

      expect(result).toBe(state)
    })

    it('returns same state for invalid sequence', () => {
      const game = createGameWithColumns([
        [createFaceUpCard('spades', '5'), createFaceUpCard('hearts', '4')], // Mixed suit
        [],
      ])
      const state = createGameState(game)
      const action: GameAction = {
        type: 'MOVE_CARDS',
        payload: { fromColumnId: 'col-0', cardIndex: 0, toColumnId: 'col-1' },
      }

      const result = gameReducer(state, action)

      expect(result).toBe(state)
    })

    it('returns same state for invalid move destination', () => {
      const game = createGameWithColumns([
        [createFaceUpCard('spades', '5')],
        [createFaceUpCard('hearts', '3')], // Wrong rank
      ])
      const state = createGameState(game)
      const action: GameAction = {
        type: 'MOVE_CARDS',
        payload: { fromColumnId: 'col-0', cardIndex: 0, toColumnId: 'col-1' },
      }

      const result = gameReducer(state, action)

      expect(result).toBe(state)
    })
  })
})

// =============================================================================
// DEAL
// =============================================================================

describe('DEAL action', () => {
  function createStateReadyToDeal(): GameState {
    const columns = Array.from({ length: 10 }, (_, i) =>
      createColumn([createFaceUpCard('spades', 'K')], `col-${i}`)
    )
    const stock = Array.from({ length: 10 }, () =>
      createFaceDownCard('hearts', '5')
    )
    const game = createGame({ columns, stock, dealsRemaining: 3 })
    return createGameState(game)
  }

  describe('valid deal', () => {
    it('deals cards to all columns', () => {
      const state = createStateReadyToDeal()
      const action: GameAction = { type: 'DEAL' }

      const result = gameReducer(state, action)

      result.game.columns.forEach(col => {
        expect(col.cards).toHaveLength(2)
      })
    })

    it('decrements dealsRemaining', () => {
      const state = createStateReadyToDeal()
      const action: GameAction = { type: 'DEAL' }

      const result = gameReducer(state, action)

      expect(result.game.dealsRemaining).toBe(2)
    })

    it('removes cards from stock', () => {
      const state = createStateReadyToDeal()
      const action: GameAction = { type: 'DEAL' }

      const result = gameReducer(state, action)

      expect(result.game.stock).toHaveLength(0)
    })

    it('pushes to history', () => {
      const state = createStateReadyToDeal()
      const action: GameAction = { type: 'DEAL' }

      const result = gameReducer(state, action)

      expect(result.history).toHaveLength(1)
    })

    it('auto-detects completed suits after deal', () => {
      // Set up so dealing completes a suit
      // Dealing adds card to END, so we need K-Q-J-...-2 and deal an A
      const almostComplete = createCompleteSuitSequence('spades').slice(0, 12) // K through 2, missing A
      const columns = [
        createColumn(almostComplete, 'col-0'),
        ...Array.from({ length: 9 }, (_, i) =>
          createColumn([createFaceUpCard('hearts', '2')], `col-${i + 1}`)
        ),
      ]
      const stock = [
        createFaceDownCard('spades', 'A'), // This will complete the suit when dealt to col-0
        ...Array.from({ length: 9 }, () => createFaceDownCard('hearts', '3')),
      ]
      const game = createGame({ columns, stock, dealsRemaining: 1 })
      const state = createGameState(game)
      const action: GameAction = { type: 'DEAL' }

      const result = gameReducer(state, action)

      expect(result.game.foundationsCompleted).toBe(1)
    })
  })

  describe('invalid deal returns unchanged state', () => {
    it('returns same state when column is empty', () => {
      const columns = [
        createColumn([], 'col-0'), // Empty!
        ...Array.from({ length: 9 }, (_, i) =>
          createColumn([createFaceUpCard('spades', 'K')], `col-${i + 1}`)
        ),
      ]
      const stock = Array.from({ length: 10 }, () =>
        createFaceDownCard('hearts', '5')
      )
      const game = createGame({ columns, stock, dealsRemaining: 1 })
      const state = createGameState(game)
      const action: GameAction = { type: 'DEAL' }

      const result = gameReducer(state, action)

      expect(result).toBe(state)
    })

    it('returns same state when dealsRemaining is 0', () => {
      const state = createStateReadyToDeal()
      state.game.dealsRemaining = 0
      const action: GameAction = { type: 'DEAL' }

      const result = gameReducer(state, action)

      expect(result).toBe(state)
    })

    it('returns same state when stock has fewer than 10 cards', () => {
      const state = createStateReadyToDeal()
      state.game.stock = state.game.stock.slice(0, 5)
      const action: GameAction = { type: 'DEAL' }

      const result = gameReducer(state, action)

      expect(result).toBe(state)
    })
  })
})

// =============================================================================
// UNDO
// =============================================================================

describe('UNDO action', () => {
  it('restores previous game state', () => {
    const previousGame = createGameWithColumns([
      [createFaceUpCard('spades', '5')],
    ])
    const currentGame = createGameWithColumns([
      [createFaceUpCard('hearts', 'K')],
    ])
    const state = createGameState(currentGame, { history: [previousGame] })
    const action: GameAction = { type: 'UNDO' }

    const result = gameReducer(state, action)

    expect(result.game).toEqual(previousGame)
  })

  it('removes undone state from history', () => {
    const game1 = createGameWithColumns([[createFaceUpCard('spades', 'A')]])
    const game2 = createGameWithColumns([[createFaceUpCard('hearts', 'A')]])
    const currentGame = createGameWithColumns([[createFaceUpCard('clubs', 'A')]])
    const state = createGameState(currentGame, { history: [game1, game2] })
    const action: GameAction = { type: 'UNDO' }

    const result = gameReducer(state, action)

    expect(result.history).toHaveLength(1)
    expect(result.game).toEqual(game2)
  })

  it('sets isWon to false', () => {
    const previousGame = createGameWithColumns([])
    const state = createGameState(previousGame, {
      history: [previousGame],
      isWon: true,
    })
    const action: GameAction = { type: 'UNDO' }

    const result = gameReducer(state, action)

    expect(result.isWon).toBe(false)
  })

  it('returns same state when history is empty', () => {
    const game = createGameWithColumns([[createFaceUpCard('spades', '5')]])
    const state = createGameState(game, { history: [] })
    const action: GameAction = { type: 'UNDO' }

    const result = gameReducer(state, action)

    expect(result).toBe(state)
  })
})

// =============================================================================
// FLIP_CARD
// =============================================================================

describe('FLIP_CARD action', () => {
  it('flips face-down card', () => {
    const game = createGameWithColumns([
      [createFaceDownCard('spades', '5')],
    ])
    const state = createGameState(game)
    const action: GameAction = {
      type: 'FLIP_CARD',
      payload: { columnId: 'col-0' },
    }

    const result = gameReducer(state, action)

    expect(result.game.columns[0].cards[0].faceUp).toBe(true)
  })

  it('returns same state if card already face-up', () => {
    const game = createGameWithColumns([
      [createFaceUpCard('spades', '5')],
    ])
    const state = createGameState(game)
    const action: GameAction = {
      type: 'FLIP_CARD',
      payload: { columnId: 'col-0' },
    }

    const result = gameReducer(state, action)

    expect(result).toBe(state)
  })

  it('does not add to history', () => {
    const game = createGameWithColumns([
      [createFaceDownCard('spades', '5')],
    ])
    const state = createGameState(game, { history: [] })
    const action: GameAction = {
      type: 'FLIP_CARD',
      payload: { columnId: 'col-0' },
    }

    const result = gameReducer(state, action)

    expect(result.history).toHaveLength(0)
  })
})

// =============================================================================
// COMPLETE_SUIT
// =============================================================================

describe('COMPLETE_SUIT action', () => {
  it('removes completed suit and increments foundations', () => {
    const game = createGameWithColumns([
      createCompleteSuitSequence('spades'),
    ])
    const state = createGameState(game)
    const action: GameAction = {
      type: 'COMPLETE_SUIT',
      payload: { columnId: 'col-0', suit: 'spades' },
    }

    const result = gameReducer(state, action)

    expect(result.game.foundationsCompleted).toBe(1)
    expect(result.game.columns[0].cards).toHaveLength(0)
  })

  it('pushes to history', () => {
    const game = createGameWithColumns([
      createCompleteSuitSequence('spades'),
    ])
    const state = createGameState(game)
    const action: GameAction = {
      type: 'COMPLETE_SUIT',
      payload: { columnId: 'col-0', suit: 'spades' },
    }

    const result = gameReducer(state, action)

    expect(result.history).toHaveLength(1)
  })

  it('flips newly exposed card', () => {
    const game = createGameWithColumns([
      [createFaceDownCard('hearts', 'Q'), ...createCompleteSuitSequence('spades')],
    ])
    const state = createGameState(game)
    const action: GameAction = {
      type: 'COMPLETE_SUIT',
      payload: { columnId: 'col-0', suit: 'spades' },
    }

    const result = gameReducer(state, action)

    expect(result.game.columns[0].cards[0].faceUp).toBe(true)
  })

  it('sets isWon when 8 foundations completed', () => {
    const game = createGameWithColumns([
      createCompleteSuitSequence('spades'),
    ])
    game.foundationsCompleted = 7
    const state = createGameState(game)
    const action: GameAction = {
      type: 'COMPLETE_SUIT',
      payload: { columnId: 'col-0', suit: 'spades' },
    }

    const result = gameReducer(state, action)

    expect(result.isWon).toBe(true)
  })

  it('returns same state if no completed suit', () => {
    const game = createGameWithColumns([
      [createFaceUpCard('spades', 'K')],
    ])
    const state = createGameState(game)
    const action: GameAction = {
      type: 'COMPLETE_SUIT',
      payload: { columnId: 'col-0', suit: 'spades' },
    }

    const result = gameReducer(state, action)

    expect(result).toBe(state)
  })
})

// =============================================================================
// Initial State
// =============================================================================

describe('initialGameState', () => {
  it('has default difficulty of 4', () => {
    expect(initialGameState.game.difficulty).toBe(4)
  })

  it('has empty columns and stock', () => {
    expect(initialGameState.game.columns).toEqual([])
    expect(initialGameState.game.stock).toEqual([])
  })

  it('has gameStarted as false', () => {
    expect(initialGameState.gameStarted).toBe(false)
  })

  it('has empty history', () => {
    expect(initialGameState.history).toEqual([])
  })

  it('has isWon as false', () => {
    expect(initialGameState.isWon).toBe(false)
  })
})
