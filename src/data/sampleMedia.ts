import { SampleMedia } from '../types';

export const SAMPLE_MEDIA_LIST: SampleMedia[] = [
  {
    id: 'tech-keynote',
    title: 'Future of Artificial Intelligence & Spatial Computing Keynote',
    category: 'Technology & AI',
    duration: 118,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    description: 'A groundbreaking keynote speech exploring generative neural networks, real-time spatial video synthesis, and human-computer interactions.',
    defaultSubtitles: [
      {
        id: 'sub-1',
        startTime: 1.0,
        endTime: 5.5,
        text: 'WELCOME TO THE NEXT GENERATION OF ARTIFICIAL INTELLIGENCE',
        speaker: 'Alex Rivera (Host)',
        words: [
          { word: 'WELCOME', start: 1.0, end: 1.8 },
          { word: 'TO', start: 1.9, end: 2.1 },
          { word: 'THE', start: 2.2, end: 2.4 },
          { word: 'NEXT', start: 2.5, end: 2.9 },
          { word: 'GENERATION', start: 3.0, end: 4.0 },
          { word: 'OF', start: 4.1, end: 4.3 },
          { word: 'AI', start: 4.4, end: 5.5 }
        ]
      },
      {
        id: 'sub-2',
        startTime: 6.0,
        endTime: 11.2,
        text: 'Today we are introducing multimodal real-time video synthesis on edge devices.',
        speaker: 'Alex Rivera (Host)',
        words: [
          { word: 'Today', start: 6.0, end: 6.5 },
          { word: 'we', start: 6.6, end: 6.8 },
          { word: 'are', start: 6.9, end: 7.1 },
          { word: 'introducing', start: 7.2, end: 8.2 },
          { word: 'multimodal', start: 8.3, end: 9.3 },
          { word: 'real-time', start: 9.4, end: 10.1 },
          { word: 'video', start: 10.2, end: 10.7 },
          { word: 'synthesis.', start: 10.8, end: 11.2 }
        ]
      },
      {
        id: 'sub-3',
        startTime: 12.0,
        endTime: 17.5,
        text: 'Imagine transforming a single photo into an interactive 3D scene in less than two seconds.',
        speaker: 'Alex Rivera (Host)',
        words: [
          { word: 'Imagine', start: 12.0, end: 12.7 },
          { word: 'transforming', start: 12.8, end: 13.8 },
          { word: 'a', start: 13.9, end: 14.0 },
          { word: 'single', start: 14.1, end: 14.6 },
          { word: 'photo', start: 14.7, end: 15.2 },
          { word: 'into', start: 15.3, end: 15.7 },
          { word: '3D', start: 15.8, end: 16.3 },
          { word: 'scene.', start: 16.4, end: 17.5 }
        ]
      },
      {
        id: 'sub-4',
        startTime: 18.0,
        endTime: 24.0,
        text: 'This architecture processes millions of visual tokens natively with zero latency.',
        speaker: 'Dr. Sarah Chen',
        words: [
          { word: 'This', start: 18.0, end: 18.4 },
          { word: 'architecture', start: 18.5, end: 19.6 },
          { word: 'processes', start: 19.7, end: 20.5 },
          { word: 'millions', start: 20.6, end: 21.4 },
          { word: 'of', start: 21.5, end: 21.7 },
          { word: 'tokens', start: 21.8, end: 22.6 },
          { word: 'natively.', start: 22.7, end: 24.0 }
        ]
      },
      {
        id: 'sub-5',
        startTime: 25.0,
        endTime: 32.0,
        text: 'Content creators can now auto-generate subtitles, chapters, and viral shorts in one click.',
        speaker: 'Dr. Sarah Chen',
        words: [
          { word: 'Content', start: 25.0, end: 25.5 },
          { word: 'creators', start: 25.6, end: 26.3 },
          { word: 'can', start: 26.4, end: 26.7 },
          { word: 'now', start: 26.8, end: 27.2 },
          { word: 'auto-generate', start: 27.3, end: 28.5 },
          { word: 'subtitles,', start: 28.6, end: 29.5 },
          { word: 'chapters,', start: 29.6, end: 30.5 },
          { word: 'and', start: 30.6, end: 30.8 },
          { word: 'viral', start: 30.9, end: 31.4 },
          { word: 'shorts!', start: 31.5, end: 32.0 }
        ]
      }
    ],
    defaultSummary: {
      title: 'Keynote Summary: Generative Spatial Computing & Next-Gen Video AI',
      overview: 'The keynote introduced breakthrough generative spatial neural networks capable of converting static 2D imagery into immersive, real-time 3D environments. Alex Rivera and Dr. Sarah Chen showcased how multimodal LLMs eliminate latency in video token processing, paving the way for automated video editing, instant subtitle alignment, and intelligent content summarization.',
      keyTakeaways: [
        'Edge AI hardware now supports sub-2-second spatial video generation.',
        'Multimodal token processing achieves zero-latency live captioning and word alignment.',
        'Automated viral short extraction reduces long-form editing workflows from hours to minutes.',
        'Zero-shot spatial neural networks can extrapolate depth and illumination dynamically.'
      ],
      mainTopics: ['Generative AI', 'Spatial Computing', 'Video Processing', 'Multimodal LLMs', 'Content Creation'],
      sentiment: 'Inspiring',
      targetAudience: 'AI Engineers, Tech Executives, Video Creators, and Media Producers',
      wordCount: 1420,
      estimatedReadTimeMinutes: 4,
      chapters: [
        {
          id: 'chap-1',
          startTime: 0,
          endTime: 12,
          title: '01. Vision for Spatial AI',
          summary: 'Introduction to next-generation multimodal neural networks and real-time synthesis.',
          keyPoints: ['Democratizing 3D rendering', 'Instant spatial depth generation']
        },
        {
          id: 'chap-2',
          startTime: 12,
          endTime: 25,
          title: '02. Technical Architecture & Edge Processing',
          summary: 'Deep dive into low-latency token streaming and on-device neural engines.',
          keyPoints: ['Sub-second latency benchmarks', 'Optimized neural weights for mobile']
        },
        {
          id: 'chap-3',
          startTime: 25,
          endTime: 60,
          title: '03. Creator Workflows & Automated Video Editing',
          summary: 'How AI automates captioning, transcript indexing, and short-form clip generation.',
          keyPoints: ['One-click viral clip extraction', 'Dynamic word-by-word kinetic captions']
        }
      ],
      highlights: [
        {
          id: 'hl-1',
          title: 'The 2-Second Photo-to-3D Revolution',
          startTime: 12.0,
          endTime: 24.0,
          viralityScore: 96,
          reason: 'High curiosity hook with mind-blowing stat about instant 3D photo conversion.',
          transcriptSnippet: 'Imagine transforming a single photo into an interactive 3D scene in less than two seconds...',
          category: 'Hook'
        },
        {
          id: 'hl-2',
          title: 'Zero Latency Multimodal Video Streaming',
          startTime: 18.0,
          endTime: 32.0,
          viralityScore: 91,
          reason: 'Strong technical breakdown appealing to tech builders and founders.',
          transcriptSnippet: 'This architecture processes millions of visual tokens natively with zero latency...',
          category: 'Insightful'
        }
      ]
    }
  },
  {
    id: 'creator-podcast',
    title: 'The AI Content Mastery Podcast: Building a $10M Media Brand',
    category: 'Podcast & Business',
    duration: 180,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80',
    description: 'An in-depth conversation on repurposing 1 hour of video into 20 viral clips, automatic AI subtitle styling, and audience retention strategies.',
    defaultSubtitles: [
      {
        id: 'pod-1',
        startTime: 0.5,
        endTime: 4.8,
        text: 'The biggest mistake creators make with long-form video is treating it like a single asset.',
        speaker: 'Host Marcus',
        words: [
          { word: 'The', start: 0.5, end: 0.7 },
          { word: 'biggest', start: 0.8, end: 1.2 },
          { word: 'mistake', start: 1.3, end: 1.8 },
          { word: 'creators', start: 1.9, end: 2.4 },
          { word: 'make', start: 2.5, end: 2.8 },
          { word: 'is', start: 2.9, end: 3.1 },
          { word: 'treating', start: 3.2, end: 3.8 },
          { word: 'it', start: 3.9, end: 4.1 },
          { word: 'single', start: 4.2, end: 4.8 }
        ]
      },
      {
        id: 'pod-2',
        startTime: 5.2,
        endTime: 10.0,
        text: 'Every 60-minute podcast contains at least 8 high-performing viral hooks if you know where to look.',
        speaker: 'Host Marcus',
        words: [
          { word: 'Every', start: 5.2, end: 5.6 },
          { word: 'podcast', start: 5.7, end: 6.3 },
          { word: 'contains', start: 6.4, end: 7.0 },
          { word: 'viral', start: 7.1, end: 7.6 },
          { word: 'hooks!', start: 7.7, end: 10.0 }
        ]
      },
      {
        id: 'pod-3',
        startTime: 10.5,
        endTime: 16.0,
        text: 'When you add bold, animated subtitles with pop animations, watch time increases by up to 65%.',
        speaker: 'Elena Vance',
        words: [
          { word: 'When', start: 10.5, end: 10.8 },
          { word: 'you', start: 10.9, end: 11.1 },
          { word: 'add', start: 11.2, end: 11.4 },
          { word: 'animated', start: 11.5, end: 12.2 },
          { word: 'subtitles,', start: 12.3, end: 13.0 },
          { word: 'watch', start: 13.1, end: 13.5 },
          { word: 'time', start: 13.6, end: 14.0 },
          { word: 'increases!', start: 14.1, end: 16.0 }
        ]
      }
    ],
    defaultSummary: {
      title: 'Podcast Summary: The 20x Repurposing Framework for Creators',
      overview: 'In this episode, Marcus and Elena break down the exact content engine used to scale a media brand to 10M+ impressions per month. They demonstrate how automated transcript analysis pinpoints emotional spikes, how kinetic typography retains muted mobile viewers, and how AI chaptering helps long-form video rank higher in search algorithms.',
      keyTakeaways: [
        '85% of mobile video views happen without sound — subtitles are non-negotiable.',
        'Hormozi-style single-word dynamic captions boost retention by 65%.',
        'AI Virality Scoring identifies high-yield clips automatically.',
        'Timestamped chapter indexing improves SEO indexing and user navigation.'
      ],
      mainTopics: ['Content Repurposing', 'Viral Retention', 'Short-Form Video', 'AI Captions'],
      sentiment: 'Energetic',
      targetAudience: 'Podcasters, YouTubers, Digital Marketers, and Content Strategists',
      wordCount: 2100,
      estimatedReadTimeMinutes: 6,
      chapters: [
        {
          id: 'chap-p1',
          startTime: 0,
          endTime: 10,
          title: '01. The Single Asset Fallacy',
          summary: 'Why treating long videos as static files wastes 90% of potential reach.',
          keyPoints: ['Unlocking micro-content', 'The power of multi-platform distribution']
        },
        {
          id: 'chap-p2',
          startTime: 10,
          endTime: 30,
          title: '02. Typography & Retention Psychology',
          summary: 'How color triggers and bouncing word animations keep eyes glued to mobile screens.',
          keyPoints: ['Word-by-word highlight effects', 'Contrast rules for vertical video']
        }
      ],
      highlights: [
        {
          id: 'hl-p1',
          title: 'The Muted Mobile Viewers Secret (65% Retention Boost)',
          startTime: 10.5,
          endTime: 16.0,
          viralityScore: 98,
          reason: 'Massive actionable insight about muted retention with clear stat backup.',
          transcriptSnippet: 'When you add bold, animated subtitles with pop animations, watch time increases by up to 65%...',
          category: 'Actionable'
        }
      ]
    }
  }
];
