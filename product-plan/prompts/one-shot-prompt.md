# One-Shot Implementation Prompt

I need you to implement a complete Spider Solitaire game based on detailed design specifications and UI components I'm providing.

## Instructions

Please carefully read and analyze the following files:

1. **@product-plan/product-overview.md** — Product summary with sections and data model overview
2. **@product-plan/instructions/one-shot-instructions.md** — Complete implementation instructions for all milestones

After reading these, also review:
- **@product-plan/design-system/** — Color and typography tokens
- **@product-plan/data-model/** — Entity types and relationships
- **@product-plan/shell/** — Application shell components (toolbar, modals)
- **@product-plan/sections/game-board/** — Game board components, types, sample data, and test instructions

## Before You Begin

Please ask me clarifying questions about:

1. **Tech Stack**
   - What React framework should I use? (Create React App, Vite, Next.js static export?)
   - Should this be a Progressive Web App (PWA) for offline support?
   - Any bundling or deployment preferences for ChromeBox?

2. **Game Logic Implementation**
   - Should I use a state management library (Zustand, Jotai) or React's built-in useState/useReducer?
   - Any specific requirements for card shuffling algorithm (Fisher-Yates)?
   - How should the undo system be implemented (move stack)?

3. **Deployment**
   - How will this be installed on the ChromeBox?
   - Should it be a Chrome app, a PWA, or a local HTML file?

4. **Any Other Clarifications**
   - Questions about specific game rules
   - Questions about the UI components
   - Accessibility requirements beyond what's shown

Lastly, be sure to ask me if I have any other notes to add for this implementation.

Once I answer your questions, create a comprehensive implementation plan before coding.
