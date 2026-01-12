import { useState } from 'react'
import type { GameBoardProps } from '../../game/types'
import { Column } from './Column'
import { StockPile } from './StockPile'
import { FoundationArea } from './FoundationArea'

interface DragState {
  fromColumnId: string
  cardIndex: number
}

export function GameBoard({
  game,
  preferences,
  onMoveCards,
  onDeal,
}: GameBoardProps) {
  const [dragState, setDragState] = useState<DragState | null>(null)

  // Check if any column is empty (deal is disabled if so)
  const hasEmptyColumn = game.columns.some((col) => col.cards.length === 0)
  const canDeal = game.dealsRemaining > 0 && !hasEmptyColumn

  const handleCardDragStart = (columnId: string, cardIndex: number) => {
    setDragState({ fromColumnId: columnId, cardIndex })
  }

  const handleCardDragEnd = () => {
    setDragState(null)
  }

  const handleDrop = (toColumnId: string) => {
    if (dragState && dragState.fromColumnId !== toColumnId) {
      onMoveCards?.(dragState.fromColumnId, dragState.cardIndex, toColumnId)
    }
    setDragState(null)
  }

  return (
    <div className="h-full w-full bg-emerald-900 p-2 sm:p-4 md:p-6 flex flex-col">
      {/* Status bar with stock and foundations */}
      <div className="flex items-start justify-between mb-4 sm:mb-6">
        <StockPile
          dealsRemaining={game.dealsRemaining}
          canDeal={canDeal}
          onDeal={onDeal}
        />

        <FoundationArea
          foundationsCompleted={game.foundationsCompleted}
          showCelebration={preferences.showCelebration}
        />
      </div>

      {/* Tableau - 10 columns */}
      <div className="flex-1 flex gap-1 sm:gap-2 md:gap-3 min-h-0">
        {game.columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            isValidTarget={dragState !== null && dragState.fromColumnId !== column.id}
            showValidDropTargets={preferences.showValidDropTargets}
            onCardDragStart={handleCardDragStart}
            onCardDragEnd={handleCardDragEnd}
            onDrop={handleDrop}
          />
        ))}
      </div>

      {/* Deal disabled hint */}
      {hasEmptyColumn && game.dealsRemaining > 0 && (
        <div className="mt-2 text-center text-amber-400/80 text-xs sm:text-sm">
          Fill all empty columns before dealing
        </div>
      )}
    </div>
  )
}
