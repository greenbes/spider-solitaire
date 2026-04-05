import { useState, useRef, useCallback } from 'react'
import type { GameBoardProps, Column as ColumnType } from '../../game/types'
import { Column } from './Column'
import { StockPile } from './StockPile'
import { FoundationArea } from './FoundationArea'
import { isValidMove, canMoveSameSequence } from '../../game/moves'
import { getThemeStyles } from '../../game/themes'
import { useGameBoardKeyboardNavigation } from '../../hooks/useGameBoardKeyboardNavigation'
import type { KeyboardSelection } from '../../hooks/useGameBoardKeyboardNavigation'

interface DragState {
  fromColumnId: string
  cardIndex: number
}

interface MoveSource {
  columnId: string
  cardIndex: number
}

export function GameBoard({
  game,
  preferences,
  activeHint,
  onMoveCards,
  onDeal,
}: GameBoardProps) {
  const [dragState, setDragState] = useState<DragState | null>(null)
  const boardRef = useRef<HTMLDivElement>(null)
  const themeStyles = getThemeStyles(preferences.theme)

  const { kbFocus, kbSelected, handleKeyDown } = useGameBoardKeyboardNavigation({
    game,
    onMoveCards: onMoveCards,
  })

  // Check if any column is empty (deal is disabled if so)
  const hasEmptyColumn = game.columns.some((col) => col.cards.length === 0)
  const canDeal = game.dealsRemaining > 0 && !hasEmptyColumn

  const handleCardDragStart = (columnId: string, cardIndex: number) => {
    setDragState({ fromColumnId: columnId, cardIndex })
  }

  const handleCardDragEnd = () => {
    setDragState(null)
  }

  const isValidTargetForSource = useCallback(
    (source: MoveSource, targetColumnId: string): boolean => {
      const fromCol = game.columns.find((c) => c.id === source.columnId)
      const targetCol = game.columns.find((c) => c.id === targetColumnId)
      if (!fromCol || !targetCol) return false
      if (fromCol.id === targetCol.id) return false
      if (!canMoveSameSequence(fromCol, source.cardIndex)) return false

      const movingCard = fromCol.cards[source.cardIndex]
      return isValidMove(movingCard, targetCol)
    },
    [game.columns]
  )

  const handleDrop = (toColumnId: string) => {
    if (dragState) {
      const source: MoveSource = {
        columnId: dragState.fromColumnId,
        cardIndex: dragState.cardIndex,
      }
      if (isValidTargetForSource(source, toColumnId)) {
        onMoveCards?.(source.columnId, source.cardIndex, toColumnId)
      }
    }
    setDragState(null)
  }

  // Check if dropping on a specific column would be a valid move
  const isColumnValidTarget = (targetColumn: ColumnType): boolean => {
    const source: MoveSource | null = dragState
      ? { columnId: dragState.fromColumnId, cardIndex: dragState.cardIndex }
      : kbSelected
        ? {
            columnId: game.columns[kbSelected.columnIndex].id,
            cardIndex: kbSelected.cardIndex,
          }
        : null
    if (!source) return false

    return isValidTargetForSource(source, targetColumn.id)
  }

  return (
    <div
      ref={boardRef}
      className={`h-full w-full ${themeStyles.background} p-2 sm:p-4 md:p-6 flex flex-col outline-none`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Spider Solitaire game board. Use arrow keys to navigate cards, Enter to pick up or place, Escape to cancel."
    >
      {/* Status bar with stock and foundations */}
      <div className="flex items-start justify-between mb-4 sm:mb-6">
        <StockPile
          dealsRemaining={game.dealsRemaining}
          canDeal={canDeal}
          onDeal={onDeal}
          theme={preferences.theme}
        />

        <FoundationArea
          foundationsCompleted={game.foundationsCompleted}
          showCelebration={preferences.showCelebration}
          theme={preferences.theme}
        />
      </div>

      {/* Tableau - 10 columns */}
      <div className="flex-1 flex gap-1 sm:gap-2 md:gap-3 min-h-0">
        {game.columns.map((column, columnIndex) => {
          const isHintSource = activeHint?.fromColumnId === column.id
          const isHintTarget = activeHint?.toColumnId === column.id
          const hintCardIndex = isHintSource ? activeHint?.cardIndex : undefined

          const isKbFocused = kbFocus?.columnIndex === columnIndex
          const kbFocusedCardIndex = isKbFocused ? kbFocus.cardIndex : undefined
          const isKbSelectedColumn = kbSelected?.columnIndex === columnIndex
          const kbSelectedCardIndex = isKbSelectedColumn ? kbSelected.cardIndex : undefined

          return (
            <Column
              key={column.id}
              column={column}
              isValidTarget={isColumnValidTarget(column)}
              showValidDropTargets={preferences.showValidDropTargets}
              cardArt={preferences.cardArt}
              cardSize={preferences.cardSize}
              isHintSource={isHintSource}
              isHintTarget={isHintTarget}
              hintCardIndex={hintCardIndex}
              kbFocusedCardIndex={kbFocusedCardIndex}
              kbSelectedCardIndex={kbSelectedCardIndex}
              onCardDragStart={handleCardDragStart}
              onCardDragEnd={handleCardDragEnd}
              onDrop={handleDrop}
            />
          )
        })}
      </div>

      {/* Deal disabled hint */}
      {hasEmptyColumn && game.dealsRemaining > 0 && (
        <div className="mt-2 text-center text-amber-400/80 text-xs sm:text-sm">
          Fill all empty columns before dealing
        </div>
      )}

      {/* Keyboard hint bar */}
      {kbSelected && (
        <div className="mt-2 text-center text-amber-300 text-xs sm:text-sm" role="status">
          Card selected — arrow keys to navigate, Enter to place, Escape to cancel
        </div>
      )}
    </div>
  )
}
