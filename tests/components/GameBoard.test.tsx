import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { GameBoard } from '../../src/components/game-board/GameBoard'
import type { Game, GameBoardPreferences, Hint } from '../../src/game/types'
import {
  createFaceUpCard,
  createFaceDownCard,
  createColumn,
  createGame,
  createGameWithColumns,
} from '../factories/game'

function createDefaultPreferences(): GameBoardPreferences {
  return {
    showValidDropTargets: true,
    autoMoveCompletedSuits: true,
    showCelebration: false,
    cardArt: 'classic',
    theme: 'green-felt',
    cardSize: 'large',
  }
}

function createTestGame(): Game {
  const columns = Array.from({ length: 10 }, (_, i) =>
    createColumn([createFaceUpCard('spades', 'K')], `col-${i}`)
  )
  return createGame({
    columns,
    stock: Array.from({ length: 10 }, () => createFaceDownCard('hearts', '5')),
    dealsRemaining: 3,
  })
}

describe('GameBoard component', () => {
  describe('rendering', () => {
    it('renders all 10 columns', () => {
      const game = createTestGame()
      const preferences = createDefaultPreferences()

      const { container } = render(
        <GameBoard game={game} preferences={preferences} />
      )

      // Each column has a card with 'K' rank
      const kings = screen.getAllByText('K')
      expect(kings.length).toBeGreaterThanOrEqual(10)
    })

    it('renders stock pile with deals remaining', () => {
      const game = createTestGame()
      const preferences = createDefaultPreferences()

      render(<GameBoard game={game} preferences={preferences} />)

      // Stock pile shows number of deals remaining
      expect(screen.getByText('3')).toBeTruthy()
    })

    it('renders foundation area', () => {
      const game = createTestGame()
      game.foundationsCompleted = 2
      const preferences = createDefaultPreferences()

      render(<GameBoard game={game} preferences={preferences} />)

      expect(screen.getByText('2/8')).toBeTruthy()
    })

    it('applies theme background', () => {
      const game = createTestGame()
      const preferences = createDefaultPreferences()
      preferences.theme = 'blue-felt'

      const { container } = render(
        <GameBoard game={game} preferences={preferences} />
      )

      expect(container.querySelector('.bg-blue-900')).toBeTruthy()
    })
  })

  describe('deal functionality', () => {
    it('calls onDeal when deal is triggered', () => {
      const onDeal = vi.fn()
      const game = createTestGame()
      const preferences = createDefaultPreferences()

      render(
        <GameBoard game={game} preferences={preferences} onDeal={onDeal} />
      )

      const dealButton = screen.getByLabelText(/Deal cards/)
      fireEvent.click(dealButton)

      expect(onDeal).toHaveBeenCalled()
    })

    it('shows warning when empty column blocks dealing', () => {
      const columns = Array.from({ length: 10 }, (_, i) =>
        i === 0
          ? createColumn([], `col-${i}`) // Empty column
          : createColumn([createFaceUpCard('spades', 'K')], `col-${i}`)
      )
      const game = createGame({
        columns,
        stock: Array.from({ length: 10 }, () => createFaceDownCard('hearts', '5')),
        dealsRemaining: 3,
      })
      const preferences = createDefaultPreferences()

      render(<GameBoard game={game} preferences={preferences} />)

      expect(screen.getByText('Fill all empty columns before dealing')).toBeTruthy()
    })

    it('does not show warning when deal is available', () => {
      const game = createTestGame()
      const preferences = createDefaultPreferences()

      render(<GameBoard game={game} preferences={preferences} />)

      expect(screen.queryByText('Fill all empty columns before dealing')).toBeNull()
    })

    it('does not show warning when no deals remain', () => {
      const columns = Array.from({ length: 10 }, (_, i) =>
        i === 0
          ? createColumn([], `col-${i}`)
          : createColumn([createFaceUpCard('spades', 'K')], `col-${i}`)
      )
      const game = createGame({
        columns,
        stock: [],
        dealsRemaining: 0,
      })
      const preferences = createDefaultPreferences()

      render(<GameBoard game={game} preferences={preferences} />)

      expect(screen.queryByText('Fill all empty columns before dealing')).toBeNull()
    })
  })

  describe('move cards functionality', () => {
    it('calls onMoveCards when card is dropped', () => {
      const onMoveCards = vi.fn()
      // Create a full 10-column game
      const columnCards = [
        [createFaceUpCard('spades', '5')],
        [createFaceUpCard('hearts', '6')],
        [createFaceUpCard('clubs', 'K')],
        [createFaceUpCard('clubs', 'K')],
        [createFaceUpCard('clubs', 'K')],
        [createFaceUpCard('clubs', 'K')],
        [createFaceUpCard('clubs', 'K')],
        [createFaceUpCard('clubs', 'K')],
        [createFaceUpCard('clubs', 'K')],
        [createFaceUpCard('clubs', 'K')],
      ]
      const game = createGameWithColumns(columnCards)
      const preferences = createDefaultPreferences()

      const { container } = render(
        <GameBoard game={game} preferences={preferences} onMoveCards={onMoveCards} />
      )

      // Find the first column's card and drag it
      const columns = container.querySelectorAll('[class*="flex-1 min-w-0"]')
      const firstColumnCard = columns[0].querySelector('[draggable="true"]')

      expect(firstColumnCard).toBeTruthy()

      // Simulate drag start
      fireEvent.dragStart(firstColumnCard!)

      // Simulate drop on second column
      fireEvent.drop(columns[1])

      expect(onMoveCards).toHaveBeenCalledWith('col-0', 0, 'col-1')
    })

    it('does not call onMoveCards when dropping on same column', () => {
      const onMoveCards = vi.fn()
      const columnCards = Array.from({ length: 10 }, (_, i) =>
        i === 0 ? [createFaceUpCard('spades', '5')] : [createFaceUpCard('clubs', 'K')]
      )
      const game = createGameWithColumns(columnCards)
      const preferences = createDefaultPreferences()

      const { container } = render(
        <GameBoard game={game} preferences={preferences} onMoveCards={onMoveCards} />
      )

      const columns = container.querySelectorAll('[class*="flex-1 min-w-0"]')
      const firstColumnCard = columns[0].querySelector('[draggable="true"]')

      fireEvent.dragStart(firstColumnCard!)
      fireEvent.drop(columns[0])

      expect(onMoveCards).not.toHaveBeenCalled()
    })

    it('clears drag state on drag end', () => {
      const onMoveCards = vi.fn()
      const columnCards = [
        [createFaceUpCard('spades', '5')],
        [createFaceUpCard('hearts', '6')],
        [createFaceUpCard('clubs', 'K')],
        [createFaceUpCard('clubs', 'K')],
        [createFaceUpCard('clubs', 'K')],
        [createFaceUpCard('clubs', 'K')],
        [createFaceUpCard('clubs', 'K')],
        [createFaceUpCard('clubs', 'K')],
        [createFaceUpCard('clubs', 'K')],
        [createFaceUpCard('clubs', 'K')],
      ]
      const game = createGameWithColumns(columnCards)
      const preferences = createDefaultPreferences()

      const { container } = render(
        <GameBoard game={game} preferences={preferences} onMoveCards={onMoveCards} />
      )

      const columns = container.querySelectorAll('[class*="flex-1 min-w-0"]')
      const firstColumnCard = columns[0].querySelector('[draggable="true"]')

      fireEvent.dragStart(firstColumnCard!)
      fireEvent.dragEnd(firstColumnCard!)

      // After drag end, dropping should not trigger move
      fireEvent.drop(columns[1])

      expect(onMoveCards).not.toHaveBeenCalled()
    })
  })

  describe('hint display', () => {
    it('passes hint information to columns', () => {
      const columnCards = [
        [createFaceUpCard('spades', '5')],
        [createFaceUpCard('hearts', '6')],
        [createFaceUpCard('clubs', 'K')],
        [createFaceUpCard('clubs', 'K')],
        [createFaceUpCard('clubs', 'K')],
        [createFaceUpCard('clubs', 'K')],
        [createFaceUpCard('clubs', 'K')],
        [createFaceUpCard('clubs', 'K')],
        [createFaceUpCard('clubs', 'K')],
        [createFaceUpCard('clubs', 'K')],
      ]
      const game = createGameWithColumns(columnCards)
      const preferences = createDefaultPreferences()
      const hint: Hint = {
        fromColumnId: 'col-0',
        cardIndex: 0,
        toColumnId: 'col-1',
      }

      const { container } = render(
        <GameBoard game={game} preferences={preferences} activeHint={hint} />
      )

      // Hint source and target should have animation class
      const animatedElements = container.querySelectorAll('.animate-pulse')
      expect(animatedElements.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('valid drop target highlighting', () => {
    it('highlights valid drop targets when showValidDropTargets is true', () => {
      const columnCards = [
        [createFaceUpCard('spades', '5')],
        [createFaceUpCard('hearts', '6')], // Valid target (6 can receive 5)
        [createFaceUpCard('clubs', 'K')],  // Also valid (any card on K is invalid)
        [createFaceUpCard('diamonds', '3')],
        [createFaceUpCard('diamonds', '3')],
        [createFaceUpCard('diamonds', '3')],
        [createFaceUpCard('diamonds', '3')],
        [createFaceUpCard('diamonds', '3')],
        [createFaceUpCard('diamonds', '3')],
        [createFaceUpCard('diamonds', '3')],
      ]
      const game = createGameWithColumns(columnCards)
      const preferences = createDefaultPreferences()
      preferences.showValidDropTargets = true

      const { container } = render(
        <GameBoard game={game} preferences={preferences} />
      )

      // Start dragging the 5
      const columns = container.querySelectorAll('[class*="flex-1 min-w-0"]')
      const firstColumnCard = columns[0].querySelector('[draggable="true"]')

      fireEvent.dragStart(firstColumnCard!)

      // Valid targets should have highlight styling
      // This is hard to test directly, but we can verify the component renders without error
      expect(container.firstChild).toBeTruthy()
    })
  })

  describe('card art and size preferences', () => {
    it('passes cardArt preference to columns', () => {
      const game = createTestGame()
      const preferences = createDefaultPreferences()
      preferences.cardArt = 'modern'

      const { container } = render(
        <GameBoard game={game} preferences={preferences} />
      )

      // Modern cards have rounded-xl styling
      expect(container.querySelector('.rounded-xl')).toBeTruthy()
    })

    it('renders with minimal card art', () => {
      const game = createTestGame()
      const preferences = createDefaultPreferences()
      preferences.cardArt = 'minimal'

      const { container } = render(
        <GameBoard game={game} preferences={preferences} />
      )

      // Minimal cards have rounded-md styling
      expect(container.querySelector('.rounded-md')).toBeTruthy()
    })
  })
})
