import type { Card as CardType, Suit, CardArt } from '../../game/types'

interface CardProps {
  card: CardType
  isDragging?: boolean
  isValidTarget?: boolean
  showHighlight?: boolean
  cardArt?: CardArt
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

// Modern style uses colored backgrounds for suits
const MODERN_BG_COLORS: Record<Suit, string> = {
  spades: 'bg-slate-100',
  hearts: 'bg-rose-50',
  diamonds: 'bg-rose-50',
  clubs: 'bg-slate-100',
}

// Card back component - shared across all styles
function CardBack({ isDragging, cardArt }: { isDragging?: boolean; cardArt: CardArt }) {
  if (cardArt === 'minimal') {
    return (
      <div
        className={`
          w-full aspect-[2.5/3.5] rounded-lg
          bg-emerald-800
          border border-emerald-700
          shadow-md
          ${isDragging ? 'opacity-50' : ''}
        `}
      />
    )
  }

  if (cardArt === 'modern') {
    return (
      <div
        className={`
          w-full aspect-[2.5/3.5] rounded-xl
          bg-gradient-to-br from-emerald-600 to-emerald-800
          border border-emerald-500/50
          shadow-lg
          flex items-center justify-center
          ${isDragging ? 'opacity-50' : ''}
        `}
      >
        <div className="w-[60%] h-[70%] rounded-lg border-2 border-emerald-400/30 flex items-center justify-center">
          <span className="text-emerald-400/40 text-2xl sm:text-3xl md:text-4xl">♠</span>
        </div>
      </div>
    )
  }

  // Classic style (default)
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
      <div className="w-[80%] h-[85%] rounded border border-emerald-500/30 bg-emerald-800/50 flex items-center justify-center">
        <div className="w-[70%] h-[80%] rounded border border-emerald-500/20 bg-emerald-700/30" />
      </div>
    </div>
  )
}

// Classic card style - traditional layout
function ClassicCard({ card, isDragging, isValidTarget, showHighlight }: Omit<CardProps, 'cardArt'>) {
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

// Modern card style - clean, contemporary design
function ModernCard({ card, isDragging, isValidTarget, showHighlight }: Omit<CardProps, 'cardArt'>) {
  const symbol = SUIT_SYMBOLS[card.suit]
  const colorClass = SUIT_COLORS[card.suit]
  const bgClass = MODERN_BG_COLORS[card.suit]

  return (
    <div
      className={`
        w-full aspect-[2.5/3.5] rounded-xl
        ${bgClass}
        border
        ${isValidTarget && showHighlight ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-stone-200'}
        shadow-lg
        flex flex-col
        ${isDragging ? 'opacity-50 scale-105' : ''}
        transition-transform duration-150
        overflow-hidden
      `}
    >
      {/* Top section with rank */}
      <div className={`flex items-center justify-between px-2 pt-1.5 sm:px-3 sm:pt-2 ${colorClass}`}>
        <span className="text-lg sm:text-xl md:text-2xl font-light">{card.rank}</span>
        <span className="text-sm sm:text-base md:text-lg opacity-60">{symbol}</span>
      </div>

      {/* Center - large decorative suit */}
      <div className={`flex-1 flex items-center justify-center ${colorClass}`}>
        <span className="text-4xl sm:text-5xl md:text-6xl opacity-20">{symbol}</span>
      </div>

      {/* Bottom section */}
      <div className={`flex items-center justify-between px-2 pb-1.5 sm:px-3 sm:pb-2 rotate-180 ${colorClass}`}>
        <span className="text-lg sm:text-xl md:text-2xl font-light">{card.rank}</span>
        <span className="text-sm sm:text-base md:text-lg opacity-60">{symbol}</span>
      </div>
    </div>
  )
}

// Minimal card style - stripped down, clean
function MinimalCard({ card, isDragging, isValidTarget, showHighlight }: Omit<CardProps, 'cardArt'>) {
  const symbol = SUIT_SYMBOLS[card.suit]
  const colorClass = SUIT_COLORS[card.suit]

  return (
    <div
      className={`
        w-full aspect-[2.5/3.5] rounded-md
        bg-white
        border
        ${isValidTarget && showHighlight ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-stone-300'}
        shadow-sm
        flex flex-col p-1.5 sm:p-2
        ${isDragging ? 'opacity-50 scale-105' : ''}
        transition-transform duration-150
      `}
    >
      {/* Top left - just rank and small suit */}
      <div className={`flex items-baseline gap-0.5 ${colorClass}`}>
        <span className="text-base sm:text-lg md:text-xl font-semibold">{card.rank}</span>
        <span className="text-xs sm:text-sm">{symbol}</span>
      </div>

      {/* Empty middle - intentionally minimal */}
      <div className="flex-1" />

      {/* Bottom right (inverted) */}
      <div className={`flex items-baseline gap-0.5 self-end rotate-180 ${colorClass}`}>
        <span className="text-base sm:text-lg md:text-xl font-semibold">{card.rank}</span>
        <span className="text-xs sm:text-sm">{symbol}</span>
      </div>
    </div>
  )
}

export function Card({ card, isDragging, isValidTarget, showHighlight, cardArt = 'classic' }: CardProps) {
  if (!card.faceUp) {
    return <CardBack isDragging={isDragging} cardArt={cardArt} />
  }

  switch (cardArt) {
    case 'modern':
      return <ModernCard card={card} isDragging={isDragging} isValidTarget={isValidTarget} showHighlight={showHighlight} />
    case 'minimal':
      return <MinimalCard card={card} isDragging={isDragging} isValidTarget={isValidTarget} showHighlight={showHighlight} />
    case 'classic':
    default:
      return <ClassicCard card={card} isDragging={isDragging} isValidTarget={isValidTarget} showHighlight={showHighlight} />
  }
}
