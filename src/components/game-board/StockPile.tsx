import { Layers } from 'lucide-react'
import type { Theme } from '../../game/types'
import { getThemeStyles } from '../../game/themes'

interface StockPileProps {
  dealsRemaining: number
  canDeal: boolean
  onDeal?: () => void
  theme: Theme
}

// Theme-specific gradient styles for stock pile (card back appearance)
const STOCK_PILE_STYLES: Record<Theme, { gradient: string; border: string; stack1: string; stack2: string }> = {
  'green-felt': {
    gradient: 'bg-gradient-to-br from-emerald-700 to-emerald-900 border-emerald-600',
    border: 'border-emerald-600',
    stack1: 'bg-emerald-800 border-emerald-700',
    stack2: 'bg-emerald-900 border-emerald-800',
  },
  'blue-felt': {
    gradient: 'bg-gradient-to-br from-blue-700 to-blue-900 border-blue-600',
    border: 'border-blue-600',
    stack1: 'bg-blue-800 border-blue-700',
    stack2: 'bg-blue-900 border-blue-800',
  },
  'wood': {
    gradient: 'bg-gradient-to-br from-amber-700 to-amber-900 border-amber-600',
    border: 'border-amber-600',
    stack1: 'bg-amber-800 border-amber-700',
    stack2: 'bg-amber-900 border-amber-800',
  },
  'dark': {
    gradient: 'bg-gradient-to-br from-neutral-700 to-neutral-900 border-neutral-600',
    border: 'border-neutral-600',
    stack1: 'bg-neutral-800 border-neutral-700',
    stack2: 'bg-neutral-900 border-neutral-800',
  },
}

export function StockPile({ dealsRemaining, canDeal, onDeal, theme }: StockPileProps) {
  const isEmpty = dealsRemaining === 0
  const themeStyles = getThemeStyles(theme)
  const pileStyles = STOCK_PILE_STYLES[theme]

  return (
    <button
      onClick={onDeal}
      disabled={!canDeal || isEmpty}
      className={`
        relative w-16 sm:w-20 md:w-24 aspect-[2.5/3.5] rounded-lg
        ${isEmpty
          ? `border-2 border-dashed ${themeStyles.emptySlotBorder} ${themeStyles.emptySlotBg}`
          : `${pileStyles.gradient} border-2 shadow-lg hover:shadow-xl hover:scale-105`
        }
        transition-all duration-200
        disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-lg
        flex flex-col items-center justify-center gap-1
      `}
      aria-label={isEmpty ? 'Stock pile empty' : `Deal cards (${dealsRemaining} deals remaining)`}
    >
      {!isEmpty && (
        <>
          {/* Stacked card effect */}
          <div className={`absolute -top-1 -left-1 w-full h-full rounded-lg ${pileStyles.stack1} border -z-10`} />
          <div className={`absolute -top-2 -left-2 w-full h-full rounded-lg ${pileStyles.stack2} border -z-20`} />

          {/* Content */}
          <Layers className={`w-6 h-6 sm:w-8 sm:h-8 ${themeStyles.text}`} />
          <span className={`${themeStyles.text} text-xs sm:text-sm font-medium`}>
            {dealsRemaining}
          </span>
        </>
      )}

      {isEmpty && (
        <span className={`${themeStyles.textMuted} text-xs`}>Empty</span>
      )}
    </button>
  )
}
