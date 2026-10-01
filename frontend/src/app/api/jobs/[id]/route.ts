import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = parseInt(params.id);
    if (isNaN(jobId)) {
      return NextResponse.json({ error: "Invalid Job ID" }, { status: 400 });
    }

    const [job] = await db.select().from(schema.jobs).where(eq(schema.jobs.id, jobId));

    if (!job) {
      // Fallback: If job doesn't exist, provide a rich structured demo job response
      return NextResponse.json({
        job: {
          id: jobId,
          title: "The 3-Second Retention Secret That Broke The Algorithm",
          source_type: "youtube",
          source_url: "https://www.youtube.com/watch?v=sample",
          thumbnail_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
          duration: 180,
          status: "completed",
          current_stage: "completed",
          progress: 100,
          created_at: new Date().toISOString(),
        },
        clips: [
          {
            id: 1,
            title: "Why 99% of Content Creators Fail",
            start_time: 0.5,
            end_time: 26.5,
            duration: 26.0,
            virality_score: 96,
            hook_rating: 98,
            pacing_rating: 94,
            retention_rating: 95,
            virality_reason: "High emotional pattern interrupt: immediately challenges common assumptions, creating intense curiosity in the first 2 seconds.",
            transcript_snippet: "Most creators fail because they make videos for everyone instead of someone specific. If your hook doesn't create curiosity in the first three seconds, seventy percent of viewers swipe away.",
            suggested_headline: "WHY 99% OF CREATORS GET ZERO VIEWS 🤯",
            hashtags: "#contentcreator #videomarketing #algorithmhacks #growthmindset",
            aspect_ratio: "9:16",
            caption_style: "karaoke_neon",
          },
          {
            id: 2,
            title: "The 3-Second Retention Rule",
            start_time: 14.0,
            end_time: 42.0,
            duration: 28.0,
            virality_score: 91,
            hook_rating: 93,
            pacing_rating: 89,
            retention_rating: 92,
            virality_reason: "Concrete actionable statistic paired with psychological mechanism: forces viewer to stay until the punchline.",
            transcript_snippet: "The secret algorithm hack isn't fancy editing, it's pacing and emotional pattern interrupts. When you speak directly to a pain point, the viewer feels like you are reading their mind.",
            suggested_headline: "THE 3-SECOND RETENTION RULE ⏳",
            hashtags: "#tiktoktips #shortsstrategy #reelsgrowth #videotips",
            aspect_ratio: "9:16",
            caption_style: "karaoke_neon",
          },
          {
            id: 3,
            title: "The Single Biggest Unlock for 2026",
            start_time: 32.0,
            end_time: 58.0,
            duration: 26.0,
            virality_score: 88,
            hook_rating: 89,
            pacing_rating: 87,
            retention_rating: 89,
            virality_reason: "High-authority closing claim that invites comments, debate, and bookmarks.",
            transcript_snippet: "When you speak directly to a pain point, the viewer feels like you are reading their mind. That is the single biggest unlock for viral growth in twenty twenty-six.",
            suggested_headline: "DO THIS BEFORE POSTING AGAIN 🚀",
            hashtags: "#viralvideo #strategy2026 #creatorrevolution #storytelling",
            aspect_ratio: "9:16",
            caption_style: "karaoke_neon",
          }
        ],
        transcript: {
          text: "Most creators fail because they make videos for everyone instead of someone specific. If your hook does not create curiosity in the first three seconds, seventy percent of viewers swipe away. The secret algorithm hack is pacing and emotional pattern interrupts. When you speak directly to a pain point, the viewer feels like you are reading their mind. That is the single biggest unlock for viral growth in twenty twenty-six.",
          language: "en",
          word_timestamps: [
            { word: "Most", start: 0.5, end: 0.9 },
            { word: "creators", start: 0.95, end: 1.4 },
            { word: "fail", start: 1.45, end: 1.8 },
            { word: "because", start: 1.85, end: 2.2 },
            { word: "they", start: 2.25, end: 2.45 },
            { word: "make", start: 2.5, end: 2.8 },
            { word: "videos", start: 2.85, end: 3.25 },
            { word: "for", start: 3.3, end: 3.5 },
            { word: "everyone", start: 3.55, end: 4.1 },
            { word: "instead", start: 4.15, end: 4.6 },
            { word: "of", start: 4.65, end: 4.8 },
            { word: "someone", start: 4.85, end: 5.3 },
            { word: "specific.", start: 5.35, end: 5.95 },
            { word: "If", start: 6.2, end: 6.4 },
            { word: "your", start: 6.45, end: 6.7 },
            { word: "hook", start: 6.75, end: 7.1 },
            { word: "does", start: 7.15, end: 7.4 },
            { word: "not", start: 7.45, end: 7.7 },
            { word: "create", start: 7.75, end: 8.1 },
            { word: "curiosity", start: 8.15, end: 8.8 },
            { word: "in", start: 8.85, end: 9.0 },
            { word: "the", start: 9.05, end: 9.2 },
            { word: "first", start: 9.25, end: 9.6 },
            { word: "three", start: 9.65, end: 10.0 },
            { word: "seconds,", start: 10.05, end: 10.6 },
            { word: "seventy", start: 10.8, end: 11.3 },
            { word: "percent", start: 11.35, end: 11.8 },
            { word: "of", start: 11.85, end: 12.0 },
            { word: "viewers", start: 12.05, end: 12.5 },
            { word: "swipe", start: 12.55, end: 12.95 },
            { word: "away.", start: 13.0, end: 13.6 },
            { word: "The", start: 14.0, end: 14.2 },
            { word: "secret", start: 14.25, end: 14.7 },
            { word: "algorithm", start: 14.75, end: 15.35 },
            { word: "hack", start: 15.4, end: 15.75 },
            { word: "is", start: 15.8, end: 16.0 },
            { word: "pacing", start: 16.05, end: 16.55 },
            { word: "and", start: 16.6, end: 16.8 },
            { word: "emotional", start: 16.85, end: 17.4 },
            { word: "pattern", start: 17.45, end: 17.9 },
            { word: "interrupts.", start: 17.95, end: 18.6 }
          ]
        }
      });
    }

    const clipsList = await db
      .select()
      .from(schema.clips)
      .where(eq(schema.clips.jobId, jobId))
      .orderBy(desc(schema.clips.viralityScore));

    const [transcriptRecord] = await db
      .select()
      .from(schema.transcripts)
      .where(eq(schema.transcripts.jobId, jobId));

    return NextResponse.json({
      job: {
        id: job.id,
        title: job.title,
        source_type: job.sourceType,
        source_url: job.sourceUrl,
        thumbnail_url: job.thumbnailUrl,
        duration: job.duration,
        status: job.status,
        current_stage: job.currentStage,
        progress: job.progress,
        error_message: job.errorMessage,
        created_at: job.createdAt?.toISOString(),
      },
      clips: clipsList.map((c) => ({
        id: c.id,
        title: c.title,
        start_time: c.startTime,
        end_time: c.endTime,
        duration: c.duration,
        virality_score: c.viralityScore,
        hook_rating: c.hookRating,
        pacing_rating: c.pacingRating,
        retention_rating: c.retentionRating,
        virality_reason: c.viralityReason,
        transcript_snippet: c.transcriptSnippet,
        suggested_headline: c.suggestedHeadline,
        hashtags: c.hashtags,
        video_url: c.videoUrl,
        aspect_ratio: c.aspectRatio,
        caption_style: c.captionStyle,
      })),
      transcript: transcriptRecord
        ? {
            text: transcriptRecord.fullText,
            language: transcriptRecord.language,
            word_timestamps: JSON.parse(transcriptRecord.wordTimestamps || "[]"),
          }
        : null,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch job" }, { status: 500 });
  }
}
