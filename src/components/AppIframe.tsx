import React, { useState, useEffect, useRef } from 'react';
import { DeviceConfig } from '../types';
import { ExternalLink, RefreshCw, AlertCircle, ShieldCheck, Eye, Sparkles } from 'lucide-react';

interface AppIframeProps {
  id: 'left' | 'right';
  url: string;
  device: DeviceConfig;
  zoomScale: number;
  reloadKey: number;
  onLoadingChange?: (loading: boolean) => void;
}

export const AppIframe: React.FC<AppIframeProps> = ({
  id,
  url,
  device,
  zoomScale,
  reloadKey,
  onLoadingChange,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadTimeout, setHasLoadTimeout] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setIsLoading(true);
    setHasLoadTimeout(false);
    onLoadingChange?.(true);

    // Timeout fallback for external headers warning
    const timer = setTimeout(() => {
      setIsLoading(false);
      onLoadingChange?.(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [url, reloadKey]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    onLoadingChange?.(false);
  };

  const handleOpenExternal = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Dimensions
  const isFluid = device.type === 'fluid';
  const frameWidth = isFluid ? '100%' : `${device.width}px`;
  const frameHeight = isFluid ? '100%' : `${device.height}px`;

  return (
    <div
      id={`iframe-container-${id}`}
      className="relative w-full h-full flex items-center justify-center bg-slate-100/70 dark:bg-slate-950 overflow-auto p-2"
    >
      {/* Background Grid Pattern for accurate viewport alignment */}
      <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

      {/* Frame Wrapper with Device & Scale Styling */}
      <div
        className={`relative transition-all duration-200 flex flex-col items-center justify-center ${
          !isFluid
            ? 'shadow-2xl rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900'
            : 'w-full h-full'
        }`}
        style={{
          width: frameWidth,
          height: frameHeight,
          transform: zoomScale !== 1 ? `scale(${zoomScale})` : undefined,
          transformOrigin: 'top center',
          maxHeight: isFluid ? '100%' : undefined,
          maxWidth: isFluid ? '100%' : undefined,
        }}
      >
        {/* Device Frame Top Bar for mobile/tablet */}
        {!isFluid && device.type === 'mobile' && (
          <div className="w-full h-6 bg-slate-800 dark:bg-slate-900 rounded-t-xl flex items-center justify-center shrink-0">
            <div className="w-16 h-3 bg-black rounded-full" />
          </div>
        )}

        {/* Loading Spinner Indicator */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs transition-opacity duration-300">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium text-xs">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Connecting to {new URL(url).hostname || 'app'}...</span>
            </div>
          </div>
        )}

        {/* Live Iframe */}
        <iframe
          key={`${url}-${reloadKey}`}
          ref={iframeRef}
          id={`app-iframe-${id}`}
          src={url}
          title={`${id}-app-frame`}
          onLoad={handleIframeLoad}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-presentation allow-downloads"
          allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone; midi; clipboard-read; clipboard-write;"
          className="w-full h-full border-none bg-white rounded-b-xl"
        />
      </div>

      {/* Floating Notice / Help Bar if target site restricts iframe embedding (e.g. Vercel Console / Auth pages) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 opacity-70 hover:opacity-100 transition-opacity flex items-center gap-2 bg-slate-900/90 dark:bg-slate-800/90 text-white text-[11px] px-3 py-1.5 rounded-full shadow-lg border border-slate-700/60 backdrop-blur-md">
        <span className="truncate max-w-[200px] text-slate-300 font-mono text-[10px]">
          {url}
        </span>
        <div className="h-3 w-px bg-slate-600" />
        <button
          onClick={handleOpenExternal}
          className="flex items-center gap-1 text-indigo-300 hover:text-white transition-colors font-medium whitespace-nowrap"
        >
          <ExternalLink className="w-3 h-3" />
          <span>Open Direct</span>
        </button>
      </div>
    </div>
  );
};
