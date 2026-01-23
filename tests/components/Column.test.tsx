import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Column } from '../../src/components/game-board/Column'
import {
  createFaceUpCard,
  createFaceDownCard,
  createColumn,
  createDescendingSequence,
} from '../factories/game'

describe('Column component', () => {
  describe('empty column rendering', () => {
    it('renders empty placeholder for empty column', () => {
      const column = createColumn([], 'test-col')

      render(<Column column={column} />)

      expect(screen.getByText('Empty')).toBeTruthy()
    })

    it('shows "Move here" text when isHintTarget is true', () => {
      const column = createColumn([], 'test-col')

      render(<Column column={column} isHintTarget={true} />)

      expect(screen.getByText('Move here')).toBeTruthy()
    })

    it('applies hint styling to empty column when isHintTarget', () => {
      const column = createColumn([], 'test-col')

      const { container } = render(<Column column={column} isHintTarget={true} />)

      const placeholder = container.querySelector('.animate-pulse')
      expect(placeholder).toBeTruthy()
    })

    it('applies valid target styling when isValidTarget and showValidDropTargets', () => {
      const column = createColumn([], 'test-col')

      const { container } = render(
        <Column column={column} isValidTarget={true} showValidDropTargets={true} />
      )

      const placeholder = container.querySelector('.border-amber-400')
      expect(placeholder).toBeTruthy()
    })
  })

  describe('card stack rendering', () => {
    it('renders all cards in column', () => {
      const column = createColumn([
        createFaceUpCard('spades', '5'),
        createFaceUpCard('spades', '4'),
        createFaceUpCard('spades', '3'),
      ], 'test-col')

      render(<Column column={column} />)

      expect(screen.getAllByText('5').length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText('4').length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText('3').length).toBeGreaterThanOrEqual(1)
    })

    it('renders face-down cards without showing rank', () => {
      const column = createColumn([
        createFaceDownCard('spades', 'K'),
        createFaceUpCard('spades', '5'),
      ], 'test-col')

      render(<Column column={column} />)

      // K should not be visible (face-down)
      expect(screen.queryByText('K')).toBeNull()
      // 5 should be visible (face-up)
      expect(screen.getAllByText('5').length).toBeGreaterThanOrEqual(1)
    })

    it('renders mixed face-up and face-down cards', () => {
      const column = createColumn([
        createFaceDownCard('hearts', 'Q'),
        createFaceDownCard('hearts', 'J'),
        createFaceUpCard('spades', '5'),
        createFaceUpCard('spades', '4'),
      ], 'test-col')

      render(<Column column={column} />)

      // Face-down cards not visible
      expect(screen.queryByText('Q')).toBeNull()
      expect(screen.queryByText('J')).toBeNull()
      // Face-up cards visible
      expect(screen.getAllByText('5').length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText('4').length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('drag and drop handlers', () => {
    it('calls onCardDragStart when dragging face-up card', () => {
      const onCardDragStart = vi.fn()
      const column = createColumn([
        createFaceUpCard('spades', '5'),
      ], 'test-col')

      const { container } = render(
        <Column column={column} onCardDragStart={onCardDragStart} />
      )

      const draggableCard = container.querySelector('[draggable="true"]')
      expect(draggableCard).toBeTruthy()

      fireEvent.dragStart(draggableCard!)

      expect(onCardDragStart).toHaveBeenCalledWith('test-col', 0)
    })

    it('does not make face-down cards draggable', () => {
      const column = createColumn([
        createFaceDownCard('spades', 'K'),
      ], 'test-col')

      const { container } = render(<Column column={column} />)

      const draggableCard = container.querySelector('[draggable="true"]')
      expect(draggableCard).toBeNull()
    })

    it('calls onCardDragEnd when drag ends', () => {
      const onCardDragEnd = vi.fn()
      const column = createColumn([
        createFaceUpCard('spades', '5'),
      ], 'test-col')

      const { container } = render(
        <Column column={column} onCardDragEnd={onCardDragEnd} />
      )

      const draggableCard = container.querySelector('[draggable="true"]')
      fireEvent.dragEnd(draggableCard!)

      expect(onCardDragEnd).toHaveBeenCalled()
    })

    it('calls onDrop when card is dropped on column', () => {
      const onDrop = vi.fn()
      const column = createColumn([
        createFaceUpCard('spades', '5'),
      ], 'test-col')

      const { container } = render(<Column column={column} onDrop={onDrop} />)

      const columnElement = container.firstChild as Element
      fireEvent.drop(columnElement)

      expect(onDrop).toHaveBeenCalledWith('test-col')
    })

    it('prevents default on dragOver', () => {
      const column = createColumn([
        createFaceUpCard('spades', '5'),
      ], 'test-col')

      const { container } = render(<Column column={column} />)

      const columnElement = container.firstChild as Element
      const event = new Event('dragover', { bubbles: true })
      Object.defineProperty(event, 'preventDefault', { value: vi.fn() })

      columnElement.dispatchEvent(event)

      expect(event.preventDefault).toHaveBeenCalled()
    })
  })

  describe('hint highlighting', () => {
    it('highlights hinted cards in source column', () => {
      const column = createColumn([
        createFaceUpCard('spades', '5'),
        createFaceUpCard('spades', '4'),
        createFaceUpCard('spades', '3'),
      ], 'test-col')

      const { container } = render(
        <Column column={column} isHintSource={true} hintCardIndex={1} />
      )

      // Cards from index 1 onwards should be highlighted
      const hintedCards = container.querySelectorAll('.animate-pulse')
      expect(hintedCards.length).toBeGreaterThanOrEqual(1)
    })

    it('highlights top card in target column', () => {
      const column = createColumn([
        createFaceUpCard('spades', '5'),
      ], 'test-col')

      const { container } = render(
        <Column column={column} isHintTarget={true} />
      )

      const hintedCards = container.querySelectorAll('.animate-pulse')
      expect(hintedCards.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('card art and size props', () => {
    it('passes cardArt prop to child cards', () => {
      const column = createColumn([
        createFaceUpCard('spades', '5'),
      ], 'test-col')

      const { container } = render(
        <Column column={column} cardArt="modern" />
      )

      // Modern cards have rounded-xl class
      const modernCard = container.querySelector('.rounded-xl')
      expect(modernCard).toBeTruthy()
    })

    it('passes cardSize prop to child cards', () => {
      const column = createColumn([
        createFaceUpCard('spades', '5'),
      ], 'test-col')

      // Just verify it renders without error with different sizes
      const { rerender } = render(<Column column={column} cardSize="small" />)
      rerender(<Column column={column} cardSize="medium" />)
      rerender(<Column column={column} cardSize="large" />)
    })
  })
})
