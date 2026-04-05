import { X } from 'lucide-react'
import type { UserPreferences, CardArt, Theme } from '../../game/types'
import { useModalA11y } from '../../hooks/useModalA11y'

export interface SettingsModalProps {
  isOpen: boolean
  preferences: UserPreferences
  onClose: () => void
  onPreferencesChange: (preferences: UserPreferences) => void
}

const CARD_SIZES = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
] as const

const CARD_ARTS = [
  { value: 'classic', label: 'Classic' },
  { value: 'modern', label: 'Modern' },
  { value: 'minimal', label: 'Minimal' },
] as const

const THEMES = [
  { value: 'green-felt', label: 'Green Felt' },
  { value: 'blue-felt', label: 'Blue Felt' },
  { value: 'wood', label: 'Wood' },
  { value: 'dark', label: 'Dark' },
] as const

export function SettingsModal({
  isOpen,
  preferences,
  onClose,
  onPreferencesChange,
}: SettingsModalProps) {
  const containerRef = useModalA11y({ isOpen, onClose })

  if (!isOpen) return null

  const handleChange = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    onPreferencesChange({ ...preferences, [key]: value })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div
        ref={containerRef}
        className="bg-stone-800 rounded-xl shadow-2xl w-full max-w-md mx-4 font-['DM_Sans']"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-700">
          <h2 id="settings-title" className="text-xl font-semibold text-white">Settings</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white transition-colors"
            aria-label="Close settings"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Card Size */}
          <fieldset className="space-y-2">
            <legend className="block text-sm font-medium text-stone-300">
              Card Size
            </legend>
            <div className="flex gap-2" role="radiogroup" aria-label="Card size">
              {CARD_SIZES.map((size) => {
                const isSelected = preferences.cardSize === size.value

                return (
                  <label
                    key={size.value}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors text-center cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
                    }`}
                  >
                    <input
                      className="sr-only"
                      type="radio"
                      name="card-size"
                      value={size.value}
                      checked={isSelected}
                      onChange={() => handleChange('cardSize', size.value)}
                    />
                    {size.label}
                  </label>
                )
              })}
            </div>
          </fieldset>

          {/* High Contrast */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-stone-300">
              High Contrast Mode
            </label>
            <button
              type="button"
              onClick={() => handleChange('highContrast', !preferences.highContrast)}
              role="switch"
              aria-checked={preferences.highContrast}
              aria-label="High Contrast Mode"
              className={`relative w-12 h-6 rounded-full transition-colors ${
                preferences.highContrast ? 'bg-emerald-600' : 'bg-stone-600'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  preferences.highContrast ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Card Art */}
          <div className="space-y-2">
            <label htmlFor="card-art-select" className="block text-sm font-medium text-stone-300">
              Card Art
            </label>
            <select
              id="card-art-select"
              value={preferences.cardArt}
              onChange={(e) => handleChange('cardArt', e.target.value as CardArt)}
              className="w-full px-4 py-2.5 bg-stone-700 text-white rounded-lg border border-stone-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {CARD_ARTS.map((art) => (
                <option key={art.value} value={art.value}>
                  {art.label}
                </option>
              ))}
            </select>
          </div>

          {/* Theme */}
          <div className="space-y-2">
            <label htmlFor="theme-select" className="block text-sm font-medium text-stone-300">
              Background Theme
            </label>
            <select
              id="theme-select"
              value={preferences.theme}
              onChange={(e) => handleChange('theme', e.target.value as Theme)}
              className="w-full px-4 py-2.5 bg-stone-700 text-white rounded-lg border border-stone-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {THEMES.map((theme) => (
                <option key={theme.value} value={theme.value}>
                  {theme.label}
                </option>
              ))}
            </select>
          </div>

          {/* Toolbar Position */}
          <fieldset className="flex items-center justify-between">
            <legend className="text-sm font-medium text-stone-300">
              Toolbar Position
            </legend>
            <div className="flex gap-2" role="radiogroup" aria-label="Toolbar position">
              <label
                className={`px-4 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  preferences.toolbarPosition === 'top'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
                }`}
              >
                <input
                  className="sr-only"
                  type="radio"
                  name="toolbar-position"
                  value="top"
                  checked={preferences.toolbarPosition === 'top'}
                  onChange={() => handleChange('toolbarPosition', 'top')}
                />
                Top
              </label>
              <label
                className={`px-4 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  preferences.toolbarPosition === 'bottom'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
                }`}
              >
                <input
                  className="sr-only"
                  type="radio"
                  name="toolbar-position"
                  value="bottom"
                  checked={preferences.toolbarPosition === 'bottom'}
                  onChange={() => handleChange('toolbarPosition', 'bottom')}
                />
                Bottom
              </label>
            </div>
          </fieldset>

          {/* Show Statistics */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-stone-300">
              Show Statistics
            </label>
            <button
              type="button"
              onClick={() => handleChange('showStatistics', !preferences.showStatistics)}
              role="switch"
              aria-checked={preferences.showStatistics}
              aria-label="Show Statistics"
              className={`relative w-12 h-6 rounded-full transition-colors ${
                preferences.showStatistics ? 'bg-emerald-600' : 'bg-stone-600'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  preferences.showStatistics ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-stone-700">
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
          >
            Done
          </button>
          <p className="mt-3 text-center text-xs text-stone-500 font-['IBM_Plex_Mono']">
            Version {__APP_VERSION__}
          </p>
        </div>
      </div>
    </div>
  )
}
