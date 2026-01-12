import { useReducer, useCallback, useState, useEffect } from 'react'
import { AppShell } from './components/shell'
import { GameBoard } from './components/game-board'
import { gameReducer, initialGameState } from './game'
import { usePreferences } from './hooks/usePreferences'
import type { Difficulty, Suit, GameBoardPreferences } from './game/types'

function App() {
  const [state, dispatch] = useReducer(gameReducer, initialGameState)
  const { preferences, updatePreferences } = usePreferences()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isNewGameOpen, setIsNewGameOpen] = useState(false)

  // Open new game modal on first load if no game started
  useEffect(() => {
    if (!state.gameStarted) {
      setIsNewGameOpen(true)
    }
  }, [state.gameStarted])

  const handleNewGame = useCallback((difficulty: Difficulty) => {
    dispatch({ type: 'NEW_GAME', payload: { difficulty } })
    setIsNewGameOpen(false)
  }, [])

  const handleMoveCards = useCallback(
    (fromColumnId: string, cardIndex: number, toColumnId: string) => {
      dispatch({
        type: 'MOVE_CARDS',
        payload: { fromColumnId, cardIndex, toColumnId },
      })
    },
    []
  )

  const handleDeal = useCallback(() => {
    dispatch({ type: 'DEAL' })
  }, [])

  const handleUndo = useCallback(() => {
    dispatch({ type: 'UNDO' })
  }, [])

  const handleSuitCompleted = useCallback((_suit: Suit) => {
    // The reducer handles auto-completion in MOVE_CARDS
    // This callback is here for future use (e.g., celebrations)
  }, [])

  const handleCardFlip = useCallback((columnId: string) => {
    dispatch({ type: 'FLIP_CARD', payload: { columnId } })
  }, [])

  const hasEmptyColumn = state.game.columns.some((c) => c.cards.length === 0)
  const canDeal = state.game.dealsRemaining > 0 && !hasEmptyColumn
  const canUndo = state.history.length > 0

  const gameBoardPreferences: GameBoardPreferences = {
    showValidDropTargets: false,
    autoMoveCompletedSuits: true,
    showCelebration: true,
  }

  return (
    <AppShell
      stats={{
        moves: state.game.moves,
        suitsCompleted: state.game.foundationsCompleted,
      }}
      preferences={preferences}
      canUndo={canUndo}
      canDeal={canDeal}
      isSettingsOpen={isSettingsOpen}
      isNewGameOpen={isNewGameOpen}
      onNewGame={handleNewGame}
      onUndo={handleUndo}
      onDeal={handleDeal}
      onOpenSettings={() => setIsSettingsOpen(true)}
      onCloseSettings={() => setIsSettingsOpen(false)}
      onOpenNewGame={() => setIsNewGameOpen(true)}
      onCloseNewGame={() => setIsNewGameOpen(false)}
      onPreferencesChange={updatePreferences}
    >
      {state.gameStarted ? (
        <GameBoard
          game={state.game}
          preferences={gameBoardPreferences}
          onMoveCards={handleMoveCards}
          onDeal={handleDeal}
          onSuitCompleted={handleSuitCompleted}
          onCardFlip={handleCardFlip}
        />
      ) : (
        <div className="h-full w-full bg-emerald-900 flex items-center justify-center">
          <p className="text-emerald-300 text-lg">Select difficulty to start</p>
        </div>
      )}

      {/* Win Modal */}
      {state.isWon && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setIsNewGameOpen(true)}
        >
          <div
            className="bg-stone-800 rounded-xl shadow-2xl w-full max-w-md mx-4 p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Congratulations!
            </h2>
            <p className="text-stone-300 mb-6">
              You won in {state.game.moves} moves!
            </p>
            <button
              onClick={() => setIsNewGameOpen(true)}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </AppShell>
  )
}

export default App
