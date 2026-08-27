import React, { useState } from 'react';
import { ReviewNote } from '../types';
import { 
  X, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  AlertTriangle, 
  FileText, 
  Download, 
  Copy, 
  Check, 
  Layers,
  Sparkles,
  ClipboardList
} from 'lucide-react';

interface ReviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notes: ReviewNote[];
  onAddNote: (note: Omit<ReviewNote, 'id' | 'timestamp'>) => void;
  onToggleResolve: (id: string) => void;
  onDeleteNote: (id: string) => void;
  leftUrl: string;
  rightUrl: string;
}

const DEFAULT_CHECKLIST = [
  'Header navigation and branding consistency',
  'Layout responsive styling on mobile/tablet',
  'Buttons, forms, and interactive inputs behavior',
  'Typography, colors, and design token accuracy',
  'Speed, transitions, and loading states comparison',
];

export const ReviewDrawer: React.FC<ReviewDrawerProps> = ({
  isOpen,
  onClose,
  notes,
  onAddNote,
  onToggleResolve,
  onDeleteNote,
  leftUrl,
  rightUrl,
}) => {
  const [activeTab, setActiveTab] = useState<'notes' | 'checklist'>('notes');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ReviewNote['category']>('ui');
  const [newSide, setNewSide] = useState<ReviewNote['side']>('right');
  const [newSeverity, setNewSeverity] = useState<ReviewNote['severity']>('medium');
  const [newDesc, setNewDesc] = useState('');
  const [copied, setCopied] = useState(false);
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddNote({
      title: newTitle.trim(),
      category: newCategory,
      side: newSide,
      severity: newSeverity,
      resolved: false,
      description: newDesc.trim(),
    });

    setNewTitle('');
    setNewDesc('');
  };

  const handleExportMarkdown = () => {
    const report = `# App Migration & Comparison Audit Report
**Date**: ${new Date().toLocaleString()}
**Left (Old App)**: ${leftUrl}
**Right (New App)**: ${rightUrl}

## Comparison Checklist Status
${DEFAULT_CHECKLIST.map(
  (item, i) => `- [${checklistState[i] ? 'x' : ' '}] ${item}`
).join('\n')}

## Review Notes (${notes.length} Total)
${notes
  .map(
    (n) =>
      `### ${n.resolved ? '✅ [RESOLVED]' : '⚠️ [OPEN]'} ${n.title} (${n.category.toUpperCase()} - Severity: ${n.severity.toUpperCase()})
- **Side**: ${n.side === 'left' ? 'Old (Left)' : n.side === 'right' ? 'New (Right)' : 'Both'}
- **Details**: ${n.description || 'No additional notes provided.'}
`
  )
  .join('\n\n')}
`;

    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openBugsCount = notes.filter((n) => !n.resolved && n.category === 'bug').length;
  const resolvedCount = notes.filter((n) => n.resolved).length;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 text-xs">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h2 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
            Comparison & QA Notes
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 px-4 pt-2 gap-4">
        <button
          onClick={() => setActiveTab('notes')}
          className={`pb-2 font-medium border-b-2 transition-colors ${
            activeTab === 'notes'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          Audit Notes ({notes.length})
        </button>
        <button
          onClick={() => setActiveTab('checklist')}
          className={`pb-2 font-medium border-b-2 transition-colors ${
            activeTab === 'checklist'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          QA Checklist
        </button>
      </div>

      {/* Stats overview banner */}
      <div className="px-4 py-2 bg-indigo-50/50 dark:bg-indigo-950/30 border-b border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between text-[11px]">
        <span className="text-slate-600 dark:text-slate-400">
          Resolved: <strong className="text-emerald-600 dark:text-emerald-400">{resolvedCount}</strong> / {notes.length}
        </span>
        {openBugsCount > 0 && (
          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
            <AlertTriangle className="w-3 h-3" />
            {openBugsCount} open bug{openBugsCount > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'notes' ? (
          <>
            {/* Create Note Form */}
            <form onSubmit={handleCreateNote} className="space-y-2.5 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
              <span className="font-semibold text-slate-700 dark:text-slate-300 block text-[11px]">
                Add Review Finding
              </span>
              <input
                type="text"
                placeholder="Issue or observation title..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-indigo-500"
              />

              <div className="grid grid-cols-3 gap-1.5">
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-[11px] text-slate-700 dark:text-slate-300"
                >
                  <option value="ui">UI Design</option>
                  <option value="bug">Bug / Defect</option>
                  <option value="functional">Feature</option>
                  <option value="performance">Speed</option>
                  <option value="enhancement">Improvement</option>
                </select>

                <select
                  value={newSide}
                  onChange={(e) => setNewSide(e.target.value as any)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-[11px] text-slate-700 dark:text-slate-300"
                >
                  <option value="right">New (Right)</option>
                  <option value="left">Old (Left)</option>
                  <option value="both">Both Apps</option>
                </select>

                <select
                  value={newSeverity}
                  onChange={(e) => setNewSeverity(e.target.value as any)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-[11px] text-slate-700 dark:text-slate-300"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <textarea
                placeholder="Optional description / details..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                rows={2}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-indigo-500 resize-none"
              />

              <button
                type="submit"
                disabled={!newTitle.trim()}
                className="w-full flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium py-1.5 rounded transition-colors text-xs shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Note</span>
              </button>
            </form>

            {/* Note List */}
            <div className="space-y-2">
              {notes.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p>No review notes recorded yet.</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Add notes while inspecting both apps.
                  </p>
                </div>
              ) : (
                notes.map((note) => (
                  <div
                    key={note.id}
                    className={`p-2.5 rounded-lg border transition-all ${
                      note.resolved
                        ? 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-60'
                        : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <button
                        onClick={() => onToggleResolve(note.id)}
                        className="mt-0.5 text-slate-400 hover:text-emerald-500 transition-colors shrink-0"
                      >
                        {note.resolved ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          <span
                            className={`font-semibold text-xs ${
                              note.resolved
                                ? 'line-through text-slate-500'
                                : 'text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            {note.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                          <span className="uppercase font-semibold px-1.5 py-0.2 bg-slate-100 dark:bg-slate-700 rounded text-slate-600 dark:text-slate-300">
                            {note.category}
                          </span>
                          <span>•</span>
                          <span>
                            {note.side === 'left'
                              ? 'Old'
                              : note.side === 'right'
                              ? 'New'
                              : 'Both'}
                          </span>
                          <span>•</span>
                          <span
                            className={
                              note.severity === 'high'
                                ? 'text-red-500 font-bold'
                                : note.severity === 'medium'
                                ? 'text-amber-500 font-medium'
                                : 'text-slate-400'
                            }
                          >
                            {note.severity}
                          </span>
                        </div>

                        {note.description && (
                          <p className="mt-1 text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                            {note.description}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => onDeleteNote(note.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                        title="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          /* Checklist Tab */
          <div className="space-y-2">
            <p className="text-slate-500 text-[11px] mb-3">
              Standard regression and quality checks for application migrations:
            </p>
            {DEFAULT_CHECKLIST.map((item, index) => {
              const checked = !!checklistState[index];
              return (
                <div
                  key={index}
                  onClick={() =>
                    setChecklistState((prev) => ({ ...prev, [index]: !checked }))
                  }
                  className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {}}
                    className="mt-0.5 accent-indigo-600 rounded cursor-pointer"
                  />
                  <span
                    className={`text-xs leading-snug select-none ${
                      checked
                        ? 'line-through text-slate-400'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer / Export */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-between">
        <button
          onClick={handleExportMarkdown}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-medium transition-colors text-xs shadow-xs"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied Audit Report!' : 'Export Report'}</span>
        </button>

        <span className="text-[11px] text-slate-400">
          Saved locally
        </span>
      </div>
    </div>
  );
};
