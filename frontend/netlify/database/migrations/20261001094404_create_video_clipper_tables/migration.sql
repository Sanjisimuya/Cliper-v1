CREATE TABLE "clips" (
	"id" serial PRIMARY KEY,
	"job_id" integer NOT NULL,
	"title" text NOT NULL,
	"start_time" real NOT NULL,
	"end_time" real NOT NULL,
	"duration" real NOT NULL,
	"virality_score" integer DEFAULT 85 NOT NULL,
	"hook_rating" integer DEFAULT 85,
	"pacing_rating" integer DEFAULT 85,
	"retention_rating" integer DEFAULT 85,
	"virality_reason" text DEFAULT '',
	"transcript_snippet" text DEFAULT '',
	"suggested_headline" text DEFAULT '',
	"hashtags" text DEFAULT '',
	"video_url" text,
	"aspect_ratio" text DEFAULT '9:16',
	"caption_style" text DEFAULT 'karaoke_neon',
	"rendered" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" serial PRIMARY KEY,
	"title" text NOT NULL,
	"source_type" text NOT NULL,
	"source_url" text,
	"video_path" text,
	"thumbnail_url" text,
	"duration" integer DEFAULT 0,
	"status" text DEFAULT 'pending' NOT NULL,
	"current_stage" text DEFAULT 'queued',
	"progress" integer DEFAULT 0,
	"error_message" text,
	"metadata" text DEFAULT '{}',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "transcripts" (
	"id" serial PRIMARY KEY,
	"job_id" integer NOT NULL,
	"full_text" text NOT NULL,
	"language" text DEFAULT 'en',
	"word_timestamps" text DEFAULT '[]',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "clips" ADD CONSTRAINT "clips_job_id_jobs_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id");--> statement-breakpoint
ALTER TABLE "transcripts" ADD CONSTRAINT "transcripts_job_id_jobs_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id");