# Game Board

## Overview

Standard Spider Solitaire game board with 10 tableau columns, a stock pile, and foundation area for completed suits. Familiar layout that matches existing Spider Solitaire games.

## User Flows

- Drag cards or same-suit sequences between tableau columns to build descending sequences
- Tap stock pile to deal 10 cards (one to each column) — only allowed when no columns are empty
- Complete a same-suit King-to-Ace sequence to move it to the foundation
- Win the game when all 8 suits are completed

## Design Decisions

- **Emerald felt background** — Classic card table aesthetic
- **Overlapping cards** — Face-down cards overlap more than face-up to save space
- **Visual indicators** — Stock pile shows remaining deals, foundation shows completed suits
- **Drag and drop** — Primary interaction pattern for card movement
- **Valid target highlighting** — Optional (user preference) to show where cards can be placed
- **Empty column placeholder** — Dashed border makes empty columns visible
- **Warning message** — Amber text warns when deal is blocked by empty columns

## Data Used

**Entities:** Card, Column, Game

**From global model:**
- Card (suit, rank, faceUp)
- Column (id, cards array)
- Game (difficulty, moves, dealsRemaining, foundationsCompleted, columns)

## Visual Reference

See `screenshot.png` for the target UI design.

## Components Provided

| Component | Description |
|-----------|-------------|
| `GameBoard` | Main layout with stock, foundations, and tableau |
| `Card` | Individual playing card (face-up or face-down) |
| `Column` | Tableau column with overlapping card stack |
| `StockPile` | Clickable stock with deal count indicator |
| `FoundationArea` | Completed suits counter with slot indicators |

## Callback Props

| Callback | Description |
|----------|-------------|
| `onMoveCards(fromColumnId, cardIndex, toColumnId)` | Called when cards are dragged between columns |
| `onDeal()` | Called when stock pile is clicked (deal 10 cards) |
| `onSuitCompleted(suit)` | Called when a K-A same-suit sequence is completed |
| `onCardFlip(columnId, cardIndex)` | Called when a face-down card should flip up |
