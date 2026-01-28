import type { Card as CardType, Suit, CardArt, CardSize } from '../../game/types'

interface CardProps {
  card: CardType
  isDragging?: boolean
  isValidTarget?: boolean
  showHighlight?: boolean
  isHinted?: boolean
  cardArt?: CardArt
  cardSize?: CardSize
}

// Indicator size classes for corner rank and suit symbols
const INDICATOR_SIZES = {
  small: {
    classicRank: 'text-xs',
    classicSuit: 'text-sm',
    modernRank: 'text-sm sm:text-base',
    modernSuit: 'text-xs',
    minimalRank: 'text-sm sm:text-base',
    minimalSuit: 'text-xs',
  },
  medium: {
    classicRank: 'text-sm sm:text-base',
    classicSuit: 'text-base sm:text-lg',
    modernRank: 'text-lg sm:text-xl',
    modernSuit: 'text-sm sm:text-base',
    minimalRank: 'text-base sm:text-lg',
    minimalSuit: 'text-xs sm:text-sm',
  },
  large: {
    classicRank: 'text-base sm:text-lg md:text-xl',
    classicSuit: 'text-lg sm:text-xl md:text-2xl',
    modernRank: 'text-xl sm:text-2xl md:text-3xl',
    modernSuit: 'text-base sm:text-lg md:text-xl',
    minimalRank: 'text-lg sm:text-xl md:text-2xl',
    minimalSuit: 'text-sm sm:text-base',
  },
} as const

const SUIT_SYMBOLS: Record<Suit, string> = {
  spades: '♠',
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
}

