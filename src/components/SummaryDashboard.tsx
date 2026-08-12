import React from 'react';
import { VideoSummary, Chapter, HighlightClip } from '../types';
import { FileText, Sparkles, Clock, Target, MessageSquare, CheckCircle2, Play, Flame, Download, Layers, Share2, HelpCircle } from 'lucide-react';
import { exportSummaryMarkdown } from '../utils/exportUtils';

interface SummaryDashboardProps {
  summary: VideoSummary | null;
  videoTitle: string;
  isGenerating: boolean;
  onGenerateSummary: () => void;
  seekToTime: (time: number) => void;
}

export const SummaryDashboard: React.FC<SummaryDashboardProps> = ({
  summary,
  videoTitle,
  isGenerating,
  onGenerateSummary,
  seekToTime,
}) => {
  if (isGenerating) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center animate-pulse mb-4">
          <Sparkles className="w-8 h-8 animate-spin" />
        </div>
        <h3 className="text-lg font-bold text-white">Generating AI Long-Form Summary...</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-md">
          Analyzing video script, mapping chronological chapters, evaluating sentiment, and calculating virality scores for high-impact clips.
        </p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[380px]">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
          <FileText className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-white">No Executive Summary Generated Yet</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mb-4">
          Let AI analyze this long-form video to automatically extract chapters, key takeaways, and viral clips.
        </p>
        <button
          onClick={onGenerateSummary}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 text-white text-xs font-semibold hover:opacity-95 shadow-lg shadow-indigo-600/30 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate Summary & Chapters</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Overview Header & Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {summary.sentiment || 'Educational'}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3" /> {summary.estimatedReadTimeMinutes || 3} min read summary
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">{summary.title || videoTitle}</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onGenerateSummary}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Regenerate</span>
            </button>

            <button
              onClick={() => exportSummaryMarkdown(summary, videoTitle)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Summary (.MD)</span>
            </button>
          </div>
        </div>

        {/* Executive Overview */}
        <div className="mt-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Executive Overview
          </h3>
          <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            {summary.overview}
          </p>
        </div>

        {/* Target Audience & Topics */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
            <Target className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Target Audience</p>
              <p className="text-xs text-slate-200 mt-0.5">{summary.targetAudience}</p>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
            <Layers className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Main Topics</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {summary.mainTopics?.map((topic, i) => (
                  <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Key Takeaways & Interactive Chapters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Actionable Key Takeaways */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Key Actionable Takeaways
          </h3>

          <div className="flex flex-col gap-2.5 flex-1">
            {summary.keyTakeaways?.map((takeaway, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5"
              >
                <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs text-slate-200 leading-normal">{takeaway}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Chapters Breakdown */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-indigo-400" />
            Chronological Chapters Breakdown
          </h3>

          <div className="flex flex-col gap-3 max-h-[460px] overflow-y-auto pr-1">
            {summary.chapters?.map((chap) => {
              const startMm = Math.floor(chap.startTime / 60);
              const startSs = String(Math.floor(chap.startTime % 60)).padStart(2, '0');

              return (
                <div
                  key={chap.id}
                  className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col gap-2 group"
                >
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => seekToTime(chap.startTime)}
                      className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-indigo-950/80 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-mono font-bold transition-all"
                      title="Jump video to chapter start"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{startMm}:{startSs}</span>
                    </button>

                    <h4 className="text-xs font-bold text-slate-200 flex-1 ml-3 truncate">
                      {chap.title}
                    </h4>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mt-1">
                    {chap.summary}
                  </p>

                  {chap.keyPoints && chap.keyPoints.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1 pt-2 border-t border-slate-900">
                      {chap.keyPoints.map((kp, kIdx) => (
                        <span
                          key={kIdx}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 font-medium"
                        >
                          • {kp}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
