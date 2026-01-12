import type { Column as ColumnType } from '../../game/types'
import { Card } from './Card'

interface ColumnProps {
  column: ColumnType
  isValidTarget?: boolean
  showValidDropTargets?: boolean
  onCardDragStart?: (columnId: string, cardIndex: number) => void
  onCardDragEnd?: () => void
  onDrop?: (columnId: string) => void
}

export function Column({
  column,
  isValidTarget,
  showValidDropTargets,
  onCardDragStart,
  onCardDragEnd,
  onDrop,
}: ColumnProps) {
  const isEmpty = column.cards.length === 0

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    onDrop?.(column.id)
  }

  return (
    <div
      className={`
        relative flex-1 min-w-0
        ${isEmpty ? 'min-h-[100px] sm:min-h-[120px] md:min-h-[140px]' : ''}
      `}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Empty column placeholder */}
      {isEmpty && (
        <div
          className={`
            absolute inset-0 rounded-lg
            border-2 border-dashed
            ${isValidTarget && showValidDropTargets
              ? 'border-amber-400 bg-amber-400/10'
              : 'border-emerald-600/40 bg-emerald-800/20'
            }
            flex items-center justify-center
            transition-colors duration-200
          `}
        >
          <span className="text-emerald-500/50 text-xs sm:text-sm">Empty</span>
        </div>
      )}

      {/* Cards stack */}
      {column.cards.map((card, index) => {
        const isTopCard = index === column.cards.length - 1
        const canDrag = card.faceUp

        // Calculate overlap - face-down cards overlap more
        const offsetTop = card.faceUp
          ? index * 28 // Face-up cards show more
          : index * 12 // Face-down cards overlap more

        return (
          <div
            key={`${column.id}-${index}`}
            className="absolute left-0 right-0"
            style={{ top: `${offsetTop}px` }}
            draggable={canDrag}
            onDragStart={() => canDrag && onCardDragStart?.(column.id, index)}
            onDragEnd={onCardDragEnd}
          >
            <Card
              card={card}
              isValidTarget={isTopCard && isValidTarget}
              showHighlight={showValidDropTargets}
            />
          </div>
        )
      })}
    </div>
  )
}
