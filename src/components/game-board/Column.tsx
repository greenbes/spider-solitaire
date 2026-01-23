import type { Column as ColumnType, CardArt, CardSize } from '../../game/types'
import { Card } from './Card'

interface ColumnProps {
  column: ColumnType
  isValidTarget?: boolean
  showValidDropTargets?: boolean
  cardArt?: CardArt
  cardSize?: CardSize
  isHintSource?: boolean
  isHintTarget?: boolean
  hintCardIndex?: number
  onCardDragStart?: (columnId: string, cardIndex: number) => void
  onCardDragEnd?: () => void
  onDrop?: (columnId: string) => void
}

export function Column({
  column,
  isValidTarget,
  showValidDropTargets,
  cardArt = 'classic',
  cardSize = 'large',
  isHintSource,
  isHintTarget,
  hintCardIndex,
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
            empty-slot
            absolute inset-0 rounded-lg
            border-2 border-dashed
            ${isHintTarget
              ? 'border-amber-400 bg-amber-400/20 animate-pulse'
              : isValidTarget && showValidDropTargets
                ? 'border-amber-400 bg-amber-400/10'
                : 'border-emerald-600/40 bg-emerald-800/20'
            }
            flex items-center justify-center
            transition-colors duration-200
          `}
        >
          <span className={`text-xs sm:text-sm ${isHintTarget ? 'text-amber-400' : 'text-emerald-500/50'}`}>
            {isHintTarget ? 'Move here' : 'Empty'}
          </span>
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

        // Card is hinted if it's part of the hint source sequence or the target top card
        const isHintedSource = isHintSource && hintCardIndex !== undefined && index >= hintCardIndex
        const isHintedTarget = isHintTarget && isTopCard
        const isHinted = isHintedSource || isHintedTarget

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
              isHinted={isHinted}
              cardArt={cardArt}
              cardSize={cardSize}
            />
          </div>
        )
      })}
    </div>
  )
}
