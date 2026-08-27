export type SplitOrientation = 'horizontal' | 'vertical' | 'diff-overlay' | 'swipe-compare';

export type SplitRatio = '50-50' | '70-30' | '30-70' | '100-0' | '0-100' | 'custom';

export type DevicePreset = 'fluid' | 'desktop-lg' | 'desktop' | 'laptop' | 'tablet' | 'mobile' | 'custom';

export interface DeviceConfig {
  id: DevicePreset;
  name: string;
  width: number | '100%';
  height: number | '100%';
  icon: string;
  type: 'desktop' | 'tablet' | 'mobile' | 'fluid';
}

export interface ReviewNote {
  id: string;
  title: string;
  category: 'ui' | 'functional' | 'performance' | 'bug' | 'enhancement';
  side: 'left' | 'right' | 'both';
  severity: 'low' | 'medium' | 'high';
  resolved: boolean;
  timestamp: number;
  description: string;
}

export interface PresetSite {
  label: string;
  leftUrl: string;
  rightUrl: string;
  description: string;
}
