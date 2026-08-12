import React, { useState } from 'react';
import { Wand2, X, Upload, Sparkles, Film, CheckCircle2, AlertCircle, Ratio, Image as ImageIcon } from 'lucide-react';

interface VeoAnimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVideoGenerated: (videoUrl: string, prompt: string, aspectRatio: '16:9' | '9:16') => void;
}

const SAMPLE_PHOTOS = [
  {
    name: 'Futuristic Cyberpunk Avatar',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    prompt: 'Cinematic slow zoom, atmospheric neon rim light reflection, subtle wind moving hair',
  },
  {
    name: 'Mountain Sunset Landscape',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    prompt: 'Fluid pan across mountain lake, gentle water ripple animation, glowing warm sunset rays',
  },
  {
    name: 'Modern Studio Creator',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    prompt: 'Dynamic depth effect, soft camera push-in, subtle natural head nod and smiling eyes',
  },
];

export const VeoAnimatorModal: React.FC<VeoAnimatorModalProps> = ({
  isOpen,
  onClose,
  onVideoGenerated,
}) => {
  const [photoUrl, setPhotoUrl] = useState<string>(SAMPLE_PHOTOS[0].url);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>(SAMPLE_PHOTOS[0].prompt);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPhotoUrl(result);
        setImageBase64(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = (sample: typeof SAMPLE_PHOTOS[0]) => {
    setPhotoUrl(sample.url);
    setImageBase64(null); // Will let backend load or prompt
    setPrompt(sample.prompt);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMessage(null);
    setStatusMessage('Initiating Veo 3.1 video generation model...');

    try {
      // 1. Convert photo URL to base64 if not already base64
      let finalBase64 = imageBase64;
      if (!finalBase64 && photoUrl) {
        try {
          const resp = await fetch(photoUrl);
          const blob = await resp.blob();
          finalBase64 = await new Promise((resolve) => {
            const r = new FileReader();
            r.onloadend = () => resolve(r.result as string);
            r.readAsDataURL(blob);
          });
        } catch (e) {
          console.warn('Could not fetch sample photo to base64, generating text/photo prompt');
        }
      }

      // 2. Start Veo Video Generation
      const startRes = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          aspectRatio,
          imageBase64: finalBase64,
        }),
      });

      const startData = await startRes.json();
      if (!startRes.ok || !startData.operationName) {
        throw new Error(startData.error || 'Failed to start video generation');
      }

      const operationName = startData.operationName;
      const isQuotaFallback = startData.isQuotaFallback;

      if (isQuotaFallback) {
        setStatusMessage('Gemini API rate limit reached. Auto-activated fallback high-definition video synthesis preview...');
      } else {
        setStatusMessage('Synthesizing temporal neural frames (this takes ~30-60s)...');
      }

      // 3. Poll operation status
      const reassuranceMessages = [
        'Analyzing image depth map & focal planes...',
        'Predicting fluid optical flow & realistic motion vectors...',
        'Synthesizing high-definition video frames with Veo...',
        'Applying lighting consistency & motion smoothing...',
        'Finalizing MP4 video rendering...',
      ];

      let attempts = 0;
      let isDone = false;

      while (!isDone) {
        // Shorter delay if simulated quota fallback
        await new Promise((res) => setTimeout(res, isQuotaFallback ? 1200 : 4000));
        attempts++;

        const msgIdx = Math.min(attempts, reassuranceMessages.length - 1);
        if (!isQuotaFallback) {
          setStatusMessage(reassuranceMessages[msgIdx]);
        }

        const statusRes = await fetch('/api/video-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operationName }),
        });

        const statusData = await statusRes.json();
        if (statusData.error) {
          throw new Error(statusData.error.message || 'Error reported during Veo generation');
        }

        if (statusData.done) {
          isDone = true;
        }
      }

      // 4. Download generated video buffer
      setStatusMessage('Downloading completed Veo video stream...');
      const dlRes = await fetch('/api/video-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operationName }),
      });

      if (!dlRes.ok) {
        throw new Error('Failed to download generated video bytes');
      }

      const blob = await dlRes.blob();
      const generatedUrl = URL.createObjectURL(blob);

      setIsGenerating(false);
      onVideoGenerated(generatedUrl, prompt, aspectRatio);
      onClose();
    } catch (err: any) {
      console.error('Veo Animation error:', err);
      setIsGenerating(false);
      setErrorMessage(err.message || 'Veo video generation failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl text-slate-100 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Animate Photo to Video (Veo)
              </h2>
              <p className="text-xs text-slate-400">
                Uses model <span className="font-mono text-amber-300">veo-3.1-fast-generate-preview</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isGenerating}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Photo Selection */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              1. Choose Photo or Upload Image
            </label>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Image Preview Box */}
              <div className="relative w-full sm:w-48 h-40 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center group shrink-0">
                {photoUrl ? (
                  <img src={photoUrl} alt="Target" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-slate-600" />
                )}

                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white text-xs font-medium gap-1">
                  <Upload className="w-4 h-4" />
                  <span>Upload Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Sample Presets */}
              <div className="flex-1 space-y-2">
                <span className="text-[11px] text-slate-400 font-medium block">
                  Or pick a sample photo:
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {SAMPLE_PHOTOS.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSample(s)}
                      className={`p-2 rounded-lg border text-left text-xs flex items-center gap-2 transition-all ${
                        photoUrl === s.url
                          ? 'bg-indigo-950/60 border-indigo-500 text-white ring-1 ring-indigo-500/30'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <img src={s.url} alt={s.name} className="w-8 h-8 rounded-md object-cover" />
                      <div className="truncate flex-1">
                        <p className="font-semibold truncate">{s.name}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Prompt Input */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              2. Motion & Camera Animation Prompt
            </label>
            <textarea
              rows={2}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe motion: e.g. Cinematic zoom into camera, warm sunlight passing through hair..."
              className="w-full bg-slate-950 text-slate-200 placeholder-slate-500 text-xs rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Aspect Ratio Selection */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              3. Target Aspect Ratio
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setAspectRatio('16:9')}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                  aspectRatio === '16:9'
                    ? 'bg-amber-950/50 border-amber-500 text-amber-300 ring-2 ring-amber-500/30'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Ratio className="w-4 h-4" />
                <span>16:9 Landscape</span>
              </button>

              <button
                onClick={() => setAspectRatio('9:16')}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                  aspectRatio === '9:16'
                    ? 'bg-amber-950/50 border-amber-500 text-amber-300 ring-2 ring-amber-500/30'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Ratio className="w-4 h-4 rotate-90" />
                <span>9:16 Portrait (TikTok/Reels)</span>
              </button>
            </div>
          </div>

          {/* Progress Overlay during Generation */}
          {isGenerating && (
            <div className="p-4 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-amber-300 text-xs font-bold">
                <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
                <span>Veo Video Generation Active</span>
              </div>
              <p className="text-xs text-slate-300 font-medium animate-pulse">{statusMessage}</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-950/50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-rose-500/20 transition-all disabled:opacity-50"
          >
            <Wand2 className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Generating Video...' : 'Generate Veo Video'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
