import React from 'react';
import { Film, Sparkles, FileText, Video, Wand2, Download, MessageSquare, Ratio, Upload, CheckCircle2, RotateCcw, Save } from 'lucide-react';
import { SampleMedia } from '../types';

interface NavbarProps {
  activeTab: 'editor' | 'summary' | 'clips';
  setActiveTab: (tab: 'editor' | 'summary' | 'clips') => void;
  aspectRatio: '16:9' | '9:16' | '1:1';
  setAspectRatio: (ar: '16:9' | '9:16' | '1:1') => void;
  openVeoModal: () => void;
  openUploadModal: () => void;
  toggleChat: () => void;
  sampleMediaList: SampleMedia[];
  activeProjectTitle: string;
  onSelectSample: (sample: SampleMedia) => void;
  saveStatus?: 'saved' | 'saving' | 'idle';
  lastSavedTime?: string | null;
  onResetProject?: () => void;
  onDownloadProject?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  aspectRatio,
  setAspectRatio,
  openVeoModal,
  openUploadModal,
  toggleChat,
  sampleMediaList,
  activeProjectTitle,
  onSelectSample,
  saveStatus = 'saved',
  lastSavedTime,
  onResetProject,
  onDownloadProject,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Project Selector */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-amber-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                  VideoAI Studio
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  AI Subtitles & Summary
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-xs text-slate-400 font-medium truncate max-w-[180px]">
                  {activeProjectTitle}
                </p>

                {/* Auto-save status badge */}
                <div
                  className="flex items-center gap-1 text-[10px] font-medium text-slate-400 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800/80"
                  title={lastSavedTime ? `Last saved to local storage at ${lastSavedTime}` : 'Changes saved automatically'}
                >
                  {saveStatus === 'saving' ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                      <span className="text-amber-300">Saving...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Auto-saved</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={openVeoModal}
              className="p-2 rounded-lg bg-gradient-to-r from-amber-500 to-rose-500 text-white text-xs font-semibold"
              title="Veo Animate Photo"
            >
              <Wand2 className="w-4 h-4" />
            </button>
            {onDownloadProject && (
              <button
                onClick={onDownloadProject}
                className="p-2 rounded-lg bg-slate-800 text-slate-200 border border-slate-700"
                title="Download Project Backup (JSON)"
              >
                <Download className="w-4 h-4 text-emerald-400" />
              </button>
            )}
            <button
              onClick={openUploadModal}
              className="p-2 rounded-lg bg-slate-800 text-slate-200 border border-slate-700"
            >
              <Upload className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Mode Controls */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800/80 w-full md:w-auto justify-center">
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'editor'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Video & Subtitles</span>
          </button>

          <button
            onClick={() => setActiveTab('summary')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'summary'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>AI Summary & Chapters</span>
          </button>

          <button
            onClick={() => setActiveTab('clips')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'clips'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Viral Clips</span>
          </button>
        </div>

        {/* Action Controls & Aspect Ratio */}
        <div className="hidden md:flex items-center gap-3">
          {/* Aspect Ratio Selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-400 px-2 font-medium flex items-center gap-1">
              <Ratio className="w-3 h-3" /> Canvas
            </span>
            <button
              onClick={() => setAspectRatio('16:9')}
              className={`px-2 py-1 text-[11px] font-semibold rounded ${
                aspectRatio === '16:9' ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              16:9
            </button>
            <button
              onClick={() => setAspectRatio('9:16')}
              className={`px-2 py-1 text-[11px] font-semibold rounded ${
                aspectRatio === '9:16' ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              9:16
            </button>
            <button
              onClick={() => setAspectRatio('1:1')}
              className={`px-2 py-1 text-[11px] font-semibold rounded ${
                aspectRatio === '1:1' ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              1:1
            </button>
          </div>

          {/* Veo Animate Photo Button */}
          <button
            onClick={openVeoModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 text-white text-xs font-semibold hover:opacity-95 transition-all shadow-md shadow-rose-500/20 active:scale-95"
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-200" />
            <span>Animate Photo (Veo)</span>
          </button>

          {/* Download Project Backup JSON */}
          {onDownloadProject && (
            <button
              onClick={onDownloadProject}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all hover:text-emerald-300 active:scale-95 shadow-sm"
              title="Download serialized project state as JSON"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download Project</span>
            </button>
          )}

          {/* Upload / Change Video */}
          <button
            onClick={openUploadModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Media</span>
          </button>

          {/* AI Chat Assistant Toggle */}
          <button
            onClick={toggleChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-indigo-900/50 hover:text-indigo-200 text-slate-300 text-xs font-medium border border-slate-700/80 transition-all"
            title="Ask AI Assistant"
          >
            <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Assistant</span>
          </button>

          {/* Reset Project State Button */}
          {onResetProject && (
            <button
              onClick={onResetProject}
              className="p-2 rounded-xl bg-slate-800/60 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-700/60 hover:border-rose-500/40 transition-all"
              title="Reset project to default sample"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
