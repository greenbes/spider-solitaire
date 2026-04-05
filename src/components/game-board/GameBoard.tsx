import { useState, useRef, useCallback, useEffect } from 'react'
import type { GameBoardProps, Column as ColumnType } from '../../game/types'
import { Column } from './Column'
import { StockPile } from './StockPile'
import { FoundationArea } from './FoundationArea'
import { isValidMove, canMoveSameSequence } from '../../game/moves'
import { getThemeStyles } from '../../game/themes'

interface DragState {
  fromColumnId: string
  cardIndex: number
}

interface MoveSource {
  columnId: string
  cardIndex: number
}

interface KeyboardSelection {
  columnIndex: number
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
  const [kbFocus, setKbFocus] = useState<KeyboardSelection | null>(null)
  const [kbSelected, setKbSelected] = useState<KeyboardSelection | null>(null)
  const boardRef = useRef<HTMLDivElement>(null)
  const themeStyles = getThemeStyles(preferences.theme)

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

  // Find the deepest movable card index in a column (start of movable sequence)
  const findMovableStart = useCallback((column: ColumnType): number => {
    // Returns the smallest index such that the sequence from that index is movable
    if (column.cards.length === 0) return 0
    let best = column.cards.length - 1
    for (let i = column.cards.length - 1; i >= 0; i--) {
      if (canMoveSameSequence(column, i)) {
        best = i
      } else {
        break
      }
    }
    return best
  }, [])

  const clampFocus = useCallback(
    (columnIndex: number, cardIndex: number): KeyboardSelection => {
      const col = game.columns[columnIndex]
      if (!col || col.cards.length === 0) {
        return { columnIndex, cardIndex: 0 }
      }
      const movableStart = findMovableStart(col)
      return {
        columnIndex,
        cardIndex: Math.max(movableStart, Math.min(cardIndex, col.cards.length - 1)),
      }
    },
    [game.columns, findMovableStart]
  )

  // Keyboard event handler on the board container
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Initialize focus on first key press
      if (!kbFocus) {
        const firstNonEmpty = game.columns.findIndex((c) => c.cards.length > 0)
        if (firstNonEmpty === -1) return
        setKbFocus(clampFocus(firstNonEmpty, game.columns[firstNonEmpty].cards.length - 1))
        e.preventDefault()
        return
      }

      const current = kbFocus
      const currentCol = game.columns[current.columnIndex]

      switch (e.key) {
        case 'ArrowLeft': {
          e.preventDefault()
          for (let offset = 1; offset <= game.columns.length; offset++) {
            const next = (current.columnIndex - offset + game.columns.length) % game.columns.length
            const col = game.columns[next]
            if (col.cards.length > 0 || kbSelected) {
              setKbFocus(clampFocus(next, col.cards.length - 1))
              break
            }
          }
          break
        }
        case 'ArrowRight': {
          e.preventDefault()
          for (let offset = 1; offset <= game.columns.length; offset++) {
            const next = (current.columnIndex + offset) % game.columns.length
            const col = game.columns[next]
            if (col.cards.length > 0 || kbSelected) {
              setKbFocus(clampFocus(next, col.cards.length - 1))
              break
            }
          }
          break
        }
        case 'ArrowUp': {
          e.preventDefault()
          if (!currentCol || currentCol.cards.length === 0) break
          const movableStart = findMovableStart(currentCol)
          if (current.cardIndex > movableStart) {
            setKbFocus({ ...current, cardIndex: current.cardIndex - 1 })
          }
          break
        }
        case 'ArrowDown': {
          e.preventDefault()
          if (!currentCol || currentCol.cards.length === 0) break
          if (current.cardIndex < currentCol.cards.length - 1) {
            setKbFocus({ ...current, cardIndex: current.cardIndex + 1 })
          }
          break
        }
        case 'Enter':
        case ' ': {
          e.preventDefault()
          if (!kbSelected) {
            // Pick up: only if focused card is part of a movable sequence
            if (!currentCol || currentCol.cards.length === 0) break
            if (!canMoveSameSequence(currentCol, current.cardIndex)) break
            setKbSelected(current)
          } else {
            // Drop
            const fromCol = game.columns[kbSelected.columnIndex]
            const toCol = game.columns[current.columnIndex]
            if (fromCol.id === toCol.id) {
              // Deselect
              setKbSelected(null)
              break
            }
            const movingCard = fromCol.cards[kbSelected.cardIndex]
            if (isValidMove(movingCard, toCol)) {
              onMoveCards?.(fromCol.id, kbSelected.cardIndex, toCol.id)
            }
            setKbSelected(null)
          }
          break
        }
        case 'Escape': {
          if (kbSelected) {
            e.preventDefault()
            setKbSelected(null)
          }
          break
        }
      }
    },
    [kbFocus, kbSelected, game.columns, clampFocus, findMovableStart, onMoveCards]
  )

  // After a successful move, re-clamp keyboard focus to a valid position
  useEffect(() => {
    if (!kbFocus) return
    const col = game.columns[kbFocus.columnIndex]
    if (!col || col.cards.length === 0) {
      // Find next non-empty column
      const next = game.columns.findIndex((c) => c.cards.length > 0)
      if (next >= 0) {
        setKbFocus(clampFocus(next, game.columns[next].cards.length - 1))
      } else {
        setKbFocus(null)
      }
      return
    }
    if (kbFocus.cardIndex >= col.cards.length) {
      setKbFocus(clampFocus(kbFocus.columnIndex, col.cards.length - 1))
    }
  }, [game.columns, kbFocus, clampFocus])

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
