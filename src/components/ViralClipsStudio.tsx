import React from 'react';
import { HighlightClip } from '../types';
import { Flame, Play, Sparkles, Share2, Copy, Check, Ratio, Video, Scissors, RotateCcw, Clock, Sliders } from 'lucide-react';

interface ViralClipsStudioProps {
  highlights: HighlightClip[];
  seekToTime: (time: number) => void;
  setAspectRatio: (ar: '16:9' | '9:16' | '1:1') => void;
  onGenerateSummary: () => void;
  duration: number;
  trimStart: number;
  setTrimStart: (val: number) => void;
  trimEnd: number;
  setTrimEnd: (val: number) => void;
  currentTime: number;
  isGenerating?: boolean;
}

export const ViralClipsStudio: React.FC<ViralClipsStudioProps> = ({
  highlights,
  seekToTime,
  setAspectRatio,
  onGenerateSummary,
  duration,
  trimStart,
  setTrimStart,
  trimEnd,
  setTrimEnd,
  currentTime,
  isGenerating = false,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const formatSecs = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleCopySnippet = (clip: HighlightClip) => {
    const textToCopy = `🔥 ${clip.title}\n\n"${clip.transcriptSnippet}"\n\nVirality Score: ${clip.viralityScore}/100`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(clip.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const maxDuration = Math.max(duration || 60, 1);
  const trimmedLength = Math.max(0, trimEnd - trimStart);

  // Preset Trims
  const applyPreset = (type: 'first30' | 'first60' | 'middle' | 'reset') => {
    if (type === 'first30') {
      setTrimStart(0);
      setTrimEnd(Math.min(30, maxDuration));
    } else if (type === 'first60') {
      setTrimStart(0);
      setTrimEnd(Math.min(60, maxDuration));
    } else if (type === 'middle') {
      const quarter = maxDuration * 0.25;
      const threeQuarter = maxDuration * 0.75;
      setTrimStart(Math.floor(quarter));
      setTrimEnd(Math.ceil(threeQuarter));
    } else {
      setTrimStart(0);
      setTrimEnd(maxDuration);
    }
  };

  const handlePreviewTrimmed = () => {
    seekToTime(trimStart);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Video Project Trimmer Tool UI */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                <Scissors className="w-3 h-3 text-rose-400" />
                Video Trimming Studio
              </span>
              <span className="text-xs font-mono text-slate-400">
                Selected: <strong className="text-white">{formatSecs(trimStart)}</strong> - <strong className="text-white">{formatSecs(trimEnd)}</strong> ({Math.round(trimmedLength)}s duration)
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Trim Video Range Before Generating Clips
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Specify custom start and end points to constrain AI clip extraction to a specific chapter or highlight region.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviewTrimmed}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current text-indigo-400" />
              <span>Preview Selection</span>
            </button>

            <button
              onClick={onGenerateSummary}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 text-white text-xs font-semibold hover:opacity-95 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Analyzing Trimmed Range...' : 'Generate Clips from Selection'}</span>
            </button>
          </div>
        </div>

        {/* Visual Timeline Range Representation */}
        <div className="mt-5 flex flex-col gap-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" /> 00:00 (Start)
            </span>
            <span className="text-indigo-400 font-bold bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-500/30">
              Active Selection: {formatSecs(trimStart)} ➔ {formatSecs(trimEnd)}
            </span>
            <span>{formatSecs(maxDuration)} (End)</span>
          </div>

          {/* Timeline Bar Visualizer */}
          <div className="relative h-6 bg-slate-900 rounded-lg border border-slate-800 overflow-hidden flex items-center">
            {/* Trimmed Active Region Bar */}
            <div
              className="absolute h-full bg-gradient-to-r from-rose-500/40 via-amber-500/40 to-indigo-500/40 border-x-2 border-amber-400/90 shadow-[0_0_15px_rgba(251,191,36,0.3)]"
              style={{
                left: `${(trimStart / maxDuration) * 100}%`,
                width: `${(trimmedLength / maxDuration) * 100}%`,
              }}
            >
              <div className="w-full h-full flex items-center justify-between px-2 text-[10px] font-mono font-bold text-amber-200 select-none overflow-hidden">
                <span>✂️ {formatSecs(trimStart)}</span>
                <span>{formatSecs(trimEnd)} ✂️</span>
              </div>
            </div>

            {/* Current Playhead Needle */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-cyan-400 z-10 shadow-[0_0_8px_rgba(34,211,238,1)] transition-all"
              style={{ left: `${(currentTime / maxDuration) * 100}%` }}
              title={`Current time: ${formatSecs(currentTime)}`}
            />
          </div>

          {/* Interactive Dual Handles Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            {/* Start Trim Control */}
            <div className="flex flex-col gap-1.5 bg-slate-900 p-3 rounded-lg border border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Trim Start Time
                </label>
                <span className="font-mono text-emerald-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {formatSecs(trimStart)} ({trimStart.toFixed(1)}s)
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={Math.max(0, trimEnd - 1)}
                step={0.5}
                value={trimStart}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setTrimStart(val);
                }}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* End Trim Control */}
            <div className="flex flex-col gap-1.5 bg-slate-900 p-3 rounded-lg border border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  Trim End Time
                </label>
                <span className="font-mono text-rose-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {formatSecs(trimEnd)} ({trimEnd.toFixed(1)}s)
                </span>
              </div>
              <input
                type="range"
                min={Math.min(maxDuration, trimStart + 1)}
                max={maxDuration}
                step={0.5}
                value={trimEnd}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setTrimEnd(val);
                }}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-900 text-xs">
            <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
              <Sliders className="w-3 h-3 text-amber-400" /> Quick Trim Presets:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => applyPreset('first30')}
                className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium border border-slate-700 transition-all"
              >
                First 30s
              </button>
              <button
                onClick={() => applyPreset('first60')}
                className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium border border-slate-700 transition-all"
              >
                First 60s
              </button>
              <button
                onClick={() => applyPreset('middle')}
                className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium border border-slate-700 transition-all"
              >
                Middle 50%
              </button>
              <button
                onClick={() => applyPreset('reset')}
                className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 text-[11px] font-medium border border-slate-700 transition-all flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Full Video
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Viral Clips Display Studio */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-6">
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" />
                Viral Short-Form Clips & Hook Extractor
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                TikTok / Reels / Shorts Ready
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              AI evaluated your video content to find moments with maximum retention score & virality potential.
            </p>
          </div>

          <button
            onClick={() => setAspectRatio('9:16')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
          >
            <Ratio className="w-4 h-4 text-amber-400" />
            <span>Switch to 9:16 Vertical Canvas</span>
          </button>
        </div>

        {(!highlights || highlights.length === 0) ? (
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[260px]">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">No Viral Clips Generated Yet</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mb-4">
              Set your trim start and end points above and click below to pinpoint high-virality hooks for TikTok, Shorts, and Reels.
            </p>
            <button
              onClick={onGenerateSummary}
              disabled={isGenerating}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 text-white text-xs font-semibold hover:opacity-95 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Analyzing Video...' : 'Analyze Trimmed Video for Viral Clips'}</span>
            </button>
          </div>
        ) : (
          /* Grid of Highlight Clips */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {highlights.map((clip) => {
              const startMm = Math.floor(clip.startTime / 60);
              const startSs = String(Math.floor(clip.startTime % 60)).padStart(2, '0');
              const endMm = Math.floor(clip.endTime / 60);
              const endSs = String(Math.floor(clip.endTime % 60)).padStart(2, '0');

              return (
                <div
                  key={clip.id}
                  className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/50 transition-all flex flex-col justify-between gap-4 group relative overflow-hidden shadow-lg"
                >
                  {/* Virality Score Meter Ribbon */}
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                      {clip.category || 'Viral Hook'}
                    </span>

                    <div className="flex items-center gap-1.5 bg-amber-950/40 border border-amber-500/40 px-2.5 py-1 rounded-full text-amber-300 font-bold text-xs">
                      <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{clip.viralityScore}/100 Virality</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                      {clip.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 font-medium leading-relaxed">
                      {clip.reason}
                    </p>

                    {/* Quote Box */}
                    <div className="mt-3 p-3 rounded-lg bg-slate-900 border border-slate-800/80 text-slate-300 text-xs italic font-mono border-l-2 border-l-amber-400">
                      "{clip.transcriptSnippet}"
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-900 text-xs">
                    <span className="font-mono text-slate-400 text-[11px]">
                      ⏱️ {startMm}:{startSs} - {endMm}:{endSs}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopySnippet(clip)}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition-all"
                        title="Copy clip text & score"
                      >
                        {copiedId === clip.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => seekToTime(clip.startTime)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-semibold text-xs shadow-md shadow-amber-500/20 transition-all"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Play Highlight</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

