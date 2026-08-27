import React, { useState, useEffect } from 'react';
import { 
  SplitOrientation, 
  DeviceConfig, 
  ReviewNote, 
  PresetSite 
} from './types';
import { 
  DEFAULT_LEFT_URL, 
  DEFAULT_RIGHT_URL, 
  DEVICE_PRESETS, 
  PRESET_URLS 
} from './constants';
import { Header } from './components/Header';
import { PaneHeader } from './components/PaneHeader';
import { AppIframe } from './components/AppIframe';
import { SplitPane } from './components/SplitPane';
import { OverlayDiffView } from './components/OverlayDiffView';
import { ReviewDrawer } from './components/ReviewDrawer';

export default function App() {
  const [leftUrl, setLeftUrl] = useState<string>(() => {
    return localStorage.getItem('comparator_left_url') || DEFAULT_LEFT_URL;
  });

  const [rightUrl, setRightUrl] = useState<string>(() => {
    return localStorage.getItem('comparator_right_url') || DEFAULT_RIGHT_URL;
  });

  const [orientation, setOrientation] = useState<SplitOrientation>('horizontal');
  const [splitRatio, setSplitRatio] = useState<number>(50);
  const [selectedDevice, setSelectedDevice] = useState<DeviceConfig>(DEVICE_PRESETS[0]);
  const [zoomScale, setZoomScale] = useState<number>(1);
  
  const [leftReloadKey, setLeftReloadKey] = useState<number>(0);
  const [rightReloadKey, setRightReloadKey] = useState<number>(0);
  const [isLeftLoading, setIsLeftLoading] = useState<boolean>(false);
  const [isRightLoading, setIsRightLoading] = useState<boolean>(false);

  const [maximizedPane, setMaximizedPane] = useState<'left' | 'right' | null>(null);
  const [isReviewDrawerOpen, setIsReviewDrawerOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Review Notes State with LocalStorage Persistence
  const [notes, setNotes] = useState<ReviewNote[]>(() => {
    try {
      const saved = localStorage.getItem('comparator_review_notes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save URLs & Notes to localStorage
  useEffect(() => {
    localStorage.setItem('comparator_left_url', leftUrl);
  }, [leftUrl]);

  useEffect(() => {
    localStorage.setItem('comparator_right_url', rightUrl);
  }, [rightUrl]);

  useEffect(() => {
    localStorage.setItem('comparator_review_notes', JSON.stringify(notes));
  }, [notes]);

  const handleSwapUrls = () => {
    const temp = leftUrl;
    setLeftUrl(rightUrl);
    setRightUrl(temp);
    setLeftReloadKey((k) => k + 1);
    setRightReloadKey((k) => k + 1);
  };

  const handleReloadBoth = () => {
    setLeftReloadKey((k) => k + 1);
    setRightReloadKey((k) => k + 1);
  };

  const handleApplyPreset = (preset: PresetSite) => {
    setLeftUrl(preset.leftUrl);
    setRightUrl(preset.rightUrl);
    setLeftReloadKey((k) => k + 1);
    setRightReloadKey((k) => k + 1);
  };

  const handleSyncPath = (path: string) => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    try {
      const leftObj = new URL(leftUrl);
      leftObj.pathname = cleanPath;
      setLeftUrl(leftObj.toString());
    } catch {
      setLeftUrl(`${leftUrl.replace(/\/+$/, '')}${cleanPath}`);
    }

    try {
      const rightObj = new URL(rightUrl);
      rightObj.pathname = cleanPath;
      setRightUrl(rightObj.toString());
    } catch {
      setRightUrl(`${rightUrl.replace(/\/+$/, '')}${cleanPath}`);
    }

    setLeftReloadKey((k) => k + 1);
    setRightReloadKey((k) => k + 1);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleAddNote = (noteData: Omit<ReviewNote, 'id' | 'timestamp'>) => {
    const newNote: ReviewNote = {
      ...noteData,
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: Date.now(),
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  const handleToggleResolveNote = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, resolved: !n.resolved } : n))
    );
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const openBugsCount = notes.filter((n) => !n.resolved && n.category === 'bug').length;

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      {/* Top Application Header Toolbar */}
      <Header
        orientation={orientation}
        onOrientationChange={(newOrient) => {
          setOrientation(newOrient);
          setMaximizedPane(null);
        }}
        splitRatio={splitRatio}
        onSplitPresetSelect={(ratio) => {
          setSplitRatio(ratio);
          setMaximizedPane(null);
        }}
        selectedDevice={selectedDevice}
        onDeviceChange={setSelectedDevice}
        zoomScale={zoomScale}
        onZoomChange={setZoomScale}
        onReloadBoth={handleReloadBoth}
        onToggleReviewDrawer={() => setIsReviewDrawerOpen(!isReviewDrawerOpen)}
        notesCount={notes.length}
        openBugsCount={openBugsCount}
        leftUrl={leftUrl}
        rightUrl={rightUrl}
        onSwapUrls={handleSwapUrls}
        onApplyPreset={handleApplyPreset}
        onSyncPath={handleSyncPath}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {/* Main Comparison Body Area */}
      <main className="relative flex-1 w-full h-full overflow-hidden">
        {orientation === 'diff-overlay' ? (
          <OverlayDiffView
            leftUrl={leftUrl}
            rightUrl={rightUrl}
            device={selectedDevice}
            zoomScale={zoomScale}
            reloadKey={leftReloadKey + rightReloadKey}
          />
        ) : (
          <SplitPane
            orientation={orientation}
            splitRatio={
              maximizedPane === 'left'
                ? 100
                : maximizedPane === 'right'
                ? 0
                : splitRatio
            }
            onSplitRatioChange={(newRatio) => {
              setSplitRatio(newRatio);
              setMaximizedPane(null);
            }}
            leftComponent={
              <div className="flex flex-col w-full h-full">
                <PaneHeader
                  id="left"
                  title="Old Version"
                  badge="Legacy"
                  badgeColor="amber"
                  url={leftUrl}
                  onUrlChange={(newUrl) => {
                    setLeftUrl(newUrl);
                    setLeftReloadKey((k) => k + 1);
                  }}
                  onReload={() => setLeftReloadKey((k) => k + 1)}
                  isLoading={isLeftLoading}
                  onToggleMaximize={() =>
                    setMaximizedPane((cur) => (cur === 'left' ? null : 'left'))
                  }
                  isMaximized={maximizedPane === 'left'}
                />
                <div className="flex-1 w-full h-full overflow-hidden">
                  <AppIframe
                    id="left"
                    url={leftUrl}
                    device={selectedDevice}
                    zoomScale={zoomScale}
                    reloadKey={leftReloadKey}
                    onLoadingChange={setIsLeftLoading}
                  />
                </div>
              </div>
            }
            rightComponent={
              <div className="flex flex-col w-full h-full">
                <PaneHeader
                  id="right"
                  title="New Pro Version"
                  badge="Tester Pro"
                  badgeColor="emerald"
                  url={rightUrl}
                  onUrlChange={(newUrl) => {
                    setRightUrl(newUrl);
                    setRightReloadKey((k) => k + 1);
                  }}
                  onReload={() => setRightReloadKey((k) => k + 1)}
                  isLoading={isRightLoading}
                  onToggleMaximize={() =>
                    setMaximizedPane((cur) => (cur === 'right' ? null : 'right'))
                  }
                  isMaximized={maximizedPane === 'right'}
                />
                <div className="flex-1 w-full h-full overflow-hidden">
                  <AppIframe
                    id="right"
                    url={rightUrl}
                    device={selectedDevice}
                    zoomScale={zoomScale}
                    reloadKey={rightReloadKey}
                    onLoadingChange={setIsRightLoading}
                  />
                </div>
              </div>
            }
          />
        )}

        {/* Side Review / QA Drawer */}
        <ReviewDrawer
          isOpen={isReviewDrawerOpen}
          onClose={() => setIsReviewDrawerOpen(false)}
          notes={notes}
          onAddNote={handleAddNote}
          onToggleResolve={handleToggleResolveNote}
          onDeleteNote={handleDeleteNote}
          leftUrl={leftUrl}
          rightUrl={rightUrl}
        />
      </main>
    </div>
  );
}
