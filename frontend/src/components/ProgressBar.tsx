"use client";

import React from "react";
import { 
  DownloadCloud, 
  FileText, 
  Sparkles, 
  ScanFace, 
  Video, 
  CheckCircle2, 
  AlertCircle,
  Loader2 
} from "lucide-react";

interface ProgressBarProps {
  stage: string;
  progress: number;
  errorMessage?: string;
}

const STAGES = [
  { id: "downloading", label: "Video Ingest", icon: DownloadCloud, desc: "Fetching streams & metadata" },
  { id: "transcribing", label: "Speech Transcription", icon: FileText, desc: "Word-level alignment & timestamps" },
  { id: "analyzing", label: "Virality AI Scoring", icon: Sparkles, desc: "Hook & engagement detection" },
  { id: "face_tracking", label: "Speaker Face Tracking", icon: ScanFace, desc: "Re-framing 16:9 to vertical 9:16" },
  { id: "rendering", label: "Dynamic Captions & Render", icon: Video, desc: "Burning animated captions to MP4" },
  { id: "completed", label: "Export Ready", icon: CheckCircle2, desc: "High-virality vertical clips generated" },
];

export default function ProgressBar({ stage, progress, errorMessage }: ProgressBarProps) {
  if (stage === "error") {
    return (
      <div className="w-full bg-red-950/40 border border-red-500/30 rounded-2xl p-6 text-red-200 flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-lg text-red-300">Processing Error</h4>
          <p className="text-sm mt-1 text-red-200/80">{errorMessage || "An unexpected error occurred during clip generation."}</p>
        </div>
      </div>
    );
  }

  const getStageStatus = (stageId: string, index: number) => {
    const stageOrder = ["queued", "downloading", "transcribing", "analyzing", "face_tracking", "rendering", "completed"];
    const currentIdx = stageOrder.indexOf(stage);
    const targetIdx = stageOrder.indexOf(stageId);

    if (currentIdx > targetIdx || stage === "completed") return "done";
    if (stage === stageId) return "current";
    return "pending";
  };

  return (
    <div className="w-full bg-surface border border-surface-border rounded-2xl p-6 shadow-2xl relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-cyan/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-brand-cyan flex items-center gap-2">
            {stage !== "completed" && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Pipeline Status
          </span>
          <h3 className="text-xl font-bold text-white mt-1 capitalize">
            {stage === "completed" ? "All Viral Clips Rendered!" : `Stage: ${stage.replace("_", " ")}`}
          </h3>
        </div>
        <div className="text-right">
          <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-emerald">
            {Math.min(100, Math.max(0, progress))}%
          </span>
          <p className="text-xs text-gray-400">Total Progress</p>
        </div>
      </div>

      {/* Main glowing progress track */}
      <div className="w-full h-3 bg-surface-elevated rounded-full overflow-hidden p-0.5 border border-surface-border mb-8">
        <div 
          className="h-full bg-gradient-to-r from-brand-cyan via-brand-emerald to-brand-violet rounded-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(0,240,255,0.5)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Multi-stage step breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {STAGES.map((s, idx) => {
          const status = getStageStatus(s.id, idx);
          const Icon = s.icon;
          const isDone = status === "done";
          const isCurrent = status === "current";

          return (
            <div 
              key={s.id} 
              className={`p-3.5 rounded-xl border transition-all duration-300 relative ${
                isCurrent 
                  ? "bg-brand-cyan/10 border-brand-cyan/60 shadow-[0_0_15px_rgba(0,240,255,0.15)] scale-[1.02]" 
                  : isDone
                  ? "bg-surface-elevated/80 border-brand-emerald/40 text-gray-300"
                  : "bg-surface-elevated/40 border-surface-border/60 text-gray-500 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${
                  isCurrent ? "bg-brand-cyan text-black" : isDone ? "bg-brand-emerald/20 text-brand-emerald" : "bg-surface text-gray-500"
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                {isDone && <CheckCircle2 className="w-4 h-4 text-brand-emerald" />}
                {isCurrent && <Loader2 className="w-4 h-4 text-brand-cyan animate-spin" />}
              </div>
              <h5 className="font-semibold text-xs text-white leading-tight">{s.label}</h5>
              <p className="text-[11px] text-gray-400 mt-1 line-clamp-1">{s.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
