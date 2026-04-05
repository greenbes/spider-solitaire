import { useReducer, useCallback, useMemo, useState, useEffect } from 'react'
import { AppShell } from './components/shell'
import { GameBoard } from './components/game-board'
import { gameReducer, initialGameState, getHint, hasValidMoves } from './game'
import { HINT_TOTAL_DURATION_MS } from './game/constants'
import { usePreferences } from './hooks/usePreferences'
import { useGamePersistence, loadPersistedGameState } from './hooks/useGamePersistence'
import { useModalA11y } from './hooks/useModalA11y'
import { EndGameModal } from './components/shell/EndGameModal'
import { getThemeStyles } from './game/themes'

function App() {
  const [state, dispatch] = useReducer(
    gameReducer,
    initialGameState,
    (initial) => loadPersistedGameState() ?? initial
  )
  useGamePersistence(state)
  const { preferences, updatePreferences } = usePreferences()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isNewGameOpen, setIsNewGameOpen] = useState(false)
  const [activeHint, setActiveHint] = useState<Hint | null>(null)

  // Open new game modal on first load if no game started
  useEffect(() => {
    if (!state.gameStarted) {
      setIsNewGameOpen(true)
    }
  }, [state.gameStarted])

  // Auto-dismiss hint after HINT_FLASH_COUNT × HINT_PULSE_DURATION_MS
  useEffect(() => {
    if (!activeHint) return

    const timeout = setTimeout(() => {
      setActiveHint(null)
    }, HINT_TOTAL_DURATION_MS)

    return () => clearTimeout(timeout)
  }, [activeHint])

  const handleNewGame = useCallback((difficulty: Difficulty) => {
    dispatch({ type: 'NEW_GAME', payload: { difficulty } })
    setIsNewGameOpen(false)
    setActiveHint(null)
  }, [])

  const handleMoveCards = useCallback(
    (fromColumnId: string, cardIndex: number, toColumnId: string) => {
      dispatch({
        type: 'MOVE_CARDS',
        payload: { fromColumnId, cardIndex, toColumnId },
      })
      setActiveHint(null)
    },
    []
  )

  const handleDeal = useCallback(() => {
    dispatch({ type: 'DEAL' })
    setActiveHint(null)
  }, [])

  const handleUndo = useCallback(() => {
    dispatch({ type: 'UNDO' })
    setActiveHint(null)
    setStuckDismissed(false)
  }, [])

  const cachedHint = useMemo(() => getHint(state.game), [state.game])
  const handleHint = useCallback(() => {
    setActiveHint(cachedHint)
  }, [cachedHint])

  const hasEmptyColumn = state.game.columns.some((c) => c.cards.length === 0)
  const canDeal = state.game.dealsRemaining > 0 && !hasEmptyColumn
  const canUndo = state.history.length > 0

  // Game-over detection: no valid moves and no deals remaining
  const isStuck = useMemo(() => {
    if (!state.gameStarted || state.isWon) return false
    if (canDeal) return false
    return !hasValidMoves(state.game)
  }, [state.gameStarted, state.isWon, state.game, canDeal])

  const [stuckDismissed, setStuckDismissed] = useState(false)
  useEffect(() => {
    // Reset the dismissed flag when the stuck condition clears
    if (!isStuck) setStuckDismissed(false)
  }, [isStuck])

  const themeStyles = getThemeStyles(preferences.theme)

  const gameBoardPreferences: GameBoardPreferences = {
    showValidDropTargets: true,
    autoMoveCompletedSuits: true,
    showCelebration: true,
    cardArt: preferences.cardArt,
    theme: preferences.theme,
    cardSize: preferences.cardSize,
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
      gameInProgress={state.gameStarted}
      onNewGame={handleNewGame}
      onUndo={handleUndo}
      onHint={handleHint}
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
          activeHint={activeHint}
          onMoveCards={handleMoveCards}
          onDeal={handleDeal}
        />
      ) : (
        <div className={`h-full w-full ${themeStyles.background} flex items-center justify-center`}>
          <p className={`${themeStyles.text} text-lg`}>Select difficulty to start</p>
        </div>
      )}

      {/* No-moves Modal */}
      <EndGameModal
        isOpen={isStuck && !stuckDismissed}
        title="No Moves Remaining"
        titleId="stuck-title"
        icon="🛑"
        onClose={() => setStuckDismissed(true)}
        actions={
          <>
            <button
              onClick={() => setStuckDismissed(true)}
              className="flex-1 px-4 py-2.5 bg-stone-700 hover:bg-stone-600 text-white rounded-lg font-medium transition-colors"
            >
              Dismiss
            </button>
            {canUndo && (
              <button
                onClick={handleUndo}
                className="flex-1 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium transition-colors"
              >
                Undo
              </button>
            )}
            <button
              onClick={() => setIsNewGameOpen(true)}
              className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
            >
              New Game
            </button>
          </>
        }
      >
        <p>
          You've run out of valid moves and deals. You can undo to try a
          different path, or start a new game.
        </p>
      </EndGameModal>

      {/* Win Modal */}
      <EndGameModal
        isOpen={state.isWon}
        title="Congratulations!"
        titleId="win-title"
        icon="🎉"
        closeOnEscape={false}
        actions={
          <button
            onClick={() => setIsNewGameOpen(true)}
            className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
          >
            Play Again
          </button>
        }
      >
        <p>You won in {state.game.moves} moves!</p>
      </EndGameModal>
    </AppShell>
  )
}

export default App
