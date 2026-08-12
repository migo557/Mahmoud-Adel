export interface WordTimestamp {
  word: string;
  start: number;
  end: number;
}

export interface SubtitleItem {
  id: string;
  startTime: number; // in seconds
  endTime: number;   // in seconds
  text: string;
  speaker?: string;
  words?: WordTimestamp[];
}

export type SubtitlePreset = 'hormozi' | 'clean' | 'neon' | 'boxed' | 'cinematic';

export interface SubtitleStyleConfig {
  preset: SubtitlePreset;
  fontSize: number; // in pixels (e.g. 24 - 48)
  textColor: string;
  highlightColor: string;
  backgroundColor: string;
  position: 'bottom' | 'middle' | 'top';
  textTransform: 'none' | 'uppercase' | 'lowercase';
  animation: 'pop' | 'highlight' | 'fade' | 'none';
  fontWeight: 'bold' | 'normal' | 'black';
  strokeColor?: string;
}

export interface Chapter {
  id: string;
  startTime: number;
  endTime: number;
  title: string;
  summary: string;
  keyPoints: string[];
}

export interface HighlightClip {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  viralityScore: number; // 0 - 100
  reason: string;
  transcriptSnippet: string;
  category: 'Insightful' | 'Funny' | 'Actionable' | 'Hook' | 'Controversial';
}

export interface VideoSummary {
  title: string;
  overview: string;
  keyTakeaways: string[];
  mainTopics: string[];
  chapters: Chapter[];
  highlights: HighlightClip[];
  sentiment: 'Inspiring' | 'Educational' | 'Analytical' | 'Conversational' | 'Energetic';
  targetAudience: string;
  wordCount: number;
  estimatedReadTimeMinutes: number;
}

export interface SampleMedia {
  id: string;
  title: string;
  category: string;
  duration: number;
  videoUrl: string;
  thumbnailUrl: string;
  description: string;
  defaultSubtitles: SubtitleItem[];
  defaultSummary?: VideoSummary;
}

export interface VeoGenerationConfig {
  prompt: string;
  aspectRatio: '16:9' | '9:16';
  imageBase64?: string;
  resolution?: '720p' | '1080p';
}

export interface VideoProject {
  id: string;
  title: string;
  videoUrl: string;
  duration: number;
  aspectRatio: '16:9' | '9:16' | '1:1';
  subtitles: SubtitleItem[];
  subtitleStyle: SubtitleStyleConfig;
  summary: VideoSummary | null;
  rawTranscript?: string;
  isCustomUpload: boolean;
}
