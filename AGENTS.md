# XMB React — Agent Guide

## Project Overview

A PSP XMB (XrossMediaBar) clone built with React + Vite. No 3D, no routing — a single-screen
console-style interface with keyboard/touch navigation.

**Stack:** React 19 · Vite 8 · lucide-react (icons) · Canvas 2D (boot animation + background)

## Architecture

```
src/
├── main.jsx                          # Entry point
├── index.css                         # Global reset
├── App.jsx                           # App shell: boot screen → XMB menu
├── App.css                           # CSS vars + global layout
├── manifest.jsx                      # Menu data + boot text (single source of truth)
│
├── hooks/
│   └── useSounds.js                  # Audio preloading (cursor, confirm, cancel, opening, start)
│
├── context/
│   └── XMBContext.jsx                # useReducer state management for ALL navigation
│
├── components/
│   ├── BootScreen.jsx                # Canvas text overlay (boot animation)
│   ├── WaveBackground.jsx            # Animated wave canvas (always running)
│   ├── StatusBar.jsx                 # Clock, battery, wifi
│   ├── SplashBackground.jsx          # Per-item background image (delayed fade-in)
│   ├── CategoryRow.jsx               # Horizontal category icons
│   ├── ItemColumn.jsx                # Vertical item list
│   ├── ItemRow.jsx                   # Single item + sub-menu
│   ├── SubMenuPanel.jsx              # Sub-items (for folder-type items)
│   ├── SidePanel.jsx                 # Merged: info panel + action menu
│   ├── MediaPlayer.jsx               # Fullscreen video/audio/iframe
│   └── QuitDialog.jsx                # Exit confirmation
│
└── styles/
    └── *.css                         # Component-scoped styles
```

## State Management

All navigation state lives in `XMBContext` via `useReducer`. The state shape:

```js
{
  currentCategory: 0,           // Active category index
  selectedIndices: [0,0,0...],  // Selected item index per category
  subMenuOpen: false,           // Sub-menu (folder items) open
  subMenuIndex: 0,              // Selected sub-item index
  contextMenuOpen: false,       // (legacy, not actively used)
  contextMenuIndex: 0,
  activeItem: null,             // Item shown in SidePanel
  showMedia: null,              // Item playing in MediaPlayer
  showSidePanel: false,         // SidePanel visible
  sidePanelMode: null,          // 'info' | 'actions'
  sidePanelActionIndex: 0,      // Selected action button index
  showQuitDialog: false,        // Quit confirmation visible
  quitDialogIndex: 0,           // Yes/No selection
  isSwitchingCategory: false,   // Disable scroll animation on category switch
}
```

**Key actions:** `NAVIGATE_CATEGORY`, `NAVIGATE_ITEM`, `ACTIVATE`, `BACK`, `OPEN_SIDE_PANEL`,
`NAVIGATE_SIDE_PANEL`, `EXECUTE_SIDE_PANEL_ACTION`, `NAVIGATE_QUIT_DIALOG`, `EXECUTE_QUIT_DIALOG`,
`OPEN_MEDIA`, `CLOSE_MEDIA`, `SHOW_QUIT_DIALOG`, `HIDE_QUIT_DIALOG`, `QUIT_MEDIA`.

## Keyboard Handling

**ALL keyboard handling is centralized in `App.jsx`** via a single `window.addEventListener('keydown')`.
Child components have NO `keydown` listeners (except QuitDialog for its own internal navigation,
which is redundant but harmless).

**Key repeat prevention:** The handler checks `e.repeat` and ignores repeated keydown events when
holding a key down. This prevents sounds from firing multiple times and improves overall snappiness.

Key mappings:
- `ArrowLeft/Right` — Navigate categories (or quit dialog options)
- `ArrowUp/Down` — Navigate items (or side panel actions)
- `Enter` — Activate / confirm
- `Escape/Backspace` — Go back
- `T` — Open SidePanel in 'actions' mode

All keys call `e.preventDefault()` to block browser defaults.

## Item Types (manifest.jsx)

Every item has a `type` field that determines Enter behavior:

| Type | Enter does | T/Triangle does |
|---|---|---|
| `application` | Opens MediaPlayer fullscreen | Opens SidePanel (actions) |
| `document` | Opens SidePanel (info) | Opens SidePanel (actions) |
| `folder` | Opens sub-menu | Opens SidePanel (actions) |

## Boot Sequence

1. `WaveBackground` canvas renders immediately (always running)
2. `BootScreen` text overlay fades in on top
3. User presses any key → `opening.mp3` plays, text fades out with scale+blur over 1.5s
4. Menu fades in (800ms with 400ms delay) behind the fading text
5. Boot screen unmounts after 1.5s

**Important:** The sound plays on keypress (user gesture), not on mount, because browsers block
autoplay audio. The WaveBackground never stops — it's a single canvas running for the entire session.

## Splash Background

- No image shown while navigating quickly between items
- After staying on an item for 1.5s, the splash art fades in
- Moving to another item immediately fades out, timer resets
- Crossfade uses two stacked divs with CSS animations

## Item Column Scrolling

- **Switching categories:** instant snap (no animation)
- **Navigating items within a category:** 100ms slide transition (perfectly matches category row speed)
- Controlled by `isSwitchingCategory` flag in state
- Optimized cubic-bezier easing: `cubic-bezier(0.33, 0.66, 0.66, 1)` for responsive feel
- **Margin shifts are instant (not animated)** — prevents bounce from opposing transform/margin animations
- Only transform and opacity animate; margin-bottom changes instantly for crisp movement

## CSS Architecture

- `App.css` — CSS custom properties (`--icon-active`, `--icon-dim`, etc.) + global layout
- `styles/*.css` — Component-scoped styles, imported by each component
- No CSS modules, no Tailwind, no styled-components
- Responsive breakpoints at 768px in ItemColumn.css and SidePanel.css

## Adding New Content

Edit `manifest.jsx`:
- Add categories to the `categories` array
- Each item needs: `id`, `label`, `icon` (Lucide), `type`, `action`
- Optional: `splashArt` (image URL), `subItems` (for folders)
- Change boot text via the `boot` export

## Development Commands

```bash
npm run dev      # Vite dev server
npm run build    # Production build
npm run lint     # ESLint
npm run preview  # Preview production build
```

## Important Gotchas

1. **Don't add `onKeyDown` to overlay components** — keyboard is centralized in App.jsx. Adding
   local handlers causes double-firing (Enter triggers action twice).
2. **Don't call `playSound` in useEffect on mount** — browsers block audio without user gesture.
   Only call it in response to user interaction.
3. **`isSwitchingCategory` must be reset** — set it to `false` in `NAVIGATE_ITEM` to re-enable
   scroll animations after category switch.
4. **WaveBackground is a singleton** — there's only one canvas, shared between boot and menu.
   Don't create multiple wave canvases.
5. **SidePanel has two modes** — `info` (icon, title, description) and `actions` (list of buttons).
   Don't create separate components for these.
6. **QuitDialog uses context state** — `quitDialogIndex` is in the reducer, not local state.
7. **Key repeat is blocked** — the keyboard handler checks `e.repeat` to prevent sounds/actions
   from firing repeatedly when holding keys. Never remove this check.
