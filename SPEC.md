# XMB React - PSP-style Interface

## Project Overview

- **Project Name**: XMB React
- **Type**: Interactive Web Application (PSP XMB Clone)
- **Core Functionality**: A faithful recreation of the Sony PSP's XMB (XrossMediaBar) interface with keyboard/touch navigation, customizable menus via React code, and full PSP UI including status bar
- **Target Users**: Developers wanting a customizable PSP-style menu system

## UI/UX Specification

### Layout Structure

**Full Screen Layout**:
- Status bar: top 32px (clock, battery, Wi-Fi indicators)
- XMB horizontal category bar: bottom 80px, horizontally scrollable
- Icon grid: center area, 5 columns × 4 rows max, scrollable vertically
- Current category label: above icons, left-aligned

**Responsive Breakpoints**:
- Mobile: < 768px (touch-optimized, larger touch targets)
- Desktop: ≥ 768px (keyboard navigation focus indicators)

### Visual Design

**Color Palette** (Classic PSP Theme):
- Background: `#0a0a1a` (deep navy black)
- Category bar background: `#121225`
- Icon default: `#4a4a6a` (muted purple-gray)
- Icon active/selected: `#00d4ff` (cyan glow)
- Text primary: `#e0e0e8`
- Text secondary: `#8888aa`
- Selection highlight: `rgba(0, 212, 255, 0.15)`
- Focus ring: `#00d4ff`
- Status bar background: `#080812`

**Typography**:
- Font family: `"Segoe UI", "SF Pro Display", system-ui, sans-serif`
- Category label: 14px, uppercase, letter-spacing 2px
- Icon label: 12px, centered below icon
- Clock: 16px, monospace weight

**Spacing System**:
- Icon grid gap: 24px
- Icon size: 48px (mobile: 56px)
- Category icon size: 32px
- Horizontal padding: 32px

**Visual Effects**:
- Selected icon: cyan glow (box-shadow: 0 0 20px rgba(0, 212, 255, 0.6))
- Icon hover: scale 1.1, 150ms ease
- Category slide: 200ms ease-out
- Screen transitions: fade 150ms
- Background: subtle radial gradient from center (#151530 to #0a0a1a)

### Components

**StatusBar**:
- Left: Clock (HH:MM format, updates every minute)
- Center: Battery indicator (icon + percentage)
- Right: Wi-Fi strength indicator (if connected)

**CategoryBar**:
- Horizontal scrollable list
- Categories: Photo, Music, Video, Game, Settings, Network
- Selected category: cyan highlight, elevated
- Arrow indicators when scrollable

**IconGrid**:
- Scrollable grid of icons
- 5 columns on desktop, 4 on mobile
- Each icon has: icon (Lucide or custom SVG), label below
- Selected state: cyan glow + scale up
- Pressed state: brief scale down

**DetailPanel** (for items with details action):
- Slides in from right or overlays
- Shows item title, description, metadata
- Back button to return

**MediaPlayer** (for items with media action):
- Full-screen overlay
- WebGL game: renders iframe/canvas
- Video: HTML5 video player
- Back button to return

### Navigation

**Keyboard Controls**:
- Arrow Left/Right: navigate categories
- Arrow Up/Down: navigate icons in grid
- Enter: select/activate icon
- Backspace/Escape: go back (close detail panel)
- Tab: cycle through categories

**Touch Controls**:
- Tap category: switch category
- Tap icon: activate
- Swipe left/right on icons: scroll grid
- Swipe up/down on icons: scroll grid
- Swipe from left edge: go back

## Functionality Specification

### Core Features

1. **Category Navigation**: Switch between horizontal categories
2. **Icon Grid**: Display items in current category as scrollable grid
3. **Selection System**: Visual feedback for current selection
4. **Activation**: Trigger action based on item config
5. **Detail Panel**: Show details for items configured with "details" action
6. **Media Player**: Render embedded content for "media" action type
7. **Status Bar**: Real-time clock and battery display

### Configuration System

Manifest is a React file that exports:
```js
// src/manifest.jsx
export const theme = {
  colors: { ... },
  icons: { ... },
}

export const categories = [
  {
    id: 'photo',
    label: 'Photo',
    icon: 'ImageIcon',
    items: [
      { id: 'photo1', label: 'My Photos', icon: 'ImageIcon', action: { type: 'details', ... } },
    ]
  }
]
```

### Data Handling

- Manifest is imported directly as React code
- No external data fetching
- State: currentCategory (index), selectedIcon (index), activeItem (null | item), panelOpen (boolean)

### Edge Cases

- Empty category: show "No items" message
- Overflow icons: vertical scroll with momentum
- Missing icon: fallback to generic icon
- Long labels: truncate with ellipsis

## Acceptance Criteria

1. ✅ Page loads with PSP-style dark theme
2. ✅ Status bar shows clock (updating) and battery icon
3. ✅ Category bar displays 6 categories, horizontally scrollable
4. ✅ Icons display in grid below category
5. ✅ Keyboard navigation works (arrows + enter)
6. ✅ Touch navigation works (tap + swipe)
7. ✅ Selected icon has cyan glow effect
8. ✅ Clicking item with "details" action shows detail panel
9. ✅ Detail panel can be closed
10. ✅ Responsive: works on mobile and desktop
