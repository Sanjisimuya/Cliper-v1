import React from "react";
import VideoUploader from "@/components/VideoUploader";
import { 
  Sparkles, 
  ScanFace, 
  TrendingUp, 
  Video, 
  Flame, 
  Cpu, 
  Zap, 
  CheckCircle,
  Play,
  ArrowRight
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Decorative ambient background grid & orbs */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-brand-cyan/20 via-brand-emerald/15 to-brand-violet/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Top Feature Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-elevated/90 border border-brand-cyan/40 shadow-lg shadow-brand-cyan/10 mb-8 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-brand-cyan animate-pulse" />
          <span className="text-xs font-bold text-gray-200">
            Next-Gen Autonomous Video Repurposing Pipeline
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald" />
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] max-w-5xl mx-auto">
          Turn 1-Hour Videos Into{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-brand-emerald to-brand-amber">
            10 Viral 9:16 Shorts
          </span>{" "}
          in 60 Seconds
        </h1>

        <p className="mt-6 text-base sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
          Ingest long-form YouTube podcasts and webinars. Our AI transcribes speech with word precision, tracks the active speaker with cinematic re-framing, detects high-virality hooks, and renders vertical MP4 clips with dynamic animated captions.
        </p>

        {/* Feature Highlights Ticker */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-8 text-xs font-semibold text-gray-400">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-brand-cyan" />
            <span>AI Speaker Face Tracking (16:9 → 9:16)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-brand-emerald" />
            <span>LLM Virality Scoring (0–100)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-brand-pink" />
            <span>Dynamic TikTok Animated Captions</span>
          </div>
        </div>
      </section>

      {/* Main Video Ingestion Studio Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pb-20 max-w-7xl mx-auto">
        <VideoUploader />
      </section>

      {/* Technical Architecture Pillars */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-surface-border/60">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-cyan flex items-center justify-center gap-1.5">
            <Cpu className="w-4 h-4" />
            Under The Hood
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-2">
            The Autonomous Clipper Engine
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            Built for enterprise-grade video processing with distributed workers and real-time computer vision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="p-6 rounded-3xl bg-surface border border-surface-border/80 hover:border-brand-cyan/50 transition-all duration-300 relative group">
            <div className="w-12 h-12 rounded-2xl bg-brand-cyan/15 text-brand-cyan flex items-center justify-center mb-4 border border-brand-cyan/30 shadow-lg shadow-brand-cyan/10">
              <ScanFace className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-cyan transition-colors">
              Speaker Face Tracking
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Detects human faces across video frames, tracks head movements, and applies exponential smoothing to pan the 9:16 crop window seamlessly without camera jitter.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-3xl bg-surface border border-surface-border/80 hover:border-brand-emerald/50 transition-all duration-300 relative group">
            <div className="w-12 h-12 rounded-2xl bg-brand-emerald/15 text-brand-emerald flex items-center justify-center mb-4 border border-brand-emerald/30 shadow-lg shadow-brand-emerald/10">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-emerald transition-colors">
              LLM Virality Scoring
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Analyzes speech transcripts with advanced language models to evaluate hook strength, tension, emotional pattern interrupts, and predicts viewer retention curves.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-3xl bg-surface border border-surface-border/80 hover:border-brand-pink/50 transition-all duration-300 relative group">
            <div className="w-12 h-12 rounded-2xl bg-brand-pink/15 text-brand-pink flex items-center justify-center mb-4 border border-brand-pink/30 shadow-lg shadow-brand-pink/10">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-pink transition-colors">
              Dynamic Karaoke Captions
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Word-level timestamps drive TikTok/Reels-style kinetic subtitles with active word highlights, bouncy scale animations, and drop shadows burned straight into MP4.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
