# Milestone 1: Foundation

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** None

---

## About These Instructions

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Data model definitions (TypeScript types and sample data)
- UI/UX specifications (user flows, requirements, screenshots)
- Design system tokens (colors, typography)

**What you need to build:**
- Game state management (React state or a state library)
- Game logic (card movement rules, win detection, undo system)
- Local storage persistence for user preferences
- Integration of the provided UI components with game state

**Important guidelines:**
- **DO NOT** redesign or restyle the provided components — use them as-is
- **DO** wire up the callback props to your game logic
- **DO** implement the Spider Solitaire rules correctly
- **DO** implement proper state management for undo functionality
- The components are props-based and ready to integrate — focus on the game logic layer

---

## Goal

Set up the foundational elements: design tokens, data model types, routing structure, and application shell with toolbar, settings modal, and new game modal.

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
- See `product-plan/data-model/README.md` for entity relationships

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
- `preferences` — User preferences (toolbar position, show statistics, etc.)
- `canUndo` — Whether undo is available
- `canDeal` — Whether deal is available
- `onNewGame(difficulty)` — Called when user starts a new game
- `onUndo()` — Called when user clicks undo
- `onDeal()` — Called when user clicks deal
- `onPreferencesChange(prefs)` — Called when user changes settings

### 4. User Preferences Persistence

Implement localStorage persistence for UserPreferences:

```typescript
interface UserPreferences {
  toolbarPosition: 'top' | 'bottom'
  showStatistics: boolean
  cardSize: 'small' | 'medium' | 'large'
  highContrast: boolean
  cardArt: string
  theme: string
}
```

- Load preferences on app start
- Save preferences when changed
- Provide sensible defaults

## Files to Reference

- `product-plan/design-system/` — Design tokens
- `product-plan/data-model/` — Type definitions
- `product-plan/shell/README.md` — Shell design intent
- `product-plan/shell/components/` — Shell React components
- `product-plan/shell/screenshot.png` — Shell visual reference (if exists)

## Done When

- [ ] Design tokens are configured (colors, fonts)
- [ ] Data model types are defined
- [ ] Shell renders with toolbar at configurable position
- [ ] New Game button opens difficulty selection modal
- [ ] Settings button opens preferences modal
- [ ] User preferences persist to localStorage
- [ ] Responsive on different screen sizes
