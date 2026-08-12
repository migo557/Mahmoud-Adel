import { SubtitleItem, VideoSummary } from '../types';

export function formatTimeSRT(seconds: number): string {
  const date = new Date(0);
  date.setUTCMilliseconds(seconds * 1000);
  const hh = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const mm = String(date.getUTCMinutes()).padStart(2, '0');
  const ss = String(date.getUTCSeconds()).padStart(2, '0');
  const ms = String(date.getUTCMilliseconds()).padStart(3, '0');
  return `${hh}:${mm}:${ss},${ms}`;
}

export function formatTimeVTT(seconds: number): string {
  const date = new Date(0);
  date.setUTCMilliseconds(seconds * 1000);
  const hh = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const mm = String(date.getUTCMinutes()).padStart(2, '0');
  const ss = String(date.getUTCSeconds()).padStart(2, '0');
  const ms = String(date.getUTCMilliseconds()).padStart(3, '0');
  return `${hh}:${mm}:${ss}.${ms}`;
}

export function exportSRT(subtitles: SubtitleItem[], filename: string = 'subtitles.srt') {
  let srtContent = '';
  subtitles.forEach((sub, index) => {
    srtContent += `${index + 1}\n`;
    srtContent += `${formatTimeSRT(sub.startTime)} --> ${formatTimeSRT(sub.endTime)}\n`;
    srtContent += `${sub.speaker ? `[${sub.speaker}] ` : ''}${sub.text}\n\n`;
  });

  const blob = new Blob([srtContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportVTT(subtitles: SubtitleItem[], filename: string = 'subtitles.vtt') {
  let vttContent = 'WEBVTT\n\n';
  subtitles.forEach((sub, index) => {
    vttContent += `${index + 1}\n`;
    vttContent += `${formatTimeVTT(sub.startTime)} --> ${formatTimeVTT(sub.endTime)}\n`;
    vttContent += `${sub.speaker ? `<v ${sub.speaker}>` : ''}${sub.text}\n\n`;
  });

  const blob = new Blob([vttContent], { type: 'text/vtt;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportSummaryMarkdown(summary: VideoSummary, videoTitle: string) {
  let md = `# Executive Video Summary: ${summary.title || videoTitle}\n\n`;
  md += `## 📌 Overview\n${summary.overview}\n\n`;
  md += `## 🎯 Key Takeaways\n`;
  summary.keyTakeaways?.forEach((point) => {
    md += `- ${point}\n`;
  });
  md += `\n## 🏷️ Main Topics\n${summary.mainTopics?.join(', ') || 'N/A'}\n\n`;
  md += `## ⏱️ Chapter Breakdown\n`;
  summary.chapters?.forEach((chap) => {
    const startMm = Math.floor(chap.startTime / 60);
    const startSs = String(Math.floor(chap.startTime % 60)).padStart(2, '0');
    md += `### [${startMm}:${startSs}] ${chap.title}\n`;
    md += `${chap.summary}\n`;
    if (chap.keyPoints && chap.keyPoints.length > 0) {
      chap.keyPoints.forEach((kp) => (md += `  * ${kp}\n`));
    }
    md += `\n`;
  });

  md += `## 🔥 Viral Highlight Clips\n`;
  summary.highlights?.forEach((hl) => {
    const startMm = Math.floor(hl.startTime / 60);
    const startSs = String(Math.floor(hl.startTime % 60)).padStart(2, '0');
    md += `### ${hl.title} (Virality Score: ${hl.viralityScore}%)\n`;
    md += `**Timestamp:** [${startMm}:${startSs}] | **Category:** ${hl.category}\n`;
    md += `**Reason:** ${hl.reason}\n`;
    md += `> "${hl.transcriptSnippet}"\n\n`;
  });

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${videoTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}_summary.md`;
  link.click();
  URL.revokeObjectURL(url);
}
