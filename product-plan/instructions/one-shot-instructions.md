# Spider Solitaire — Complete Implementation Instructions

---

## About These Instructions

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Data model definitions (TypeScript types and sample data)
- UI/UX specifications (user flows, requirements, screenshots)
- Design system tokens (colors, typography)
- Test-writing instructions for TDD approach

**What you need to build:**
- Game state management (React state or a state library)
- Spider Solitaire game logic (rules, win detection)
- Card dealing and shuffling algorithms
- Undo system with move history
- Local storage persistence for user preferences
- Integration of the provided UI components with game state

**Important guidelines:**
- **DO NOT** redesign or restyle the provided components — use them as-is
- **DO** wire up the callback props to your game logic
- **DO** implement proper Spider Solitaire rules
- **DO** use test-driven development — write tests first using `tests.md` instructions
- The components are props-based and ready to integrate — focus on the game logic layer

---

## Test-Driven Development

Each section includes a `tests.md` file with detailed test-writing instructions. These are **framework-agnostic** — adapt them to your testing setup (Jest, Vitest, Playwright, etc.).

**For each section:**
1. Read `product-plan/sections/[section-id]/tests.md`
2. Write failing tests for key game logic and user flows
3. Implement the feature to make tests pass
4. Refactor while keeping tests green

---

## Product Overview

### Summary

A full-screen, two-deck Spider Solitaire game designed for ChromeBox. Runs entirely in the local browser with no server or remote connectivity required after installation. Built with accessibility in mind, featuring large cards, high contrast options, and simple controls.

### Key Features

- Three difficulty levels: 1, 2, and 4 suits
- Adjustable card size for visibility
- High contrast display options
- Customizable card art and backgrounds
- Unlimited undo functionality
- Preferences saved in local storage
- Full-screen gameplay optimized for ChromeBox
- Fully offline — no server or network required

### Architecture Note

This is a **local-only game application** with no backend required:
- All game logic runs in the browser
- User preferences stored in localStorage
- No authentication or user accounts
- No remote data persistence
- Can be deployed as a static site or PWA

---

# Milestone 1: Foundation

## Goal

Set up the foundational elements: design tokens, data model types, and application shell with toolbar, settings modal, and new game modal.

## What to Implement

### 1. Design Tokens

Configure your styling system with these tokens:

- See `product-plan/design-system/tokens.css` for CSS custom properties
- See `product-plan/design-system/tailwind-colors.md` for Tailwind configuration
- See `product-plan/design-system/fonts.md` for Google Fonts setup

**Colors:**
- Primary: `emerald` — New Game button, Deal button, selected states
- Secondary: `amber` — Default badge, warning states
- Neutral: `stone` — Toolbar background, text, borders

### 2. Data Model Types

Create TypeScript interfaces for the game entities:

- See `product-plan/data-model/types.ts` for interface definitions

**Core Types:**
- `Card` — suit, rank, faceUp
- `Column` — id, cards array
- `Game` — difficulty, moves, dealsRemaining, foundationsCompleted, columns
- `Difficulty` — 1 | 2 | 4
- `UserPreferences` — toolbar position, card size, themes, etc.

### 3. Application Shell

Copy the shell components from `product-plan/shell/components/` to your project:

- `AppShell.tsx` — Main layout wrapper with toolbar positioning
- `GameToolbar.tsx` — Bottom/top toolbar with game controls
- `SettingsModal.tsx` — User preferences modal
- `NewGameModal.tsx` — Difficulty selection modal

**Wire Up the Shell:**

The AppShell accepts these props:
- `stats` — Current game statistics (moves, suits completed)
- `preferences` — User preferences
- `canUndo` — Whether undo is available
- `canDeal` — Whether deal is available
- `onNewGame(difficulty)` — Called when user starts a new game
- `onUndo()` — Called when user clicks undo
- `onDeal()` — Called when user clicks deal
- `onPreferencesChange(prefs)` — Called when user changes settings

