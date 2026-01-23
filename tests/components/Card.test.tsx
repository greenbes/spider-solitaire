import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card } from '../../src/components/game-board/Card'
import { createFaceUpCard, createFaceDownCard } from '../factories/game'

describe('Card component', () => {
  describe('face-up card rendering', () => {
    it('renders rank for face-up card', () => {
      const card = createFaceUpCard('spades', '5')

      render(<Card card={card} />)

      // The rank should appear multiple times (top-left and bottom-right)
      const ranks = screen.getAllByText('5')
      expect(ranks.length).toBeGreaterThanOrEqual(1)
    })

    it('renders suit symbol for face-up spades', () => {
      const card = createFaceUpCard('spades', 'K')

      render(<Card card={card} />)

      const suits = screen.getAllByText('♠')
      expect(suits.length).toBeGreaterThanOrEqual(1)
    })

    it('renders suit symbol for face-up hearts', () => {
      const card = createFaceUpCard('hearts', 'Q')

      render(<Card card={card} />)

      const suits = screen.getAllByText('♥')
      expect(suits.length).toBeGreaterThanOrEqual(1)
    })

    it('renders suit symbol for face-up diamonds', () => {
      const card = createFaceUpCard('diamonds', 'J')

      render(<Card card={card} />)

      const suits = screen.getAllByText('♦')
      expect(suits.length).toBeGreaterThanOrEqual(1)
    })

    it('renders suit symbol for face-up clubs', () => {
      const card = createFaceUpCard('clubs', '10')

      render(<Card card={card} />)

      const suits = screen.getAllByText('♣')
      expect(suits.length).toBeGreaterThanOrEqual(1)
    })

    it('renders face cards correctly', () => {
      const king = createFaceUpCard('hearts', 'K')

      render(<Card card={king} />)

      const ranks = screen.getAllByText('K')
      expect(ranks.length).toBeGreaterThanOrEqual(1)
    })

    it('renders Ace correctly', () => {
      const ace = createFaceUpCard('spades', 'A')

      render(<Card card={ace} />)

      const ranks = screen.getAllByText('A')
      expect(ranks.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('face-down card rendering', () => {
    it('does not render rank for face-down card', () => {
      const card = createFaceDownCard('spades', '5')

      render(<Card card={card} />)

      expect(screen.queryByText('5')).toBeNull()
    })

    it('does not render suit symbol for face-down card', () => {
      const card = createFaceDownCard('hearts', 'K')

      render(<Card card={card} />)

      // Card back might show decorative spade, so we check for hearts specifically
      expect(screen.queryByText('♥')).toBeNull()
    })
  })

  describe('card styles', () => {
    it('renders with different card art styles', () => {
      const card = createFaceUpCard('spades', '5')

      const { rerender, container } = render(<Card card={card} cardArt="classic" />)
      const classicCard = container.firstChild

      rerender(<Card card={card} cardArt="modern" />)
      const modernCard = container.firstChild

      // The cards should render (we can't easily compare styles in this test)
      expect(classicCard).toBeTruthy()
      expect(modernCard).toBeTruthy()
    })

    it('renders with different sizes', () => {
      const card = createFaceUpCard('spades', '5')

      const { rerender, container } = render(<Card card={card} cardSize="small" />)
      expect(container.firstChild).toBeTruthy()

      rerender(<Card card={card} cardSize="medium" />)
      expect(container.firstChild).toBeTruthy()

      rerender(<Card card={card} cardSize="large" />)
      expect(container.firstChild).toBeTruthy()
    })
  })

  describe('hint highlighting', () => {
    it('applies hint styling when isHinted is true', () => {
      const card = createFaceUpCard('spades', '5')

      const { container } = render(<Card card={card} isHinted={true} />)

      // Check that animate-pulse class is applied (hint animation)
      const cardElement = container.querySelector('.animate-pulse')
      expect(cardElement).toBeTruthy()
    })

    it('does not apply hint styling when isHinted is false', () => {
      const card = createFaceUpCard('spades', '5')

      const { container } = render(<Card card={card} isHinted={false} />)

      const cardElement = container.querySelector('.animate-pulse')
      expect(cardElement).toBeNull()
    })
  })

  describe('valid target highlighting', () => {
    it('applies target styling when isValidTarget and showHighlight are true', () => {
      const card = createFaceUpCard('spades', '5')

      const { container } = render(
        <Card card={card} isValidTarget={true} showHighlight={true} />
      )

      // Check for amber ring styling
      const cardElement = container.querySelector('.ring-amber-400\\/50')
      expect(cardElement).toBeTruthy()
    })

    it('does not apply target styling when showHighlight is false', () => {
      const card = createFaceUpCard('spades', '5')

      const { container } = render(
        <Card card={card} isValidTarget={true} showHighlight={false} />
      )

      const cardElement = container.querySelector('.ring-amber-400\\/50')
      expect(cardElement).toBeNull()
    })
  })

  describe('dragging state', () => {
    it('applies opacity when isDragging is true', () => {
      const card = createFaceUpCard('spades', '5')

      const { container } = render(<Card card={card} isDragging={true} />)

      const cardElement = container.querySelector('.opacity-50')
      expect(cardElement).toBeTruthy()
    })
  })
})
