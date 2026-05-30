# Origin Story AI Product Brief

## One-Sentence Positioning

Origin Story AI is a portfolio showcase and playable comic-book RPG where users
create a hero or villain, make choices, and build an archived character history.

## Problem

Generative game demos often feel like loose chat wrappers. They may produce fun
text, but the player cannot see a clear loop, persistent state, resource
tradeoffs, or meaningful consequences.

## Audience

- Portfolio reviewers evaluating imagination and product taste.
- Players who enjoy lightweight superhero role-playing loops.
- Creative technologists interested in hybrid deterministic and generative
  systems.

## Use Cases

| Use Case | Origin Story Helps With |
| --- | --- |
| Character creation | Build a hero or villain with powers, origin, and alignment. |
| Choice loop | Make civilian, hero, villain, and crisis decisions. |
| State management | Track resources like sanity, justice, glory, suspicion, and wealth. |
| Generative moments | Use AI for origins, major events, images, and narrative flavor. |
| Long Box archive | Preserve completed runs and legacy outcomes. |

## Solution

Origin Story uses a hybrid engine. Deterministic rules power routine actions and
resource updates, while optional OpenRouter models generate major story and image
moments. The app remains playable without an API key through fallback content.

The play screen uses a current-panel cockpit rather than a scroll-first feed:
the latest story, generated art, next choices, stats, and nemesis pressure are
kept visible together. The visual system uses one dark comic-console theme
across all universes so longer sessions remain easy on the eyes while generated
worlds still express themselves through story, images, and character content.

## Core Game Loop

1. Create a hero, anti-hero, or villain with a civilian identity, origin,
   inciting incident, tone, alignment, and power concept.
2. Resolve routine civilian and hero/villain actions through deterministic
   stat changes.
3. Trigger larger generative moments for origin narration, arc events, crises,
   nemeses, NPCs, headlines, costumes, and illustrated panels when AI is enabled.
4. Manage long-term pressure through suspicion, sanity, wealth, glory, justice,
   retcon points, assets, allies, and the nemesis doomsday clock.
5. Finish a run through victory, defeat, retirement, retcon, or legacy handoff,
   then preserve the result in the Long Box archive.

## BYOK Model

Origin Story supports browser BYOK for portfolio play. Players can paste an
OpenRouter key in AI Settings, use the fast default image model
`black-forest-labs/flux.2-klein-4b`, choose alternate text and image models, and
continue playing without developer environment setup. The key is stored only in
browser local storage and used only for OpenRouter calls. If no key is present,
the deterministic loop remains playable with fallback narrative copy.

If an image provider returns no art, the active panel keeps a visible retry state
so the story does not look broken or silently lose the illustration.

## Product Boundaries

- Origin Story is a fun portfolio showcase, not a production SaaS product.
- It should open directly into the playable experience.
- Generative output is flavor layered over a deterministic game loop.
- Public monetized hosting should use a server-side AI gateway rather than
  exposing provider calls directly from the browser.

## Current Readiness

Origin Story is currently paused and should not be treated as portfolio-ready.
The core concept remains strong: a playable comic-book RPG where deterministic
systems and generative moments create an evolving hero or villain history. The
current implementation proves the direction, but the user experience does not
yet consistently meet the quality bar for a polished showcase.

The main risk is not the game idea. The risk is that the interface still feels
like a sequence of patches rather than a fully resolved play surface. Before the
project is presented as a portfolio piece, it needs a UX-first redesign pass that
defines the first five minutes of play, the hierarchy of the main screen, the role
of generated art, and how much game state belongs on screen at once.

Do not continue with isolated UI fixes as the next step. The next meaningful
milestone is a clean product-design reset: screens first, code second.

## UX Reset Requirements

- Define the exact first-session flow: character creation, origin reveal, first
  choice, first generated panel, and first reward.
- Decide whether generated art is the main event or supporting flavor.
- Redesign the main play surface around a small number of durable priorities:
  latest story, current image, next choices, player state, and world pressure.
- Establish rules for what belongs on the main screen versus a modal, archive,
  dossier, or secondary view.
- Resolve long-session readability: type scale, spacing, contrast, scroll
  behavior, and information density.
- Create a small set of target screenshots before implementing another UI pass.
- Treat the current build as a prototype, not the final portfolio presentation.
