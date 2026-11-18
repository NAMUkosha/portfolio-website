# Wenjia Space component system v2

The component catalogue is `visual-exploration/system.html`. It runs the same CSS primitives and tokens as the portfolio. Implementation values belong to `tokens.css`; primitive classes to `ui.css`; legacy page selectors bind through `site-components.css`. JavaScript motion reads computed CSS tokens through `ui-motion.js`.

## Typography

| Role | Size | Use |
| --- | --- | --- |
| Display | fluid 36–48px | Homepage, case openings |
| Heading | 32px | Case sections and dialogs |
| Subheading | 24px | Section subdivisions |
| Lead | fluid 20–24px | Introductions |
| Body | 16px | Case and biography reading |
| Supporting | 14px | Supporting copy |
| Interface | 13px | Navigation, buttons, tabs, links |
| Caption | 12px | Metadata, chips, captions |

Existing display/title/micro token names that resolve to the same values are compatibility aliases, not additional type styles. Do not introduce another visually indistinguishable role. Editorial serif/mono opening words and the lettering inside supplied project images retain their intentional identity.

## Components

- **Access**: one dark button with collapsed and hover/focus expanded states. Granted access hides the site control. Expansion is not a separate component.
- **Secondary**: one light glass action, for both links and buttons. Replaces `ui-btn--light` and `ui-btn--glass`; use `ui-btn ui-btn--secondary`. Height 40px; type 13px.
- **Text link**: one understated underlined action. No arrow suffix.
- **Neutral chip**: one flat rounded pill for credentials and disciplines. A year is plain metadata. No separate credential or badge surface.
- **Floating surface**: one glass recipe shared by navigation, action controls and floating menus. Modal backdrop remains a distinct functional overlay.
- **Tabs**: one neutral selected-state treatment for case tabs, with each owning tablist retaining its keyboard and selection logic.
- **Flip card**: shared image and text faces; click or keyboard to flip, pointer tilt and glare, with reduced-motion support. Implemented in `ui.css` and `interests.js`.
- **Project cards**: the existing images, stacks, private covers and orbit behaviours remain content patterns. They are not generic button variants.

The catalogue now groups states and aliases inside families: 40 entries rather than 45, including the newly shared tab family. Preview miniatures may be scaled to fit the catalogue stage; detail snippets and tokens define production values.

## Motion

160ms feedback; 220ms state change; 350ms controls; 550ms surface entrance; 850ms scene transition. Generic UI uses `--ds-ease-out`. Menu entrance no longer has a separate rubber distortion. JS reads the same values with `WenjiaMotion.duration(role)` and `WenjiaMotion.easing()`.

The opening's semantic letter effects, object personalities and project orbit springs are deliberate narrative patterns. They respect reduced motion and do not define additional generic control styles. Spring physics remain continuous rather than being approximated by a timed CSS transition.

## Arrows

No decorative or diagonal arrow glyphs in website UI or catalogue controls. Previous, Next, Top, Unlock and Scroll to explore use explicit text. Async case links are cleaned without changing encrypted source data. Supplied screenshots/diagrams remain project artwork.

## Migration and validation

Main entry points, experiment entry points, case typography, shared controls, layout tokens and regular CSS transitions now consume canonical roles. Project-specific product illustrations and semantic colour inside case diagrams remain content. Maintain access encryption, routing, project interactions and the opening handoff when changing primitives.

Before accepting a change, compare actual page controls with catalogue computed styles and check desktop/mobile, reader open/close, tabs, year filter, form feedback, catalogue search/details/tokens, and reduced motion.
