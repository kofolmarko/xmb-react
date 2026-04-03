import { Image, Music, Video, Gamepad2, Settings, Wifi, Play, Puzzle, Car, Globe, Download, Sun, Volume2, Clock, Info } from 'lucide-react';

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
    defaultIndex: 0,
    items: [
      {
        id: 'photo1',
        label: 'Vacation',
        icon: Image,
        splashArt: 'https://picsum.photos/seed/vacation2024/1280/720',
        action: { type: 'details', description: 'Summer 2024 trip photos', date: '2024-08-15' },
      },
      {
        id: 'photo2',
        label: 'Family',
        icon: Image,
        splashArt: 'https://picsum.photos/seed/family/1280/720',
        action: { type: 'details', description: 'Family gathering moments', date: '2024-12-25' },
      },
      {
        id: 'photo3',
        label: 'Nature',
        icon: Image,
        splashArt: 'https://picsum.photos/seed/nature99/1280/720',
        action: { type: 'details', description: 'Landscape photography', date: '2024-06-10' },
      },
    ],
  },
  {
    id: 'music',
    label: 'Music',
    icon: Music,
    defaultIndex: 0,
    items: [
      {
        id: 'music1',
        label: 'Playlist 1',
        icon: Music,
        splashArt: 'https://picsum.photos/seed/music-dark/1280/720',
        action: { type: 'media', contentType: 'audio', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
      },
      {
        id: 'music2',
        label: 'Playlist 2',
        icon: Music,
        splashArt: 'https://picsum.photos/seed/music2/1280/720',
        action: { type: 'media', contentType: 'audio', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
      },
      {
        id: 'music3',
        label: 'Artists',
        icon: Music,
        action: { type: 'details', description: 'Manage your music library', date: '' },
      },
    ],
  },
  {
    id: 'video',
    label: 'Video',
    icon: Video,
    defaultIndex: 0,
    items: [
      {
        id: 'video1',
        label: 'Movies',
        icon: Video,
        splashArt: 'https://picsum.photos/seed/cinema/1280/720',
        action: { type: 'media', contentType: 'video', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
      },
      {
        id: 'video2',
        label: 'TV Shows',
        icon: Video,
        splashArt: 'https://picsum.photos/seed/tvshows/1280/720',
        subItems: [
          { id: 'tv1', label: 'Continue Watching', icon: Play, action: { type: 'details', description: 'Resume from where you left off', date: '' } },
          { id: 'tv2', label: 'New Releases', icon: Video, action: { type: 'details', description: 'Latest episodes', date: '' } },
          { id: 'tv3', label: 'My List', icon: Video, action: { type: 'details', description: 'Saved shows', date: '' } },
        ],
        action: { type: 'details', description: 'Your TV series collection', date: '' },
      },
      {
        id: 'video3',
        label: 'Clips',
        icon: Video,
        action: { type: 'details', description: 'Short video clips', date: '' },
      },
    ],
  },
  {
    id: 'game',
    label: 'Game',
    icon: Gamepad2,
    defaultIndex: 0,
    items: [
      {
        id: 'game1',
        label: '3D Runner',
        icon: Gamepad2,
        splashArt: 'https://picsum.photos/seed/runner3d/1280/720',
        subItems: [
          { id: 'g1-play', label: 'Play', icon: Play, action: { type: 'media', contentType: 'webgl', src: 'https://threejs.org/examples/games_fps.html' } },
          { id: 'g1-info', label: 'Game Info', icon: Info, action: { type: 'details', description: 'Fast-paced 3D runner built with Three.js', date: '' } },
          { id: 'g1-scores', label: 'High Scores', icon: Gamepad2, action: { type: 'details', description: 'No scores yet — be the first!', date: '' } },
        ],
        action: { type: 'media', contentType: 'webgl', src: 'https://threejs.org/examples/games_fps.html' },
      },
      {
        id: 'game2',
        label: 'Puzzle',
        icon: Puzzle,
        splashArt: 'https://picsum.photos/seed/puzzlegame/1280/720',
        subItems: [
          { id: 'g2-play', label: 'Play', icon: Play, action: { type: 'details', description: 'Starting puzzle game…', date: '' } },
          { id: 'g2-levels', label: 'Level Select', icon: Puzzle, action: { type: 'details', description: '24 levels available', date: '' } },
        ],
        action: { type: 'details', description: 'Brain teasing puzzles', date: '' },
      },
      {
        id: 'game3',
        label: 'Racing',
        icon: Car,
        splashArt: 'https://picsum.photos/seed/racing/1280/720',
        action: { type: 'details', description: 'Speed challenges', date: '' },
      },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    defaultIndex: 0,
    items: [
      { id: 'settings1', label: 'Display', icon: Sun, action: { type: 'details', description: 'Screen brightness, theme settings', date: '' } },
      { id: 'settings2', label: 'Audio', icon: Volume2, action: { type: 'details', description: 'Volume, sound effects', date: '' } },
      { id: 'settings3', label: 'Date/Time', icon: Clock, action: { type: 'details', description: 'Set date and time', date: '' } },
      { id: 'settings4', label: 'About', icon: Info, action: { type: 'details', description: 'XMB React v1.0.0', date: '2026' } },
    ],
  },
  {
    id: 'network',
    label: 'Network',
    icon: Wifi,
    defaultIndex: 0,
    items: [
      {
        id: 'net1',
        label: 'Browser',
        icon: Globe,
        splashArt: 'https://picsum.photos/seed/browser/1280/720',
        action: { type: 'media', contentType: 'web', src: 'https://example.com' },
      },
      {
        id: 'net2',
        label: 'Downloads',
        icon: Download,
        action: { type: 'details', description: 'Manage downloads', date: '' },
      },
    ],
  },
];
