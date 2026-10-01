import { pgTable, serial, text, timestamp, integer, real } from "drizzle-orm/pg-core";

export const jobs = pgTable("jobs", {
  id: serial().primaryKey(),
  title: text().notNull(),
  sourceType: text("source_type").notNull(), // 'youtube', 'upload', 'sample'
  sourceUrl: text("source_url"),
  videoPath: text("video_path"),
  thumbnailUrl: text("thumbnail_url"),
  duration: integer().default(0), // duration in seconds
  status: text().notNull().default("pending"), // 'pending', 'processing', 'completed', 'failed'
  currentStage: text("current_stage").default("queued"), // 'queued', 'downloading', 'transcribing', 'analyzing', 'face_tracking', 'rendering', 'completed', 'error'
  progress: integer().default(0), // 0 - 100
  errorMessage: text("error_message"),
  metadata: text().default("{}"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const clips = pgTable("clips", {
  id: serial().primaryKey(),
  jobId: integer("job_id").notNull().references(() => jobs.id),
  title: text().notNull(),
  startTime: real("start_time").notNull(), // seconds with decimals (e.g. 12.5)
  endTime: real("end_time").notNull(), // seconds with decimals (e.g. 42.8)
  duration: real().notNull(), // seconds (e.g. 30.3)
  viralityScore: integer("virality_score").notNull().default(85), // 0 - 100
  hookRating: integer("hook_rating").default(85), // 0 - 100
  pacingRating: integer("pacing_rating").default(85), // 0 - 100
  retentionRating: integer("retention_rating").default(85), // 0 - 100
  viralityReason: text("virality_reason").default(""),
  transcriptSnippet: text("transcript_snippet").default(""),
  suggestedHeadline: text("suggested_headline").default(""),
  hashtags: text().default(""),
  videoUrl: text("video_url"),
  aspectRatio: text("aspect_ratio").default("9:16"),
  captionStyle: text("caption_style").default("karaoke_neon"),
  rendered: integer().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const transcripts = pgTable("transcripts", {
  id: serial().primaryKey(),
  jobId: integer("job_id").notNull().references(() => jobs.id),
  fullText: text("full_text").notNull(),
  language: text().default("en"),
  wordTimestamps: text("word_timestamps").default("[]"), // JSON stringified array of words with start/end
  createdAt: timestamp("created_at").defaultNow(),
});
