import type { Metadata } from "next";
import "./globals.css";
import { Scissors, Sparkles, Video } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Video Clipper | Transform Long Videos into Viral 9:16 Shorts",
  description: "AI-powered video clipping platform with speaker face tracking, virality scoring, and dynamic animated captions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-gray-100 min-h-screen antialiased flex flex-col font-sans selection:bg-brand-cyan selection:text-black">
        {/* Top Studio Navbar */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-surface-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-cyan to-brand-emerald flex items-center justify-center text-black font-black shadow-lg shadow-brand-cyan/20 group-hover:scale-105 transition-transform">
                <Scissors className="w-5 h-5 -rotate-45" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-white tracking-tight flex items-center gap-1.5">
                  CLIPPER<span className="text-brand-cyan">.AI</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30">
                    PRO
                  </span>
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-elevated/70 border border-surface-border text-xs text-gray-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>AI Face Tracking Engine Active</span>
              </div>

              <Link
                href="/"
                className="px-4 py-2 rounded-xl bg-surface-elevated hover:bg-surface-highlight border border-surface-border text-xs font-bold text-white transition-all flex items-center gap-1.5"
              >
                <Video className="w-3.5 h-3.5 text-brand-cyan" />
                <span>New Project</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Viewport Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Global Studio Footer */}
        <footer className="border-t border-surface-border/80 bg-surface/40 py-8 px-4 text-center text-xs text-gray-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-cyan" />
              <span className="text-gray-400 font-medium">Full-Stack AI Video Clipper Monorepo • MVP to Production</span>
            </div>
            <p className="text-gray-500">
              Speaker Face Tracking (16:9 → 9:16) • LLM Virality Scoring • Dynamic Word-Level Captions
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
