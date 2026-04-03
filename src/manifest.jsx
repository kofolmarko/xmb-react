import { Image, Music, Video, Gamepad2, Settings, Wifi } from 'lucide-react';

export const theme = {
  colors: {
    background: '#0a0a1a',
    categoryBar: '#121225',
    iconDefault: '#4a4a6a',
    iconActive: '#00d4ff',
    textPrimary: '#e0e0e8',
    textSecondary: '#8888aa',
    selectionHighlight: 'rgba(0, 212, 255, 0.15)',
    focusRing: '#00d4ff',
    statusBar: '#080812',
    iconGlow: 'rgba(0, 212, 255, 0.6)',
  },
};

export const categories = [
  {
    id: 'photo',
    label: 'Image',
    icon: Image,
    items: [
      { id: 'photo1', label: 'Vacation', icon: Image, action: { type: 'details', description: 'Summer 2024 trip photos', date: '2024-08-15' } },
      { id: 'photo2', label: 'Family', icon: Image, action: { type: 'details', description: 'Family gathering moments', date: '2024-12-25' } },
      { id: 'photo3', label: 'Nature', icon: Image, action: { type: 'details', description: 'Landscape photography', date: '2024-06-10' } },
    ],
  },
  {
    id: 'music',
    label: 'Music',
    icon: Music,
    items: [
      { id: 'music1', label: 'Playlist 1', icon: Music, action: { type: 'media', contentType: 'audio', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' } },
      { id: 'music2', label: 'Playlist 2', icon: Music, action: { type: 'media', contentType: 'audio', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' } },
      { id: 'music3', label: 'Artists', icon: Music, action: { type: 'details', description: 'Manage your music library', date: '' } },
    ],
  },
  {
    id: 'video',
    label: 'Video',
    icon: Video,
    items: [
      { id: 'video1', label: 'Movies', icon: Video, action: { type: 'media', contentType: 'video', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' } },
      { id: 'video2', label: 'TV Shows', icon: Video, action: { type: 'details', description: 'Your TV series collection', date: '' } },
      { id: 'video3', label: 'Clips', icon: Video, action: { type: 'details', description: 'Short video clips', date: '' } },
    ],
  },
  {
    id: 'game',
    label: 'Game',
    icon: Gamepad2,
    items: [
      { id: 'game1', label: '3D Runner', icon: Gamepad2, action: { type: 'media', contentType: 'webgl', src: 'https://threejs.org/examples/games_fps.html' } },
      { id: 'game2', label: 'Puzzle', icon: Gamepad2, action: { type: 'details', description: 'Brain teasing puzzles', date: '' } },
      { id: 'game3', label: 'Racing', icon: Gamepad2, action: { type: 'details', description: 'Speed challenges', date: '' } },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    items: [
      { id: 'settings1', label: 'Display', icon: Settings, action: { type: 'details', description: 'Screen brightness, theme settings', date: '' } },
      { id: 'settings2', label: 'Audio', icon: Settings, action: { type: 'details', description: 'Volume, sound effects', date: '' } },
      { id: 'settings3', label: 'Date/Time', icon: Settings, action: { type: 'details', description: 'Set date and time', date: '' } },
      { id: 'settings4', label: 'About', icon: Settings, action: { type: 'details', description: 'XMB React v1.0.0', date: '2026' } },
    ],
  },
  {
    id: 'network',
    label: 'Network',
    icon: Wifi,
    items: [
      { id: 'net1', label: 'Browser', icon: Wifi, action: { type: 'media', contentType: 'web', src: 'https://example.com' } },
      { id: 'net2', label: 'Downloads', icon: Wifi, action: { type: 'details', description: 'Manage downloads', date: '' } },
    ],
  },
];
