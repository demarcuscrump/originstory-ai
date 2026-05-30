<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# Origin Story AI

**AI-powered comic book role-playing game.**

Hybrid Engine. Dynamic Scenarios. Dark Comic Cockpit.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Zustand](https://img.shields.io/badge/Zustand-5-764ABC?logo=react&logoColor=white)](https://github.com/pmndrs/zustand)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Vitest](https://img.shields.io/badge/Vitest-4-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev)
[![CI](https://github.com/demarcuscrump/originstory-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/demarcuscrump/originstory-ai/actions/workflows/ci.yml)
[![Anthropic Claude](https://img.shields.io/badge/Claude_3.5_Haiku-D4C5B9?logo=anthropic&logoColor=black)](https://anthropic.com)
[![FLUX.2 Klein](https://img.shields.io/badge/FLUX.2_Klein-fast_image-FFD21F?labelColor=111111)](https://openrouter.ai/black-forest-labs/flux.2-klein-4b)
[![License](https://img.shields.io/badge/License-Proprietary-red)](#license)
</div>

---

## Portfolio Demo

Origin Story opens directly into the playable comic-book loop: create a hero or villain, generate an origin, make civilian/hero/villain choices, and archive finished runs in the Long Box.

The deterministic game loop is explorable without an API key. Players can use in-app BYOK settings to add an OpenRouter key for generative story panels, character analysis, NPCs, villains, and image moments.

**Current status:** paused for a UX-first redesign. The concept is strong, but the current interface should be treated as a prototype, not the final portfolio-ready presentation. See the [Product Brief](docs/PRODUCT_BRIEF.md) and [Design Spec](docs/DESIGN_SPEC.md) for the reset requirements.

---

Origin Story is a narrative role-playing game where you create and manage a superhero or villain throughout their career. Featuring a unique hybrid engine, the game blends the instant responsiveness of traditional RPGs with the boundless creativity of Generative AI via OpenRouter.

## The Hybrid AI Engine
To ensure high performance and economic viability, the game operates on two layers:
1. **The Deterministic Layer:** Mundane actions (patrols, day jobs) use instant, pre-written text resolution with immediate stat calculation. This keeps the core game loop fast and snappy.
2. **The Generative Layer:** Milestone events (Character Origins, Boss Fights, Crises, and Arc Events) trigger calls to the **OpenRouter API** (`anthropic/claude-3.5-haiku` and `black-forest-labs/flux.2-klein-4b`) to dynamically write and illustrate key moments in your character's career.

For an in-depth look at the state machine, save debouncing, and API handling, please see the [ARCHITECTURE.md](ARCHITECTURE.md).

## Features
- **Dynamic Character Creation**: Define your origin, archetype, and powers, and watch the AI generate your unique origin story.
- **Stat Management**: Balance 6 core resources: Wealth, Sanity, Justice, Glory, Suspicion, and Retcon Points.
- **Dark Comic Cockpit**: Keep the latest story beat, generated art, next choices, stats, and nemesis pressure visible together in one fixed, easy-on-the-eyes theme.
- **The Nemesis System**: A persistent, dynamically generated rival plots against you. If you don't keep their "Doomsday Clock" down, they will enact their master plan.
- **Legacy Mechanics**: Retire or fall in battle to pass down inherited wealth and glory to the next generation of heroes.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```

The app is playable without an API key. To unlock AI moments as a player, open **AI Settings** inside the app and paste an OpenRouter key. The key is stored only in that browser's local storage and is not committed to the repo.

For development defaults, you may also create a `.env.local` file:
   ```env
   VITE_OPENROUTER_API_KEY=your_openrouter_api_key
   VITE_OPENROUTER_TEXT_MODEL=anthropic/claude-3.5-haiku
   VITE_OPENROUTER_IMAGE_MODEL=black-forest-labs/flux.2-klein-4b
   ```

## Testing

```bash
npm test          # Run all tests (Vitest)
npm run test:watch # Watch mode
```

25 tests cover BYOK settings, AI Settings modal behavior, stat clamping, deterministic outcome selection, alignment-based action generation, and Zustand store mutations.

---

## Documentation

| Document | Purpose |
| --- | --- |
| [Product Brief](docs/PRODUCT_BRIEF.md) | Problem, audience, use cases, solution, boundaries, and readiness. |
| [Design Spec](docs/DESIGN_SPEC.md) | Comic RPG palette, layout, component, and accessibility rules. |
| [Architecture](ARCHITECTURE.md) | Hybrid engine, state machine, storage, AI calls, and tests. |

---

## License

Proprietary. All rights reserved. Copyright 2026 DeMarcus Crump.
