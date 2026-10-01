"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  ScanFace, 
  Layers, 
  Sparkles, 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share2, 
  Music,
  Maximize2
} from "lucide-react";
import { ClipItem, WordTimestamp } from "@/lib/api";

interface VideoPlayerProps {
  clip: ClipItem | null;
  videoSource?: string;
  wordTimestamps?: WordTimestamp[];
}

export default function VideoPlayer({ clip, videoSource, wordTimestamps = [] }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const [isMuted, setIsMuted] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<"9:16" | "1:1" | "16:9">("9:16");
  const [showFaceBox, setShowFaceBox] = useState(true);
  const [captionTheme, setCaptionTheme] = useState<"neon" | "gold" | "cyber">("neon");
  const [liked, setLiked] = useState(false);

  // Sync video time
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || clip?.duration || 30);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  // Find active words in wordTimestamps for the current playback second
  const relativeTime = (clip?.start_time || 0) + currentTime;
  const currentWords = wordTimestamps.filter(
    (w) => w.start <= relativeTime + 1.2 && w.end >= relativeTime - 1.2
  );

  const activeWord = wordTimestamps.find(
    (w) => w.start <= relativeTime && w.end >= relativeTime
  );

  // Fallback caption text if word timestamps are not provided
  const fallbackWords = (clip?.transcript_snippet || "AI Video Clipper automatically detects high viral hooks and burns dynamic captions.")
    .split(" ")
    .slice(0, 16);

  const fallbackActiveIndex = Math.floor((currentTime % 6) / (6 / fallbackWords.length));

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      {/* Player Top Controls */}
      <div className="w-full flex items-center justify-between gap-2 mb-3 bg-surface border border-surface-border p-2 rounded-xl text-xs">
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setAspectRatio("9:16")}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              aspectRatio === "9:16" ? "bg-brand-cyan text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            9:16 Reel
          </button>
          <button 
            onClick={() => setAspectRatio("1:1")}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              aspectRatio === "1:1" ? "bg-brand-cyan text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            1:1 Post
          </button>
          <button 
            onClick={() => setAspectRatio("16:9")}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              aspectRatio === "16:9" ? "bg-brand-cyan text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            16:9 Full
          </button>
        </div>

        <button
          onClick={() => setShowFaceBox(!showFaceBox)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
            showFaceBox 
              ? "bg-brand-pink/20 text-brand-pink border-brand-pink/40" 
              : "bg-surface-elevated text-gray-400 border-surface-border"
          }`}
          title="Toggle Speaker Face Tracking Bounding Box"
        >
          <ScanFace className="w-3.5 h-3.5" />
          <span>Face Track</span>
        </button>
      </div>

      {/* Smartphone Mockup Frame */}
      <div 
        className={`relative bg-black rounded-[42px] border-[10px] border-[#1e2230] shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-500 flex flex-col justify-between ${
          aspectRatio === "9:16" 
            ? "w-[330px] sm:w-[360px] h-[640px] sm:h-[680px]" 
            : aspectRatio === "1:1"
            ? "w-[360px] h-[360px] rounded-3xl border-4"
            : "w-full max-w-[480px] h-[270px] rounded-2xl border-4"
        }`}
      >
        {/* Dynamic Island / Speaker Notch (only on 9:16 phone mockup) */}
        {aspectRatio === "9:16" && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 bg-[#12141c] rounded-full z-40 flex items-center justify-center gap-2 border border-white/5">
            <div className="w-2 h-2 rounded-full bg-brand-cyan/80 animate-pulse" />
            <div className="w-2.5 h-2.5 rounded-full bg-black border border-white/10" />
          </div>
        )}

        {/* Video Canvas / Video Element */}
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-950">
          {videoSource ? (
            <video
              ref={videoRef}
              src={videoSource}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onClick={togglePlay}
              loop
              playsInline
              className={`w-full h-full cursor-pointer ${aspectRatio === "9:16" ? "object-cover scale-105" : "object-contain"}`}
            />
          ) : (
            <div 
              onClick={togglePlay}
              className="w-full h-full cursor-pointer relative bg-gradient-to-br from-[#0c0d14] via-[#151928] to-[#0c0d14] flex flex-col items-center justify-center text-center p-6 select-none"
            >
              {/* Animated decorative gradient orb */}
              <div className="absolute w-64 h-64 bg-brand-cyan/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />

              {/* Speaker silhouette visualization */}
              <div className="relative z-10 w-28 h-28 rounded-full border-2 border-brand-cyan/40 bg-surface-elevated/80 flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.25)]">
                <ScanFace className="w-14 h-14 text-brand-cyan" />
              </div>

              <div className="relative z-10 mt-6">
                <h4 className="text-sm font-bold text-white tracking-wide uppercase">
                  {clip ? clip.title : "Smart Re-Framing Preview"}
                </h4>
                <p className="text-xs text-brand-cyan/90 mt-1 font-medium">
                  {isPlaying ? "Rendering Live Captions..." : "Click to Play Preview"}
                </p>
              </div>
            </div>
          )}

          {/* AI Face Tracking Bounding Box Visualization */}
          {showFaceBox && (
            <div 
              className="absolute pointer-events-none z-30 transition-all duration-300 ease-out border-2 border-brand-pink/90 rounded-xl shadow-[0_0_15px_rgba(255,0,127,0.5)]"
              style={{
                top: "22%",
                left: `${38 + Math.sin(currentTime * 1.5) * 6}%`,
                width: "120px",
                height: "140px",
              }}
            >
              <div className="absolute -top-6 left-0 bg-brand-pink text-black font-extrabold text-[10px] uppercase px-1.5 py-0.5 rounded shadow">
                Speaker Face
              </div>
              <div className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 border-white" />
              <div className="absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2 border-white" />
            </div>
          )}

          {/* DYNAMIC ANIMATED KARAOKE CAPTIONS OVERLAY */}
          <div className="absolute bottom-28 left-4 right-4 z-30 text-center pointer-events-none">
            {clip?.suggested_headline && (
              <div className="inline-block bg-black/85 backdrop-blur-md px-3 py-1 rounded-lg border border-brand-cyan/60 text-brand-cyan text-xs font-black tracking-wide uppercase mb-3 shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
                {clip.suggested_headline}
              </div>
            )}

            <div className="bg-black/75 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 shadow-2xl max-w-[90%] mx-auto">
              <p className="text-base sm:text-lg font-black tracking-tight leading-snug uppercase">
                {currentWords.length > 0 ? (
                  currentWords.map((w, idx) => {
                    const isWordActive = activeWord?.word === w.word;
                    return (
                      <span
                        key={idx}
                        className={`inline-block mx-1 transition-all duration-150 ${
                          isWordActive
                            ? "text-yellow-300 scale-110 drop-shadow-[0_0_12px_rgba(253,224,71,0.9)] underline decoration-brand-cyan decoration-2"
                            : "text-white opacity-85"
                        }`}
                      >
                        {w.word}
                      </span>
                    );
                  })
                ) : (
                  fallbackWords.map((word, idx) => {
                    const isActive = idx === fallbackActiveIndex;
                    return (
                      <span
                        key={idx}
                        className={`inline-block mx-1 transition-all duration-150 ${
                          isActive
                            ? "text-yellow-300 scale-110 drop-shadow-[0_0_12px_rgba(253,224,71,0.9)] underline decoration-brand-cyan decoration-2"
                            : "text-white opacity-85"
                        }`}
                      >
                        {word}
                      </span>
                    );
                  })
                )}
              </p>
            </div>
          </div>

          {/* Simulated TikTok / Reels Social UI Overlay */}
          {aspectRatio === "9:16" && (
            <>
              {/* Right Action Bar */}
              <div className="absolute right-3 bottom-24 flex flex-col items-center gap-4 z-30 pointer-events-auto">
                <button 
                  onClick={() => setLiked(!liked)}
                  className="flex flex-col items-center text-white group"
                >
                  <div className={`p-2.5 rounded-full backdrop-blur-md transition-all ${
                    liked ? "bg-red-500/80 text-white scale-110" : "bg-black/40 text-white group-hover:bg-black/60"
                  }`}>
                    <Heart className={`w-5 h-5 ${liked ? "fill-white" : ""}`} />
                  </div>
                  <span className="text-[10px] font-bold mt-1 text-white drop-shadow">148.2K</span>
                </button>

                <div className="flex flex-col items-center text-white">
                  <div className="p-2.5 rounded-full bg-black/40 backdrop-blur-md">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[10px] font-bold mt-1 text-white drop-shadow">1,824</span>
                </div>

                <div className="flex flex-col items-center text-white">
                  <div className="p-2.5 rounded-full bg-black/40 backdrop-blur-md">
                    <Bookmark className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[10px] font-bold mt-1 text-white drop-shadow">38.9K</span>
                </div>

                <div className="flex flex-col items-center text-white">
                  <div className="p-2.5 rounded-full bg-black/40 backdrop-blur-md">
                    <Share2 className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[10px] font-bold mt-1 text-white drop-shadow">Share</span>
                </div>

                {/* Spinning Music Vinyl */}
                <div className="w-9 h-9 rounded-full bg-surface-elevated border-2 border-brand-cyan p-1 animate-spin duration-3000">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                    <Music className="w-3.5 h-3.5 text-brand-cyan" />
                  </div>
                </div>
              </div>

              {/* Bottom Creator Info Bar */}
              <div className="absolute left-4 bottom-14 z-30 max-w-[70%] text-left pointer-events-none">
                <h5 className="text-xs font-bold text-white drop-shadow flex items-center gap-1.5">
                  @aiclipper_pro
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan" />
                </h5>
                <p className="text-[11px] text-gray-200 drop-shadow line-clamp-1 mt-0.5">
                  {clip?.hashtags || "#viral #shorts #tiktokgrowth #contentstrategy"}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Custom Mini Scrubber / Controls at Bottom */}
        <div className="w-full bg-[#12141c]/95 border-t border-surface-border p-3 z-40 flex items-center gap-3">
          <button 
            onClick={togglePlay}
            className="p-1.5 rounded-lg bg-brand-cyan text-black hover:opacity-90 transition-opacity"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          </button>

          <input
            type="range"
            min={0}
            max={duration || 30}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 h-1.5 bg-surface-border rounded-lg appearance-none cursor-pointer accent-brand-cyan"
          />

          <span className="text-[10px] font-mono text-gray-400 shrink-0">
            {Math.floor(currentTime)}s / {Math.floor(duration)}s
          </span>

          <button 
            onClick={toggleMute}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
