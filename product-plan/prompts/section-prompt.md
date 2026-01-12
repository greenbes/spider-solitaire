# Section Implementation Prompt

## Define Section Variables

- **SECTION_NAME** = Game Board
- **SECTION_ID** = game-board
- **NN** = 02

---

I need you to implement the **SECTION_NAME** section of my Spider Solitaire application.

## Instructions

Please carefully read and analyze the following files:

1. **@product-plan/product-overview.md** — Product summary for overall context
2. **@product-plan/instructions/incremental/NN-SECTION_ID.md** — Specific instructions for this section

Also review the section assets:
- **@product-plan/sections/SECTION_ID/README.md** — Feature overview and design intent
- **@product-plan/sections/SECTION_ID/tests.md** — Test-writing instructions (use TDD approach)
- **@product-plan/sections/SECTION_ID/components/** — React components to integrate
- **@product-plan/sections/SECTION_ID/types.ts** — TypeScript interfaces
- **@product-plan/sections/SECTION_ID/sample-data.json** — Test data

## Before You Begin

Please ask me clarifying questions about:

1. **Game Logic**
   - How should I implement the card movement validation?
   - What algorithm for detecting completed suits?
   - How should the undo stack be structured?

2. **Integration**
   - Where does the game state live? (Parent component, context, store?)
   - How should I connect the GameBoard to the AppShell callbacks?

3. **Any Other Clarifications**
   - Questions about specific Spider Solitaire rules
   - Questions about the drag and drop implementation

## Implementation Approach

Use test-driven development:
1. Read the `tests.md` file and write failing tests first
2. Implement the feature to make tests pass
3. Refactor while keeping tests green

Lastly, be sure to ask me if I have any other notes to add for this implementation.

Once I answer your questions, proceed with implementation.
