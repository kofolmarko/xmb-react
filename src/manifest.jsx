/**
 * xmb-react — manifest.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * This is the single file you need to edit to make XMB your own.
 * Everything — categories, items, boot screen text — is defined here.
 *
 * QUICK START
 * ───────────
 * 1. Change `boot.text` to your name or project title.
 * 2. Edit category items below — each one is a self-contained JS object.
 * 3. Add icons from https://lucide.dev (already imported at the top).
 * 4. Run `npm run dev` and open Settings → Developer Guide for a full
 *    in-app schema reference, or read the schema below.
 *
 * ITEM SCHEMA
 * ───────────
 * Every item shares a base shape:
 *
 *   {
 *     id:        string       — unique identifier
 *     label:     string       — display name in the menu
 *     icon:      LucideIcon   — icon component from lucide-react
 *     type:      ItemType     — controls how the item is opened (see below)
 *     splashArt: string?      — URL shown as background when item is focused
 *     details:   Array<{ label: string, value: string }>?
 *                            — metadata rows shown in the Details side panel
 *                              e.g. [{ label: 'Artist', value: 'Suno AI' }]
 *                              Auto-derived info (Type, Format, Images, etc.)
 *                              is appended automatically for any missing labels.
 *     action:    Action       — what happens when the item is opened
 *   }
 *
 * ITEM TYPES
 * ──────────
 * 'document'    Opens a Markdown document viewer.
 *               action: { type: 'details', description: string, date: string }
 *
 * 'gallery'     Opens a full-screen image carousel with captions.
 *               action: { type: 'gallery', images: Array<{ url, caption }> }
 *
 * 'application' Launches content with an animated loading screen.
 *               - Audio:  action: { type: 'media', contentType: 'audio', src }
 *               - Video:  action: { type: 'media', contentType: 'video', src }
 *               - Web:    action: { type: 'media', contentType: 'web',   src }
 *               - WebGL:  action: { type: 'media', contentType: 'webgl', src }
 *               Optional: thumbnail: string  — card image shown in the Game category
 *
 * 'download'    Shows a download panel with filename, size, and confirm button.
 *               action: { type: 'download', filename, filesize, url }
 *
 * 'folder'      Opens a sub-menu. Items inside use the same shape as top-level.
 *               subItems: Item[]
 *               action: { type: 'details', description, date } — side panel info
 */

import {
  Wrench, Camera, Music, Film, Gamepad2, Globe, Star,
  FolderOpen, Image, Headphones, Video, Disc, Download,
  Monitor, Gamepad, Info, Wifi, Keyboard, BookOpen, Scale,
  Code, ExternalLink, Play, ListMusic, Clapperboard, Images,
} from 'lucide-react';

// ─── Boot screen ─────────────────────────────────────────────────────────────

export const boot = {
  text: 'xmb-react',
  subText: 'Press any key to start',
};

// ─── Categories ──────────────────────────────────────────────────────────────

