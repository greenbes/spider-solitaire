import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SettingsModal } from '../../src/components/shell/SettingsModal'
import type { UserPreferences } from '../../src/game/types'

const defaultPreferences: UserPreferences = {
  toolbarPosition: 'bottom',
  showStatistics: true,
  cardSize: 'large',
  highContrast: false,
  cardArt: 'classic',
  theme: 'green-felt',
}

describe('SettingsModal accessibility controls', () => {
  it('exposes high contrast and statistics toggles as switches', () => {
    render(
      <SettingsModal
        isOpen={true}
        preferences={defaultPreferences}
        onClose={() => {}}
        onPreferencesChange={() => {}}
      />
    )

    const highContrastSwitch = screen.getByRole('switch', { name: 'High Contrast Mode' })
    const statisticsSwitch = screen.getByRole('switch', { name: 'Show Statistics' })

    expect(highContrastSwitch.getAttribute('aria-checked')).toBe('false')
    expect(statisticsSwitch.getAttribute('aria-checked')).toBe('true')
  })

  it('exposes card size and toolbar position as radio groups', () => {
    render(
      <SettingsModal
        isOpen={true}
        preferences={defaultPreferences}
        onClose={() => {}}
        onPreferencesChange={() => {}}
      />
    )

    expect(screen.getByRole('radiogroup', { name: 'Card size' })).toBeTruthy()
    expect(screen.getByRole('radiogroup', { name: 'Toolbar position' })).toBeTruthy()

    const smallCardSize = screen.getByRole('radio', { name: 'Small' })
    const largeCardSize = screen.getByRole('radio', { name: 'Large' })
    const topToolbar = screen.getByRole('radio', { name: 'Top' })
    const bottomToolbar = screen.getByRole('radio', { name: 'Bottom' })

    expect(smallCardSize).not.toBeChecked()
    expect(largeCardSize).toBeChecked()
    expect(topToolbar).not.toBeChecked()
    expect(bottomToolbar).toBeChecked()
  })

  it('calls onPreferencesChange with updated switch values', () => {
    const onPreferencesChange = vi.fn()

    render(
      <SettingsModal
        isOpen={true}
        preferences={defaultPreferences}
        onClose={() => {}}
        onPreferencesChange={onPreferencesChange}
      />
    )

    fireEvent.click(screen.getByRole('switch', { name: 'High Contrast Mode' }))

    expect(onPreferencesChange).toHaveBeenCalledWith({
      ...defaultPreferences,
      highContrast: true,
    })
  })

  it('calls onPreferencesChange with updated radio values', () => {
    const onPreferencesChange = vi.fn()

    render(
      <SettingsModal
        isOpen={true}
        preferences={defaultPreferences}
        onClose={() => {}}
        onPreferencesChange={onPreferencesChange}
      />
    )

    fireEvent.click(screen.getByRole('radio', { name: 'Small' }))

    expect(onPreferencesChange).toHaveBeenCalledWith({
      ...defaultPreferences,
      cardSize: 'small',
    })
  })
})
