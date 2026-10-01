import json
import traceback
from celery import shared_task
from database.session import SessionLocal
from database.models import Job, Clip, Transcript
from services.downloader import downloader_service
from services.transcriber import transcriber_service
from services.virality_analyzer import virality_analyzer_service
from services.face_tracker import face_tracker_service
from services.video_renderer import video_renderer_service

@shared_task(bind=True, name="workers.tasks.process_video_pipeline")
def process_video_pipeline(self, job_id: int):
    """
    Master end-to-end video clipping pipeline:
    1. Ingestion (YouTube or Upload)
    2. Audio Extraction & Word-level Transcription
    3. LLM Virality Analysis & High-Engagement Scoring
    4. Speaker Face Tracking & 9:16 Smooth Crop Calculation
    5. Dynamic Animated Caption Burning & Rendering
    """
    db = SessionLocal()
    try:
        job = db.query(Job).filter(Job.id == job_id).first()
        if not job:
            return {"error": "Job not found"}

        # STAGE 1: Download / Ingestion
        job.status = "processing"
        job.current_stage = "downloading"
        job.progress = 15
        db.commit()

        video_path = job.video_path
        if job.source_type == "youtube" and (not video_path or not video_path.endswith(".mp4")):
            download_res = downloader_service.download_youtube(job.source_url)
            job.title = job.title or download_res.get("title", "YouTube Video")
            job.video_path = download_res.get("video_path")
            job.duration = download_res.get("duration", 180)
            job.thumbnail_url = download_res.get("thumbnail_url")
            video_path = job.video_path
            db.commit()

        # STAGE 2: Transcription
        job.current_stage = "transcribing"
        job.progress = 35
        db.commit()

        transcript_data = transcriber_service.transcribe(video_path)
        words = transcript_data.get("words", [])
        
        # Save transcript to DB
        transcript_record = Transcript(
            job_id=job.id,
            full_text=transcript_data.get("text", ""),
            language=transcript_data.get("language", "en"),
            word_timestamps=json.dumps(words)
        )
        db.add(transcript_record)
        db.commit()

        # STAGE 3: AI Virality Analysis
        job.current_stage = "analyzing"
        job.progress = 55
        db.commit()

        clip_candidates = virality_analyzer_service.analyze(transcript_data, job.duration or 180)

        # STAGE 4 & 5: Face Tracking & Video Rendering per Clip
        job.current_stage = "rendering"
        job.progress = 75
        db.commit()

        rendered_clips = []
        for index, candidate in enumerate(clip_candidates):
            start_t = candidate["start_time"]
            end_t = candidate["end_time"]

            # Compute Face Tracking Trajectory
            crop_trajectory = face_tracker_service.track_faces_and_generate_crop_trajectory(
                video_path=video_path,
                start_time=start_t,
                end_time=end_t,
                target_aspect_ratio=9 / 16
            )

            # Render 9:16 Vertical Clip with burned dynamic captions
            rendered_video_path = video_renderer_service.render_vertical_clip(
                video_path=video_path,
                start_time=start_t,
                end_time=end_t,
                crop_trajectory=crop_trajectory,
                word_timestamps=words,
                caption_style="karaoke_neon",
                output_name=f"job_{job.id}_clip_{index + 1}"
            )

            clip_record = Clip(
                job_id=job.id,
                title=candidate.get("title", f"Clip {index + 1}"),
                start_time=start_t,
                end_time=end_t,
                duration=candidate.get("duration", end_t - start_t),
                virality_score=candidate.get("virality_score", 90),
                hook_rating=candidate.get("hook_rating", 90),
                pacing_rating=candidate.get("pacing_rating", 88),
                retention_rating=candidate.get("retention_rating", 90),
                virality_reason=candidate.get("virality_reason", ""),
                transcript_snippet=candidate.get("transcript_snippet", ""),
                suggested_headline=candidate.get("suggested_headline", ""),
                hashtags=candidate.get("hashtags", ""),
                video_url=f"/api/storage/clips/{rendered_video_path.split('/')[-1]}",
                aspect_ratio="9:16",
                caption_style="karaoke_neon",
                rendered=1
            )
            db.add(clip_record)
            rendered_clips.append(clip_record)

        db.commit()

        # FINALIZE JOB
        job.status = "completed"
        job.current_stage = "completed"
        job.progress = 100
        db.commit()

        return {
            "status": "success",
            "job_id": job.id,
            "clips_count": len(rendered_clips)
        }

    except Exception as e:
        db.rollback()
        if job:
            job.status = "failed"
            job.current_stage = "error"
            job.error_message = str(e)
            db.commit()
        return {"status": "failed", "error": str(e), "traceback": traceback.format_exc()}
    finally:
        db.close()
