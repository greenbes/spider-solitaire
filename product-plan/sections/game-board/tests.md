# Test Instructions: Game Board

These test-writing instructions are **framework-agnostic**. Adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, React Testing Library, etc.).

## Overview

The Game Board is the core playing surface for Spider Solitaire. Test the game logic (card movement rules, dealing, suit completion, win detection) and UI interactions (drag and drop, button clicks, visual state changes).

---

## Game Logic Tests

### Card Movement Validation

**Test: Valid moves are accepted**

- Moving a single face-up card to a column where the top card is one rank higher
- Moving a same-suit sequence (e.g., 7♠-6♠-5♠) to a column where top card is one rank higher
- Moving any card/sequence to an empty column

**Expected Results:**
- [ ] Move is executed
- [ ] Move is recorded in undo history
- [ ] Move count increments

**Test: Invalid moves are rejected**

- Moving a card to a column where the top card is NOT one rank higher
- Moving a mixed-suit sequence (e.g., 7♠-6♥) as a group
- Moving a face-down card

**Expected Results:**
- [ ] Move is rejected (cards return to original position)
- [ ] No change to game state
- [ ] Move count does not increment

---

### Dealing from Stock

**Test: Deal succeeds when no empty columns**

**Setup:**
- All 10 columns have at least one card
- Stock has deals remaining (dealsRemaining > 0)

**Steps:**
1. Click "Deal" button (or stock pile)

**Expected Results:**
- [ ] 10 cards are dealt (one to each column, face-up)
- [ ] dealsRemaining decrements by 1
- [ ] Move is recorded in undo history

**Test: Deal is blocked when empty column exists**

**Setup:**
- At least one column is empty
- Stock has deals remaining

**Expected Results:**
- [ ] Deal button is disabled OR shows warning when clicked
- [ ] Message "Fill all empty columns before dealing" is visible
- [ ] No cards are dealt

**Test: Deal is blocked when stock is empty**

**Setup:**
- dealsRemaining === 0

**Expected Results:**
- [ ] Deal button is disabled
- [ ] Stock pile shows empty state

---

### Suit Completion

**Test: Completed suit is detected**

**Setup:**
- A column contains K-Q-J-10-9-8-7-6-5-4-3-2-A of same suit at the top

**Expected Results:**
- [ ] Completed sequence is detected
- [ ] Based on user preference:
  - Auto-move: Cards animate to foundation
  - Manual: Cards are highlighted
- [ ] foundationsCompleted increments by 1
- [ ] onSuitCompleted callback is called with the suit

**Test: Near-completion is NOT detected**

**Setup:**
- A column has K-Q-J-10-9-8-7-6-5-4-3-2 (missing Ace)

**Expected Results:**
- [ ] No completion is triggered
- [ ] foundationsCompleted does not change

---

### Win Detection

**Test: Win is detected when 8 suits completed**

**Setup:**
- foundationsCompleted === 7
- Player completes final suit

**Expected Results:**
- [ ] Win state is triggered after 8th suit completion
- [ ] Win message or animation is displayed
- [ ] Game is marked as won

---

### Card Flipping

**Test: Face-down card flips when exposed**

**Setup:**
- Column has face-down cards with one face-up card on top
- Player moves the face-up card away

**Expected Results:**
- [ ] Top face-down card automatically flips face-up
- [ ] Card is now draggable
- [ ] onCardFlip callback is called

---

### Undo System

**Test: Undo reverses card movement**

**Setup:**
- Player has made at least one move

**Steps:**
1. Click "Undo" button

**Expected Results:**
- [ ] Last move is reversed
- [ ] Cards return to previous positions
- [ ] Move count decrements (or stays if tracking undo separately)
- [ ] Undo button is disabled if no more moves to undo

**Test: Undo reverses deal**

**Setup:**
- Player has dealt cards from stock

**Steps:**
1. Click "Undo" button

**Expected Results:**
- [ ] 10 cards return to stock
- [ ] dealsRemaining increments
- [ ] Column state returns to pre-deal state

---

## User Flow Tests

### Flow 1: Start a New Game

**Steps:**
1. Click "New Game" button
2. Modal appears with difficulty options (1, 2, 4 suits)
3. Select difficulty (default is 4 suits)
4. Click "Start Game"

**Expected Results:**
- [ ] Modal opens with title "New Game"
- [ ] Three difficulty options are shown with spade icons
- [ ] 4 Suits is pre-selected and marked "Default"
- [ ] After clicking Start Game:
  - Modal closes
  - 104 cards are shuffled (using 1, 2, or 4 suit types based on difficulty)
  - 54 cards dealt to tableau (6 to columns 0-3, 5 to columns 4-9)
  - Only top card of each column is face-up
  - 50 cards in stock (5 deals)
  - Move count reset to 0
  - Foundations reset to 0

