# Spider Solitaire

A full-screen, two-deck Spider Solitaire PWA for ChromeBox. Local-only browser application with no backend required.

## Features

- Classic Spider Solitaire gameplay with 1, 2, or 4 suit difficulty
- Drag-and-drop card movement
- Undo support with full history
- Hint system with visual card highlighting
- Multiple card art styles (Classic, Modern, Minimal)
- Theme support (Green Felt, Blue Felt, Wood, Dark)
- Adjustable card sizes
- PWA support for offline play

## Development

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run test     # Run tests (watch mode)
npm run test:run # Run tests once
```

## Tech Stack

- **Framework:** Vite + React + TypeScript
- **State Management:** useReducer with undo history
- **Styling:** Tailwind CSS v4
- **PWA:** vite-plugin-pwa with Workbox
- **Testing:** Vitest + React Testing Library

---

## Task Progress

> Last Updated: 2026-01-18

### Summary

| Status | Count | Progress |
|--------|-------|----------|
| Completed | 5 | ████████████████████████████████████████ 100% |
| Pending | 0 | |
| **Total** | **5** | |

---

### Completed

- [x] **#1** Add Hint button to suggest next move with card highlighting
  - Type: feature | Priority: medium | Complexity: medium-high
  - Completed: 2026-01-18

- [x] **#2** Move Hint button to left of Moves indicator
  - Type: ui | Priority: low | Complexity: low
  - Completed: 2026-01-18

- [x] **#3** Flash hint cards 10 times then auto-dismiss
  - Type: enhancement | Priority: low | Complexity: low-medium
  - Completed: 2026-01-18

- [x] **#4** Create static errors.html with generic error message
  - Type: ui | Priority: medium | Complexity: low
  - Completed: 2026-01-18

- [x] **#5** Create justfile with S3 deploy action
  - Type: devops | Priority: medium | Complexity: low
  - Completed: 2026-01-18

---

## Game Rules

- **Initial deal:** 54 cards to 10 columns (6/6/6/6/5/5/5/5/5/5), only top card face-up
- **Stock:** 50 cards, dealt 10 at a time (5 deals total)
- **Valid move:** Place card on any card one rank higher, or empty column
- **Sequence move:** Only same-suit descending sequences can move as group
- **Deal restriction:** Cannot deal when any column is empty
- **Completion:** K-Q-J-10-9-8-7-6-5-4-3-2-A of same suit moves to foundation
- **Win:** 8 foundations completed

## License

MIT