export const categories = [
  // ── Settings ───────────────────────────────────────────────────────────────
  {
    id: 'settings',
    label: 'Settings',
    icon: Wrench,
    defaultIndex: 0,
    items: [
      {
        id: 'set-about',
        label: 'About',
        icon: Info,
        type: 'document',
        action: {
          type: 'details',
          date: '2026',
          description: `# xmb-react

A PSP-style Cross Media Bar (XMB) interface built with React + Vite.

**GitHub:** [kofolmarko/xmb-react](https://github.com/kofolmarko/xmb-react)

---

## Features

- Animated wave background with surge on launch
- Per-item splash art backgrounds
- Markdown document viewer
- Image gallery with captions
- Audio and video media player
- WebGL / web app launcher with loading screen
- File download manager
- Glassmorphic side panel and overlays
- Boot screen animation
- Keyboard, touch, and \`postMessage\` controls
- Single-file manifest — one file to customise everything

## Stack

React 19 · Vite · Lucide React · CSS custom properties`,
        },
      },
      {
        id: 'set-controls',
        label: 'Controls',
        icon: Keyboard,
        type: 'document',
        action: {
          type: 'details',
          date: '',
          description: `# Controls

## Moving around

\`←\` \`→\` — switch categories
\`↑\` \`↓\` — scroll items
\`Enter\` — open selected item
\`Esc\` · \`Backspace\` — go back

## Panels

\`T\` — open item details
\`S\` — open item actions
\`Tab\` — jump to first category

## System

\`B\` — cycle brightness
\`M\` — mute / unmute
\`+\` / \`-\` — volume up / down
\`Home\` · \`P\` — exit / quit dialog

## Touch

Swipe **left / right** to change category
Swipe **up / down** to scroll items
**Tap** to open — tap again to close

---

While in a media player, press \`Esc\` or tap to bring up the quit dialog.`,
        },
      },
      {
        id: 'set-devguide',
        label: 'Developer Guide',
        icon: Code,
        type: 'document',
        action: {
          type: 'details',
          date: '2026',
          description: `# Developer Guide

Everything is configured in **\`src/manifest.jsx\`**.
Open it, read the comment block at the top, then edit.

---

## Boot screen

\`\`\`js
export const boot = {
  text: 'Your Name',
  subText: 'Press any key to start',
};
\`\`\`

---

## document — Markdown viewer

\`\`\`js
{
  id: 'my-doc',
  label: 'My Document',
  icon: FileText,
  type: 'document',
  splashArt: 'https://example.com/bg.jpg', // optional
  action: {
    type: 'details',
    description: '## Hello\\n\\nMarkdown content here.',
    date: '2026',
  }
}
\`\`\`

---

## gallery — Image carousel

\`\`\`js
{
  id: 'my-gallery',
  label: 'My Photos',
  icon: Image,
  type: 'gallery',
  splashArt: 'https://example.com/bg.jpg',
  action: {
    type: 'gallery',
    images: [
      { url: 'https://example.com/1.jpg', caption: 'Caption text' },
      { url: 'https://example.com/2.jpg', caption: 'Another photo' },
    ]
  }
}
\`\`\`

---

## application — Launch audio / video / web / WebGL

\`\`\`js
{
  id: 'my-app',
  label: 'My App',
  icon: Gamepad2,
  type: 'application',
  thumbnail: 'https://example.com/thumb.jpg', // card image in Game category
  splashArt: 'https://example.com/bg.jpg',
  action: {
    type: 'media',
    contentType: 'audio' | 'video' | 'web' | 'webgl',
    src: 'https://example.com/content',
  }
}
\`\`\`

---

## download — File download

\`\`\`js
{
  id: 'my-dl',
  label: 'Download File',
  icon: Download,
  type: 'download',
  action: {
    type: 'download',
    filename: 'file.zip',
    filesize: '12 MB',
    url: '/downloads/file.zip',
  }
}
\`\`\`

---

## folder — Nested sub-menu

\`\`\`js
{
  id: 'my-folder',
  label: 'My Folder',
  icon: FolderOpen,
  type: 'folder',
  splashArt: 'https://example.com/bg.jpg',
  subItems: [
    { id: 'sub1', label: 'Item', icon: File,
      type: 'document', action: { type: 'details', description: '...' } },
  ],
  action: { type: 'details', description: 'Folder description', date: '' },
}
\`\`\`

---

## Tips

- **\`splashArt\`** sets the full-screen background when an item is focused
- **\`thumbnail\`** is the card image shown in the Game category
- All icons come from [Lucide React](https://lucide.dev) — already installed
- Markdown in \`description\` supports headings, bold, tables, code, blockquotes`,
        },
      },
      {
        id: 'set-license',
        label: 'License',
        icon: Scale,
        type: 'document',
        action: {
          type: 'details',
          date: '2026',
          description: `# MIT License

Copyright (c) 2026 Marko Kofol

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`,
        },
      },
      {
        id: 'set-sysinfo',
        label: 'System Info',
        icon: Monitor,
        type: 'document',
        action: {
          type: 'details',
          date: '2026',
          description: `# xmb-react

**Version:** 1.0.0
**Build:** 2026

---

## Capabilities

- Application launcher with animated loading screen
- Markdown document viewer
- Image gallery with captions
- Audio / video media player
- WebGL and web iframe support
- File download manager
- Glassmorphic overlay system
- Boot animation

## Stack

React 19 · Vite · Lucide React · CSS custom properties`,
        },
      },
      {
        id: 'set-themes',
        label: 'Themes',
        icon: Star,
        type: 'theme',
        action: {
          type: 'details',
          date: '2026',
          description: `# Themes

Change the look and feel of the XMB interface.

## Available Themes

- **Midnight** — Deep blue ocean waves (default)
- **Emerald** — Lush green forest tones
- **Crimson** — Warm red sunset hues
- **Gold** — Rich amber and golden light

## How to Switch

Press **C** on your keyboard to cycle through themes.

Your selection is saved automatically and restored on next visit.`,
        },
      },
    ],
  },

  // ── Photo ───────────────────────────────────────────────────────────────────
  {
    id: 'photo',
    label: 'Photo',
    icon: Camera,
    defaultIndex: 0,
    items: [
      {
        id: 'ph-demo',
        label: 'Demo Gallery',
        icon: Images,
        type: 'folder',
        splashArt: 'https://picsum.photos/seed/gallery-hero/1280/720',
        subItems: [
          {
            id: 'ph-demo-all',
            label: 'View All',
            loadingLabel: 'Demo Gallery',
            icon: Play,
            type: 'gallery',
            splashArt: 'https://picsum.photos/seed/gallery-hero/1280/720',
            action: {
              type: 'gallery',
              images: [
                { url: 'https://picsum.photos/seed/landscape1/1280/720', caption: 'Mountain valley at dawn' },
                { url: 'https://picsum.photos/seed/coast1/1280/720',     caption: 'Coastline at golden hour' },
                { url: 'https://picsum.photos/seed/forest2/1280/720',    caption: 'Forest path in autumn' },
                { url: 'https://picsum.photos/seed/city2/1280/720',      caption: 'City skyline at night' },
                { url: 'https://picsum.photos/seed/desert1/1280/720',    caption: 'Sand dunes at sunset' },
              ],
            },
          },
          { id: 'ph-1', label: 'Mountain Valley', icon: Image, type: 'gallery', thumbnail: 'https://picsum.photos/seed/landscape1/400/225', splashArt: 'https://picsum.photos/seed/landscape1/1280/720', details: [{ label: 'Caption', value: 'Mountain valley at dawn' }, { label: 'Resolution', value: '1280×720' }, { label: 'Source', value: 'Picsum' }], action: { type: 'gallery', images: [{ url: 'https://picsum.photos/seed/landscape1/1280/720', caption: 'Mountain valley at dawn' }] } },
          { id: 'ph-2', label: 'Coastline',       icon: Image, type: 'gallery', thumbnail: 'https://picsum.photos/seed/coast1/400/225',     splashArt: 'https://picsum.photos/seed/coast1/1280/720',     details: [{ label: 'Caption', value: 'Coastline at golden hour' }, { label: 'Resolution', value: '1280×720' }, { label: 'Source', value: 'Picsum' }], action: { type: 'gallery', images: [{ url: 'https://picsum.photos/seed/coast1/1280/720',     caption: 'Coastline at golden hour' }] } },
          { id: 'ph-3', label: 'Forest Path',     icon: Image, type: 'gallery', thumbnail: 'https://picsum.photos/seed/forest2/400/225',    splashArt: 'https://picsum.photos/seed/forest2/1280/720',    details: [{ label: 'Caption', value: 'Forest path in autumn' }, { label: 'Resolution', value: '1280×720' }, { label: 'Source', value: 'Picsum' }], action: { type: 'gallery', images: [{ url: 'https://picsum.photos/seed/forest2/1280/720',    caption: 'Forest path in autumn' }] } },
          { id: 'ph-4', label: 'City Skyline',    icon: Image, type: 'gallery', thumbnail: 'https://picsum.photos/seed/city2/400/225',      splashArt: 'https://picsum.photos/seed/city2/1280/720',      details: [{ label: 'Caption', value: 'City skyline at night' }, { label: 'Resolution', value: '1280×720' }, { label: 'Source', value: 'Picsum' }], action: { type: 'gallery', images: [{ url: 'https://picsum.photos/seed/city2/1280/720',      caption: 'City skyline at night' }] } },
          { id: 'ph-5', label: 'Sand Dunes',      icon: Image, type: 'gallery', thumbnail: 'https://picsum.photos/seed/desert1/400/225',    splashArt: 'https://picsum.photos/seed/desert1/1280/720',    details: [{ label: 'Caption', value: 'Sand dunes at sunset' }, { label: 'Resolution', value: '1280×720' }, { label: 'Source', value: 'Picsum' }], action: { type: 'gallery', images: [{ url: 'https://picsum.photos/seed/desert1/1280/720',    caption: 'Sand dunes at sunset' }] } },
        ],
        details: [
          { label: 'Photos',  value: '5' },
          { label: 'Format',  value: 'JPEG' },
          { label: 'Source',  value: 'Picsum Photos' },
        ],
        action: { type: 'details', description: 'Demo photo collection', date: '' },
      },
      {
        id: 'ph-storage',
        label: 'Memory Stick',
        icon: FolderOpen,
        type: 'folder',
        subItems: [
          { id: 'ms-ph-1', label: 'Mountain Valley', icon: Image, type: 'gallery', details: [{ label: 'Caption', value: 'Mountain valley at dawn' }, { label: 'Resolution', value: '1280×720' }, { label: 'Format', value: 'JPEG' }, { label: 'Size', value: '312 KB' }], action: { type: 'gallery', images: [{ url: 'https://picsum.photos/seed/landscape1/1280/720', caption: 'Mountain valley at dawn' }] } },
          { id: 'ms-ph-2', label: 'Coastline',       icon: Image, type: 'gallery', details: [{ label: 'Caption', value: 'Coastline at golden hour' }, { label: 'Resolution', value: '1280×720' }, { label: 'Format', value: 'JPEG' }, { label: 'Size', value: '287 KB' }], action: { type: 'gallery', images: [{ url: 'https://picsum.photos/seed/coast1/1280/720',     caption: 'Coastline at golden hour' }] } },
          { id: 'ms-ph-3', label: 'Forest Path',     icon: Image, type: 'gallery', details: [{ label: 'Caption', value: 'Forest path in autumn' }, { label: 'Resolution', value: '1280×720' }, { label: 'Format', value: 'JPEG' }, { label: 'Size', value: '341 KB' }], action: { type: 'gallery', images: [{ url: 'https://picsum.photos/seed/forest2/1280/720',    caption: 'Forest path in autumn' }] } },
          { id: 'ms-ph-4', label: 'City Skyline',    icon: Image, type: 'gallery', details: [{ label: 'Caption', value: 'City skyline at night' }, { label: 'Resolution', value: '1280×720' }, { label: 'Format', value: 'JPEG' }, { label: 'Size', value: '298 KB' }], action: { type: 'gallery', images: [{ url: 'https://picsum.photos/seed/city2/1280/720',      caption: 'City skyline at night' }] } },
          { id: 'ms-ph-5', label: 'Sand Dunes',      icon: Image, type: 'gallery', details: [{ label: 'Caption', value: 'Sand dunes at sunset' }, { label: 'Resolution', value: '1280×720' }, { label: 'Format', value: 'JPEG' }, { label: 'Size', value: '264 KB' }], action: { type: 'gallery', images: [{ url: 'https://picsum.photos/seed/desert1/1280/720',    caption: 'Sand dunes at sunset' }] } },
          { id: 'ms-ph-6', label: 'Aurora Borealis', icon: Image, type: 'gallery', details: [{ label: 'Caption', value: 'Aurora borealis' },         { label: 'Resolution', value: '1280×720' }, { label: 'Format', value: 'JPEG' }, { label: 'Size', value: '319 KB' }], action: { type: 'gallery', images: [{ url: 'https://picsum.photos/seed/aurora1/1280/720',   caption: 'Aurora borealis' }] } },
          { id: 'ms-ph-7', label: 'Snowy Mountain',  icon: Image, type: 'gallery', details: [{ label: 'Caption', value: 'Snowy mountain peak' },     { label: 'Resolution', value: '1280×720' }, { label: 'Format', value: 'JPEG' }, { label: 'Size', value: '278 KB' }], action: { type: 'gallery', images: [{ url: 'https://picsum.photos/seed/snow-mt/1280/720',   caption: 'Snowy mountain peak' }] } },
          { id: 'ms-ph-8', label: 'Ocean Waves',     icon: Image, type: 'gallery', details: [{ label: 'Caption', value: 'Ocean waves at dusk' },     { label: 'Resolution', value: '1280×720' }, { label: 'Format', value: 'JPEG' }, { label: 'Size', value: '305 KB' }], action: { type: 'gallery', images: [{ url: 'https://picsum.photos/seed/ocean-w/1280/720',   caption: 'Ocean waves at dusk' }] } },
          { id: 'ms-ph-9', label: 'Ancient Ruins',   icon: Image, type: 'gallery', details: [{ label: 'Caption', value: 'Ancient ruins' },           { label: 'Resolution', value: '1280×720' }, { label: 'Format', value: 'JPEG' }, { label: 'Size', value: '293 KB' }], action: { type: 'gallery', images: [{ url: 'https://picsum.photos/seed/ruins1/1280/720',    caption: 'Ancient ruins' }] } },
        ],
        details: [
          { label: 'Type',      value: 'Memory Stick PRO Duo' },
          { label: 'Capacity',  value: '2 GB' },
          { label: 'Free',      value: '1.99 GB' },
          { label: 'Photos',    value: '9' },
        ],
        action: { type: 'details', description: 'Images on storage', date: '' },
      },
    ],
  },

  // ── Music ───────────────────────────────────────────────────────────────────
  {
    id: 'music',
    label: 'Music',
    icon: Music,
    defaultIndex: 0,
    items: [
      {
        id: 'mu-collection',
        label: 'Demo Playlist',
        icon: ListMusic,
        type: 'folder',
        splashArt: 'https://picsum.photos/seed/music-t1/400/400',
        subItems: [
          {
            id: 'mu-all',
            label: 'Play All',
            loadingLabel: 'Demo Playlist',
            icon: Play,
            type: 'application',
            splashArt: 'https://picsum.photos/seed/music-t1/400/400',
            action: {
              type: 'media',
              contentType: 'audio',
              playlist: [
                { title: 'Cozy Snowfall Dream', src: '/music/Cozy_Snowfall_Dream.mp3', thumbnail: 'https://picsum.photos/seed/music-t1/400/400' },
                { title: 'Floating Home',       src: '/music/Floating_Home.mp3',        thumbnail: 'https://picsum.photos/seed/music-t2/400/400' },
                { title: 'Mango Postcard',      src: '/music/Mango_Postcard.mp3',       thumbnail: 'https://picsum.photos/seed/music-t3/400/400' },
                { title: 'Serene Groove Vibes', src: '/music/Serene_Groove_Vibes.mp3',  thumbnail: 'https://picsum.photos/seed/music-t4/400/400' },
              ],
            },
          },
          { id: 'mu-t1', label: 'Cozy Snowfall Dream', icon: Music, type: 'application', thumbnail: 'https://picsum.photos/seed/music-t1/400/400', splashArt: 'https://picsum.photos/seed/music-t1/400/400', details: [{ label: 'Artist', value: 'Suno AI' }, { label: 'Genre', value: 'Ambient' },   { label: 'Duration', value: '2:31' }, { label: 'Format', value: 'MP3' }, { label: 'Year', value: '2026' }], action: { type: 'media', contentType: 'audio', src: '/music/Cozy_Snowfall_Dream.mp3' } },
          { id: 'mu-t2', label: 'Floating Home',       icon: Music, type: 'application', thumbnail: 'https://picsum.photos/seed/music-t2/400/400', splashArt: 'https://picsum.photos/seed/music-t2/400/400', details: [{ label: 'Artist', value: 'Suno AI' }, { label: 'Genre', value: 'Lo-fi' },     { label: 'Duration', value: '2:48' }, { label: 'Format', value: 'MP3' }, { label: 'Year', value: '2026' }], action: { type: 'media', contentType: 'audio', src: '/music/Floating_Home.mp3' } },
          { id: 'mu-t3', label: 'Mango Postcard',      icon: Music, type: 'application', thumbnail: 'https://picsum.photos/seed/music-t3/400/400', splashArt: 'https://picsum.photos/seed/music-t3/400/400', details: [{ label: 'Artist', value: 'Suno AI' }, { label: 'Genre', value: 'Tropical' }, { label: 'Duration', value: '2:14' }, { label: 'Format', value: 'MP3' }, { label: 'Year', value: '2026' }], action: { type: 'media', contentType: 'audio', src: '/music/Mango_Postcard.mp3' } },
          { id: 'mu-t4', label: 'Serene Groove Vibes', icon: Music, type: 'application', thumbnail: 'https://picsum.photos/seed/music-t4/400/400', splashArt: 'https://picsum.photos/seed/music-t4/400/400', details: [{ label: 'Artist', value: 'Suno AI' }, { label: 'Genre', value: 'Chillout' }, { label: 'Duration', value: '3:02' }, { label: 'Format', value: 'MP3' }, { label: 'Year', value: '2026' }], action: { type: 'media', contentType: 'audio', src: '/music/Serene_Groove_Vibes.mp3' } },
        ],
        details: [
          { label: 'Tracks',    value: '4' },
          { label: 'Duration',  value: '10:35' },
          { label: 'Format',    value: 'MP3' },
          { label: 'Artist',    value: 'Suno AI' },
        ],
        action: { type: 'details', description: 'Demo music playlist', date: '' },
      },
      {
        id: 'mu-storage',
        label: 'Memory Stick',
        icon: FolderOpen,
        type: 'folder',
        subItems: [
          { id: 'mu-s-t1', label: 'Cozy Snowfall Dream', icon: Music, type: 'application', details: [{ label: 'Artist', value: 'Suno AI' }, { label: 'Genre', value: 'Ambient' },   { label: 'Duration', value: '2:31' }, { label: 'Format', value: 'MP3' }, { label: 'Size', value: '2.4 MB' }], action: { type: 'media', contentType: 'audio', src: '/music/Cozy_Snowfall_Dream.mp3' } },
          { id: 'mu-s-t2', label: 'Floating Home',       icon: Music, type: 'application', details: [{ label: 'Artist', value: 'Suno AI' }, { label: 'Genre', value: 'Lo-fi' },     { label: 'Duration', value: '2:48' }, { label: 'Format', value: 'MP3' }, { label: 'Size', value: '2.7 MB' }], action: { type: 'media', contentType: 'audio', src: '/music/Floating_Home.mp3' } },
          { id: 'mu-s-t3', label: 'Mango Postcard',      icon: Music, type: 'application', details: [{ label: 'Artist', value: 'Suno AI' }, { label: 'Genre', value: 'Tropical' }, { label: 'Duration', value: '2:14' }, { label: 'Format', value: 'MP3' }, { label: 'Size', value: '2.1 MB' }], action: { type: 'media', contentType: 'audio', src: '/music/Mango_Postcard.mp3' } },
          { id: 'mu-s-t4', label: 'Serene Groove Vibes', icon: Music, type: 'application', details: [{ label: 'Artist', value: 'Suno AI' }, { label: 'Genre', value: 'Chillout' }, { label: 'Duration', value: '3:02' }, { label: 'Format', value: 'MP3' }, { label: 'Size', value: '2.9 MB' }], action: { type: 'media', contentType: 'audio', src: '/music/Serene_Groove_Vibes.mp3' } },
        ],
        details: [
          { label: 'Type',      value: 'Memory Stick PRO Duo' },
          { label: 'Capacity',  value: '2 GB' },
          { label: 'Free',      value: '1.99 GB' },
          { label: 'Tracks',    value: '4' },
          { label: 'Used',      value: '10.1 MB' },
        ],
        action: { type: 'details', description: 'Music files on storage', date: '' },
      },
    ],
  },

  // ── Video ───────────────────────────────────────────────────────────────────
  {
    id: 'video',
    label: 'Video',
    icon: Film,
    defaultIndex: 0,
    items: [
      {
        id: 'vi-nature',
        label: 'Nature Collection',
        icon: Clapperboard,
        type: 'folder',
        splashArt: 'https://picsum.photos/seed/calm-lake-trees/400/225',
        subItems: [
          {
            id: 'vi-nature-all',
            label: 'Play All',
            loadingLabel: 'Nature Collection',
            icon: Play,
            type: 'application',
            splashArt: 'https://picsum.photos/seed/calm-lake-trees/400/225',
            action: {
              type: 'media',
              contentType: 'video',
              playlist: [
                { title: 'Calm Lake Trees', src: '/video/Calm_Lake_Trees.mp4',          thumbnail: 'https://picsum.photos/seed/calm-lake-trees/400/225' },
                { title: 'Tranquil Forest', src: '/video/Tranquil_Forest_Sunny_Day.mp4', thumbnail: 'https://picsum.photos/seed/tranquil-forest-sunny/400/225' },
              ],
            },
          },
          { id: 'vi-calm',   label: 'Calm Lake Trees', icon: Video, type: 'application', thumbnail: 'https://picsum.photos/seed/calm-lake-trees/400/225',      splashArt: 'https://picsum.photos/seed/calm-lake-trees/400/225',      details: [{ label: 'Duration', value: '0:30' }, { label: 'Resolution', value: '1920×1080' }, { label: 'Genre', value: 'Nature' }, { label: 'Format', value: 'MP4' }, { label: 'Source', value: 'Pexels' }], action: { type: 'media', contentType: 'video', src: '/video/Calm_Lake_Trees.mp4' } },
          { id: 'vi-forest', label: 'Tranquil Forest', icon: Video, type: 'application', thumbnail: 'https://picsum.photos/seed/tranquil-forest-sunny/400/225', splashArt: 'https://picsum.photos/seed/tranquil-forest-sunny/400/225', details: [{ label: 'Duration', value: '0:28' }, { label: 'Resolution', value: '1920×1080' }, { label: 'Genre', value: 'Nature' }, { label: 'Format', value: 'MP4' }, { label: 'Source', value: 'Pexels' }], action: { type: 'media', contentType: 'video', src: '/video/Tranquil_Forest_Sunny_Day.mp4' } },
        ],
        details: [
          { label: 'Videos',      value: '2' },
          { label: 'Duration',    value: '0:58' },
          { label: 'Format',      value: 'MP4' },
          { label: 'Resolution',  value: '1920×1080' },
        ],
        action: { type: 'details', description: 'Nature video collection', date: '' },
      },
      {
        id: 'vi-storage',
        label: 'Memory Stick',
        icon: FolderOpen,
        type: 'folder',
        subItems: [
          { id: 'vi-s-calm',   label: 'Calm Lake Trees', icon: Video, type: 'application', details: [{ label: 'Duration', value: '0:30' }, { label: 'Resolution', value: '1920×1080' }, { label: 'Genre', value: 'Nature' }, { label: 'Format', value: 'MP4' }, { label: 'Size', value: '48 MB' }],  action: { type: 'media', contentType: 'video', src: '/video/Calm_Lake_Trees.mp4' } },
          { id: 'vi-s-forest', label: 'Tranquil Forest', icon: Video, type: 'application', details: [{ label: 'Duration', value: '0:28' }, { label: 'Resolution', value: '1920×1080' }, { label: 'Genre', value: 'Nature' }, { label: 'Format', value: 'MP4' }, { label: 'Size', value: '43 MB' }],  action: { type: 'media', contentType: 'video', src: '/video/Tranquil_Forest_Sunny_Day.mp4' } },
        ],
        details: [
          { label: 'Type',      value: 'Memory Stick PRO Duo' },
          { label: 'Capacity',  value: '4 GB' },
          { label: 'Free',      value: '3.91 GB' },
          { label: 'Videos',    value: '2' },
          { label: 'Used',      value: '91 MB' },
        ],
        action: { type: 'details', description: 'Video files on storage', date: '' },
      },
    ],
  },

  // ── Game ────────────────────────────────────────────────────────────────────
  {
    id: 'game',
    label: 'Game',
    icon: Gamepad2,
    defaultIndex: 1,
    items: [
      {
        id: 'gm-storage',
        label: 'Memory Stick',
        icon: FolderOpen,
        type: 'folder',
        subItems: [
          {
            id: 'gm-storage-a',
            label: 'Saved Data',
            icon: Gamepad,
            type: 'document',
            action: {
              type: 'details',
              description: '## Saved Data\n\nNo save files found.',
              date: '',
            },
          },
          {
            id: 'gm-storage-b',
            label: 'Download Save',
            icon: Download,
            type: 'download',
            action: {
              type: 'download',
              filename: 'game-save.dat',
              filesize: '156 KB',
              url: '/downloads/game-save.dat',
            },
          },
        ],
        details: [
          { label: 'Type',       value: 'Memory Stick PRO Duo' },
          { label: 'Capacity',   value: '2 GB' },
          { label: 'Free',       value: '2.00 GB' },
          { label: 'Save Files', value: '1' },
          { label: 'Used',       value: '156 KB' },
        ],
        action: { type: 'details', description: 'Data on storage', date: '' },
      },
      {
        id: 'gm-umd',
        label: 'Gamabunta',
        icon: Disc,
        type: 'application',
        thumbnail: '/thumbnails/gamabunta-thumb.png',
        splashArt: '/splasharts/gamabunta.png',
        details: [
          { label: 'Genre',     value: 'Action' },
          { label: 'Platform',  value: 'WebGL' },
          { label: 'Developer', value: 'Marko Kofol' },
          { label: 'Year',      value: '2021' },
        ],
        action: {
          type: 'media',
          contentType: 'webgl',
          src: 'https://web-gl-gamabunta.vercel.app/',
        },
      },
      {
        id: 'gm-obkavici',
        label: 'Ob Kavici',
        icon: Globe,
        type: 'application',
        thumbnail: 'https://obkavici.si/opengraph-image',
        splashArt: 'https://obkavici.si/opengraph-image',
        details: [
          { label: 'Type',    value: 'Web App' },
          { label: 'Source',  value: 'obkavici.si' },
          { label: 'Year',    value: '2026' },
        ],
        action: {
          type: 'media',
          contentType: 'web',
          src: 'https://www.obkavici.si/',
        },
      },
    ],
  },

  // ── Network ─────────────────────────────────────────────────────────────────
  {
    id: 'network',
    label: 'Network',
    icon: Globe,
    defaultIndex: 0,
    items: [
      {
        id: 'ne-github',
        label: 'GitHub',
        icon: ExternalLink,
        type: 'document',
        splashArt: 'https://picsum.photos/seed/github-dark/1280/720',
        action: {
          type: 'details',
          date: '2026',
          description: `# xmb-react on GitHub

**[Open repository →](https://github.com/kofolmarko/xmb-react)**

Source code, issues, and pull requests for xmb-react.`,
        },
      },
      {
        id: 'ne-downloads',
        label: 'Downloads',
        icon: Download,
        type: 'document',
        action: { type: 'details', description: '## Downloads\n\nNo active downloads.', date: '' },
      },
      {
        id: 'ne-remote',
        label: 'Remote Play',
        icon: Wifi,
        type: 'document',
        action: { type: 'details', description: '## Remote Play\n\nConnect to a remote server to stream content.', date: '' },
      },
    ],
  },

  // ── Extras ──────────────────────────────────────────────────────────────────
  {
    id: 'extras',
    label: 'Extras',
    icon: Star,
    defaultIndex: 0,
    items: [
      {
        id: 'ex-fps',
        label: 'FPS Demo',
        icon: Gamepad2,
        type: 'application',
        thumbnail: 'https://picsum.photos/seed/fpsdemo/200/120',
        splashArt: 'https://picsum.photos/seed/fpsdemo/1280/720',
        action: {
          type: 'media',
          contentType: 'webgl',
          src: 'https://threejs.org/examples/games_fps.html',
        },
      },
      {
        id: 'ex-book',
        label: 'XMB Handbook',
        icon: BookOpen,
        type: 'document',
        action: {
          type: 'details',
          date: '2026',
          description: `# XMB Handbook

A reference for everything the XMB interface can do.

---

## Navigation model

The XMB is organised as a flat row of **categories** (top) with a vertical
list of **items** below each one. Navigate between categories with ← →,
and between items with ↑ ↓.

Folders open a sub-menu. Press ← or Escape to go back.

---

## Overlays

| Overlay | Opened by |
|---------|-----------|
| Document viewer | \`type: 'document'\` |
| Gallery carousel | \`type: 'gallery'\` |
| Media player | \`type: 'application'\` with \`action.type: 'media'\` |
| Download panel | \`type: 'download'\` |
| Side panel | Triangle key, or auto on focus |

---

## Side panel

Press **T** on any non-document item to open the side panel.
For media items it shows Play and Open in New Tab actions.
For other items it shows the item description.

---

## Splash art

Set \`splashArt\` on any item to show a full-screen background image
when that item is focused. The image fades in with a subtle animation.

---

## Boot screen

The boot screen plays on first load. Edit \`boot.text\` and \`boot.subText\`
in \`manifest.jsx\` to personalise it.`,
        },
      },
    ],
  },
];
