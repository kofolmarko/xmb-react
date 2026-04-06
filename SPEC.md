# react-xmb — Specification

## Project Overview

- **Project Name**: react-xmb
- **Type**: Interactive Web Application (PSP XMB Clone)
- **Core Functionality**: A faithful recreation of the Sony PSP's XMB (XrossMediaBar) interface with keyboard/touch navigation and a single-file manifest for customisation.
- **Target Users**: Developers wanting a customisable PSP-style menu system

## Layout Structure

**Full Screen Layout**:
- Status bar: fixed top, ~32px (clock, battery, Wi-Fi indicators)
- Category row: horizontally centred icon strip with labels
- Item column: vertical list below current category
- Overlays: SidePanel, DocumentViewer, GalleryViewer, DownloadPanel, MediaPlayer, QuitDialog — stack on top of the base layout

**Responsive Breakpoints**:
- All current layouts target desktop/widescreen. Mobile is not a priority target.

## Visual Design

**Color Palette** (CSS custom properties in `App.css`):
- `--bg-primary`: `#0a0a1a` (deep navy black)
- `--icon-active`: `#00d4ff` (cyan glow — selected state)
- `--icon-dim`: `#4a4a6a` (muted purple-gray — unselected)
- `--text-primary`: `#e0e0e8`
- `--text-secondary`: `#8888aa`
- `--icon-glow`: `#00d4ff`

**Typography**:
- Body: `"Michroma"` (Google Fonts), system-ui fallback
- Category label: uppercase, letter-spacing
- Item label: 12–14px, centered

**Visual Effects**:
- Selected icon: cyan glow via `box-shadow` + `drop-shadow`
- Wave background: animated Canvas 2D, always running
- Splash art: per-item full-screen background, 1.5s delay before fade-in
- Category switch: instant snap for item column, animated for category icons
- App launch: wave surge animation synced to `start.mp3` (~2.6s)

## Components

```
src/
├── App.jsx                 # Shell: boot → menu. ALL keyboard + touch handling.
├── manifest.jsx            # Single source of truth for all content
│
├── components/
│   ├── BootScreen.jsx      # Canvas boot animation
│   ├── WaveBackground.jsx  # Animated wave canvas (singleton, always running)
│   ├── StatusBar.jsx       # Clock, battery, Wi-Fi
│   ├── SplashBackground.jsx# Per-item background image with delayed crossfade
│   ├── CategoryRow.jsx     # Horizontal category icon strip
│   ├── ItemColumn.jsx      # Vertical item list for current category
│   ├── ItemRow.jsx         # Single item row + sub-menu trigger
│   ├── SubMenuPanel.jsx    # Sub-items panel (folder type)
│   ├── OverlayHeader.jsx   # Shared header bar used by overlays
│   ├── SidePanel.jsx       # Info panel + action menu (two modes: info / actions)
│   ├── DocumentViewer.jsx  # Fullscreen Markdown viewer (react-markdown)
│   ├── GalleryViewer.jsx   # Fullscreen image carousel with captions
│   ├── DownloadPanel.jsx   # File download confirmation panel
│   ├── MediaPlayer.jsx     # Fullscreen audio / video / web / WebGL iframe
│   ├── LoadingScreen.jsx   # Animated loading screen before MediaPlayer opens
│   └── QuitDialog.jsx      # Exit confirmation dialog (Yes / Cancel)
```

## Categories

Seven categories, in order: Settings, Photo, Music, Video, Game, Network, Extras.

Defined in `manifest.jsx` as the `categories` array. Each has an `id`, `label`, `icon` (Lucide), `defaultIndex`, and `items`.

## Item Types

| Type | Activated by Enter | Description |
|------|--------------------|-------------|
| `document` | Opens DocumentViewer | Renders `action.description` as Markdown |
| `gallery` | Opens GalleryViewer | Image carousel from `action.images` |
| `application` | Opens LoadingScreen → MediaPlayer | Audio, video, web iframe, or WebGL |
| `download` | Opens DownloadPanel | Shows filename + filesize, triggers download |
| `folder` | Opens sub-menu | `subItems` array, same shape as top-level items |

**Item shape:**
```js
{
  id:        string,      // unique
  label:     string,
  icon:      LucideIcon,
  type:      ItemType,
  splashArt: string?,     // full-screen background URL when focused
  thumbnail: string?,     // card image shown in the Game category
  action:    Action,
  subItems:  Item[]?,     // folder only
}
```

## State (XMBContext)

All navigation state in `XMBContext` via `useReducer`:

```js
{
  currentCategory: 0,
  selectedIndices: [],        // one index per category
  subMenuOpen: false,
  subMenuIndex: 0,
  contextMenuOpen: false,     // legacy, unused
  contextMenuIndex: 0,
  activeItem: null,
  showMedia: null,
  showLoading: false,
  loadingItem: null,
  showDocumentViewer: false,
  showGalleryViewer: false,
  showDownloadPanel: false,
  showSidePanel: false,
  sidePanelMode: null,        // 'info' | 'actions'
  sidePanelActionIndex: 0,
  showQuitDialog: false,
  quitDialogIndex: 0,
  isSwitchingCategory: false,
}
```

## Navigation

**Keyboard** (centralised in `App.jsx`):

| Key | Action |
|-----|--------|
| ← → | Navigate categories |
| ↑ ↓ | Navigate items / side panel actions / quit dialog |
| Enter | Confirm / open |
| Escape · Backspace | Back / cancel |
| T | Open details panel |
| S | Open actions panel |
| Tab | Jump to first category |
| Home · P | PS button (quit dialog in media) |
| B | Cycle brightness |
| M | Toggle mute |
| + / = | Volume up |
| − / _ | Volume down |

**Touch** (centralised in `App.jsx`):

| Gesture | Action |
|---------|--------|
| Swipe left / right | Navigate categories |
| Swipe up / down | Navigate items |
| Tap | Confirm / close overlay |
| Tap (in overlay, x > 100px) | Close overlay |

## Manifest Format

```js
// src/manifest.jsx

export const boot = {
  text: 'react-xmb',
  subText: 'Press any key to start',
};

export const categories = [
  {
    id: 'photo',
    label: 'Photo',
    icon: Camera,          // Lucide icon component
    defaultIndex: 0,
    items: [
      {
        id: 'ph1',
        label: 'My Gallery',
        icon: Image,
        type: 'gallery',
        splashArt: 'https://...',
        action: {
          type: 'gallery',
          images: [
            { url: 'https://...', caption: 'Caption' },
          ],
        },
      },
    ],
  },
];
```

## Acceptance Criteria

1. ✅ Boot screen plays on load, dismissed by any key
2. ✅ Status bar shows live clock and battery indicator
3. ✅ Seven categories navigable with arrow keys and touch swipe
4. ✅ Items scroll vertically within a category
5. ✅ Selected item has cyan glow effect
6. ✅ `document` items open Markdown viewer
7. ✅ `gallery` items open image carousel
8. ✅ `application` items play through loading screen into MediaPlayer
9. ✅ `download` items open download panel
10. ✅ `folder` items open sub-menu
11. ✅ Splash art fades in after 1.5s on focused item
12. ✅ Wave surge plays on app launch
13. ✅ All keyboard controls work without page scroll interference
14. ✅ Touch swipe and tap controls work on touch devices
