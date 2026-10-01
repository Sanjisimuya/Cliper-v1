"use client";

import React, { useState } from "react";
import { 
  Play, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  Flame, 
  Clock, 
  Share2, 
  TrendingUp,
  Tag
} from "lucide-react";
import { ClipItem } from "@/lib/api";

interface ClipCardProps {
  clip: ClipItem;
  isSelected: boolean;
  onSelect: (clip: ClipItem) => void;
}

export default function ClipCard({ clip, isSelected, onSelect }: ClipCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyCaption = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = `${clip.suggested_headline}\n\n${clip.transcript_snippet}\n\n${clip.hashtags}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "from-emerald-400 to-brand-emerald text-emerald-400 border-emerald-500/40";
    if (score >= 80) return "from-brand-cyan to-blue-500 text-brand-cyan border-brand-cyan/40";
    return "from-amber-400 to-orange-500 text-amber-400 border-amber-500/40";
  };

  return (
    <div 
      onClick={() => onSelect(clip)}
      className={`rounded-2xl border transition-all duration-300 p-5 cursor-pointer relative overflow-hidden group ${
        isSelected 
          ? "bg-surface-elevated border-brand-cyan shadow-[0_0_25px_rgba(0,240,255,0.2)] ring-1 ring-brand-cyan" 
          : "bg-surface/90 hover:bg-surface-elevated/70 border-surface-border hover:border-surface-highlight"
      }`}
    >
      {/* Top row: Title + Virality Badge */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30">
              <Sparkles className="w-3 h-3" />
              9:16 Vertical
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-gray-400 bg-surface-highlight/40 px-2.5 py-0.5 rounded-full border border-surface-border">
              <Clock className="w-3 h-3" />
              {Math.round(clip.duration)}s
            </span>
          </div>
          <h4 className="text-base font-bold text-white group-hover:text-brand-cyan transition-colors truncate">
            {clip.title}
          </h4>
        </div>

        {/* Circular virality score pill */}
        <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl border bg-surface-elevated/80 shadow-inner ${getScoreColor(clip.virality_score)}`}>
          <div className="flex items-center text-xs font-bold text-gray-300">
            <Flame className="w-3.5 h-3.5 mr-0.5 text-brand-pink animate-pulse" />
          </div>
          <span className="text-lg font-black leading-none">{clip.virality_score}</span>
          <span className="text-[9px] uppercase tracking-tighter opacity-70">VIRAL</span>
        </div>
      </div>

      {/* Suggested Headline banner */}
      {clip.suggested_headline && (
        <div className="mb-3 p-2.5 rounded-xl bg-surface-elevated/60 border border-surface-border/80">
          <p className="text-xs font-extrabold text-brand-cyan tracking-wide uppercase flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-brand-cyan" />
            Hook Overlay:
          </p>
          <p className="text-xs text-gray-200 mt-0.5 font-medium italic line-clamp-1">
            "{clip.suggested_headline}"
          </p>
        </div>
      )}

      {/* Virality breakdown metrics */}
      <div className="grid grid-cols-3 gap-2 mb-3.5 bg-black/20 p-2.5 rounded-xl border border-surface-border/50 text-center">
        <div>
          <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Hook</span>
          <span className="text-xs font-bold text-brand-cyan">{clip.hook_rating || 92}%</span>
        </div>
        <div>
          <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Pacing</span>
          <span className="text-xs font-bold text-brand-emerald">{clip.pacing_rating || 88}%</span>
        </div>
        <div>
          <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Retention</span>
          <span className="text-xs font-bold text-brand-violet">{clip.retention_rating || 94}%</span>
        </div>
      </div>

      {/* Virality psychology reason */}
      {clip.virality_reason && (
        <p className="text-xs text-gray-400 line-clamp-2 mb-4 leading-relaxed bg-surface-elevated/30 p-2 rounded-lg">
          <strong className="text-gray-300">Why it works:</strong> {clip.virality_reason}
        </p>
      )}

      {/* Card Actions */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-surface-border/60">
        <button
          onClick={() => onSelect(clip)}
          className={`flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
            isSelected 
              ? "bg-brand-cyan text-black shadow-lg shadow-brand-cyan/20" 
              : "bg-surface-highlight/60 hover:bg-surface-highlight text-white"
          }`}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          {isSelected ? "Previewing" : "Play in 9:16"}
        </button>

        <button
          onClick={handleCopyCaption}
          title="Copy Caption & Tags"
          className="p-2 rounded-xl bg-surface-highlight/40 hover:bg-surface-highlight text-gray-300 hover:text-white border border-surface-border transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-brand-emerald" /> : <Copy className="w-4 h-4" />}
        </button>

        {clip.video_url && (
          <a
            href={clip.video_url}
            download={`viral_clip_${clip.id}.mp4`}
            onClick={(e) => e.stopPropagation()}
            title="Download Vertical MP4"
            className="p-2 rounded-xl bg-brand-emerald/15 hover:bg-brand-emerald/30 text-brand-emerald border border-brand-emerald/30 transition-colors"
          >
            <Download className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
}
