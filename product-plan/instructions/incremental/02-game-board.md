# Milestone 2: Game Board

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

---

## About These Instructions

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Data model definitions (TypeScript types and sample data)
- UI/UX specifications (user flows, requirements, screenshots)
- Test-writing instructions for TDD approach

**What you need to build:**
- Spider Solitaire game logic
- Card dealing and shuffling algorithms
- Move validation and execution
- Win detection
- Undo system with move history
- Integration of UI components with game state

**Important guidelines:**
- **DO NOT** redesign or restyle the provided components — use them as-is
- **DO** wire up the callback props to your game logic
- **DO** implement proper Spider Solitaire rules
- **DO** use test-driven development — write tests first using `tests.md` instructions
- The components are props-based and ready to integrate — focus on the game logic layer

---

## Goal

Implement the Game Board — the main playing surface where Spider Solitaire is played.

## Overview

The Game Board is where players interact with cards to build sequences and complete suits. Users drag cards between 10 tableau columns, deal from the stock pile, and try to complete 8 same-suit King-to-Ace sequences.

**Key Functionality:**
- Display 10 tableau columns with face-up and face-down cards
- Show stock pile with remaining deals indicator (0-5)
- Show foundation area with completed suits count (0-8)
- Drag and drop cards/sequences between columns
- Deal 10 cards from stock (one to each column)
- Auto-flip face-down cards when exposed
- Detect and handle completed suits (K-A same-suit sequence)
- Detect win condition (all 8 suits completed)

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/game-board/tests.md` for detailed test-writing instructions including:
- Key user flows to test (card movement, dealing, winning)
- Spider Solitaire rule validations
- Expected behaviors and edge cases

**TDD Workflow:**
1. Read `tests.md` and write failing tests for game logic
2. Implement the feature to make tests pass
3. Refactor while keeping tests green

## What to Implement

### Components

Copy the section components from `product-plan/sections/game-board/components/`:

- `GameBoard.tsx` — Main game board layout
- `Card.tsx` — Individual card (face-up/face-down)
- `Column.tsx` — Tableau column with overlapping cards
- `StockPile.tsx` — Stock pile with deal count
- `FoundationArea.tsx` — Completed suits indicator

### Game Logic

Implement Spider Solitaire rules:

**Initial Deal:**
- Shuffle 104 cards (2 decks)
- Deal 54 cards to tableau: 6 cards each to columns 0-3, 5 cards each to columns 4-9
- Only top card of each column is face-up
- Remaining 50 cards go to stock (5 deals of 10)

**Card Movement Rules:**
- Cards can be placed on a card one rank higher (any suit)
- Only same-suit sequences can be moved as a group
- Any card/sequence can be placed in an empty column
- Validate moves before executing

**Dealing from Stock:**
- Only allowed when no columns are empty
- Deal one card face-up to each of the 10 columns
- Decrement deals remaining

**Suit Completion:**
- Detect when a column has K-Q-J-10-9-8-7-6-5-4-3-2-A of same suit
- Based on user preference: auto-move to foundation or highlight
- Show celebration animation (if enabled)
- Increment foundations completed

**Win Condition:**
- Game is won when foundationsCompleted === 8

### Undo System

Implement move history for unlimited undo:
- Record each move (card movements, deals)
- Allow reversal of any action
- Maintain undo stack

### Callbacks

Wire up these user actions from GameBoardProps:

| Callback | Description |
|----------|-------------|
| `onMoveCards(fromColumnId, cardIndex, toColumnId)` | Move cards between columns |
| `onDeal()` | Deal 10 cards from stock |
| `onSuitCompleted(suit)` | Handle completed suit |
| `onCardFlip(columnId, cardIndex)` | Flip exposed face-down card |

### Empty States

Handle these empty states:
- **Empty column** — Show placeholder, accept any card
- **Empty stock** — Show empty indicator, disable deal button
- **Win state** — All suits completed, show win message

## Files to Reference

- `product-plan/sections/game-board/README.md` — Feature overview
- `product-plan/sections/game-board/tests.md` — Test-writing instructions
- `product-plan/sections/game-board/components/` — React components
- `product-plan/sections/game-board/types.ts` — TypeScript interfaces
- `product-plan/sections/game-board/sample-data.json` — Sample game state
- `product-plan/sections/game-board/screenshot.png` — Visual reference

## Expected User Flows

### Flow 1: Start a New Game

1. User clicks "New Game" button in toolbar
2. New Game modal opens with difficulty options
3. User selects difficulty (1, 2, or 4 suits)
4. User clicks "Start Game"
5. **Outcome:** Cards are dealt, game board displays initial state

### Flow 2: Move Cards Between Columns

1. User drags a card (or same-suit sequence) from one column
2. Valid drop targets highlight (if preference enabled)
3. User drops on a valid column
4. **Outcome:** Cards move, move recorded in history, undo becomes available

### Flow 3: Deal from Stock

1. User verifies no columns are empty
2. User clicks "Deal" button (or taps stock pile)
3. **Outcome:** 10 cards dealt (one to each column), deals remaining decrements

### Flow 4: Complete a Suit

1. User arranges a K-Q-J-10-9-8-7-6-5-4-3-2-A sequence of same suit
2. System detects completed sequence
3. **Outcome:** Cards animate to foundation, celebration plays (if enabled), suits counter increments

### Flow 5: Win the Game

1. User completes 8th suit
2. **Outcome:** Win message displayed, option to start new game

## Done When

- [ ] Tests written for game logic (card movement, dealing, winning)
- [ ] All tests pass
- [ ] Game board renders with 10 columns
- [ ] Cards display correctly (face-up/face-down)
- [ ] Drag and drop works for valid moves
- [ ] Invalid moves are rejected
- [ ] Deal button works when no empty columns
- [ ] Face-down cards flip when exposed
- [ ] Completed suits are detected and handled
- [ ] Win condition triggers win state
- [ ] Undo works for all actions
- [ ] Matches the visual design
- [ ] Responsive on different screen sizes
