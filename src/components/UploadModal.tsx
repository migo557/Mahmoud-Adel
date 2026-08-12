import React, { useState, useRef } from 'react';
import {
  Upload,
  X,
  FolderUp,
  Link as LinkIcon,
  Video,
  FileVideo,
  FileAudio,
  Check,
  Globe,
  Film,
  List,
  Sparkles,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { SampleMedia } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  sampleMediaList: SampleMedia[];
  onSelectSample: (sample: SampleMedia) => void;
  onCustomUpload: (fileUrl: string, fileName: string) => void;
}

interface ScannedFile {
  id: string;
  file: File;
  name: string;
  path: string;
  sizeFormatted: string;
  type: 'video' | 'audio';
  url: string;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  sampleMediaList,
  onSelectSample,
  onCustomUpload,
}) => {
  const [activeTab, setActiveTab] = useState<'files' | 'link' | 'samples'>('files');

  // Folder & File scanning state
  const [scannedFiles, setScannedFiles] = useState<ScannedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  // Link import state
  const [linkUrl, setLinkUrl] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  const [linkError, setLinkError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Format bytes helper
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Helper to process FileList or DataTransferItemList
  const processFiles = (files: FileList | File[]) => {
    const validMediaFiles: ScannedFile[] = [];
    const mediaRegex = /\.(mp4|webm|mov|mkv|avi|m4v|3gp|flv|mp3|wav|m4a|aac|ogg|flac)$/i;

    Array.from(files).forEach((file, idx) => {
      if (mediaRegex.test(file.name) || file.type.startsWith('video/') || file.type.startsWith('audio/')) {
        const relativePath = (file as any).webkitRelativePath || file.name;
        const objectUrl = URL.createObjectURL(file);
        validMediaFiles.push({
          id: `file_${Date.now()}_${idx}`,
          file,
          name: file.name,
          path: relativePath,
          sizeFormatted: formatBytes(file.size),
          type: file.type.startsWith('audio/') || /\.(mp3|wav|m4a|aac|flac)$/i.test(file.name) ? 'audio' : 'video',
          url: objectUrl,
        });
      }
    });

    if (validMediaFiles.length > 0) {
      setScannedFiles(validMediaFiles);
      setSelectedFileId(validMediaFiles[0].id);
    }
  };

  // Single or Multi File Input change
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  // Drag & Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  // Confirm Selection from Scanned Files
  const handleConfirmScannedFile = (scannedFile: ScannedFile) => {
    onCustomUpload(scannedFile.url, scannedFile.name);
    onClose();
  };

  // Handle URL / Link Submission
  const handleImportLink = () => {
    setLinkError(null);
    let trimmed = linkUrl.trim();

    if (!trimmed) {
      setLinkError('Please enter a valid URL');
      return;
    }

    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      trimmed = 'https://' + trimmed;
    }

    // Process common video hosting share links
    let processedUrl = trimmed;

    // Google Drive share link transformation
    if (trimmed.includes('drive.google.com') && trimmed.includes('/file/d/')) {
      const match = trimmed.match(/\/file\/d\/([^\/]+)/);
      if (match && match[1]) {
        processedUrl = `https://drive.google.com/uc?export=download&id=${match[1]}`;
      }
    }
    // Dropbox share link transformation
    else if (trimmed.includes('dropbox.com')) {
      processedUrl = trimmed.replace('dl=0', 'raw=1');
    }

    const titleToUse = linkTitle.trim() || extractTitleFromUrl(trimmed);

    onCustomUpload(processedUrl, titleToUse);
    onClose();
  };

  const extractTitleFromUrl = (urlStr: string) => {
    try {
      const parsed = new URL(urlStr);
      const pathname = parsed.pathname;
      const filename = pathname.substring(pathname.lastIndexOf('/') + 1);
      if (filename && filename.includes('.')) {
        return filename.replace(/\.[^/.]+$/, '');
      }
      return parsed.hostname + ' Video';
    } catch (e) {
      return 'Web Video';
    }
  };

  // Preset web video samples for quick testing
  const WEB_PRESETS = [
    {
      title: 'Tears of Steel 4K',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      duration: '12m 14s',
      category: 'Sci-Fi Film',
    },
    {
      title: 'Big Buck Bunny',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      duration: '9m 56s',
      category: 'Animation',
    },
    {
      title: 'For Bigger Blazes',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      duration: '0m 15s',
      category: 'Commercial',
    },
    {
      title: 'For Bigger Escapes',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      duration: '0m 15s',
      category: 'Nature / Travel',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl text-slate-100 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Import & Load Media</h2>
              <p className="text-xs text-slate-400">Upload from local files, folders, or web links</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-2 bg-slate-950 border-b border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('files')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-bold transition-all ${
              activeTab === 'files'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <FolderUp className="w-4 h-4" />
            <span>Local File or Folder</span>
          </button>

          <button
            onClick={() => setActiveTab('link')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-bold transition-all ${
              activeTab === 'link'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>Web Link / URL</span>
          </button>

          <button
            onClick={() => setActiveTab('samples')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-bold transition-all ${
              activeTab === 'samples'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Film className="w-4 h-4 text-amber-400" />
            <span>Demo Library</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* TAB 1: LOCAL FILES & FOLDERS */}
          {activeTab === 'files' && (
            <div className="space-y-4">
              {/* Dual Action Drag & Drop Dropzone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all ${
                  isDragging
                    ? 'border-indigo-400 bg-indigo-950/40 scale-[1.01]'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
                  <FolderUp className="w-6 h-6 text-indigo-400" />
                </div>

                <h3 className="text-sm font-bold text-white">Drag & drop video file or entire folder here</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Select a single video, multiple media files, or scan a folder directory on your device.
                </p>

                {/* Dual Buttons: Pick File vs Pick Folder */}
                <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/20"
                  >
                    <FileVideo className="w-4 h-4" />
                    <span>Select Media File(s)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => folderInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-all"
                  >
                    <FolderUp className="w-4 h-4 text-cyan-400" />
                    <span>Select Whole Folder</span>
                  </button>
                </div>

                {/* Hidden File Inputs */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="video/*,audio/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <input
                  ref={folderInputRef}
                  type="file"
                  /* @ts-ignore */
                  webkitdirectory=""
                  directory=""
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Scanned Folder / Media File List */}
              {scannedFiles.length > 0 && (
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <List className="w-4 h-4 text-indigo-400" />
                      Detected Media Items ({scannedFiles.length})
                    </span>
                    <span className="text-slate-400 text-[11px]">Select item to load into editor</span>
                  </div>

                  <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                    {scannedFiles.map((sf) => (
                      <div
                        key={sf.id}
                        onClick={() => setSelectedFileId(sf.id)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                          selectedFileId === sf.id
                            ? 'bg-indigo-950/80 border-indigo-500/80 text-white'
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3 truncate pr-2">
                          {sf.type === 'video' ? (
                            <FileVideo className="w-4 h-4 text-indigo-400 shrink-0" />
                          ) : (
                            <FileAudio className="w-4 h-4 text-rose-400 shrink-0" />
                          )}
                          <div className="truncate">
                            <p className="font-semibold text-white truncate">{sf.name}</p>
                            <p className="text-[10px] text-slate-400 truncate">{sf.path}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                            {sf.sizeFormatted}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleConfirmScannedFile(sf);
                            }}
                            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px]"
                          >
                            <span>Load</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: IMPORT VIA LINK / URL */}
          {activeTab === 'link' && (
            <div className="space-y-4">
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
                <label className="text-xs font-bold text-white block">
                  Paste Video or Audio URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Globe className="w-4 h-4 text-cyan-400" />
                  </div>
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => {
                      setLinkUrl(e.target.value);
                      setLinkError(null);
                    }}
                    placeholder="https://example.com/video.mp4 or Drive / Dropbox link..."
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Project Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={linkTitle}
                    onChange={(e) => setLinkTitle(e.target.value)}
                    placeholder="E.g., Tech Podcast Episode 12"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {linkError && (
                  <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-950/60 border border-rose-500/30 p-2.5 rounded-xl">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{linkError}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleImportLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white text-xs font-bold hover:opacity-95 shadow-md shadow-indigo-600/20 transition-all"
                >
                  <LinkIcon className="w-4 h-4" />
                  <span>Import Media from Link</span>
                </button>
              </div>

              {/* Quick Web Video Presets */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">
                  Or Test with Sample Web Video Streams
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {WEB_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        onCustomUpload(p.url, p.title);
                        onClose();
                      }}
                      className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/60 text-left transition-all flex items-center justify-between group"
                    >
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                          {p.category}
                        </span>
                        <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 truncate">
                          {p.title}
                        </h4>
                        <span className="text-[10px] text-slate-500 font-mono">⏱️ {p.duration}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRESET SAMPLE DEMO VIDEOS */}
          {activeTab === 'samples' && (
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-3">
                Select Pre-Configured Sample Project with Transcripts
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sampleMediaList.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => {
                      onSelectSample(sample);
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500 text-left transition-all flex items-start gap-3 group"
                  >
                    <img
                      src={sample.thumbnailUrl}
                      alt={sample.title}
                      className="w-16 h-12 rounded-lg object-cover shrink-0"
                    />
                    <div className="truncate flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                        {sample.category}
                      </span>
                      <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 truncate">
                        {sample.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">⏱️ {sample.duration}s</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

