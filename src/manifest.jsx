import { Wrench, Camera, Music, Film, Gamepad2, Globe, Star, FolderOpen, Image, Headphones, Video, Disc, ShoppingCart, Wifi, Download, Clock, Shield, Battery, Monitor, Gamepad, Info } from 'lucide-react';

export const boot = {
  text: 'XMB React',
  subText: 'Press any key to start',
};

export const categories = [
  {
    id: 'settings',
    label: 'Settings',
    icon: Wrench,
    defaultIndex: 0,
    items: [
      { id: 'set1', label: 'Theme', icon: Monitor, type: 'document', action: { type: 'details', description: 'Background and color settings', date: '' } },
      { id: 'set2', label: 'Date & Time', icon: Clock, type: 'document', action: { type: 'details', description: 'Set date, time and timezone', date: '' } },
      { id: 'set3', label: 'Security', icon: Shield, type: 'document', action: { type: 'details', description: 'Password and lock settings', date: '' } },
      { id: 'set4', label: 'Power Save', icon: Battery, type: 'document', action: { type: 'details', description: 'Auto-off and brightness', date: '' } },
      { id: 'set5', label: 'System Info', icon: Info, type: 'document', action: { type: 'details', description: 'XMB React v1.0.0', date: '2026' } },
    ],
  },
  {
    id: 'photo',
    label: 'Photo',
    icon: Camera,
    defaultIndex: 0,
    items: [
      {
        id: 'ph1',
        label: 'Memory Stick',
        icon: FolderOpen,
        type: 'folder',
        splashArt: 'https://picsum.photos/seed/photos/1280/720',
        subItems: [
          { id: 'ph1a', label: 'Screenshots', icon: Image, type: 'document', action: { type: 'details', description: 'Saved screenshots', date: '' } },
          { id: 'ph1b', label: 'Camera Roll', icon: Camera, type: 'document', action: { type: 'details', description: 'Photos from camera', date: '' } },
        ],
        action: { type: 'details', description: 'Photos on storage', date: '' },
      },
      { id: 'ph2', label: 'Online Images', icon: Globe, type: 'document', splashArt: 'https://picsum.photos/seed/online/1280/720', action: { type: 'details', description: 'Downloaded from web', date: '' } },
    ],
  },
  {
    id: 'music',
    label: 'Music',
    icon: Music,
    defaultIndex: 0,
    items: [
      { id: 'mu1', label: 'All Tracks', icon: Headphones, type: 'application', splashArt: 'https://picsum.photos/seed/music-dark/1280/720', action: { type: 'media', contentType: 'audio', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' } },
      { id: 'mu2', label: 'Music Server', icon: Wifi, type: 'document', action: { type: 'details', description: 'Stream from media server', date: '' } },
      {
        id: 'mu3',
        label: 'Memory Stick',
        icon: FolderOpen,
        type: 'folder',
        splashArt: 'https://picsum.photos/seed/music2/1280/720',
        subItems: [
          { id: 'mu3a', label: 'Playlist 1', icon: Music, type: 'application', action: { type: 'media', contentType: 'audio', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' } },
          { id: 'mu3b', label: 'Artists', icon: Headphones, type: 'document', action: { type: 'details', description: 'Browse by artist', date: '' } },
        ],
        action: { type: 'details', description: 'Music on storage', date: '' },
      },
    ],
  },
  {
    id: 'video',
    label: 'Video',
    icon: Film,
    defaultIndex: 0,
    items: [
      { id: 'vi1', label: 'Video Server', icon: Wifi, type: 'document', action: { type: 'details', description: 'Stream from media server', date: '' } },
      {
        id: 'vi2',
        label: 'Memory Stick',
        icon: FolderOpen,
        type: 'folder',
        splashArt: 'https://picsum.photos/seed/cinema/1280/720',
        subItems: [
          { id: 'vi2a', label: 'Movies', icon: Video, type: 'application', action: { type: 'media', contentType: 'video', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' } },
          { id: 'vi2b', label: 'Clips', icon: Video, type: 'document', action: { type: 'details', description: 'Short video clips', date: '' } },
        ],
        action: { type: 'details', description: 'Videos on storage', date: '' },
      },
    ],
  },
  {
    id: 'game',
    label: 'Game',
    icon: Gamepad2,
    defaultIndex: 1,
    items: [
      {
        id: 'gm1',
        label: 'Memory Stick',
        icon: FolderOpen,
        type: 'folder',
        splashArt: 'https://picsum.photos/seed/gamesave/1280/720',
        subItems: [
          { id: 'gm1a', label: 'Saved Data', icon: Gamepad, type: 'document', action: { type: 'details', description: 'Game save files', date: '' } },
          { id: 'gm1b', label: 'Minis', icon: Gamepad2, type: 'document', action: { type: 'details', description: 'Downloaded mini games', date: '' } },
        ],
        action: { type: 'details', description: 'Data on storage', date: '' },
      },
      {
        id: 'gm2',
        label: 'UMD',
        icon: Disc,
        type: 'application',
        umd: true,
        splashArt: 'https://picsum.photos/seed/runner3d/1280/720',
        subItems: [
          { id: 'gm2-play', label: 'Play', icon: Gamepad2, type: 'application', action: { type: 'media', contentType: 'webgl', src: 'https://threejs.org/examples/games_fps.html' } },
          { id: 'gm2-info', label: 'Game Info', icon: Info, type: 'document', action: { type: 'details', description: 'Fast-paced 3D runner', date: '' } },
        ],
        action: { type: 'media', contentType: 'webgl', src: 'https://threejs.org/examples/games_fps.html' },
      },
      {
        id: 'gm3',
        label: 'PlayStation Network',
        icon: ShoppingCart,
        type: 'document',
        splashArt: 'https://picsum.photos/seed/psn/1280/720',
        action: { type: 'details', description: 'Browse and download games', date: '' },
      },
    ],
  },
  {
    id: 'network',
    label: 'Network',
    icon: Globe,
    defaultIndex: 0,
    items: [
      { id: 'ne1', label: 'Browser', icon: Globe, type: 'application', splashArt: 'https://picsum.photos/seed/browser/1280/720', action: { type: 'media', contentType: 'web', src: 'https://example.com' } },
      { id: 'ne2', label: 'Downloads', icon: Download, type: 'document', action: { type: 'details', description: 'Manage downloads', date: '' } },
      { id: 'ne3', label: 'Remote Play', icon: Wifi, type: 'document', action: { type: 'details', description: 'Connect to remote server', date: '' } },
    ],
  },
  {
    id: 'extras',
    label: 'Extras',
    icon: Star,
    defaultIndex: 0,
    items: [
      {
        id: 'ex1',
        label: 'Gamabunta',
        icon: Gamepad2,
        type: 'application',
        splashArt: 'https://picsum.photos/seed/gamabunta/1280/720',
        action: { type: 'media', contentType: 'webgl', src: 'https://web-gl-gamabunta.vercel.app/' },
      },
      {
        id: 'ex2',
        label: 'Puzzle',
        icon: Star,
        type: 'application',
        splashArt: 'https://picsum.photos/seed/puzzlegame/1280/720',
        action: { type: 'details', description: 'Brain teasing puzzles', date: '' },
      },
      {
        id: 'ex3',
        label: 'Racing',
        icon: Star,
        type: 'application',
        splashArt: 'https://picsum.photos/seed/racing/1280/720',
        action: { type: 'details', description: 'Speed challenges', date: '' },
      },
    ],
  },
];
