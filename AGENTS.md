# react-xmb — Agent Guide

## Project Overview

A PSP XMB (XrossMediaBar) clone built with React + Vite. No 3D, no routing — a single-screen
console-style interface with keyboard/touch navigation.

**Stack:** React 19 · Vite 8 · lucide-react (icons) · react-markdown · Canvas 2D (boot + wave)

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
│   ├── ItemRow.jsx                   # Single item + sub-menu trigger
│   ├── SubMenuPanel.jsx              # Sub-items (for folder-type items)
│   ├── OverlayHeader.jsx             # Shared header bar for overlays
│   ├── SidePanel.jsx                 # Info panel + action menu (two modes)
│   ├── DocumentViewer.jsx            # Fullscreen Markdown viewer
│   ├── GalleryViewer.jsx             # Fullscreen image carousel
│   ├── DownloadPanel.jsx             # File download confirmation panel
│   ├── MediaPlayer.jsx               # Fullscreen audio/video/web/WebGL iframe
│   ├── LoadingScreen.jsx             # Animated loading screen before MediaPlayer
│   └── QuitDialog.jsx                # Exit confirmation (Yes / Cancel)
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
  contextMenuOpen: false,       // Legacy, not actively used
  contextMenuIndex: 0,
  activeItem: null,             // Item shown in SidePanel / DocumentViewer / etc.
  showMedia: null,              // Item playing in MediaPlayer
  showLoading: false,           // LoadingScreen visible
  loadingItem: null,            // Item queued for MediaPlayer
  showDocumentViewer: false,    // DocumentViewer visible
  showGalleryViewer: false,     // GalleryViewer visible
  showDownloadPanel: false,     // DownloadPanel visible
  showSidePanel: false,         // SidePanel visible
  sidePanelMode: null,          // 'info' | 'actions'
  sidePanelActionIndex: 0,      // Selected action button index in SidePanel
  showQuitDialog: false,        // Quit confirmation visible
  quitDialogIndex: 0,           // Yes/No selection (0 = Yes, 1 = Cancel)
  isSwitchingCategory: false,   // Disables item scroll animation on category switch
}
```

**Key actions:** `NAVIGATE_CATEGORY`, `NAVIGATE_TO_CATEGORY`, `NAVIGATE_ITEM`, `ACTIVATE`, `BACK`,
`OPEN_SIDE_PANEL`, `CLOSE_SIDE_PANEL`, `NAVIGATE_SIDE_PANEL`, `EXECUTE_SIDE_PANEL_ACTION`,
`NAVIGATE_QUIT_DIALOG`, `EXECUTE_QUIT_DIALOG`, `OPEN_MEDIA`, `CLOSE_MEDIA`,
`SHOW_QUIT_DIALOG`, `HIDE_QUIT_DIALOG`, `QUIT_MEDIA`, `LOADING_COMPLETE`.

## Keyboard Handling

**ALL keyboard handling is centralised in `App.jsx`** via a single `window.addEventListener('keydown')`.
Child components have NO `keydown` listeners.

**Key repeat prevention:** The handler checks `e.repeat` and ignores repeated keydown events.

Key mappings (all call `e.preventDefault()`):

| Key | PSP action | XMB action |
|-----|-----------|------------|
| ArrowLeft / Right | D-pad | Navigate categories (or quit dialog) |
| ArrowUp / Down | D-pad | Navigate items / side panel actions |
| Enter | Cross (X) | Confirm / activate |
| Escape · Backspace | Circle (O) | Back / cancel |
| T | Triangle | Open SidePanel (details or actions) |
| S | Square | Open SidePanel (actions or info) |
| Tab | Select | Jump to first category |
| Home · P | PS button | Show quit dialog (or close from media) |
| B | Brightness | Cycle brightness levels |
| M | Mute | Toggle mute |
| + / = | Volume+ | Volume up |
| − / _ | Volume− | Volume down |

postMessage also accepted: `{ type: 'psp_button', action: string }` — same action strings as above
(`'left'`, `'right'`, `'up'`, `'down'`, `'cross'`, `'circle'`, `'triangle'`, `'square'`,
`'start'`, `'select'`, `'ps'`, `'brightness'`, `'mute'`, `'volume_up'`, `'volume_down'`).

## Touch & Gesture Controls

**ALL touch handling is centralised in `App.jsx`** via `onTouchStart` / `onTouchEnd` on the root div.

**Swipe direction logic:**
- Swipe right → previous category
- Swipe left → next category
- Swipe down → previous item
- Swipe up → next item

**Thresholds:**
- `SWIPE_THRESHOLD = 50px` — minimum distance to register as swipe
- `TAP_THRESHOLD = 10px` — maximum movement to register as tap
- Tap duration must be < 300ms

**Overlay interactions:**
- MediaPlayer / SidePanel / DocumentViewer / GalleryViewer / DownloadPanel: tap (x > 100px) → back
- QuitDialog: tap → close

**Important:** Button `onClick` handlers work alongside touch gestures. The touch handler only
processes swipes (distance > SWIPE_THRESHOLD), allowing taps/clicks to bubble to buttons naturally.

## Item Types (manifest.jsx)

Every item has a `type` field that determines Enter / activate behavior:

| Type | Enter does | T/Triangle does |
|------|-----------|-----------------|
| `document` | Opens DocumentViewer | Opens SidePanel (info) |
| `gallery` | Opens GalleryViewer | Opens SidePanel (info) |
| `application` | Opens LoadingScreen → MediaPlayer | Opens SidePanel (actions) |
| `download` | Opens DownloadPanel | Opens SidePanel (info) |
| `folder` | Opens sub-menu | Opens SidePanel (info) |

## Overlay Priority

Only one overlay is shown at a time. The render order (highest priority last in JSX):
DocumentViewer → GalleryViewer → DownloadPanel → SidePanel → LoadingScreen → MediaPlayer → QuitDialog.

The `overlayOpen` flag in App.jsx covers all of these and is used to hide/show the status bar and
category/item icons.

## Boot Sequence

1. `WaveBackground` canvas renders immediately (always running)
2. `BootScreen` text overlay fades in on top
3. User presses any key → `opening.mp3` plays, text fades out with scale+blur over 1.5s
4. Menu fades in (800ms with 400ms delay) behind the fading text
5. BootScreen unmounts after 1.5s

**Important:** Sound plays on keypress (user gesture), not on mount — browsers block autoplay audio.

## App Launch Sequence

1. Enter pressed on an `application` item → `ACTIVATE` dispatched
2. State: `showLoading: true`, `loadingItem: item`
3. `start.mp3` plays, wave surges for ~2.6s
4. `LoadingScreen` renders with animated bar
5. After animation completes, LoadingScreen fires `loadingComplete()`
6. State: `showLoading: false`, `showMedia: item`
7. `MediaPlayer` renders with the item's `action.src`

## Splash Background

- No image shown while navigating quickly
- After 1.5s on an item, splash art fades in
- Navigating away immediately fades out, timer resets
- Crossfade uses two stacked divs with CSS opacity animations

## Item Column Scrolling

- **Switching categories:** instant snap (no animation) — controlled by `isSwitchingCategory`
- **Navigating items within a category:** 100ms slide transition
- Only `transform` and `opacity` animate; `margin` changes instantly to prevent bounce

## CSS Architecture

- `App.css` — CSS custom properties + global layout
- `styles/*.css` — Component-scoped styles, imported by each component
- No CSS modules, no Tailwind, no styled-components
- Variables: `--icon-active`, `--icon-dim`, `--icon-glow`, `--text-primary`, `--text-secondary`, etc.

## Adding New Content

Edit `manifest.jsx` only:
- Add/edit entries in the `categories` array
- Each item needs: `id`, `label`, `icon` (Lucide), `type`, `action`
- Optional: `splashArt` (URL), `subItems` (for folders), `thumbnail` (Game category card image)
- Change boot text via the `boot` export
- Full schema reference is in the comment block at the top of `manifest.jsx`

## Development Commands

```bash
npm run dev      # Vite dev server
npm run build    # Production build → dist/
npm run lint     # ESLint
npm run preview  # Preview production build
```

## Important Gotchas

1. **Don't add `onKeyDown` to overlay components** — keyboard is centralised in App.jsx. Local
   handlers cause double-firing (Enter triggers action twice).
2. **Don't call `playSound` in useEffect on mount** — browsers block audio without a user gesture.
   Only call it in response to user interaction.
3. **`isSwitchingCategory` must be reset** — set it to `false` in `NAVIGATE_ITEM` to re-enable
   scroll animations after a category switch.
4. **WaveBackground is a singleton** — one canvas for the entire session. Don't create multiples.
5. **SidePanel has two modes** — `info` and `actions`. Don't split into separate components.
6. **QuitDialog state is in the reducer** — `quitDialogIndex` is not local state.
7. **Key repeat is blocked** — the handler checks `e.repeat`. Never remove this check.
8. **Touch events work with button clicks** — don't `stopPropagation` on touch events inside items.
9. **LoadingScreen owns its own timer** — it fires `loadingComplete` via callback after its
   animation ends. Don't drive it externally with a fixed timeout.
