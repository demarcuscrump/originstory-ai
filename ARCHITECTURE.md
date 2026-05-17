# Origin Story AI — Architecture

Origin Story is a React 19 + TypeScript infinite-canvas comic-book RPG that blends a **deterministic** game engine with **generative AI** for narrative and art. The architecture was refactored from a monolithic `App.tsx` (1 700 LOC) into a modular layer cake of store → hooks → pages → components.

---

## Core Principles

1. **Hybrid AI Loop** — cheap deterministic actions (~5 ms) for routine play; rich generative calls for milestone events and boss fights.
2. **Infinite Canvas** — a virtualized, vertically scrolling event log (`react-virtuoso`) acting as the "issues" of a comic book.
3. **Stat-Driven Resolution** — every action resolves against 6 core stats: **Wealth · Sanity · Justice · Glory · Suspicion · Retcon Points**.
4. **IndexedDB Persistence** — game state auto-saves via `localforage` (backed by IndexedDB), eliminating the 5 MB `localStorage` ceiling.

---

## Directory Structure

```text
OriginStoryAI/
├── App.tsx                 # Thin phase router (≈45 LOC)
├── types.ts                # TypeScript enums & interfaces
├── index.tsx               # React DOM entry + ErrorBoundary
│
├── constants/
│   └── gameData.ts         # STANDARD_OUTCOMES, INITIAL_STATS, action configs, helpers
│
├── store/
│   └── useGameStore.ts     # Zustand store (state + setters + persist → localforage)
│
├── hooks/
│   └── useGameActions.ts   # Complex game logic (action resolution, showdowns, legacy)
│
├── pages/
│   ├── TitleScreen.tsx
│   ├── CreationScreen.tsx
│   ├── PlayingScreen.tsx   # Virtualized infinite canvas + modals + controls
│   ├── GameOverScreen.tsx
│   └── VictoryScreen.tsx
│
├── components/             # Presentational UI (Button, EventPanel, StatRadar, modals…)
├── services/
│   ├── aiService.ts        # OpenRouter API (Claude 3.5 Haiku + GPT-5.4 Image)
│   └── audioService.ts     # Web Audio API sound effects
│
└── __tests__/
    ├── gameData.test.ts    # Stat clamping, outcomes, alignment actions
    └── useGameStore.test.ts # Store init, setters, reset
```

---

## State Machine

```
TITLE ──► CREATION ──► PLAYING ──► VICTORY
                          │           │
                          ▼           ▼
                       GAMEOVER ◄─────┘
                          │
                          ├── Retcon → PLAYING
                          └── Legacy → CREATION
```

`App.tsx` reads `gamePhase` from the Zustand store and renders the corresponding page component via a `switch` statement. No routing library needed.

---

## State Management (`store/useGameStore.ts`)

All game state lives in a single **Zustand** store, split into:

| Layer | Description |
|-------|-------------|
| **Persisted** | `character`, `stats`, `history`, `nemesis`, `upgrades`, `sidekicks`, `npcs`, `assets`, `bpRewards`, `archives` — saved to IndexedDB via `zustand/middleware/persist` + `localforage` |
| **Transient UI** | `activeModal`, `isProcessing`, `fxState`, `suggestedActions` — reset on reload |

Functional updaters are supported for every setter (e.g. `setStats(prev => ({ ...prev, wealth: 99 }))`).

### Why Zustand over Context / Redux?

- Zero boilerplate — no providers, reducers, or action constants.
- Selector-based re-renders — components subscribe only to the slices they need.
- First-class `persist` middleware with pluggable storage.

---

## Game Logic (`hooks/useGameActions.ts`)

All complex async game logic is extracted into a single custom hook that reads/writes the store:

- **`handleAction`** — the main turn loop: stat effects → archetype bonuses → asset upkeep → doomsday clock → arc events → game-over checks.
- **`handleShowdown`** — boss fight resolution with upgrade bonuses and D20-style roll.
- **`handleCharacterComplete`** — origin stat allocation, nemesis generation, upgrade/NPC seeding.
- **`handleLegacy`** / **`handleRetcon`** — New Game+ with inherited stats / timeline rewind.

This keeps page components purely presentational.

---

## The Hybrid Engine (`services/aiService.ts`)

| Loop | Trigger | Model | Latency |
|------|---------|-------|---------|
| **Deterministic** | Standard actions (Patrol, Day Job, Rest…) | Local `STANDARD_OUTCOMES` dictionary | ~5 ms |
| **Generative Text** | Arc events, Crises, Showdowns, Origins | `anthropic/claude-3.5-haiku` via OpenRouter | 1–3 s |
| **Generative Image** | Panel illustrations, entity portraits | `openai/gpt-5.4-image-2` via OpenRouter | 45–60 s (async) |

### Anti-Hallucination: Safe JSON Parsing

All AI prompts enforce **object wrapping** — the LLM is instructed to return `{ "narrative": "..." }` instead of raw text. `safeJSONParse` in `aiService.ts` catches malformed responses, strips markdown fences, and falls back gracefully, preventing `.map is not a function` crashes.

---

## Performance

- **List Virtualization** — `react-virtuoso` renders only visible event panels in the infinite canvas, keeping DOM node count constant regardless of game length.
- **Async Image Loading** — panel images generate in the background; a spinner placeholder keeps the UI responsive.
- **IndexedDB Persistence** — `localforage` auto-selects the best available driver (IndexedDB → WebSQL → localStorage), eliminating quota errors.

---

## Testing

Vitest tests cover:

- `clampStat` / `clampAllStats` — boundary clamping for all stat fields.
- `getActionOutcome` — deterministic outcome pool selection and fallback.
- `getJusticeLabel` / `getActionsForAlignment` — alignment-specific label and action generation.
- `useGameStore` — init state, phase transitions, XP grants, functional updaters, reset.

Run: `npm test`
