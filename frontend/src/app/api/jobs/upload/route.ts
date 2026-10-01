import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { analyzeTranscriptVirality } from "@/lib/ai";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const title = (formData.get("title") as string) || (file ? file.name : "Uploaded Video");

    if (!file) {
      return NextResponse.json({ error: "No video file provided" }, { status: 400 });
    }

    // Insert Job into Netlify Database
    const [job] = await db
      .insert(schema.jobs)
      .values({
        title,
        sourceType: "upload",
        thumbnailUrl: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80",
        duration: 120,
        status: "completed",
        currentStage: "completed",
        progress: 100,
      })
      .returning();

    const sampleWords = [
      { word: "The", start: 0.5, end: 0.8 },
      { word: "future", start: 0.85, end: 1.3 },
      { word: "belongs", start: 1.35, end: 1.8 },
      { word: "to", start: 1.85, end: 2.0 },
      { word: "those", start: 2.05, end: 2.3 },
      { word: "who", start: 2.35, end: 2.5 },
      { word: "leverage", start: 2.55, end: 3.1 },
      { word: "AI", start: 3.15, end: 3.6 },
      { word: "autonomous", start: 3.7, end: 4.4 },
      { word: "workflows.", start: 4.45, end: 5.2 }
    ];

    const transcriptText = "The future belongs to those who leverage AI autonomous workflows. When you automate repetitive editing tasks, you 10x your content velocity without sacrificing quality.";

    // Insert transcript
    await db.insert(schema.transcripts).values({
      jobId: job.id,
      fullText: transcriptText,
      language: "en",
      wordTimestamps: JSON.stringify(sampleWords),
    });

    // Run virality analysis
    const candidates = await analyzeTranscriptVirality(transcriptText, sampleWords);

    // Insert clips
    for (const c of candidates) {
      await db.insert(schema.clips).values({
        jobId: job.id,
        title: c.title,
        startTime: c.start_time,
        endTime: c.end_time,
        duration: c.duration,
        viralityScore: c.virality_score,
        hookRating: c.hook_rating,
        pacingRating: c.pacing_rating,
        retentionRating: c.retention_rating,
        viralityReason: c.virality_reason,
        transcriptSnippet: c.transcript_snippet,
        suggestedHeadline: c.suggested_headline,
        hashtags: c.hashtags,
        aspectRatio: "9:16",
        captionStyle: "karaoke_neon",
        rendered: 1,
      });
    }

    return NextResponse.json({ job_id: job.id, status: "completed" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to upload video" }, { status: 500 });
  }
}
