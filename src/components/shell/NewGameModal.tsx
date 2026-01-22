import { useState } from 'react'
import { X, Spade } from 'lucide-react'
import type { Difficulty } from '../../game/types'

export interface NewGameModalProps {
  isOpen: boolean
  onClose: () => void
  onStartGame: (difficulty: Difficulty) => void
  gameInProgress?: boolean
}

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string; description: string }[] = [
  {
    value: 1,
    label: '1 Suit',
    description: 'Easiest — All cards are spades. Great for learning.',
  },
  {
    value: 2,
    label: '2 Suits',
    description: 'Medium — Spades and hearts. A balanced challenge.',
  },
  {
    value: 4,
    label: '4 Suits',
    description: 'Hardest — All four suits. The classic experience.',
  },
]

export function NewGameModal({ isOpen, onClose, onStartGame, gameInProgress = false }: NewGameModalProps) {
  const canClose = gameInProgress
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(2)

  if (!isOpen) return null

  const handleStartGame = () => {
    onStartGame(selectedDifficulty)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={canClose ? onClose : undefined}
    >
      <div
        className="bg-stone-800 rounded-xl shadow-2xl w-full max-w-md mx-4 font-['DM_Sans']"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-700">
          <h2 className="text-xl font-semibold text-white">New Game</h2>
          {canClose && (
            <button
              onClick={onClose}
              className="p-1 text-stone-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        <div className="px-6 py-5 space-y-4">
          <p className="text-stone-300 text-sm">
            Choose difficulty level:
          </p>

          <div className="space-y-3">
            {DIFFICULTY_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedDifficulty(option.value)}
                className={`
                  w-full p-4 rounded-lg text-left transition-all
                  ${selectedDifficulty === option.value
                    ? 'bg-emerald-600 ring-2 ring-emerald-400'
                    : 'bg-stone-700 hover:bg-stone-600'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className="flex gap-0.5">
                    {Array.from({ length: option.value }).map((_, i) => (
                      <Spade
                        key={i}
                        className={`w-4 h-4 ${
                          selectedDifficulty === option.value
                            ? 'text-emerald-200'
                            : 'text-stone-400'
                        }`}
                        fill="currentColor"
                      />
                    ))}
                  </div>
                  <span
                    className={`font-medium ${
                      selectedDifficulty === option.value
                        ? 'text-white'
                        : 'text-stone-200'
                    }`}
                  >
                    {option.label}
                  </span>
                  {option.value === 2 && (
                    <span className="ml-auto text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded">
                      Default
                    </span>
                  )}
                </div>
                <p
                  className={`mt-1 text-sm ${
                    selectedDifficulty === option.value
                      ? 'text-emerald-100'
                      : 'text-stone-400'
                  }`}
                >
                  {option.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-stone-700 flex gap-3">
          {canClose && (
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-stone-700 hover:bg-stone-600 text-white rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleStartGame}
            className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  )
}
