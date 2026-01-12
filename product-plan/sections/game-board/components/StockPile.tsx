import { Layers } from 'lucide-react'

interface StockPileProps {
  dealsRemaining: number
  canDeal: boolean
  onDeal?: () => void
}

export function StockPile({ dealsRemaining, canDeal, onDeal }: StockPileProps) {
  const isEmpty = dealsRemaining === 0

  return (
    <button
      onClick={onDeal}
      disabled={!canDeal || isEmpty}
      className={`
        relative w-16 sm:w-20 md:w-24 aspect-[2.5/3.5] rounded-lg
        ${isEmpty
          ? 'border-2 border-dashed border-emerald-600/40 bg-emerald-800/20'
          : 'bg-gradient-to-br from-emerald-700 to-emerald-900 border-2 border-emerald-600 shadow-lg hover:shadow-xl hover:scale-105'
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
          <div className="absolute -top-1 -left-1 w-full h-full rounded-lg bg-emerald-800 border border-emerald-700 -z-10" />
          <div className="absolute -top-2 -left-2 w-full h-full rounded-lg bg-emerald-900 border border-emerald-800 -z-20" />

          {/* Content */}
          <Layers className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-300" />
          <span className="text-emerald-200 text-xs sm:text-sm font-medium">
            {dealsRemaining}
          </span>
        </>
      )}

      {isEmpty && (
        <span className="text-emerald-500/50 text-xs">Empty</span>
      )}
    </button>
  )
}
