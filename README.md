<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# Origin Story AI

**AI-powered infinite canvas comic book role-playing game.**

Hybrid Engine. Dynamic Scenarios. Infinite Canvas.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Zustand](https://img.shields.io/badge/Zustand-5-764ABC?logo=react&logoColor=white)](https://github.com/pmndrs/zustand)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Vitest](https://img.shields.io/badge/Vitest-4-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev)
[![Anthropic Claude](https://img.shields.io/badge/Claude_3.5_Haiku-D4C5B9?logo=anthropic&logoColor=black)](https://anthropic.com)
[![OpenAI](https://img.shields.io/badge/GPT--5.4--Image--2-412991?logo=openai&logoColor=white)](https://openai.com)
[![License](https://img.shields.io/badge/License-Proprietary-red)](#license)

[![Back to Portfolio](https://img.shields.io/badge/⬅_Back_to_Main_Portfolio-111111?style=for-the-badge)](https://github.com/demarcuscrump)
</div>

---

## Demo

> **Video / GIF placeholder** — record a 30-second gameplay clip and drop it here:
>
> `![Demo](docs/demo.gif)`

---

Origin Story is an infinite-canvas, narrative role-playing game where you create and manage a superhero (or villain) throughout their career. Featuring a unique hybrid engine, the game blends the instant responsiveness of traditional RPGs with the boundless creativity of Generative AI via OpenRouter.

## The Hybrid AI Engine
To ensure high performance and economic viability, the game operates on two layers:
1. **The Deterministic Layer:** Mundane actions (patrols, day jobs) use instant, pre-written text resolution with immediate stat calculation. This keeps the core game loop fast and snappy.
2. **The Generative Layer:** Milestone events (Character Origins, Boss Fights, Crises, and Arc Events) trigger calls to the **OpenRouter API** (`anthropic/claude-3.5-haiku` and `openai/gpt-5.4-image-2`) to dynamically write and illustrate key moments in your character's career.

For an in-depth look at the state machine, save debouncing, and API handling, please see the [ARCHITECTURE.md](ARCHITECTURE.md).

## Features
- **Dynamic Character Creation**: Define your origin, archetype, and powers, and watch the AI generate your unique origin story.
- **Stat Management**: Balance 6 core resources: Wealth, Sanity, Justice, Glory, Suspicion, and Retcon Points.
- **Infinite Canvas**: Scroll back through the "issues" of your comic book, watching your history unfold.
- **The Nemesis System**: A persistent, dynamically generated rival plots against you. If you don't keep their "Doomsday Clock" down, they will enact their master plan.
- **Legacy Mechanics**: Retire or fall in battle to pass down inherited wealth and glory to the next generation of heroes.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env.local` file and set your OpenRouter API keys:
   ```env
   VITE_OPENROUTER_API_KEY=your_openrouter_api_key
   VITE_OPENROUTER_TEXT_MODEL=anthropic/claude-3.5-haiku
   VITE_OPENROUTER_IMAGE_MODEL=openai/gpt-5.4-image-2
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Testing

```bash
npm test          # Run all tests (Vitest)
npm run test:watch # Watch mode
```

20 tests cover stat clamping, deterministic outcome selection, alignment-based action generation, and Zustand store mutations.

---

## License

Proprietary. All rights reserved. Copyright 2026 DeMarcus Crump.
