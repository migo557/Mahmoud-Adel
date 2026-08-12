import React, { useState, useRef, useEffect } from 'react';
import { SAMPLE_MEDIA_LIST } from './data/sampleMedia';
import { SubtitleItem, SubtitleStyleConfig, VideoSummary, SampleMedia } from './types';
import { Navbar } from './components/Navbar';
import { VideoPlayerCanvas } from './components/VideoPlayerCanvas';
import { SubtitleEditor } from './components/SubtitleEditor';
import { SummaryDashboard } from './components/SummaryDashboard';
import { ViralClipsStudio } from './components/ViralClipsStudio';
import { VeoAnimatorModal } from './components/VeoAnimatorModal';
import { UploadModal } from './components/UploadModal';
import { AIChatDrawer } from './components/AIChatDrawer';
import { Sparkles, Play, Wand2, FileText, Film, Layers, CheckCircle2, RotateCcw, X } from 'lucide-react';

const AUTOSAVE_STORAGE_KEY = 'video_ai_studio_autosave_v1';

export default function App() {
  const initialSample = SAMPLE_MEDIA_LIST[0];

  // Helper function to load initial state from localStorage
  const loadInitialState = () => {
    try {
      const saved = localStorage.getItem(AUTOSAVE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          projectTitle: parsed.projectTitle || initialSample.title,
          // If videoUrl was blob: URL from file upload, blob URLs expire on refresh so fallback to initial sample
          videoUrl: parsed.videoUrl && !parsed.videoUrl.startsWith('blob:') ? parsed.videoUrl : initialSample.videoUrl,
          duration: parsed.duration || initialSample.duration,
          aspectRatio: (parsed.aspectRatio || '16:9') as '16:9' | '9:16' | '1:1',
          subtitles: (parsed.subtitles || initialSample.defaultSubtitles) as SubtitleItem[],
          subtitleStyle: (parsed.subtitleStyle || {
            preset: 'hormozi',
            fontSize: 28,
            textColor: '#ffffff',
            highlightColor: '#facc15',
            backgroundColor: '#000000',
            position: 'bottom',
            textTransform: 'uppercase',
            animation: 'pop',
            fontWeight: 'black',
          }) as SubtitleStyleConfig,
          summary: parsed.summary !== undefined ? parsed.summary : initialSample.defaultSummary,
          lastSavedTime: parsed.lastSavedTime || null,
          isRecovered: true,
        };
      }
    } catch (err) {
      console.error('Failed to parse autosave state from localStorage:', err);
    }

    return {
      projectTitle: initialSample.title,
      videoUrl: initialSample.videoUrl,
      duration: initialSample.duration,
      aspectRatio: '16:9' as const,
      subtitles: initialSample.defaultSubtitles,
      subtitleStyle: {
        preset: 'hormozi' as const,
        fontSize: 28,
        textColor: '#ffffff',
        highlightColor: '#facc15',
        backgroundColor: '#000000',
        position: 'bottom' as const,
        textTransform: 'uppercase' as const,
        animation: 'pop' as const,
        fontWeight: 'black' as const,
      },
      summary: initialSample.defaultSummary || null,
      lastSavedTime: null,
      isRecovered: false,
    };
  };

  const initialLoadedState = useRef(loadInitialState()).current;

  // Active Video Project State
  const [projectTitle, setProjectTitle] = useState<string>(initialLoadedState.projectTitle);
  const [videoUrl, setVideoUrl] = useState<string>(initialLoadedState.videoUrl);
  const [duration, setDuration] = useState<number>(initialLoadedState.duration);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>(initialLoadedState.aspectRatio);
  const [currentTime, setCurrentTime] = useState<number>(0);

  // Video Trimming State
  const [trimStart, setTrimStart] = useState<number>(0);
  const [trimEnd, setTrimEnd] = useState<number>(initialLoadedState.duration || 60);

  // Subtitles & Styling
  const [subtitles, setSubtitles] = useState<SubtitleItem[]>(initialLoadedState.subtitles);
  const [subtitleStyle, setSubtitleStyle] = useState<SubtitleStyleConfig>(initialLoadedState.subtitleStyle);

  // Long-Form Summary Data
  const [summary, setSummary] = useState<VideoSummary | null>(initialLoadedState.summary);

  // Auto-save Status
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'idle'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(initialLoadedState.lastSavedTime);
  const [showRecoveryBanner, setShowRecoveryBanner] = useState<boolean>(initialLoadedState.isRecovered);

  // UI State
  const [activeTab, setActiveTab] = useState<'editor' | 'summary' | 'clips'>('editor');
  const [isVeoModalOpen, setIsVeoModalOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState<boolean>(false);

  // Loading States
  const [isGeneratingSubtitles, setIsGeneratingSubtitles] = useState<boolean>(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState<boolean>(false);

  // Video Ref
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-save Effect: Debounce save to localStorage when project edits change
  useEffect(() => {
    setSaveStatus('saving');
    const timer = setTimeout(() => {
      try {
        const timeFormatted = new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });

        const dataToSave = {
          projectTitle,
          videoUrl: videoUrl.startsWith('blob:') ? '' : videoUrl,
          duration,
          aspectRatio,
          subtitles,
          subtitleStyle,
          summary,
          lastSavedTime: timeFormatted,
        };

        localStorage.setItem(AUTOSAVE_STORAGE_KEY, JSON.stringify(dataToSave));
        setLastSavedTime(timeFormatted);
        setSaveStatus('saved');
      } catch (err) {
        console.error('Auto-save error:', err);
        setSaveStatus('idle');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [projectTitle, videoUrl, duration, aspectRatio, subtitles, subtitleStyle, summary]);

  // Reset to default sample
  const handleResetProject = () => {
    try {
      localStorage.removeItem(AUTOSAVE_STORAGE_KEY);
    } catch (e) {}

    setProjectTitle(initialSample.title);
    setVideoUrl(initialSample.videoUrl);
    setDuration(initialSample.duration);
    setTrimStart(0);
    setTrimEnd(initialSample.duration || 60);
    setSubtitles(initialSample.defaultSubtitles);
    setSummary(initialSample.defaultSummary || null);
    setAspectRatio('16:9');
    setCurrentTime(0);
    setShowRecoveryBanner(false);
  };

  // Seek helper
  const seekToTime = (time: number) => {
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      videoRef.current.play().catch(() => {});
    }
  };

  // API Trigger: Auto Generate Subtitles
  const handleGenerateSubtitles = async () => {
    setIsGeneratingSubtitles(true);
    try {
      const res = await fetch('/api/generate-subtitles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: projectTitle,
          duration,
          transcript: subtitles.map((s) => s.text).join(' '),
        }),
      });

      const data = await res.json();
      if (data.subtitles && Array.isArray(data.subtitles)) {
        setSubtitles(data.subtitles);
      }
    } catch (err) {
      console.error('Failed to generate subtitles:', err);
    } finally {
      setIsGeneratingSubtitles(false);
    }
  };

  // API Trigger: Summarize Content & Generate Chapters
  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const res = await fetch('/api/summarize-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: projectTitle,
          duration,
          subtitles,
          trimStart,
          trimEnd,
        }),
      });

      const data = await res.json();
      if (data.summary) {
        setSummary(data.summary);
      }
    } catch (err) {
      console.error('Failed to summarize content:', err);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // Select Pre-loaded Sample
  const handleSelectSample = (sample: SampleMedia) => {
    setProjectTitle(sample.title);
    setVideoUrl(sample.videoUrl);
    setDuration(sample.duration);
    setTrimStart(0);
    setTrimEnd(sample.duration || 60);
    setSubtitles(sample.defaultSubtitles);
    setSummary(sample.defaultSummary || null);
    setCurrentTime(0);
  };

  // Custom File Upload
  const handleCustomUpload = (fileUrl: string, fileName: string) => {
    setProjectTitle(fileName.replace(/\.[^/.]+$/, ''));
    setVideoUrl(fileUrl);
    setSubtitles([]);
    setSummary(null);
    setCurrentTime(0);
    setTrimStart(0);
    setTrimEnd(60);
    setActiveTab('editor');
  };

  // Veo Generated Video Callback
  const handleVeoVideoGenerated = (newVideoUrl: string, promptUsed: string, ar: '16:9' | '9:16') => {
    setProjectTitle(`Veo Animated Video (${promptUsed.substring(0, 30)}...)`);
    setVideoUrl(newVideoUrl);
    setAspectRatio(ar);
    setSubtitles([]);
    setSummary(null);
    setCurrentTime(0);
    setTrimStart(0);
    setTrimEnd(60);
    setActiveTab('editor');

    // Automatically trigger subtitles for generated Veo video
    handleGenerateSubtitles();
  };

  // Download Project Backup JSON
  const handleDownloadProject = () => {
    const projectBackup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      project: {
        title: projectTitle,
        videoUrl: videoUrl.startsWith('blob:') ? '' : videoUrl,
        duration,
        aspectRatio,
        trimStart,
        trimEnd,
      },
      subtitles,
      subtitleStyle,
      summary,
    };

    const jsonString = JSON.stringify(projectBackup, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = url;
    const safeTitle = projectTitle.replace(/[^a-z0-9_-]/gi, '_').toLowerCase() || 'video_project';
    downloadAnchor.download = `${safeTitle}_project_backup.json`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white antialiased">
      {/* Main Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        aspectRatio={aspectRatio}
        setAspectRatio={setAspectRatio}
        openVeoModal={() => setIsVeoModalOpen(true)}
        openUploadModal={() => setIsUploadModalOpen(true)}
        toggleChat={() => setIsChatDrawerOpen((prev) => !prev)}
        sampleMediaList={SAMPLE_MEDIA_LIST}
        activeProjectTitle={projectTitle}
        onSelectSample={handleSelectSample}
        saveStatus={saveStatus}
        lastSavedTime={lastSavedTime}
        onResetProject={handleResetProject}
        onDownloadProject={handleDownloadProject}
      />

      {/* Recovered State Toast / Banner */}
      {showRecoveryBanner && (
        <div className="bg-indigo-950/80 border-b border-indigo-500/30 text-indigo-200 text-xs py-2 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Project Recovered:</strong> Loaded auto-saved subtitles and project edits from local storage{lastSavedTime ? ` (${lastSavedTime})` : ''}.
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleResetProject}
                className="flex items-center gap-1 text-[11px] font-medium text-indigo-300 hover:text-white underline decoration-indigo-400/50"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Default</span>
              </button>
              <button
                onClick={() => setShowRecoveryBanner(false)}
                className="text-slate-400 hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 flex flex-col gap-6">
        {/* TAB 1: VIDEO EDITOR & SUBTITLE WORKBENCH */}
        {activeTab === 'editor' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Video Stage & Controls */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <VideoPlayerCanvas
                videoUrl={videoUrl}
                subtitles={subtitles}
                subtitleStyle={subtitleStyle}
                aspectRatio={aspectRatio}
                chapters={summary?.chapters || []}
                currentTime={currentTime}
                setCurrentTime={setCurrentTime}
                onDurationChange={(dur) => {
                  setDuration(dur);
                  if (trimEnd === 0 || trimEnd === duration) {
                    setTrimEnd(dur);
                  }
                }}
                videoRef={videoRef}
              />
            </div>

            {/* Right Column: AI Subtitle Editor Timeline */}
            <div className="lg:col-span-7 h-full">
              <SubtitleEditor
                subtitles={subtitles}
                setSubtitles={setSubtitles}
                subtitleStyle={subtitleStyle}
                setSubtitleStyle={setSubtitleStyle}
                currentTime={currentTime}
                seekToTime={seekToTime}
                onGenerateSubtitles={handleGenerateSubtitles}
                isGenerating={isGeneratingSubtitles}
                projectTitle={projectTitle}
              />
            </div>
          </div>
        )}

        {/* TAB 2: AI SUMMARY & CHAPTER BREAKDOWN */}
        {activeTab === 'summary' && (
          <SummaryDashboard
            summary={summary}
            videoTitle={projectTitle}
            isGenerating={isGeneratingSummary}
            onGenerateSummary={handleGenerateSummary}
            seekToTime={(t) => {
              setActiveTab('editor');
              seekToTime(t);
            }}
          />
        )}

        {/* TAB 3: VIRAL CLIPS STUDIO */}
        {activeTab === 'clips' && (
          <ViralClipsStudio
            highlights={summary?.highlights || []}
            seekToTime={(t) => {
              setActiveTab('editor');
              seekToTime(t);
            }}
            setAspectRatio={(ar) => {
              setAspectRatio(ar);
              setActiveTab('editor');
            }}
            onGenerateSummary={handleGenerateSummary}
            duration={duration}
            trimStart={trimStart}
            setTrimStart={setTrimStart}
            trimEnd={trimEnd}
            setTrimEnd={setTrimEnd}
            currentTime={currentTime}
            isGenerating={isGeneratingSummary}
          />
        )}
      </main>

      {/* Veo Photo-to-Video Animator Modal */}
      <VeoAnimatorModal
        isOpen={isVeoModalOpen}
        onClose={() => setIsVeoModalOpen(false)}
        onVideoGenerated={handleVeoVideoGenerated}
      />

      {/* File Upload / Sample Selector Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        sampleMediaList={SAMPLE_MEDIA_LIST}
        onSelectSample={handleSelectSample}
        onCustomUpload={handleCustomUpload}
      />

      {/* AI Assistant Side Drawer */}
      <AIChatDrawer
        isOpen={isChatDrawerOpen}
        onClose={() => setIsChatDrawerOpen(false)}
        subtitles={subtitles}
        summary={summary}
      />
    </div>
  );
}
