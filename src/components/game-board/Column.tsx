import { useEffect, useRef } from 'react'
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
  /** Index of card currently focused via keyboard navigation (if any) */
  kbFocusedCardIndex?: number
  /** Index of card currently selected (picked up) via keyboard (if any) */
  kbSelectedCardIndex?: number
  onCardDragStart?: (columnId: string, cardIndex: number) => void
  onCardDragEnd?: () => void
  onDrop?: (columnId: string) => void
}

function cardLabel(suit: string, rank: string): string {
  return `${rank} of ${suit}`
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
  kbFocusedCardIndex,
  kbSelectedCardIndex,
  onCardDragStart,
  onCardDragEnd,
  onDrop,
}: ColumnProps) {
  const isEmpty = column.cards.length === 0
  const focusedRef = useRef<HTMLDivElement>(null)

  // Move browser focus to match keyboard focus position
  useEffect(() => {
    if (kbFocusedCardIndex !== undefined && focusedRef.current) {
      focusedRef.current.focus({ preventScroll: true })
    }
  }, [kbFocusedCardIndex])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    onDrop?.(column.id)
  }

  const emptyLabel = isHintTarget
    ? 'Empty column, suggested move target'
    : isValidTarget
      ? 'Empty column, valid drop target'
      : 'Empty column'

  return (
    <div
      className={`
        relative flex-1 min-w-0
        ${isEmpty ? 'min-h-[100px] sm:min-h-[120px] md:min-h-[140px]' : ''}
      `}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      role="group"
      aria-label={`Column ${column.id}`}
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
          role="region"
          aria-label={emptyLabel}
          aria-dropeffect={isValidTarget ? 'move' : 'none'}
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

        const isKbFocused = kbFocusedCardIndex === index
        const isKbSelected =
          kbSelectedCardIndex !== undefined && index >= kbSelectedCardIndex
        // Roving tabindex: when the parent manages focus (kbFocusedCardIndex is
        // defined on any card in this column, handled via kbManaged), only the
        // focused card is tab-reachable. Otherwise fall back to tabindex=0 for
        // all draggable cards (simple navigation).
        const kbManaged = kbFocusedCardIndex !== undefined
        const tabIndex = !canDrag ? -1 : kbManaged ? (isKbFocused ? 0 : -1) : 0

        const label = card.faceUp
          ? `${cardLabel(card.suit, card.rank)}${canDrag ? ', draggable' : ''}${isKbSelected ? ', selected' : ''}`
          : 'Face-down card'

        return (
          <div
            key={`${column.id}-${index}`}
            ref={isKbFocused ? focusedRef : undefined}
            className={`absolute left-0 right-0 ${isKbFocused ? 'ring-4 ring-blue-400 rounded-lg z-10' : ''} ${isKbSelected ? 'ring-2 ring-amber-400 rounded-lg' : ''}`}
            style={{ top: `${offsetTop}px` }}
            draggable={canDrag}
            onDragStart={() => canDrag && onCardDragStart?.(column.id, index)}
            onDragEnd={onCardDragEnd}
            role={canDrag ? 'button' : 'img'}
            tabIndex={tabIndex}
            aria-label={label}
            aria-grabbed={canDrag ? isKbSelected : undefined}
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
