# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Spider Solitaire — a full-screen, two-deck card game PWA for ChromeBox. Local-only browser application with no backend required. All game logic runs client-side; user preferences persist in localStorage.

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production (tsc + vite build)
npm run preview  # Preview production build
npm run test     # Run tests with Vitest (watch mode)
npm run test:run # Run tests once
```

## Tech Stack

- **Framework:** Vite + React + TypeScript
- **State Management:** useReducer with undo history
- **Styling:** Tailwind CSS v4
- **PWA:** vite-plugin-pwa with Workbox
- **Testing:** Vitest + React Testing Library

## Architecture

```
src/
├── components/
│   ├── shell/           # AppShell, GameToolbar, SettingsModal, NewGameModal
│   └── game-board/      # GameBoard, Card, Column, StockPile, FoundationArea
├── game/
│   ├── types.ts         # Card, Column, Game, Difficulty, GameState, GameAction
│   ├── constants.ts     # RANKS, SUITS, RANK_ORDER, NUM_COLUMNS
│   ├── deck.ts          # createDeck, shuffleDeck
│   ├── deal.ts          # dealInitialCards, dealFromStock
│   ├── moves.ts         # isValidMove, canMoveSameSequence, moveCards, flipTopCard
│   ├── completion.ts    # detectCompletedSuit, removeCompletedSuit, isWinCondition
│   └── reducer.ts       # gameReducer with actions: NEW_GAME, MOVE_CARDS, DEAL, UNDO
├── hooks/
│   └── usePreferences.ts # localStorage persistence for UserPreferences
└── App.tsx              # Main app wiring state to components
```

## Game Rules

- **Initial deal:** 54 cards to 10 columns (6/6/6/6/5/5/5/5/5/5), only top card face-up
- **Stock:** 50 cards, dealt 10 at a time (5 deals total)
- **Valid move:** Place card on any card one rank higher, or empty column
- **Sequence move:** Only same-suit descending sequences can move as group
- **Deal restriction:** Cannot deal when any column is empty
- **Completion:** K-Q-J-10-9-8-7-6-5-4-3-2-A of same suit → moves to foundation
- **Win:** 8 foundations completed

## Key Files

- `src/game/reducer.ts` — All game state logic
- `src/App.tsx` — Main component wiring
- `src/components/game-board/GameBoard.tsx` — Drag-and-drop handling
- `vite.config.ts` — PWA configuration

## Design System

**Colors (Tailwind):**
- Primary: `emerald` — buttons, selected states, game board background
- Secondary: `amber` — highlights, warnings, valid drop targets
- Neutral: `stone` — backgrounds, text, borders

**Typography:**
- DM Sans (all UI text)
- IBM Plex Mono (statistics, numbers)
