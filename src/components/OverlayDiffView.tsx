import React, { useState, useRef, useEffect } from 'react';
import { DeviceConfig } from '../types';
import { Sliders, Eye, Grid, Crosshair, SplitSquareVertical } from 'lucide-react';

interface OverlayDiffViewProps {
  leftUrl: string;
  rightUrl: string;
  device: DeviceConfig;
  zoomScale: number;
  reloadKey: number;
}

export const OverlayDiffView: React.FC<OverlayDiffViewProps> = ({
  leftUrl,
  rightUrl,
  device,
  zoomScale,
  reloadKey,
}) => {
  const [diffMode, setDiffMode] = useState<'swipe' | 'opacity'>('swipe');
  const [swipePos, setSwipePos] = useState(50); // 0% to 100%
  const [opacity, setOpacity] = useState(0.5); // 0 to 1
  const [showGrid, setShowGrid] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const offset = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (offset / rect.width) * 100));
    setSwipePos(pct);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  const isFluid = device.type === 'fluid';
  const frameWidth = isFluid ? '100%' : `${device.width}px`;
  const frameHeight = isFluid ? '100%' : `${device.height}px`;

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-900 overflow-hidden">
      {/* Floating Tool Controls Bar */}
      <div className="z-40 bg-slate-900/90 border-b border-slate-800 px-4 py-2 flex items-center justify-between gap-4 text-xs text-slate-200 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-300">Diff Inspection:</span>
          <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            <button
              onClick={() => setDiffMode('swipe')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs transition-colors ${
                diffMode === 'swipe'
                  ? 'bg-indigo-600 text-white font-medium shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <SplitSquareVertical className="w-3.5 h-3.5" />
              <span>Swipe Curtain</span>
            </button>
            <button
              onClick={() => setDiffMode('opacity')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs transition-colors ${
                diffMode === 'opacity'
                  ? 'bg-indigo-600 text-white font-medium shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Ghost Opacity</span>
            </button>
          </div>
        </div>

        {/* Dynamic Controls depending on mode */}
        <div className="flex items-center gap-4">
          {diffMode === 'swipe' ? (
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Position:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={swipePos}
                onChange={(e) => setSwipePos(Number(e.target.value))}
                className="w-32 accent-indigo-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
              />
              <span className="font-mono text-slate-300 w-8 text-right">
                {Math.round(swipePos)}%
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-slate-400">New Version Opacity:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-32 accent-emerald-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
              />
              <span className="font-mono text-slate-300 w-8 text-right">
                {Math.round(opacity * 100)}%
              </span>
            </div>
          )}

          <button
            onClick={() => setShowGrid(!showGrid)}
            title="Toggle Alignment Grid"
            className={`flex items-center gap-1 px-2 py-1 rounded-md border text-xs transition-all ${
              showGrid
                ? 'bg-slate-800 text-indigo-400 border-indigo-500/50'
                : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Grid</span>
          </button>
        </div>
      </div>

      {/* Main Diff Display Stage */}
      <div
        ref={containerRef}
        className="relative flex-1 flex items-center justify-center p-4 overflow-auto"
      >
        {/* Alignment Grid Overlay */}
        {showGrid && (
          <div className="absolute inset-0 z-30 bg-[linear-gradient(to_right,#3b82f620_1px,transparent_1px),linear-gradient(to_bottom,#3b82f620_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        )}

        <div
          className="relative shadow-2xl rounded-lg overflow-hidden border border-slate-700 bg-white"
          style={{
            width: frameWidth,
            height: frameHeight,
            transform: zoomScale !== 1 ? `scale(${zoomScale})` : undefined,
            transformOrigin: 'top center',
            maxWidth: '100%',
            maxHeight: '100%',
          }}
        >
          {/* Base Layer: Left (Old) App */}
          <div className="absolute inset-0 z-0">
            <iframe
              key={`diff-left-${leftUrl}-${reloadKey}`}
              src={leftUrl}
              title="Old Version"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
              className="w-full h-full border-none"
            />
            {/* Old Label Pill */}
            <div className="absolute top-3 left-3 z-10 bg-amber-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
              OLD (Left)
            </div>
          </div>

          {/* Overlay Layer: Right (New) App */}
          {diffMode === 'swipe' ? (
            <div
              className="absolute inset-0 z-10 overflow-hidden"
              style={{
                clipPath: `polygon(${swipePos}% 0, 100% 0, 100% 100%, ${swipePos}% 100%)`,
              }}
            >
              <iframe
                key={`diff-right-swipe-${rightUrl}-${reloadKey}`}
                src={rightUrl}
                title="New Version"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                className="w-full h-full border-none"
              />
              <div className="absolute top-3 right-3 z-10 bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                NEW (Right)
              </div>
            </div>
          ) : (
            <div
              className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-75"
              style={{ opacity }}
            >
              <iframe
                key={`diff-right-opacity-${rightUrl}-${reloadKey}`}
                src={rightUrl}
                title="New Version"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                className="w-full h-full border-none"
              />
              <div className="absolute top-3 right-3 z-10 bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                NEW (Right)
              </div>
            </div>
          )}

          {/* Swipe Divider Drag Handle */}
          {diffMode === 'swipe' && (
            <div
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              style={{ left: `${swipePos}%` }}
              className="absolute top-0 bottom-0 z-20 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] cursor-ew-resize flex items-center justify-center -translate-x-1/2"
            >
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg border-2 border-white text-xs">
                ↔
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
