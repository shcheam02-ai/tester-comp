import React, { useState } from 'react';
import { 
  SplitOrientation, 
  SplitRatio, 
  DevicePreset, 
  DeviceConfig, 
  PresetSite 
} from '../types';
import { DEVICE_PRESETS, PRESET_URLS, COMMON_PATHS } from '../constants';
import {
  Columns2,
  Rows2,
  Layers,
  Monitor,
  Laptop,
  Tablet,
  Smartphone,
  Maximize2,
  Minimize2,
  RotateCw,
  ClipboardList,
  Sliders,
  ZoomIn,
  ZoomOut,
  FolderSync,
  Compass,
  ChevronDown,
  Sparkles,
  ArrowLeftRight,
  ExternalLink,
} from 'lucide-react';

interface HeaderProps {
  orientation: SplitOrientation;
  onOrientationChange: (orientation: SplitOrientation) => void;
  splitRatio: number;
  onSplitPresetSelect: (ratioPct: number) => void;
  selectedDevice: DeviceConfig;
  onDeviceChange: (device: DeviceConfig) => void;
  zoomScale: number;
  onZoomChange: (scale: number) => void;
  onReloadBoth: () => void;
  onToggleReviewDrawer: () => void;
  notesCount: number;
  openBugsCount: number;
  leftUrl: string;
  rightUrl: string;
  onSwapUrls: () => void;
  onApplyPreset: (preset: PresetSite) => void;
  onSyncPath: (path: string) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  orientation,
  onOrientationChange,
  splitRatio,
  onSplitPresetSelect,
  selectedDevice,
  onDeviceChange,
  zoomScale,
  onZoomChange,
  onReloadBoth,
  onToggleReviewDrawer,
  notesCount,
  openBugsCount,
  leftUrl,
  rightUrl,
  onSwapUrls,
  onApplyPreset,
  onSyncPath,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);
  const [showPathMenu, setShowPathMenu] = useState(false);
  const [customSubpath, setCustomSubpath] = useState('');

  const handleApplyCustomPath = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSubpath.trim()) {
      onSyncPath(customSubpath.trim());
      setShowPathMenu(false);
    }
  };

  return (
    <header
      id="main-app-header"
      className="z-40 bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-between gap-2 select-none shadow-xs text-xs backdrop-blur-md"
    >
      {/* Brand & Preset Site Switcher */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Columns2 className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 dark:text-slate-100 text-xs leading-none">
              Side-by-Side App Comparator
            </h1>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              Dual Live Viewport
            </span>
          </div>
        </div>

        {/* Quick Swap URLs Button */}
        <button
          id="btn-swap-urls"
          onClick={onSwapUrls}
          title="Swap Left and Right Applications"
          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 transition-colors border border-slate-200 dark:border-slate-700"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
        </button>

        {/* Sync Path Dropdown */}
        <div className="relative">
          <button
            id="btn-sync-path-menu"
            onClick={() => setShowPathMenu(!showPathMenu)}
            title="Navigate both apps to the same subpage/route"
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <FolderSync className="w-3 h-3 text-indigo-500" />
            <span className="font-mono text-[10px]">Sync Route</span>
            <ChevronDown className="w-2.5 h-2.5 opacity-60" />
          </button>

          {showPathMenu && (
            <div className="absolute left-0 top-full mt-1 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Common Routes
              </span>
              <div className="grid grid-cols-2 gap-1 mb-2">
                {COMMON_PATHS.map((path) => (
                  <button
                    key={path}
                    onClick={() => {
                      onSyncPath(path);
                      setShowPathMenu(false);
                    }}
                    className="text-left px-2 py-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/40 text-slate-700 dark:text-slate-300 font-mono text-[11px] transition-colors truncate"
                  >
                    {path}
                  </button>
                ))}
              </div>

              <form onSubmit={handleApplyCustomPath} className="flex gap-1 pt-1.5 border-t border-slate-200 dark:border-slate-700">
                <input
                  type="text"
                  placeholder="/custom/route"
                  value={customSubpath}
                  onChange={(e) => setCustomSubpath(e.target.value)}
                  className="flex-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 font-mono text-[10px] text-slate-800 dark:text-slate-200 focus:outline-indigo-500"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-2 py-1 rounded text-[10px] font-medium hover:bg-indigo-700"
                >
                  Go
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Center Controls: Orientation & Split Presets & Device Preview */}
      <div className="flex items-center gap-2">
        {/* Layout Orientation Modes */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            id="btn-orient-horizontal"
            onClick={() => onOrientationChange('horizontal')}
            title="Side-by-Side (Horizontal Split)"
            className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${
              orientation === 'horizontal'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Columns2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Split</span>
          </button>

          <button
            id="btn-orient-vertical"
            onClick={() => onOrientationChange('vertical')}
            title="Top and Bottom (Vertical Split)"
            className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${
              orientation === 'vertical'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Rows2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Stacked</span>
          </button>

          <button
            id="btn-orient-diff"
            onClick={() => onOrientationChange('diff-overlay')}
            title="Diff Overlay & Swipe Curtain Inspector"
            className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${
              orientation === 'diff-overlay'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Diff Overlay</span>
          </button>
        </div>

        {/* Split Ratio Presets (Only in split modes) */}
        {orientation !== 'diff-overlay' && (
          <div className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-600 dark:text-slate-300">
            <button
              onClick={() => onSplitPresetSelect(50)}
              className={`px-2 py-0.5 rounded ${
                splitRatio === 50
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              50/50
            </button>
            <button
              onClick={() => onSplitPresetSelect(70)}
              className={`px-2 py-0.5 rounded ${
                splitRatio === 70
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              70/30
            </button>
            <button
              onClick={() => onSplitPresetSelect(30)}
              className={`px-2 py-0.5 rounded ${
                splitRatio === 30
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              30/70
            </button>
          </div>
        )}

        {/* Device Viewport Selector */}
        <div className="flex items-center gap-1">
          <select
            id="select-device-preset"
            value={selectedDevice.id}
            onChange={(e) => {
              const found = DEVICE_PRESETS.find((d) => d.id === e.target.value);
              if (found) onDeviceChange(found);
            }}
            className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 text-slate-700 dark:text-slate-200 text-xs font-medium focus:ring-1 focus:ring-indigo-500"
          >
            {DEVICE_PRESETS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Zoom Multipliers */}
        <div className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => onZoomChange(Math.max(0.4, Number((zoomScale - 0.1).toFixed(1))))}
            title="Zoom Out"
            className="p-1 hover:text-indigo-600 text-slate-500"
          >
            <ZoomOut className="w-3 h-3" />
          </button>
          <span className="font-mono text-[10px] w-8 text-center text-slate-600 dark:text-slate-300">
            {Math.round(zoomScale * 100)}%
          </span>
          <button
            onClick={() => onZoomChange(Math.min(1.5, Number((zoomScale + 0.1).toFixed(1))))}
            title="Zoom In"
            className="p-1 hover:text-indigo-600 text-slate-500"
          >
            <ZoomIn className="w-3 h-3" />
          </button>
          {zoomScale !== 1 && (
            <button
              onClick={() => onZoomChange(1)}
              className="text-[9px] text-indigo-500 hover:underline ml-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Right Side Actions: Reload Both, QA Notes Drawer, Fullscreen */}
      <div className="flex items-center gap-2">
        {/* Reload Both Panes */}
        <button
          id="btn-reload-both"
          onClick={onReloadBoth}
          title="Reload both frames simultaneously"
          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
        >
          <RotateCw className="w-3.5 h-3.5 text-indigo-500" />
          <span className="hidden sm:inline font-medium text-[11px]">Reload Both</span>
        </button>

        {/* QA Review Drawer Toggle Button */}
        <button
          id="btn-toggle-review-drawer"
          onClick={onToggleReviewDrawer}
          className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-xs transition-colors"
        >
          <ClipboardList className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px]">Audit Notes</span>
          {notesCount > 0 && (
            <span className="ml-0.5 px-1.5 py-0.2 bg-white text-indigo-700 rounded-full text-[10px] font-bold">
              {notesCount}
            </span>
          )}
          {openBugsCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping absolute -top-0.5 -right-0.5" />
          )}
        </button>

        {/* Fullscreen Toggle */}
        <button
          id="btn-toggle-fullscreen"
          onClick={onToggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Comparator'}
          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors border border-slate-200 dark:border-slate-700"
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </header>
  );
};
