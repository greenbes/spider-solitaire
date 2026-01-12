# Spider Solitaire — Product Overview

## Summary

A full-screen, two-deck Spider Solitaire game designed for ChromeBox. Runs entirely in the local browser with no server or remote connectivity required after installation. Built with accessibility in mind, featuring large cards, high contrast options, and simple controls for a comfortable playing experience.

**Key Features:**
- Three difficulty levels: 1, 2, and 4 suits
- Adjustable card size for visibility
- High contrast display options
- Customizable card art and backgrounds
- Unlimited undo functionality
- Preferences saved in local storage
- Full-screen gameplay optimized for ChromeBox
- Fully offline — no server or network required

## Planned Sections

1. **Game Board** — The main playing surface with tableau columns, stock pile, and completed suit foundations where cards are moved and stacked.
2. **Game Controls** — New game, difficulty selection (1/2/4 suits), undo functionality, and dealing from the stock pile.
3. **Appearance & Accessibility** — Card size adjustment, high contrast mode, customizable card art, themes, and backgrounds.

## Data Model

**Entities:**
- **Card** — A playing card with suit (spades, hearts, diamonds, clubs) and rank (Ace through King)
- **Column** — One of 10 tableau columns holding a stack of cards
- **Stock** — Remaining undealt cards (50 cards, dealt 10 at a time)
- **Foundation** — A completed King-to-Ace same-suit sequence
- **Game** — Current game state including difficulty, card positions, and move history
- **Move** — A recorded player action for undo functionality
- **UserPreferences** — Saved settings in local storage

**Relationships:**
- Game has 10 Columns, one Stock, up to 8 Foundations, and many Moves
- Column, Stock each contain Cards
- UserPreferences persists independently across game sessions

## Design System

**Colors:**
- Primary: `emerald` — for buttons, key actions
- Secondary: `amber` — for highlights, warnings
- Neutral: `stone` — for backgrounds, text, borders

**Typography:**
- Heading: DM Sans
- Body: DM Sans
- Mono: IBM Plex Mono

## Implementation Sequence

Build this product in milestones:

1. **Foundation** — Set up design tokens, data model types, and application shell (toolbar, settings modal, new game modal)
2. **Game Board** — Implement the main game board with 10 tableau columns, stock pile, and foundation area

Each milestone has a dedicated instruction document in `product-plan/instructions/`.

## Architecture Note

This is a **local-only game application** with no backend required:
- All game logic runs in the browser
- User preferences stored in localStorage
- No authentication or user accounts
- No remote data persistence
- Can be deployed as a static site or PWA
