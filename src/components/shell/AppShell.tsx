import { useState } from 'react'
import { GameToolbar } from './GameToolbar'
import { SettingsModal } from './SettingsModal'
import { NewGameModal } from './NewGameModal'
import { HelpModal } from './HelpModal'
import type { Difficulty, UserPreferences, GameStats } from '../../game/types'

const defaultStats: GameStats = {
  moves: 0,
  suitsCompleted: 0,
}

const defaultPreferences: UserPreferences = {
  toolbarPosition: 'bottom',
  showStatistics: true,
  cardSize: 'large',
  highContrast: false,
  cardArt: 'classic',
  theme: 'green-felt',
}

export interface AppShellProps {
  children: React.ReactNode
  stats?: GameStats
  preferences?: UserPreferences
  canUndo?: boolean
  canDeal?: boolean
  isSettingsOpen?: boolean
  isNewGameOpen?: boolean
  gameInProgress?: boolean
  onNewGame?: (difficulty: Difficulty) => void
  onUndo?: () => void
  onHint?: () => void
  onDeal?: () => void
  onOpenSettings?: () => void
  onCloseSettings?: () => void
  onOpenNewGame?: () => void
  onCloseNewGame?: () => void
  onPreferencesChange?: (preferences: UserPreferences) => void
}

export function AppShell({
  children,
  stats = defaultStats,
  preferences: propPreferences,
  canUndo = false,
  canDeal = true,
  isSettingsOpen: propIsSettingsOpen,
  isNewGameOpen: propIsNewGameOpen,
  gameInProgress = false,
  onNewGame: propOnNewGame,
  onUndo = () => {},
  onHint = () => {},
  onDeal = () => {},
  onOpenSettings: propOnOpenSettings,
  onCloseSettings: propOnCloseSettings,
  onOpenNewGame: propOnOpenNewGame,
  onCloseNewGame: propOnCloseNewGame,
  onPreferencesChange: propOnPreferencesChange,
}: AppShellProps) {
  // Use internal state when props aren't provided (for preview mode)
  const [internalPreferences, setInternalPreferences] = useState(defaultPreferences)
  const [internalSettingsOpen, setInternalSettingsOpen] = useState(false)
  const [internalNewGameOpen, setInternalNewGameOpen] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)

  const preferences = propPreferences ?? internalPreferences
  const isSettingsOpen = propIsSettingsOpen ?? internalSettingsOpen
  const isNewGameOpen = propIsNewGameOpen ?? internalNewGameOpen
  const onOpenSettings = propOnOpenSettings ?? (() => setInternalSettingsOpen(true))
  const onCloseSettings = propOnCloseSettings ?? (() => setInternalSettingsOpen(false))
  const onOpenNewGame = propOnOpenNewGame ?? (() => setInternalNewGameOpen(true))
  const onCloseNewGame = propOnCloseNewGame ?? (() => setInternalNewGameOpen(false))
  const onPreferencesChange = propOnPreferencesChange ?? setInternalPreferences
  const onNewGame = propOnNewGame ?? ((difficulty: Difficulty) => console.log('Start new game with difficulty:', difficulty))

  const isTop = preferences.toolbarPosition === 'top'

  return (
    <div className="h-screen w-screen flex flex-col bg-stone-900 font-['DM_Sans']">
      {isTop && (
        <GameToolbar
          stats={stats}
          showStatistics={preferences.showStatistics}
          canUndo={canUndo}
          canDeal={canDeal}
          onNewGame={onOpenNewGame}
          onUndo={onUndo}
          onHint={onHint}
          onDeal={onDeal}
          onHelp={() => setIsHelpOpen(true)}
          onOpenSettings={onOpenSettings}
        />
      )}

      <main className="flex-1 overflow-hidden">{children}</main>

      {!isTop && (
        <GameToolbar
          stats={stats}
          showStatistics={preferences.showStatistics}
          canUndo={canUndo}
          canDeal={canDeal}
          onNewGame={onOpenNewGame}
          onUndo={onUndo}
          onHint={onHint}
          onDeal={onDeal}
          onHelp={() => setIsHelpOpen(true)}
          onOpenSettings={onOpenSettings}
        />
      )}

      <NewGameModal
        isOpen={isNewGameOpen}
        onClose={onCloseNewGame}
        onStartGame={onNewGame}
        gameInProgress={gameInProgress}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        preferences={preferences}
        onClose={onCloseSettings}
        onPreferencesChange={onPreferencesChange}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  )
}
