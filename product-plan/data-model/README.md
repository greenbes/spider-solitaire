# Data Model

## Entities

### Card
A playing card with a suit (spades, hearts, diamonds, clubs) and rank (Ace through King). Cards can be face-up or face-down on the tableau.

### Column
One of the 10 tableau columns on the game board. Each column holds a stack of cards, with only face-up cards in descending sequence being movable.

### Stock
The remaining undealt cards after the initial deal. Contains 50 cards that are dealt 10 at a time (one to each column) when the player chooses to deal.

### Foundation
A completed sequence of 13 cards of the same suit, running from King down to Ace. When completed, these cards are removed from play. A winning game has 8 foundations.

### Game
The current game state, including difficulty level (1, 2, or 4 suits), all card positions, and move history for undo functionality.

### Move
A recorded player action (moving cards between columns or dealing from stock) that can be undone. The game maintains a history of moves for unlimited undo.

### UserPreferences
The player's saved settings stored in local storage, including card size, high contrast mode, selected card art, theme, and background.

## Relationships

- Game has 10 Columns
- Game has one Stock
- Game has many Foundations (up to 8 when won)
- Game has many Moves (undo history)
- Column has many Cards
- Stock has many Cards
- Foundation contains 13 Cards of the same suit
- UserPreferences is independent of Game (persists across sessions)

## Notes

- All game state lives in memory during play
- UserPreferences are persisted to localStorage
- No backend or database required
- Game state is NOT persisted between sessions (by design)