### 4. User Preferences Persistence

Implement localStorage persistence for UserPreferences:
- Load preferences on app start
- Save preferences when changed
- Provide sensible defaults

## Files to Reference

- `product-plan/design-system/` — Design tokens
- `product-plan/data-model/` — Type definitions
- `product-plan/shell/components/` — Shell React components

## Done When

- [ ] Design tokens are configured
- [ ] Data model types are defined
- [ ] Shell renders with toolbar
- [ ] New Game button opens difficulty modal
- [ ] Settings button opens preferences modal
- [ ] Preferences persist to localStorage

---

# Milestone 2: Game Board

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
- Detect and handle completed suits
- Detect win condition

## Recommended Approach: Test-Driven Development

See `product-plan/sections/game-board/tests.md` for detailed test-writing instructions.

## What to Implement

### Components

Copy components from `product-plan/sections/game-board/components/`:

- `GameBoard.tsx` — Main game board layout
- `Card.tsx` — Individual card (face-up/face-down)
- `Column.tsx` — Tableau column with overlapping cards
- `StockPile.tsx` — Stock pile with deal count
- `FoundationArea.tsx` — Completed suits indicator

### Game Logic

Implement Spider Solitaire rules:

**Initial Deal:**
- Shuffle 104 cards (2 decks based on difficulty)
- Deal 54 cards to tableau: 6 cards each to columns 0-3, 5 cards each to columns 4-9
- Only top card of each column is face-up
- Remaining 50 cards go to stock (5 deals of 10)

**Card Movement Rules:**
- Cards can be placed on a card one rank higher (any suit)
- Only same-suit sequences can be moved as a group
- Any card/sequence can be placed in an empty column

**Dealing from Stock:**
- Only allowed when no columns are empty
- Deal one card face-up to each of the 10 columns

**Suit Completion:**
- Detect K-Q-J-10-9-8-7-6-5-4-3-2-A of same suit
- Handle based on user preference (auto-move or highlight)
- Show celebration animation if enabled

**Win Condition:**
- Game is won when 8 suits are completed

### Undo System

Implement move history for unlimited undo:
- Record each move
- Allow reversal of any action

### Callbacks

Wire up these user actions:

| Callback | Description |
|----------|-------------|
| `onMoveCards(fromColumnId, cardIndex, toColumnId)` | Move cards between columns |
| `onDeal()` | Deal 10 cards from stock |
| `onSuitCompleted(suit)` | Handle completed suit |
| `onCardFlip(columnId, cardIndex)` | Flip exposed face-down card |

## Files to Reference

- `product-plan/sections/game-board/README.md` — Feature overview
- `product-plan/sections/game-board/tests.md` — Test-writing instructions
- `product-plan/sections/game-board/components/` — React components
- `product-plan/sections/game-board/types.ts` — TypeScript interfaces
- `product-plan/sections/game-board/sample-data.json` — Sample game state
- `product-plan/sections/game-board/screenshot.png` — Visual reference

## Expected User Flows

### Start a New Game
1. Click "New Game" → Modal opens
2. Select difficulty → Click "Start Game"
3. Cards are dealt, game begins

### Move Cards
1. Drag card/sequence from one column
2. Drop on valid target column
3. Cards move, undo becomes available

### Deal from Stock
1. Ensure no empty columns
2. Click "Deal" button
3. 10 cards dealt, deals remaining decrements

### Complete a Suit
1. Arrange K-A same-suit sequence
2. System detects completion
3. Cards move to foundation, celebration plays

### Win the Game
1. Complete 8th suit
2. Win message displayed

## Done When

- [ ] Tests written for game logic
- [ ] All tests pass
- [ ] Game board renders correctly
- [ ] Drag and drop works
- [ ] Deal button works
- [ ] Suit completion works
- [ ] Win detection works
- [ ] Undo works
- [ ] Matches visual design
