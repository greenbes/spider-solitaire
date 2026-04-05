import { useState, useCallback, useEffect } from 'react'
import type { Game, Column as ColumnType } from '../game/types'
import { isValidMove, canMoveSameSequence } from '../game/moves'

export interface KeyboardSelection {
  columnIndex: number
  cardIndex: number
}

interface UseGameBoardKeyboardNavigationProps {
  game: Game
  onMoveCards: (fromColumnId: string, cardIndex: number, toColumnId: string) => void
}

export function useGameBoardKeyboardNavigation({
  game,
  onMoveCards,
}: UseGameBoardKeyboardNavigationProps) {
  const [kbFocus, setKbFocus] = useState<KeyboardSelection | null>(null)
  const [kbSelected, setKbSelected] = useState<KeyboardSelection | null>(null)

  const findMovableStart = useCallback((column: ColumnType): number => {
    if (column.cards.length === 0) return 0
    let best = column.cards.length - 1
    for (let i = column.cards.length - 1; i >= 0; i--) {
      if (canMoveSameSequence(column, i)) {
        best = i
      } else {
        break
      }
    }
    return best
  }, [])

  const clampFocus = useCallback(
    (columnIndex: number, cardIndex: number): KeyboardSelection => {
      const col = game.columns[columnIndex]
      if (!col || col.cards.length === 0) {
        return { columnIndex, cardIndex: 0 }
      }
      const movableStart = findMovableStart(col)
      return {
        columnIndex,
        cardIndex: Math.max(movableStart, Math.min(cardIndex, col.cards.length - 1)),
      }
    },
    [game.columns, findMovableStart]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!kbFocus) {
        const firstNonEmpty = game.columns.findIndex((c) => c.cards.length > 0)
        if (firstNonEmpty === -1) return
        setKbFocus(clampFocus(firstNonEmpty, game.columns[firstNonEmpty].cards.length - 1))
        e.preventDefault()
        return
      }

      const current = kbFocus
      const currentCol = game.columns[current.columnIndex]

      switch (e.key) {
        case 'ArrowLeft': {
          e.preventDefault()
          for (let offset = 1; offset <= game.columns.length; offset++) {
            const next = (current.columnIndex - offset + game.columns.length) % game.columns.length
            const col = game.columns[next]
            if (col.cards.length > 0 || kbSelected) {
              setKbFocus(clampFocus(next, col.cards.length - 1))
              break
            }
          }
          break
        }
        case 'ArrowRight': {
          e.preventDefault()
          for (let offset = 1; offset <= game.columns.length; offset++) {
            const next = (current.columnIndex + offset) % game.columns.length
            const col = game.columns[next]
            if (col.cards.length > 0 || kbSelected) {
              setKbFocus(clampFocus(next, col.cards.length - 1))
              break
            }
          }
          break
        }
        case 'ArrowUp': {
          e.preventDefault()
          if (!currentCol || currentCol.cards.length === 0) break
          const movableStart = findMovableStart(currentCol)
          if (current.cardIndex > movableStart) {
            setKbFocus({ ...current, cardIndex: current.cardIndex - 1 })
          }
          break
        }
        case 'ArrowDown': {
          e.preventDefault()
          if (!currentCol || currentCol.cards.length === 0) break
          if (current.cardIndex < currentCol.cards.length - 1) {
            setKbFocus({ ...current, cardIndex: current.cardIndex + 1 })
          }
          break
        }
        case 'Enter':
        case ' ': {
          e.preventDefault()
          if (!kbSelected) {
            if (!currentCol || currentCol.cards.length === 0) break
            if (!canMoveSameSequence(currentCol, current.cardIndex)) break
            setKbSelected(current)
          } else {
            const fromCol = game.columns[kbSelected.columnIndex]
            const toCol = game.columns[current.columnIndex]
            if (fromCol.id === toCol.id) {
              setKbSelected(null)
              break
            }
            const movingCard = fromCol.cards[kbSelected.cardIndex]
            if (isValidMove(movingCard, toCol)) {
              onMoveCards(fromCol.id, kbSelected.cardIndex, toCol.id)
            }
            setKbSelected(null)
          }
          break
        }
        case 'Escape': {
          if (kbSelected) {
            e.preventDefault()
            setKbSelected(null)
          }
          break
        }
      }
    },
    [kbFocus, kbSelected, game.columns, clampFocus, findMovableStart, onMoveCards]
  )

  useEffect(() => {
    if (!kbFocus) return
    const col = game.columns[kbFocus.columnIndex]
    if (!col || col.cards.length === 0) {
      const next = game.columns.findIndex((c) => c.cards.length > 0)
      if (next >= 0) {
        setKbFocus(clampFocus(next, game.columns[next].cards.length - 1))
      } else {
        setKbFocus(null)
      }
      return
    }
    if (kbFocus.cardIndex >= col.cards.length) {
      setKbFocus(clampFocus(kbFocus.columnIndex, col.cards.length - 1))
    }
  }, [game.columns, kbFocus, clampFocus])

  return { kbFocus, kbSelected, handleKeyDown }
}
