# Application Shell

## Overview

A minimal full-screen game shell optimized for Spider Solitaire on ChromeBox. The shell provides a configurable toolbar with game controls and modals, maximizing space for the game board.

## Layout Pattern

Full-screen layout with a single toolbar. The game board fills all remaining space. Toolbar position is user-configurable (top or bottom, default: bottom).

## Components

### AppShell

Main wrapper that manages layout and modal state.

**Props:**
- `children` — Game board content
- `stats` — Current game stats (moves, suits completed)
- `preferences` — User preferences
- `canUndo` — Whether undo is available
- `canDeal` — Whether deal is available
- `onNewGame(difficulty)` — Start new game callback
- `onUndo()` — Undo callback
- `onDeal()` — Deal callback
- `onPreferencesChange(prefs)` — Preferences changed callback

### GameToolbar

Bottom/top toolbar with game controls and statistics.

**Contains:**
- New Game button (emerald, opens modal)
- Undo button (disabled when no moves)
- Deal button (emerald, disabled when can't deal)
- Statistics display (moves count, suits completed)
- Settings button (gear icon)

### NewGameModal

Difficulty selection modal.

**Features:**
- 1 Suit option (easiest)
- 2 Suits option (medium)
- 4 Suits option (hardest, default)
- Visual spade icons for each option
- "Default" badge on 4 suits

### SettingsModal

User preferences modal.

**Settings:**
- Card Size (Small / Medium / Large)
- High Contrast Mode (toggle)
- Card Art (Classic / Modern / Minimal)
- Background Theme (Green Felt / Blue Felt / Wood / Dark)
- Toolbar Position (Top / Bottom)
- Show Statistics (toggle)

## Visual Reference

See `screenshot.png` for the target UI design (if available).
