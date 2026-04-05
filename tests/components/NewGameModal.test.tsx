import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { NewGameModal } from '../../src/components/shell/NewGameModal'

describe('NewGameModal accessibility controls', () => {
  it('exposes difficulty options as a radio group', () => {
    render(
      <NewGameModal
        isOpen={true}
        onClose={() => {}}
        onStartGame={() => {}}
        gameInProgress={true}
      />
    )

    expect(screen.getByRole('radiogroup', { name: 'Difficulty level' })).toBeTruthy()

    const oneSuit = screen.getByRole('radio', { name: /1 Suit/i })
    const twoSuits = screen.getByRole('radio', { name: /2 Suits/i })
    const fourSuits = screen.getByRole('radio', { name: /4 Suits/i })

    expect(oneSuit.getAttribute('aria-checked')).toBe('false')
    expect(twoSuits.getAttribute('aria-checked')).toBe('true')
    expect(fourSuits.getAttribute('aria-checked')).toBe('false')
  })

  it('supports arrow-key selection in difficulty radio group', () => {
    render(
      <NewGameModal
        isOpen={true}
        onClose={() => {}}
        onStartGame={() => {}}
        gameInProgress={true}
      />
    )

    const twoSuits = screen.getByRole('radio', { name: /2 Suits/i })
    fireEvent.keyDown(twoSuits, { key: 'ArrowRight' })

    expect(screen.getByRole('radio', { name: /4 Suits/i }).getAttribute('aria-checked')).toBe('true')

    const fourSuits = screen.getByRole('radio', { name: /4 Suits/i })
    fireEvent.keyDown(fourSuits, { key: 'ArrowRight' })

    expect(screen.getByRole('radio', { name: /1 Suit/i }).getAttribute('aria-checked')).toBe('true')
  })

  it('starts a game with the currently selected difficulty', () => {
    const onStartGame = vi.fn()
    const onClose = vi.fn()

    render(
      <NewGameModal
        isOpen={true}
        onClose={onClose}
        onStartGame={onStartGame}
        gameInProgress={true}
      />
    )

    const twoSuits = screen.getByRole('radio', { name: /2 Suits/i })
    fireEvent.keyDown(twoSuits, { key: 'ArrowLeft' })
    fireEvent.click(screen.getByRole('button', { name: 'Start Game' }))

    expect(onStartGame).toHaveBeenCalledWith(1)
    expect(onClose).toHaveBeenCalled()
  })
})
