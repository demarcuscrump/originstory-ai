# Origin Story AI — Architecture

Origin Story is a React 19 + TypeScript comic-book RPG that blends a **deterministic** game engine with **generative AI** for narrative and art. The architecture was refactored from a monolithic `App.tsx` (1 700 LOC) into a modular layer cake of store → hooks → pages → components.

---

## Core Principles

1. **Hybrid AI Loop** — cheap deterministic actions (~5 ms) for routine play; rich generative calls for milestone events and boss fights.
2. **Current-Panel Cockpit** — the active story beat, generated art, and next choices stay visible together; older beats become compact context or Long Box archives.
3. **Stat-Driven Resolution** — every action resolves against 6 core stats: **Wealth · Sanity · Justice · Glory · Suspicion · Retcon Points**.
4. **IndexedDB Persistence** — game state auto-saves via `localforage` (backed by IndexedDB), eliminating the 5 MB `localStorage` ceiling.
5. **Fixed Visual Theme** — universe tone affects narrative, not the global UI palette; the app uses a consistent dark comic-console interface for readability.

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
│   ├── PlayingScreen.tsx   # Current-panel cockpit + modals + controls
│   ├── GameOverScreen.tsx
│   └── VictoryScreen.tsx
│
├── components/             # Presentational UI (Button, modals, dossiers)
├── services/
│   ├── aiService.ts        # OpenRouter API calls and fallbacks
│   ├── aiSettings.ts       # BYOK settings, model defaults, credential resolution
│   └── audioService.ts     # Web Audio API sound effects
│
└── __tests__/
    ├── aiSettings.test.ts  # BYOK save, clear, and environment fallback
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
| **Generative Image** | Panel illustrations, entity portraits | `black-forest-labs/flux.2-klein-4b` via OpenRouter | Provider-dependent fast mode (async) |

### BYOK Credential Flow

Origin Story supports browser BYOK for portfolio play. `components/AiSettingsModal.tsx`
lets a player paste an OpenRouter key and optional model IDs. `services/aiSettings.ts`
stores those values in browser `localStorage`, resolves them before every AI call,
and falls back to `VITE_OPENROUTER_*` development environment variables when no
browser key is saved.

Image generation uses OpenRouter's chat completions image pathway. Flux models
are treated as image-only providers and are requested with `modalities: ["image"]`;
mixed-output image models can still use `["image", "text"]`.

The game does not require a key to start. If no key is available, deterministic
actions, stat changes, archives, legacy, and fallback story copy continue to work.
AI-assisted origins, dynamic character analysis, NPCs, nemeses, suggested actions,
and images are skipped or replaced with safe fallback text.

For a public hosted version, the BYOK path is acceptable for a portfolio demo.
A paid production release should move OpenRouter calls behind a server proxy or
gateway so rate limits, abuse controls, and key handling can be managed centrally.

### Anti-Hallucination: Safe JSON Parsing

All AI prompts enforce **object wrapping** — the LLM is instructed to return `{ "narrative": "..." }` instead of raw text. `safeJSONParse` in `aiService.ts` catches malformed responses, strips markdown fences, and falls back gracefully, preventing `.map is not a function` crashes.

---

## Performance

- **Output-First Play Surface** — the latest story beat is rendered as one stable panel, avoiding nested scrollbars during normal play.
- **Full-Bleed Panel Rendering** — generated panel art uses `object-cover` in a stable frame, with wide-panel prompts to reduce letterboxing and preserve a comic-page feel.
- **Async Image Loading** — panel images generate in the background; a spinner placeholder keeps the UI responsive without blocking choices.
- **Visible Image Failures** — if a provider returns no image, the panel keeps a readable fallback state with a retry affordance instead of silently collapsing the art frame.
- **IndexedDB Persistence** — `localforage` auto-selects the best available driver (IndexedDB → WebSQL → localStorage), eliminating quota errors.

---

## Testing

Vitest tests cover:

- `aiSettings` — browser BYOK persistence, model defaults, and environment fallback.
- `clampStat` / `clampAllStats` — boundary clamping for all stat fields.
- `getActionOutcome` — deterministic outcome pool selection and fallback.
- `getJusticeLabel` / `getActionsForAlignment` — alignment-specific label and action generation.
- `useGameStore` — init state, phase transitions, XP grants, functional updaters, reset.

Run: `npm test`
