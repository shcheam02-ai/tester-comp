import { DeviceConfig, PresetSite } from './types';

export const DEFAULT_LEFT_URL = 'https://tester-building.vercel.app';
export const DEFAULT_RIGHT_URL = 'https://vercel.com/cheam-shing-howe/tester-pro';

export const DEVICE_PRESETS: DeviceConfig[] = [
  {
    id: 'fluid',
    name: 'Fluid (Fill Screen)',
    width: '100%',
    height: '100%',
    icon: 'Maximize2',
    type: 'fluid',
  },
  {
    id: 'desktop-lg',
    name: 'Large Desktop (1920 × 1080)',
    width: 1920,
    height: 1080,
    icon: 'Monitor',
    type: 'desktop',
  },
  {
    id: 'desktop',
    name: 'Desktop (1440 × 900)',
    width: 1440,
    height: 900,
    icon: 'Monitor',
    type: 'desktop',
  },
  {
    id: 'laptop',
    name: 'Laptop (1280 × 800)',
    width: 1280,
    height: 800,
    icon: 'Laptop',
    type: 'desktop',
  },
  {
    id: 'tablet',
    name: 'iPad / Tablet (768 × 1024)',
    width: 768,
    height: 1024,
    icon: 'Tablet',
    type: 'tablet',
  },
  {
    id: 'mobile',
    name: 'Mobile Phone (390 × 844)',
    width: 390,
    height: 844,
    icon: 'Smartphone',
    type: 'mobile',
  },
];

export const PRESET_URLS: PresetSite[] = [
  {
    label: 'Tester Building vs Tester Pro (Current Request)',
    leftUrl: 'https://tester-building.vercel.app',
    rightUrl: 'https://vercel.com/cheam-shing-howe/tester-pro',
    description: 'Compare previous deployment against new pro version',
  },
  {
    label: 'Deployment vs Localhost (Demo)',
    leftUrl: 'https://tester-building.vercel.app',
    rightUrl: 'http://localhost:3000',
    description: 'Preview remote build vs local development server',
  },
];

export const COMMON_PATHS = [
  '/',
  '/login',
  '/dashboard',
  '/settings',
  '/profile',
  '/pricing',
  '/about',
  '/docs',
];
