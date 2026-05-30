# Origin Story AI Design Spec

Origin Story AI is a fun portfolio showcase and playable comic-book RPG. It
should feel energetic, readable, and character-driven without pretending to be a
production SaaS product.

## Design Status

The current UI is paused for a UX-first redesign. The product idea is strong, but
the existing play screen should be treated as a prototype rather than the final
portfolio presentation. Future work should not continue as small visual patches.
The next pass needs to define the desired experience in screens before touching
implementation again.

The redesign must answer:

- What should the player understand in the first 30 seconds?
- What should the first five minutes of play feel like?
- What is the primary reward: story, generated art, stats, progression, or the
  archived comic history?
- Which information must be visible during every decision?
- Which information belongs in modals, dossiers, or archives?
- How can the screen preserve comic-book personality without hurting readability?

## Design Principles

- Lead with the playable loop: create a character, make choices, watch the comic
  history grow.
- Preserve the comic-book fantasy in headers, panels, and moments of emphasis,
  while keeping controls, forms, and long text in a readable app language.
- Make deterministic game state visible before generative flavor.
- Use one fixed dark comic-console theme across all universes so the screen is
  easy to look at for long sessions.
- The Long Box should feel like an archive of completed runs.
- BYOK should feel like a player setting, not a developer-only setup step.
- Do not use emoji in formal docs, navigation, or repo badges.

## UX Laws Applied

- Jakob's Law: controls should behave like recognizable app controls even when
  the visual theme is comic-inspired.
- Hick's Law: the main play screen should expose the next useful choices, not
  every secondary system at equal weight.
- Fitts's Law: primary actions need large targets near the active decision area.
- Miller's Law: stats are grouped into compact scan cards, not a large chart.
- Progressive disclosure: long-form details live in modals or dossiers; sidebars
  summarize only.
- Aesthetic-usability effect: comic styling should add delight without making
  reading, scanning, or choosing harder.

## Core Tokens

| Token | Hex | Usage |
| --- | ---: | --- |
| Console Black | `#0E0E0E` | Strong borders, shadows, dividers |
| Stage Charcoal | `#242424` | App background and main viewport |
| Card Charcoal | `#343434` | Cards, modals, sidebars |
| Raised Charcoal | `#3E3E3E` | Hover states and stepped surfaces |
| Comic Yellow | `#FFD21F` | Primary actions, active tabs, issue accents |
| Soft White | `#F4F4F0` | Main text |
| Caption Grey | `#B8B8B0` | Secondary text and metadata |
| Steel Blue | `#8EA0AB` | Neutral utility and info states |
| Danger Red | `#D85A4F` | Crisis, nemesis, game-over states |
| Success Mint | `#2DD38F` | Completed and safe states |

## Typography

- Use strong display type for title moments and issue headers.
- Keep choice buttons, forms, and resource labels practical and readable.
- Use system UI type for long-form story text; reserve comic type for flavor.
- Use mono or tabular numbers for stats where alignment matters.
- Do not use display type for dense descriptions or operational controls.

## Layout

- First screen should be the playable experience, not a marketing page.
- The story output is the primary play surface. It must remain visible above the
  fold during active play on desktop and mobile.
- The play screen uses an output-first cockpit: compact hero stats and gear live
  on the left, the current panel stays in the center, and external context
  such as Nemesis Watch, recent beats, and allies live on the right when desktop
  width allows it.
- The resource state should remain visible during key decisions without pushing
  the current panel below the viewport.
- Long-form villain information must not live in a cramped sidebar. Sidebars
  show summary state only; full nemesis weakness, scheme, and field notes belong
  in a readable dossier modal.
- Comic panels should have stable dimensions so generated content does not shift
  the page unexpectedly.
- Generated art should feel like a full-bleed comic panel. Use cover framing for
  the active play panel and prompt image models for wide compositions to reduce
  harsh cropping and letterboxing.
- Active generated art must expose a regenerate control because image models can
  occasionally add unwanted lettering, signs, or title text.
- Generated art uses a dark neutral frame so unfinished/loading art does not
  blast the player with bright empty space.
- Choice groups should show consequence style without revealing every outcome.
- Avoid nested scrolling as the default interaction. Normal story captions should
  fit without an internal scrollbar; only unusually long generated text should
  scroll inside the stable current-panel frame.

## Component Rules

- Character creation must show archetype, alignment, powers, and origin state.
- Character creation should use a wide builder layout with a persistent summary,
  not a cramped narrow wizard.
- Generated panels should keep the story readable while art renders in the
  background.
- Missing or failed panel art should stay visible as a clear retry state; never
  collapse the image area without telling the player what happened.
- AI Settings should clearly show offline, browser key, or environment key state.
- Deterministic fallback content should look intentional, not broken.
- Failure states should offer retry or continue-without-AI options.

## Accessibility

- Choices need keyboard focus and accessible names.
- Color-coded stats need text labels.
- Generated images require alt text.
- Motion should not be required to understand the game state.
