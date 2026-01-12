import { Plus, Undo2, Layers, Settings } from 'lucide-react'
import type { GameStats } from '../../game/types'

export interface GameToolbarProps {
  stats: GameStats
  showStatistics: boolean
  canUndo: boolean
  canDeal: boolean
  onNewGame: () => void
  onUndo: () => void
  onDeal: () => void
  onOpenSettings: () => void
}

export function GameToolbar({
  stats,
  showStatistics,
  canUndo,
  canDeal,
  onNewGame,
  onUndo,
  onDeal,
  onOpenSettings,
}: GameToolbarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-stone-800 border-stone-700 border-t sm:border-t-0 sm:border-b">
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onNewGame}
          className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">New Game</span>
        </button>

        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-stone-700 hover:bg-stone-600 disabled:bg-stone-800 disabled:text-stone-500 text-white rounded-lg font-medium transition-colors text-sm sm:text-base"
        >
          <Undo2 className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Undo</span>
        </button>

        <button
          onClick={onDeal}
          disabled={!canDeal}
          className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-stone-800 disabled:text-stone-500 text-white rounded-lg font-medium transition-colors text-sm sm:text-base"
        >
          <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Deal</span>
        </button>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        {showStatistics && (
          <div className="flex items-center gap-4 sm:gap-6 text-stone-300 text-sm sm:text-base font-mono">
            <div className="flex items-center gap-2">
              <span className="text-stone-500">Moves:</span>
              <span className="font-semibold text-white">{stats.moves}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-stone-500">Suits:</span>
              <span className="font-semibold text-white">
                {stats.suitsCompleted}/8
              </span>
            </div>
          </div>
        )}

        <button
          onClick={onOpenSettings}
          className="p-2 sm:p-2.5 bg-stone-700 hover:bg-stone-600 text-white rounded-lg transition-colors"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </div>
  )
}