### Flow 2: Move Cards Between Columns

**Steps:**
1. Drag a face-up card from one column
2. Drop on a valid target column

**Expected Results:**
- [ ] Card follows mouse during drag
- [ ] Valid drop targets highlight (if preference enabled)
- [ ] On drop: card moves to new column
- [ ] Undo button becomes enabled
- [ ] Move count increments

### Flow 3: Complete a Suit

**Steps:**
1. Arrange K through A of same suit in a column
2. Place the Ace to complete the sequence

**Expected Results:**
- [ ] Completion is detected
- [ ] Cards animate to foundation area (if auto-move enabled)
- [ ] Celebration animation plays (if enabled)
- [ ] Foundation counter shows +1 (e.g., "3/8")
- [ ] Column may now have face-down card exposed → it flips

### Flow 4: Win the Game

**Steps:**
1. Complete 8 suits

**Expected Results:**
- [ ] Win message appears
- [ ] Option to start new game is presented
- [ ] Statistics shown (moves taken, etc.)

---

## Empty State Tests

### Primary Empty State: New Installation

**Scenario:** App loads for the first time

**Expected Results:**
- [ ] New game starts automatically OR prompt to start game is shown
- [ ] User can immediately begin playing

### Empty Column State

**Scenario:** Player moves all cards out of a column

**Expected Results:**
- [ ] Empty column shows dashed border placeholder
- [ ] "Empty" text label is visible
- [ ] Any card can be placed in the empty column
- [ ] Deal button is disabled while empty column exists

### Empty Stock State

**Scenario:** All 5 deals have been used

**Expected Results:**
- [ ] Stock pile shows empty state (no cards)
- [ ] Deal button is disabled
- [ ] "Empty" text shown on stock area

---

## Component Tests

### Card Component

**Renders face-up card correctly:**
- [ ] Shows rank (A, 2-10, J, Q, K)
- [ ] Shows suit symbol (♠ ♥ ♦ ♣)
- [ ] Red suits (hearts, diamonds) use red color
- [ ] Black suits (spades, clubs) use dark color

**Renders face-down card correctly:**
- [ ] Shows card back pattern (emerald gradient)
- [ ] No rank or suit visible

### Column Component

**Renders empty column:**
- [ ] Shows dashed border placeholder
- [ ] Accepts drop events

**Renders cards with correct overlap:**
- [ ] Face-down cards overlap more (smaller offset)
- [ ] Face-up cards show more of each card

### StockPile Component

**With deals remaining:**
- [ ] Shows stacked card effect
- [ ] Shows deal count number
- [ ] Clickable and shows hover state

**Empty state:**
- [ ] Shows empty placeholder
- [ ] "Empty" text visible
- [ ] Not clickable

### FoundationArea Component

**Shows correct count:**
- [ ] Displays "X/8" format
- [ ] Trophy icon visible

**Slot indicators:**
- [ ] 8 slots shown
- [ ] Completed slots are amber colored
- [ ] Incomplete slots are empty/gray

---

## Edge Cases

- [ ] Handle very long games (100+ moves) without performance issues
- [ ] Preserve game state correctly through undo/redo cycles
- [ ] Handle rapid clicking (debounce if needed)
- [ ] Graceful handling when dragging outside the game area
- [ ] Mobile touch events work for drag and drop

---

## Sample Test Data

```typescript
// Sample card
const card: Card = {
  suit: 'spades',
  rank: 'K',
  faceUp: true
}

// Sample column with cards
const column: Column = {
  id: 'col-0',
  cards: [
    { suit: 'hearts', rank: '5', faceUp: false },
    { suit: 'spades', rank: 'K', faceUp: true },
    { suit: 'spades', rank: 'Q', faceUp: true }
  ]
}

// Sample game state
const game: Game = {
  difficulty: 4,
  moves: 42,
  dealsRemaining: 3,
  foundationsCompleted: 2,
  columns: [column, /* ... 9 more columns */]
}

// Sample preferences
const preferences: GameBoardPreferences = {
  showValidDropTargets: false,
  autoMoveCompletedSuits: true,
  showCelebration: true
}
```

---

## Notes for Test Implementation

- Mock drag events for testing drag and drop
- Use snapshot testing for component visual states
- Test accessibility: keyboard navigation, screen reader announcements
- Test responsive behavior at different viewport sizes
- Performance test with full game state (104 cards distributed)
