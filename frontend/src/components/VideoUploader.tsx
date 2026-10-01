"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  UploadCloud, 
  Sparkles, 
  Sliders, 
  Flame, 
  Zap, 
  FileVideo, 
  CheckCircle2, 
  ArrowRight,
  Play
} from "lucide-react";
import { submitYouTubeJob, submitUploadJob } from "@/lib/api";

const DEMO_PRESETS = [
  {
    title: "Why 99% of Content Fails in 2026",
    creator: "Creator Studio Masterclass",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: "14:20",
    tags: ["#viral", "#retention", "#editing"],
    thumbnail: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&q=80"
  },
  {
    title: "The 3-Second Hook Secret That Broke The Algorithm",
    creator: "Silicon Valley Tech Summit",
    url: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    duration: "28:45",
    tags: ["#algorithm", "#growth", "#shorts"],
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80"
  },
  {
    title: "Building an AI Unicorn with Zero Capital",
    creator: "Founders Lounge Podcast",
    url: "https://www.youtube.com/watch?v=L_LUpnjgPso",
    duration: "45:10",
    tags: ["#startups", "#ai", "#scaling"],
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80"
  }
];

export default function VideoUploader() {
  const router = useRouter();
  const [tab, setTab] = useState<"youtube" | "upload">("youtube");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Configuration options
  const [durationPreference, setDurationPreference] = useState<"15-30" | "30-60" | "auto">("15-30");
  const [minVirality, setMinVirality] = useState(80);
  const [captionStyle, setCaptionStyle] = useState("karaoke_neon");

  const handleYouTubeSubmit = async (urlToUse?: string, titleToUse?: string) => {
    const finalUrl = urlToUse || youtubeUrl;
    if (!finalUrl.trim()) {
      setError("Please paste a valid YouTube video URL");
      return;
    }
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await submitYouTubeJob(finalUrl, titleToUse, minVirality, captionStyle);
      router.push(`/dashboard/${res.job_id}`);
    } catch (err: any) {
      setError(err.message || "Failed to start video processing job");
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setError("Please select a video file to upload");
      return;
    }
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await submitUploadJob(selectedFile, selectedFile.name);
      router.push(`/dashboard/${res.job_id}`);
    } catch (err: any) {
      setError(err.message || "Failed to upload video");
      setIsSubmitting(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("video/")) {
        setSelectedFile(file);
      } else {
        setError("Please drop a valid video file (.mp4, .mov, .webm)");
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Glass Ingestion Card */}
      <div className="bg-surface/90 backdrop-blur-xl border border-surface-border rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow ambient light */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-violet/10 rounded-full blur-3xl pointer-events-none" />

        {/* Tab switchers */}
        <div className="flex items-center gap-2 p-1.5 bg-surface-elevated border border-surface-border rounded-2xl max-w-md mx-auto mb-8">
          <button
            type="button"
            onClick={() => { setTab("youtube"); setError(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              tab === "youtube"
                ? "bg-brand-cyan text-black shadow-lg shadow-brand-cyan/25"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <svg className="w-4 h-4 fill-current text-red-500" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            YouTube Link
          </button>
          <button
            type="button"
            onClick={() => { setTab("upload"); setError(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              tab === "upload"
                ? "bg-brand-cyan text-black shadow-lg shadow-brand-cyan/25"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            Upload Video
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs font-medium">
            {error}
          </div>
        )}

        {/* TAB 1: YouTube Ingestion */}
        {tab === "youtube" && (
          <div className="space-y-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Paste YouTube Video URL (e.g. https://www.youtube.com/watch?v=...)"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="w-full bg-surface-elevated/90 border border-surface-border focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/30 rounded-2xl py-4 pl-5 pr-36 text-sm text-white placeholder-gray-500 outline-none transition-all shadow-inner"
              />
              <button
                type="button"
                onClick={() => handleYouTubeSubmit()}
                disabled={isSubmitting || !youtubeUrl.trim()}
                className="absolute right-2 top-2 bottom-2 px-6 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-emerald text-black font-extrabold text-xs tracking-wide uppercase hover:opacity-95 disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg shadow-brand-cyan/20"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Ingesting...
                  </span>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    Clip Video
                  </>
                )}
              </button>
            </div>

            {/* Quick 1-Click Showcase Presets */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-brand-amber" />
                  Try Instant Viral Demos (1-Click Test)
                </span>
                <span className="text-[11px] text-brand-cyan">No API Key Needed</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {DEMO_PRESETS.map((demo, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setYoutubeUrl(demo.url);
                      handleYouTubeSubmit(demo.url, demo.title);
                    }}
                    className="p-3.5 rounded-2xl bg-surface-elevated/60 hover:bg-surface-elevated border border-surface-border hover:border-brand-cyan/50 transition-all duration-300 cursor-pointer group text-left relative overflow-hidden"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30">
                        {demo.duration}
                      </span>
                      <span className="text-[10px] text-gray-400 truncate">{demo.creator}</span>
                    </div>
                    <h5 className="text-xs font-bold text-white group-hover:text-brand-cyan transition-colors line-clamp-2 leading-snug">
                      {demo.title}
                    </h5>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-surface-border/50 text-[11px] text-brand-cyan font-semibold">
                      <span>Launch Pipeline</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: File Upload Ingestion */}
        {tab === "upload" && (
          <div className="space-y-6">
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer relative ${
                isDragging 
                  ? "border-brand-cyan bg-brand-cyan/10 scale-[1.01]" 
                  : "border-surface-border hover:border-surface-highlight bg-surface-elevated/40"
              }`}
            >
              <input
                type="file"
                accept="video/mp4,video/quicktime,video/webm"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedFile(e.target.files[0]);
                  }
                }}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />

              <div className="flex flex-col items-center justify-center pointer-events-none">
                <div className="w-16 h-16 rounded-2xl bg-brand-cyan/15 border border-brand-cyan/30 text-brand-cyan flex items-center justify-center mb-4 shadow-lg shadow-brand-cyan/10">
                  <UploadCloud className="w-8 h-8" />
                </div>
                {selectedFile ? (
                  <div className="flex items-center gap-2 text-sm font-bold text-brand-emerald">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(1)} MB)</span>
                  </div>
                ) : (
                  <>
                    <h4 className="text-sm font-bold text-white mb-1">
                      Drag & Drop Long-form Video Here
                    </h4>
                    <p className="text-xs text-gray-400">
                      Supports MP4, MOV, WEBM up to 500MB (16:9 Landscape Video)
                    </p>
                  </>
                )}
              </div>
            </div>

            {selectedFile && (
              <button
                type="button"
                onClick={handleFileUpload}
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-cyan to-brand-emerald text-black font-extrabold text-sm tracking-wide uppercase hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-xl shadow-brand-cyan/20"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Uploading & Launching AI Clipper...
                  </span>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-current" />
                    Process & Generate 9:16 Clips
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Advanced AI Settings Panel */}
        <div className="mt-8 pt-6 border-t border-surface-border/80">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-brand-cyan" />
              Clip Automation Parameters
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Duration Selector */}
            <div className="p-3 bg-surface-elevated/60 border border-surface-border rounded-xl">
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                Target Clip Duration
              </label>
              <div className="grid grid-cols-3 gap-1">
                {(["15-30", "30-60", "auto"] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDurationPreference(d)}
                    className={`py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                      durationPreference === d 
                        ? "bg-brand-cyan text-black" 
                        : "bg-surface text-gray-400 hover:text-white"
                    }`}
                  >
                    {d === "auto" ? "Smart" : `${d}s`}
                  </button>
                ))}
              </div>
            </div>

            {/* Virality Minimum Threshold */}
            <div className="p-3 bg-surface-elevated/60 border border-surface-border rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Min Virality Score
                </label>
                <span className="text-xs font-extrabold text-brand-cyan">{minVirality}%</span>
              </div>
              <input
                type="range"
                min={70}
                max={95}
                value={minVirality}
                onChange={(e) => setMinVirality(parseInt(e.target.value))}
                className="w-full h-1.5 bg-surface-border rounded-lg appearance-none cursor-pointer accent-brand-cyan"
              />
            </div>

            {/* Dynamic Animated Captions Style */}
            <div className="p-3 bg-surface-elevated/60 border border-surface-border rounded-xl">
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                Dynamic Captions
              </label>
              <select
                value={captionStyle}
                onChange={(e) => setCaptionStyle(e.target.value)}
                className="w-full bg-surface border border-surface-border text-xs text-white rounded-lg p-1.5 outline-none focus:border-brand-cyan"
              >
                <option value="karaoke_neon">Karaoke Neon (Yellow Bounce)</option>
                <option value="cyber_cyan">Cyber Cyan Glow</option>
                <option value="sunset_pink">Sunset Pink Wave</option>
                <option value="bold_impact">Bold Impact Subtitles</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
