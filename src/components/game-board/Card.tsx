import type { Card as CardType, Suit } from '../../game/types'

interface CardProps {
  card: CardType
  isDragging?: boolean
  isValidTarget?: boolean
  showHighlight?: boolean
}

const SUIT_SYMBOLS: Record<Suit, string> = {
  spades: '♠',
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
}

const SUIT_COLORS: Record<Suit, string> = {
  spades: 'text-stone-900 dark:text-stone-100',
  hearts: 'text-red-600 dark:text-red-500',
  diamonds: 'text-red-600 dark:text-red-500',
  clubs: 'text-stone-900 dark:text-stone-100',
}

export function Card({ card, isDragging, isValidTarget, showHighlight }: CardProps) {
  if (!card.faceUp) {
    return (
      <div
        className={`
          w-full aspect-[2.5/3.5] rounded-lg
          bg-gradient-to-br from-emerald-700 to-emerald-900
          border-2 border-emerald-600
          shadow-md
          flex items-center justify-center
          ${isDragging ? 'opacity-50' : ''}
        `}
      >
        {/* Card back pattern */}
        <div className="w-[80%] h-[85%] rounded border border-emerald-500/30 bg-emerald-800/50 flex items-center justify-center">
          <div className="w-[70%] h-[80%] rounded border border-emerald-500/20 bg-emerald-700/30" />
        </div>
      </div>
    )
  }

  const symbol = SUIT_SYMBOLS[card.suit]
  const colorClass = SUIT_COLORS[card.suit]

  return (
    <div
      className={`
        w-full aspect-[2.5/3.5] rounded-lg
        bg-white dark:bg-stone-100
        border-2
        ${isValidTarget && showHighlight ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-stone-300 dark:border-stone-400'}
        shadow-md
        flex flex-col justify-between p-1.5 sm:p-2
        ${isDragging ? 'opacity-50 scale-105' : ''}
        transition-transform duration-150
      `}
    >
      {/* Top left rank and suit */}
      <div className={`flex flex-col items-start leading-none ${colorClass}`}>
        <span className="text-sm sm:text-base md:text-lg font-bold">{card.rank}</span>
        <span className="text-base sm:text-lg md:text-xl -mt-1">{symbol}</span>
      </div>

      {/* Center suit (large) */}
      <div className={`flex-1 flex items-center justify-center ${colorClass}`}>
        <span className="text-3xl sm:text-4xl md:text-5xl">{symbol}</span>
      </div>

      {/* Bottom right rank and suit (inverted) */}
      <div className={`flex flex-col items-end leading-none rotate-180 ${colorClass}`}>
        <span className="text-sm sm:text-base md:text-lg font-bold">{card.rank}</span>
        <span className="text-base sm:text-lg md:text-xl -mt-1">{symbol}</span>
      </div>
    </div>
  )
}
