import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SplitOrientation, SplitRatio } from '../types';
import { GripVertical, GripHorizontal } from 'lucide-react';

interface SplitPaneProps {
  orientation: 'horizontal' | 'vertical';
  splitRatio: number; // 0 to 100
  onSplitRatioChange: (newRatio: number) => void;
  leftComponent: React.ReactNode;
  rightComponent: React.ReactNode;
}

export const SplitPane: React.FC<SplitPaneProps> = ({
  orientation,
  splitRatio,
  onSplitRatioChange,
  leftComponent,
  rightComponent,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const isHorizontal = orientation === 'horizontal';

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleTouchStart = () => {
    setIsDragging(true);
  };

  const updateRatio = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      let newPercentage: number;
      if (isHorizontal) {
        const offset = clientX - rect.left;
        newPercentage = (offset / rect.width) * 100;
      } else {
        const offset = clientY - rect.top;
        newPercentage = (offset / rect.height) * 100;
      }

      // Constrain ratio between 10% and 90%
      const clamped = Math.max(10, Math.min(90, newPercentage));
      onSplitRatioChange(Math.round(clamped));
    },
    [isHorizontal, onSplitRatioChange]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      updateRatio(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !e.touches[0]) return;
      updateRatio(e.touches[0].clientX, e.touches[0].clientY);
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, updateRatio]);

  return (
    <div
      ref={containerRef}
      id="split-pane-container"
      className={`relative w-full h-full flex overflow-hidden select-none ${
        isHorizontal ? 'flex-row' : 'flex-col'
      }`}
    >
      {/* First Pane (Left / Top) */}
      <div
        id="split-pane-primary"
        style={{
          [isHorizontal ? 'width' : 'height']: `${splitRatio}%`,
        }}
        className="relative h-full flex flex-col min-w-0 min-h-0 bg-white dark:bg-slate-900 overflow-hidden"
      >
        {leftComponent}
      </div>

      {/* Interactive Divider Handle */}
      <div
        id="split-pane-divider"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className={`relative z-30 group flex items-center justify-center bg-slate-200 dark:bg-slate-800 hover:bg-indigo-500 active:bg-indigo-600 transition-colors duration-150 ${
          isHorizontal
            ? 'w-2 cursor-col-resize hover:w-2.5 active:w-2.5'
            : 'h-2 cursor-row-resize hover:h-2.5 active:h-2.5'
        }`}
      >
        {/* Visual Grip handle indicator */}
        <div className="absolute flex items-center justify-center pointer-events-none text-slate-400 group-hover:text-white transition-colors">
          {isHorizontal ? (
            <GripVertical className="w-3.5 h-3.5" />
          ) : (
            <GripHorizontal className="w-3.5 h-3.5" />
          )}
        </div>

        {/* Live Ratio Badge when Dragging */}
        {isDragging && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 bg-indigo-600 text-white text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full shadow-lg pointer-events-none whitespace-nowrap">
            {Math.round(splitRatio)}% / {Math.round(100 - splitRatio)}%
          </div>
        )}
      </div>

      {/* Overlay to block iframe mouse hijacking during active drag */}
      {isDragging && (
        <div className="absolute inset-0 z-50 cursor-col-resize bg-transparent" />
      )}

      {/* Second Pane (Right / Bottom) */}
      <div
        id="split-pane-secondary"
        style={{
          [isHorizontal ? 'width' : 'height']: `${100 - splitRatio}%`,
        }}
        className="relative h-full flex flex-col min-w-0 min-h-0 bg-white dark:bg-slate-900 overflow-hidden"
      >
        {rightComponent}
      </div>
    </div>
  );
};