const SUIT_COLORS: Record<Suit, string> = {
  spades: 'text-black',
  hearts: 'text-red-600',
  diamonds: 'text-red-600',
  clubs: 'text-black',
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
          card-back
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
          card-back
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
        card-back
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
function ClassicCard({ card, isDragging, isValidTarget, showHighlight, isHinted, cardSize = 'large' }: Omit<CardProps, 'cardArt'>) {
  const symbol = SUIT_SYMBOLS[card.suit]
  const colorClass = SUIT_COLORS[card.suit]
  const sizes = INDICATOR_SIZES[cardSize]

  const getBorderClass = () => {
    if (isHinted) return 'border-amber-400 ring-2 ring-amber-400/60 animate-pulse'
    if (isValidTarget && showHighlight) return 'border-amber-400 ring-2 ring-amber-400/50'
    return 'border-stone-300'
  }

  return (
    <div
      className={`
        card-face
        w-full aspect-[2.5/3.5] rounded-lg
        bg-white
        border-2
        ${getBorderClass()}
        shadow-md
        flex flex-col justify-between p-1.5 sm:p-2
        ${isDragging ? 'opacity-50 scale-105' : ''}
        transition-transform duration-150
      `}
    >
      {/* Top left rank and suit */}
      <div className={`flex flex-col items-start leading-none ${colorClass}`}>
        <span className={`${sizes.classicRank} font-bold`}>{card.rank}</span>
        <span className={`${sizes.classicSuit} -mt-1`}>{symbol}</span>
      </div>

      {/* Center suit (large) - size unchanged */}
      <div className={`flex-1 flex items-center justify-center ${colorClass}`}>
        <span className="text-3xl sm:text-4xl md:text-5xl">{symbol}</span>
      </div>

      {/* Bottom right rank and suit (inverted) */}
      <div className={`flex flex-col items-end leading-none rotate-180 self-end ${colorClass}`}>
        <span className={`${sizes.classicRank} font-bold`}>{card.rank}</span>
        <span className={`${sizes.classicSuit} -mt-1`}>{symbol}</span>
      </div>
    </div>
  )
}

// Modern card style - clean, contemporary design
function ModernCard({ card, isDragging, isValidTarget, showHighlight, isHinted, cardSize = 'large' }: Omit<CardProps, 'cardArt'>) {
  const symbol = SUIT_SYMBOLS[card.suit]
  const colorClass = SUIT_COLORS[card.suit]
  const bgClass = MODERN_BG_COLORS[card.suit]
  const sizes = INDICATOR_SIZES[cardSize]

  const getBorderClass = () => {
    if (isHinted) return 'border-amber-400 ring-2 ring-amber-400/60 animate-pulse'
    if (isValidTarget && showHighlight) return 'border-amber-400 ring-2 ring-amber-400/50'
    return 'border-stone-200'
  }

  return (
    <div
      className={`
        card-face
        w-full aspect-[2.5/3.5] rounded-xl
        ${bgClass}
        border
        ${getBorderClass()}
        shadow-lg
        flex flex-col
        ${isDragging ? 'opacity-50 scale-105' : ''}
        transition-transform duration-150
        overflow-hidden
      `}
    >
      {/* Top section with rank */}
      <div className={`flex items-center gap-1 px-2 pt-1.5 sm:px-3 sm:pt-2 ${colorClass}`}>
        <span className={`${sizes.modernRank} font-light`}>{card.rank}</span>
        <span className={`${sizes.modernSuit} opacity-60`}>{symbol}</span>
      </div>

      {/* Center - large decorative suit (size unchanged) */}
      <div className={`flex-1 flex items-center justify-center ${colorClass}`}>
        <span className="text-4xl sm:text-5xl md:text-6xl opacity-20">{symbol}</span>
      </div>

      {/* Bottom section */}
      <div className={`flex items-center gap-1 px-2 pb-1.5 sm:px-3 sm:pb-2 rotate-180 self-end ${colorClass}`}>
        <span className={`${sizes.modernRank} font-light`}>{card.rank}</span>
        <span className={`${sizes.modernSuit} opacity-60`}>{symbol}</span>
      </div>
    </div>
  )
}

// Minimal card style - stripped down, clean
function MinimalCard({ card, isDragging, isValidTarget, showHighlight, isHinted, cardSize = 'large' }: Omit<CardProps, 'cardArt'>) {
  const symbol = SUIT_SYMBOLS[card.suit]
  const colorClass = SUIT_COLORS[card.suit]
  const sizes = INDICATOR_SIZES[cardSize]

  const getBorderClass = () => {
    if (isHinted) return 'border-amber-400 ring-2 ring-amber-400/60 animate-pulse'
    if (isValidTarget && showHighlight) return 'border-amber-400 ring-2 ring-amber-400/50'
    return 'border-stone-300'
  }

  return (
    <div
      className={`
        card-face
        w-full aspect-[2.5/3.5] rounded-md
        bg-white
        border
        ${getBorderClass()}
        shadow-sm
        flex flex-col p-1.5 sm:p-2
        ${isDragging ? 'opacity-50 scale-105' : ''}
        transition-transform duration-150
      `}
    >
      {/* Top left - just rank and small suit */}
      <div className={`flex items-baseline gap-0.5 ${colorClass}`}>
        <span className={`${sizes.minimalRank} font-semibold`}>{card.rank}</span>
        <span className={sizes.minimalSuit}>{symbol}</span>
      </div>

      {/* Empty middle - intentionally minimal */}
      <div className="flex-1" />

      {/* Bottom right (inverted) */}
      <div className={`flex items-baseline gap-0.5 self-end rotate-180 ${colorClass}`}>
        <span className={`${sizes.minimalRank} font-semibold`}>{card.rank}</span>
        <span className={sizes.minimalSuit}>{symbol}</span>
      </div>
    </div>
  )
}

export function Card({ card, isDragging, isValidTarget, showHighlight, isHinted, cardArt = 'classic', cardSize = 'large' }: CardProps) {
  if (!card.faceUp) {
    return <CardBack isDragging={isDragging} cardArt={cardArt} />
  }

  switch (cardArt) {
    case 'modern':
      return <ModernCard card={card} isDragging={isDragging} isValidTarget={isValidTarget} showHighlight={showHighlight} isHinted={isHinted} cardSize={cardSize} />
    case 'minimal':
      return <MinimalCard card={card} isDragging={isDragging} isValidTarget={isValidTarget} showHighlight={showHighlight} isHinted={isHinted} cardSize={cardSize} />
    case 'classic':
    default:
      return <ClassicCard card={card} isDragging={isDragging} isValidTarget={isValidTarget} showHighlight={showHighlight} isHinted={isHinted} cardSize={cardSize} />
  }
}
