import React, { useState } from 'react';
import { 
  RotateCw, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldAlert, 
  Maximize2, 
  Globe,
  Sparkles,
  History,
  Lock
} from 'lucide-react';

interface PaneHeaderProps {
  id: 'left' | 'right';
  title: string;
  badge: string;
  badgeColor: 'amber' | 'emerald' | 'blue' | 'purple';
  url: string;
  onUrlChange: (newUrl: string) => void;
  onReload: () => void;
  isLoading: boolean;
  onToggleMaximize?: () => void;
  isMaximized?: boolean;
}

export const PaneHeader: React.FC<PaneHeaderProps> = ({
  id,
  title,
  badge,
  badgeColor,
  url,
  onUrlChange,
  onReload,
  isLoading,
  onToggleMaximize,
  isMaximized = false,
}) => {
  const [inputVal, setInputVal] = useState(url);
  const [copied, setCopied] = useState(false);

  // Sync if external url changes
  React.useEffect(() => {
    setInputVal(url);
  }, [url]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let formatted = inputVal.trim();
    if (formatted && !/^https?:\/\//i.test(formatted)) {
      formatted = 'https://' + formatted;
      setInputVal(formatted);
    }
    onUrlChange(formatted);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenExternal = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const badgeStyles = {
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  }[badgeColor];

  return (
    <div id={`${id}-pane-header`} className="flex flex-col border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-3 py-2 text-xs select-none">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200 truncate">
            {id === 'left' ? (
              <History className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            )}
            <span className="truncate">{title}</span>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wide uppercase border ${badgeStyles}`}>
            {badge}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            id={`btn-copy-${id}`}
            onClick={handleCopy}
            title="Copy URL"
            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          
          <button
            id={`btn-open-external-${id}`}
            onClick={handleOpenExternal}
            title="Open in new window / tab"
            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          {onToggleMaximize && (
            <button
              id={`btn-maximize-${id}`}
              onClick={onToggleMaximize}
              title={isMaximized ? 'Restore Split' : 'Maximize Pane'}
              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <Maximize2 className={`w-3.5 h-3.5 ${isMaximized ? 'text-indigo-500' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Address Bar Form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-1.5 w-full">
        <div className="relative flex-1 flex items-center bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-md px-2 py-1 text-slate-800 dark:text-slate-200 focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
          <Globe className="w-3 h-3 text-slate-400 shrink-0 mr-1.5" />
          <input
            id={`input-url-${id}`}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="https://example.com"
            className="w-full bg-transparent border-none outline-none font-mono text-[11px] text-slate-700 dark:text-slate-300 placeholder-slate-400"
          />
        </div>

        <button
          id={`btn-reload-${id}`}
          type="button"
          onClick={onReload}
          title="Reload frame"
          disabled={isLoading}
          className={`p-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <RotateCw className={`w-3 h-3 ${isLoading ? 'animate-spin text-indigo-500' : ''}`} />
        </button>
      </form>
    </div>
  );
};
