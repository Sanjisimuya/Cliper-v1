"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Sparkles, 
  Video, 
  Layers, 
  Download, 
  RotateCcw, 
  Clock, 
  ExternalLink,
  Flame,
  FileText
} from "lucide-react";
import ProgressBar from "@/components/ProgressBar";
import ClipCard from "@/components/ClipCard";
import VideoPlayer from "@/components/VideoPlayer";
import { fetchJobDetails, JobResponse, ClipItem } from "@/lib/api";

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;

  const [data, setData] = useState<JobResponse | null>(null);
  const [selectedClip, setSelectedClip] = useState<ClipItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Poll for job updates while processing
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const loadData = async () => {
      try {
        const res = await fetchJobDetails(jobId);
        setData(res);
        if (res.clips && res.clips.length > 0 && !selectedClip) {
          setSelectedClip(res.clips[0]);
        }
        setLoading(false);

        // Stop polling once completed or failed
        if (res.job.status === "completed" || res.job.status === "failed") {
          clearInterval(interval);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load job details");
        setLoading(false);
      }
    };

    loadData();
    interval = setInterval(loadData, 2500);

    return () => clearInterval(interval);
  }, [jobId]);

  // Keep selected clip updated if clip list changes
  useEffect(() => {
    if (data?.clips && data.clips.length > 0) {
      if (!selectedClip || !data.clips.find(c => c.id === selectedClip.id)) {
        setSelectedClip(data.clips[0]);
      }
    }
  }, [data?.clips]);

  if (loading && !data) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-12 h-12 rounded-2xl bg-brand-cyan/20 border border-brand-cyan/40 text-brand-cyan flex items-center justify-center mb-4 animate-spin">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-white">Connecting to Clipper Engine...</h3>
        <p className="text-xs text-gray-400 mt-1">Retrieving pipeline status & clips</p>
      </div>
    );
  }

  const job = data?.job;
  const clips = data?.clips || [];
  const transcript = data?.transcript;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2.5 rounded-xl bg-surface border border-surface-border hover:border-brand-cyan/40 text-gray-300 hover:text-white transition-all flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-cyan">
                Project #{jobId}
              </span>
              <span className="text-gray-600">•</span>
              <span className="text-xs text-gray-400 capitalize">{job?.source_type || "Video"}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-0.5 truncate max-w-xl">
              {job?.title || "AI Video Repurposing Project"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {job?.source_url && (
            <a
              href={job.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-surface border border-surface-border hover:border-surface-highlight text-xs font-semibold text-gray-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Original Source</span>
            </a>
          )}
          <Link
            href="/"
            className="px-4 py-2 rounded-xl bg-brand-cyan text-black text-xs font-extrabold tracking-wide uppercase hover:opacity-90 shadow-lg shadow-brand-cyan/20 transition-all flex items-center gap-1.5"
          >
            <Video className="w-3.5 h-3.5 fill-current" />
            <span>New Video</span>
          </Link>
        </div>
      </div>

      {/* Real-time Multi-stage Progress Pipeline */}
      <div className="mb-8">
        <ProgressBar
          stage={job?.current_stage || "queued"}
          progress={job?.progress || 10}
          errorMessage={job?.error_message}
        />
      </div>

      {/* Main Studio View: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Viral Clip Candidates (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-surface-border">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-brand-amber animate-pulse" />
              <h3 className="text-lg font-bold text-white">
                Identified Viral Segments
              </h3>
              <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30">
                {clips.length} Clips
              </span>
            </div>
            <span className="text-xs text-gray-400">Ranked by Virality Score</span>
          </div>

          {clips.length === 0 ? (
            <div className="p-12 rounded-2xl bg-surface border border-surface-border text-center">
              <div className="w-12 h-12 rounded-xl bg-surface-elevated text-brand-cyan flex items-center justify-center mx-auto mb-3 animate-pulse">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">AI Analyzing Speech Transcripts...</h4>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                Our language models and face tracking engines are isolating high-retention hooks. Clips will populate automatically.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {clips.map((clip) => (
                <ClipCard
                  key={clip.id}
                  clip={clip}
                  isSelected={selectedClip?.id === clip.id}
                  onSelect={(c) => setSelectedClip(c)}
                />
              ))}
            </div>
          )}

          {/* Transcript Collapsible Drawer */}
          {transcript && transcript.text && (
            <div className="mt-8 p-5 rounded-2xl bg-surface border border-surface-border">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-brand-cyan" />
                <h4 className="text-sm font-bold text-white">Full Speech Transcript</h4>
                <span className="text-[10px] uppercase font-semibold text-gray-400 bg-surface-elevated px-2 py-0.5 rounded">
                  {transcript.language}
                </span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed max-h-48 overflow-y-auto pr-2 bg-surface-elevated/40 p-3 rounded-xl border border-surface-border/60">
                {transcript.text}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Interactive 9:16 Smartphone Mockup Player (5 cols) */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="bg-surface border border-surface-border rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-emerald animate-pulse" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Live 9:16 Studio Preview
                </h3>
              </div>
              {selectedClip && (
                <span className="text-xs font-bold text-brand-cyan">
                  Score: {selectedClip.virality_score}/100
                </span>
              )}
            </div>

            <VideoPlayer
              clip={selectedClip}
              videoSource={selectedClip?.video_url}
              wordTimestamps={transcript?.word_timestamps || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
