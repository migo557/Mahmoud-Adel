import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, FastForward, Sliders, Type, Layers } from 'lucide-react';
import { SubtitleItem, SubtitleStyleConfig, Chapter } from '../types';
import { AudioWaveformVisualizer } from './AudioWaveformVisualizer';

interface VideoPlayerCanvasProps {
  videoUrl: string;
  subtitles: SubtitleItem[];
  subtitleStyle: SubtitleStyleConfig;
  aspectRatio: '16:9' | '9:16' | '1:1';
  chapters?: Chapter[];
  currentTime: number;
  setCurrentTime: (time: number) => void;
  onDurationChange?: (duration: number) => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export const VideoPlayerCanvas: React.FC<VideoPlayerCanvasProps> = ({
  videoUrl,
  subtitles,
  subtitleStyle,
  aspectRatio,
  chapters = [],
  currentTime,
  setCurrentTime,
  onDurationChange,
  videoRef,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync state with HTML5 video events
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration || 0;
      setDuration(dur);
      if (onDurationChange) onDurationChange(dur);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch((e) => console.log('Autoplay prevented:', e));
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch((e) => console.log('Fullscreen failed:', e));
      } else {
        document.exitFullscreen().catch((e) => console.log('Exit fullscreen failed:', e));
      }
    }
  };

  // Find active subtitle item for current time
  const activeSubtitle = subtitles.find(
    (sub) => currentTime >= sub.startTime && currentTime <= sub.endTime
  );

  // Find active chapter
  const activeChapter = chapters.find(
    (chap) => currentTime >= chap.startTime && currentTime <= chap.endTime
  );

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Compute container class for aspect ratio
  const getAspectRatioClasses = () => {
    switch (aspectRatio) {
      case '9:16':
        return 'aspect-[9/16] max-w-[340px] h-[580px]';
      case '1:1':
        return 'aspect-square max-w-[500px] h-[500px]';
      case '16:9':
      default:
        return 'aspect-video w-full max-h-[520px]';
    }
  };

  // Render Subtitle Overlay styling
  const renderSubtitleOverlay = () => {
    if (!activeSubtitle) return null;

    const {
      preset,
      fontSize,
      textColor,
      highlightColor,
      backgroundColor,
      position,
      textTransform,
      fontWeight,
    } = subtitleStyle;

    // Position styling
    const positionClass =
      position === 'top'
        ? 'top-8'
        : position === 'middle'
        ? 'top-1/2 -translate-y-1/2'
        : 'bottom-12';

    // Text transform
    const transformClass =
      textTransform === 'uppercase'
        ? 'uppercase tracking-wider'
        : textTransform === 'lowercase'
        ? 'lowercase'
        : '';

    // Check if word level timing exists
    const hasWords = activeSubtitle.words && activeSubtitle.words.length > 0;

    if (preset === 'hormozi') {
      return (
        <div className={`absolute left-0 right-0 ${positionClass} px-6 flex justify-center pointer-events-none z-30 transition-all duration-150`}>
          <div
            className={`text-center font-black drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] ${transformClass}`}
            style={{
              fontSize: `${fontSize * 1.1}px`,
              color: textColor || '#ffffff',
              lineHeight: 1.2,
              textShadow: '0 0 10px rgba(0,0,0,0.9), 3px 3px 0px #000, -3px -3px 0px #000, 3px -3px 0px #000, -3px 3px 0px #000',
            }}
          >
            {hasWords ? (
              <div className="flex flex-wrap justify-center gap-x-2 gap-y-1">
                {activeSubtitle.words!.map((w, idx) => {
                  const isWordActive = currentTime >= w.start && currentTime <= w.end;
                  return (
                    <span
                      key={idx}
                      className={`inline-block transition-all duration-100 ${
                        isWordActive
                          ? 'scale-125 text-amber-300 drop-shadow-[0_0_15px_rgba(251,191,36,0.9)] font-black'
                          : 'opacity-90'
                      }`}
                      style={{
                        color: isWordActive ? highlightColor || '#facc15' : textColor || '#ffffff',
                      }}
                    >
                      {w.word}
                    </span>
                  );
                })}
              </div>
            ) : (
              <span className="bg-black/70 px-4 py-1.5 rounded-2xl border-2 border-amber-400/60 text-amber-300 font-extrabold shadow-2xl">
                {activeSubtitle.text}
              </span>
            )}
          </div>
        </div>
      );
    }

    if (preset === 'neon') {
      return (
        <div className={`absolute left-0 right-0 ${positionClass} px-6 flex justify-center pointer-events-none z-30`}>
          <div
            className={`text-center font-extrabold px-4 py-1.5 rounded-xl bg-slate-950/80 border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.5)] ${transformClass}`}
            style={{
              fontSize: `${fontSize}px`,
              color: textColor || '#22d3ee',
              textShadow: '0 0 12px rgba(34, 211, 238, 0.8)',
            }}
          >
            {activeSubtitle.text}
          </div>
        </div>
      );
    }

    if (preset === 'boxed') {
      return (
        <div className={`absolute left-0 right-0 ${positionClass} px-6 flex justify-center pointer-events-none z-30`}>
          <div
            className={`text-center font-bold px-5 py-2 rounded-lg bg-indigo-950/90 text-white border border-indigo-500/40 shadow-xl ${transformClass}`}
            style={{
              fontSize: `${fontSize}px`,
              backgroundColor: backgroundColor || 'rgba(30, 27, 75, 0.92)',
              color: textColor || '#ffffff',
            }}
          >
            {activeSubtitle.text}
          </div>
        </div>
      );
    }

    // Default Clean / Minimal style
    return (
      <div className={`absolute left-0 right-0 ${positionClass} px-6 flex justify-center pointer-events-none z-30`}>
        <div
          className={`text-center font-medium px-4 py-1.5 rounded-full bg-black/75 text-slate-100 backdrop-blur-md shadow-lg border border-white/10 ${transformClass}`}
          style={{
            fontSize: `${fontSize}px`,
            color: textColor || '#ffffff',
          }}
        >
          {activeSubtitle.text}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Video Container Stage */}
      <div
        ref={containerRef}
        className={`relative bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex items-center justify-center transition-all duration-300 group ${getAspectRatioClasses()}`}
      >
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-contain pointer-events-auto cursor-pointer"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onClick={togglePlay}
          playsInline
        />

        {/* Dynamic Subtitle Overlay */}
        {renderSubtitleOverlay()}

        {/* Active Chapter Badge Overlay */}
        {activeChapter && (
          <div className="absolute top-4 left-4 z-20 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 px-3 py-1 rounded-lg text-xs font-medium text-slate-200 flex items-center gap-1.5 shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400 text-[10px] uppercase tracking-wider">Chapter:</span>
            <span className="font-semibold text-white truncate max-w-[200px]">{activeChapter.title}</span>
          </div>
        )}

        {/* Play Overlay Big Icon when Paused */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] transition-all z-20 group-hover:bg-black/20"
          >
            <div className="w-16 h-16 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-xl shadow-indigo-600/40 hover:scale-110 transition-transform">
              <Play className="w-8 h-8 ml-1 fill-white" />
            </div>
          </button>
        )}
      </div>

      {/* Control Bar */}
      <div className="w-full max-w-4xl bg-slate-900/90 border border-slate-800 rounded-xl p-3 mt-3 flex flex-col gap-2 shadow-lg text-slate-200">
        {/* Seek Bar with Chapter Markers */}
        <div className="relative flex items-center group">
          <input
            type="range"
            min="0"
            max={duration || 100}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all"
          />
        </div>

        {/* Buttons and Time */}
        <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              onClick={toggleMute}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-all"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <span className="font-mono text-slate-400 text-[11px]">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Speed Options */}
            <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Speed:</span>
              {[0.75, 1, 1.25, 1.5, 2].map((s) => (
                <button
                  key={s}
                  onClick={() => handleSpeedChange(s)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors ${
                    playbackSpeed === s ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-all"
              title="Fullscreen"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Audio Waveform Visualization */}
      <div className="w-full max-w-4xl mt-3">
        <AudioWaveformVisualizer
          videoUrl={videoUrl}
          duration={duration}
          currentTime={currentTime}
          subtitles={subtitles}
          onSeek={(t) => {
            setCurrentTime(t);
            if (videoRef.current) {
              videoRef.current.currentTime = t;
            }
          }}
          videoRef={videoRef}
        />
      </div>
    </div>
  );
};
