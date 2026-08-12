import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles, Languages, Lightbulb, Copy, Check } from 'lucide-react';
import { SubtitleItem, VideoSummary } from '../types';

interface AIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  subtitles: SubtitleItem[];
  summary: VideoSummary | null;
  onTranslateSubtitles?: (targetLang: string) => void;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({
  isOpen,
  onClose,
  subtitles,
  summary,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: 'Hello! I am your AI Video Assistant. I can help translate your subtitles, craft TikTok hooks, or summarize specific video sections. What would you like to do?',
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!inputPrompt.trim() || isSending) return;

    const userText = inputPrompt;
    setInputPrompt('');
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setIsSending(true);

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userText,
          subtitles,
          summary,
        }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: data.reply || 'Here is what I found for your video request.' },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Sorry, I encountered an issue processing your request.' },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickAction = (actionPrompt: string) => {
    setInputPrompt(actionPrompt);
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col text-slate-100">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">AI Video Assistant</h3>
            <p className="text-[10px] text-slate-400">Powered by Gemini 3.6 Flash</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Prompts */}
      <div className="p-3 bg-slate-950/40 border-b border-slate-800 flex gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
        <button
          onClick={() => handleQuickAction('Write 3 viral TikTok captions with hashtags for this video')}
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap flex items-center gap-1 border border-slate-700"
        >
          <Lightbulb className="w-3 h-3 text-amber-400" />
          <span>TikTok Hooks</span>
        </button>
        <button
          onClick={() => handleQuickAction('Translate current subtitles into Spanish and French')}
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap flex items-center gap-1 border border-slate-700"
        >
          <Languages className="w-3 h-3 text-cyan-400" />
          <span>Translate Subtitles</span>
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${
              m.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`p-3 rounded-2xl max-w-[88%] text-xs leading-relaxed relative group ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none'
              }`}
            >
              {m.text}

              {m.sender === 'ai' && (
                <button
                  onClick={() => handleCopy(m.text, idx)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
                >
                  {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              )}
            </div>
          </div>
        ))}

        {isSending && (
          <div className="flex items-start gap-2">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 animate-pulse">
              AI is thinking...
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask AI to translate or edit video captions..."
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-slate-900 text-slate-200 placeholder-slate-500 text-xs rounded-xl px-3 py-2 border border-slate-800 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={handleSend}
            disabled={!inputPrompt.trim() || isSending}
            className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
