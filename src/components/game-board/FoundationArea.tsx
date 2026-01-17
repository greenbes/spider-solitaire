import { Trophy } from 'lucide-react'
import type { Theme } from '../../game/types'
import { getThemeStyles } from '../../game/themes'

interface FoundationAreaProps {
  foundationsCompleted: number
  showCelebration?: boolean
  theme: Theme
}

export function FoundationArea({ foundationsCompleted, showCelebration, theme }: FoundationAreaProps) {
  // Create array of 8 foundation slots
  const slots = Array.from({ length: 8 }, (_, i) => i < foundationsCompleted)
  const themeStyles = getThemeStyles(theme)

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`flex items-center gap-1.5 ${themeStyles.text}`}>
        <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="text-sm sm:text-base font-medium">
          {foundationsCompleted}/8
        </span>
      </div>

      {/* Foundation slots - shown as small indicators */}
      <div className="flex gap-1">
        {slots.map((completed, index) => (
          <div
            key={index}
            className={`
              w-3 h-4 sm:w-4 sm:h-5 rounded-sm
              ${completed
                ? 'bg-amber-500 shadow-sm shadow-amber-500/50'
                : `${themeStyles.emptySlotBg} border ${themeStyles.emptySlotBorder}`
              }
              ${completed && showCelebration ? 'animate-pulse' : ''}
              transition-colors duration-300
            `}
          />
        ))}
      </div>
    </div>
  )
}
