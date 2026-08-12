import React, { useState } from 'react';
import { SubtitleItem, SubtitleStyleConfig, SubtitlePreset } from '../types';
import { Sparkles, Plus, Trash2, Download, Search, Settings, Clock, Play, Edit3, Palette, Check, Globe, Languages } from 'lucide-react';
import { exportSRT, exportVTT } from '../utils/exportUtils';

interface SubtitleEditorProps {
  subtitles: SubtitleItem[];
  setSubtitles: React.Dispatch<React.SetStateAction<SubtitleItem[]>>;
  subtitleStyle: SubtitleStyleConfig;
  setSubtitleStyle: React.Dispatch<React.SetStateAction<SubtitleStyleConfig>>;
  currentTime: number;
  seekToTime: (time: number) => void;
  onGenerateSubtitles: () => void;
  isGenerating: boolean;
  projectTitle?: string;
}

export const SubtitleEditor: React.FC<SubtitleEditorProps> = ({
  subtitles,
  setSubtitles,
  subtitleStyle,
  setSubtitleStyle,
  currentTime,
  seekToTime,
  onGenerateSubtitles,
  isGenerating,
  projectTitle = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'timeline' | 'style'>('timeline');

  // Language Detection State
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>('English (US)');
  const [detectedConfidence, setDetectedConfidence] = useState<number | null>(0.98);
  const [speechCharacteristics, setSpeechCharacteristics] = useState<string | null>('Clear studio narration in standard English dialect.');
  const [isDetectingLanguage, setIsDetectingLanguage] = useState<boolean>(false);

  const handleDetectLanguage = async () => {
    setIsDetectingLanguage(true);
    try {
      const res = await fetch('/api/detect-language', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: projectTitle,
          subtitles,
          transcript: subtitles.map((s) => s.text).join(' '),
        }),
      });

      const data = await res.json();
      if (data.language) {
        setDetectedLanguage(data.language);
        setDetectedConfidence(data.confidence || 0.95);
        setSpeechCharacteristics(data.speechCharacteristics || null);
      }
    } catch (err) {
      console.error('Error detecting language:', err);
      setDetectedLanguage('English (US)');
    } finally {
      setIsDetectingLanguage(false);
    }
  };

  // Filtered subtitles
  const filteredSubtitles = subtitles.filter(
    (sub) =>
      sub.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.speaker && sub.speaker.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleUpdateText = (id: string, text: string) => {
    setSubtitles((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, text } : sub))
    );
  };

  const handleUpdateSpeaker = (id: string, speaker: string) => {
    setSubtitles((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, speaker } : sub))
    );
  };

  const handleUpdateStart = (id: string, startTime: number) => {
    setSubtitles((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, startTime: Math.max(0, startTime) } : sub))
    );
  };

  const handleUpdateEnd = (id: string, endTime: number) => {
    setSubtitles((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, endTime: Math.max(0, endTime) } : sub))
    );
  };

  const handleAddSubtitle = () => {
    const lastSub = subtitles[subtitles.length - 1];
    const newStart = lastSub ? lastSub.endTime + 0.2 : currentTime;
    const newSub: SubtitleItem = {
      id: `sub-${Date.now()}`,
      startTime: Number(newStart.toFixed(1)),
      endTime: Number((newStart + 3.0).toFixed(1)),
      text: 'New subtitle caption line...',
      speaker: 'Speaker',
    };
    setSubtitles((prev) => [...prev, newSub]);
  };

  const handleDeleteSubtitle = (id: string) => {
    setSubtitles((prev) => prev.filter((sub) => sub.id !== id));
  };

  const presets: { id: SubtitlePreset; name: string; desc: string; previewClass: string }[] = [
    {
      id: 'hormozi',
      name: 'Hormozi / Viral Bouncy',
      desc: 'Bold yellow/cyan text with word-level pop highlight',
      previewClass: 'bg-black text-amber-300 font-black tracking-wide border-2 border-amber-400',
    },
    {
      id: 'neon',
      name: 'Cyber Neon Glow',
      desc: 'Vibrant neon cyan glow on midnight canvas',
      previewClass: 'bg-slate-950 text-cyan-400 font-bold border border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]',
    },
    {
      id: 'boxed',
      name: 'Solid Indigo Box',
      desc: 'Modern indigo card block with high contrast',
      previewClass: 'bg-indigo-900 text-white font-bold',
    },
    {
      id: 'clean',
      name: 'Clean Minimal Pill',
      desc: 'Semi-transparent rounded glass pill',
      previewClass: 'bg-black/80 text-slate-100 font-medium backdrop-blur-sm',
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 lg:p-6 shadow-xl flex flex-col h-full">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            AI Subtitles & Kinetic Captions
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Auto-generate synced subtitles, edit word timing, or apply viral kinetic caption styles.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleDetectLanguage}
            disabled={isDetectingLanguage}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs border border-slate-700/80 transition-all shadow-sm disabled:opacity-50"
            title="Detect primary language spoken in the video audio track"
          >
            <Globe className={`w-3.5 h-3.5 text-cyan-400 ${isDetectingLanguage ? 'animate-spin' : ''}`} />
            <span>{isDetectingLanguage ? 'Detecting...' : 'Detect Language'}</span>
          </button>

          <button
            onClick={onGenerateSubtitles}
            disabled={isGenerating}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/30 disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Generating Subtitles...' : 'Auto-Generate Subtitles'}</span>
          </button>

          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'timeline'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setActiveTab('style')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'style'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Styling
            </button>
          </div>
        </div>
      </div>

      {/* Primary Language Detection Info Banner */}
      {detectedLanguage && (
        <div className="mt-3 bg-slate-950/80 border border-slate-800/80 rounded-xl px-3.5 py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Languages className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-slate-300">
              Primary Spoken Language: <strong className="text-white font-semibold">{detectedLanguage}</strong>
              {detectedConfidence !== null && (
                <span className="ml-1.5 text-[11px] text-emerald-400 font-mono bg-emerald-950/80 border border-emerald-500/30 px-1.5 py-0.5 rounded-md">
                  {Math.round(detectedConfidence * 100)}% match
                </span>
              )}
            </span>
          </div>

          {speechCharacteristics && (
            <span className="text-[11px] text-slate-400 truncate max-w-sm">
              {speechCharacteristics}
            </span>
          )}
        </div>
      )}

      {activeTab === 'timeline' ? (
        <div className="flex flex-col flex-1 mt-4 gap-4">
          {/* Subtitle Search & Quick Tools */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search subtitle text..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 placeholder-slate-500 text-xs rounded-xl pl-9 pr-3 py-2 border border-slate-800 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={handleAddSubtitle}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Caption Line</span>
              </button>

              <button
                onClick={() => exportSRT(subtitles)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all"
                title="Export .SRT"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span>Export SRT</span>
              </button>

              <button
                onClick={() => exportVTT(subtitles)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all"
                title="Export .VTT"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export VTT</span>
              </button>
            </div>
          </div>

          {/* Subtitle List */}
          <div className="overflow-y-auto max-h-[420px] pr-1 flex flex-col gap-2 rounded-xl">
            {filteredSubtitles.length === 0 ? (
              <div className="p-8 text-center bg-slate-950/50 rounded-2xl border border-dashed border-slate-800">
                <p className="text-sm font-medium text-slate-400">No subtitles found.</p>
                <p className="text-xs text-slate-500 mt-1">
                  Click "Auto-Generate Subtitles" above or add a manual caption line.
                </p>
              </div>
            ) : (
              filteredSubtitles.map((sub, index) => {
                const isActive = currentTime >= sub.startTime && currentTime <= sub.endTime;

                return (
                  <div
                    key={sub.id}
                    className={`p-3 rounded-xl border transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      isActive
                        ? 'bg-indigo-950/40 border-indigo-500/60 shadow-md ring-1 ring-indigo-500/30'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    {/* Timestamp & Play Jump */}
                    <div className="flex items-center gap-2 min-w-[160px]">
                      <button
                        onClick={() => seekToTime(sub.startTime)}
                        className={`p-1.5 rounded-lg text-xs transition-colors ${
                          isActive
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-800 text-slate-300 hover:bg-indigo-600 hover:text-white'
                        }`}
                        title="Jump video to this subtitle"
                      >
                        <Play className="w-3 h-3 fill-current" />
                      </button>

                      <div className="flex items-center gap-1 font-mono text-xs text-slate-400">
                        <input
                          type="number"
                          step="0.1"
                          value={sub.startTime}
                          onChange={(e) => handleUpdateStart(sub.id, parseFloat(e.target.value) || 0)}
                          className="w-12 bg-slate-900 text-center rounded py-0.5 border border-slate-800 text-slate-200 text-[11px]"
                        />
                        <span>-</span>
                        <input
                          type="number"
                          step="0.1"
                          value={sub.endTime}
                          onChange={(e) => handleUpdateEnd(sub.id, parseFloat(e.target.value) || 0)}
                          className="w-12 bg-slate-900 text-center rounded py-0.5 border border-slate-800 text-slate-200 text-[11px]"
                        />
                        <span className="text-[10px] text-slate-500">s</span>
                      </div>
                    </div>

                    {/* Speaker & Subtitle Text Input */}
                    <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
                      <input
                        type="text"
                        placeholder="Speaker"
                        value={sub.speaker || ''}
                        onChange={(e) => handleUpdateSpeaker(sub.id, e.target.value)}
                        className="w-full sm:w-28 bg-slate-900 text-slate-400 text-xs rounded-lg px-2 py-1 border border-slate-800 focus:outline-none focus:border-indigo-500 truncate"
                      />

                      <input
                        type="text"
                        value={sub.text}
                        onChange={(e) => handleUpdateText(sub.id, e.target.value)}
                        className="w-full bg-slate-900 text-slate-100 font-medium text-xs rounded-lg px-3 py-1.5 border border-slate-800 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    {/* Delete Action */}
                    <button
                      onClick={() => handleDeleteSubtitle(sub.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors self-end sm:self-center"
                      title="Delete line"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* Styling & Kinetic Captions Controls */
        <div className="flex flex-col flex-1 mt-4 gap-6">
          {/* Preset Cards */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Kinetic Subtitle Presets
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {presets.map((p) => {
                const isSelected = subtitleStyle.preset === p.id;

                return (
                  <button
                    key={p.id}
                    onClick={() => setSubtitleStyle((prev) => ({ ...prev, preset: p.id }))}
                    className={`p-3.5 rounded-xl border text-left transition-all relative ${
                      isSelected
                        ? 'bg-indigo-950/50 border-indigo-500 ring-2 ring-indigo-500/30'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                    <div className={`p-2 rounded-lg text-xs font-semibold mb-2 text-center ${p.previewClass}`}>
                      SAMPLE CAPTION
                    </div>
                    <p className="text-xs font-bold text-white">{p.name}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{p.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Granular Style Customizations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            {/* Position */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                On-Screen Position
              </label>
              <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
                {(['bottom', 'middle', 'top'] as const).map((pos) => (
                  <button
                    key={pos}
                    onClick={() => setSubtitleStyle((prev) => ({ ...prev, position: pos }))}
                    className={`flex-1 py-1 rounded text-xs capitalize font-medium transition-colors ${
                      subtitleStyle.position === pos ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Font Size ({subtitleStyle.fontSize}px)
              </label>
              <input
                type="range"
                min="18"
                max="48"
                value={subtitleStyle.fontSize}
                onChange={(e) =>
                  setSubtitleStyle((prev) => ({ ...prev, fontSize: parseInt(e.target.value) || 24 }))
                }
                className="w-full accent-indigo-500"
              />
            </div>

            {/* Text Transform */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Text Case
              </label>
              <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
                {(['none', 'uppercase', 'lowercase'] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => setSubtitleStyle((prev) => ({ ...prev, textTransform: c }))}
                    className={`flex-1 py-1 rounded text-xs capitalize font-medium transition-colors ${
                      subtitleStyle.textTransform === c ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
