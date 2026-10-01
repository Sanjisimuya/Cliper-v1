import os
import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, BackgroundTasks
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel, HttpUrl
from sqlalchemy.orm import Session
from database.session import get_db
from database.models import Job, Clip, Transcript
from services.downloader import downloader_service
from config import settings

router = APIRouter(prefix="/api", tags=["jobs"])

class YouTubeJobRequest(BaseModel):
    url: str
    title: Optional[str] = None
    min_virality: Optional[int] = 75
    caption_style: Optional[str] = "karaoke_neon"

class JobResponse(BaseModel):
    id: int
    title: str
    source_type: str
    source_url: Optional[str]
    duration: int
    status: str
    current_stage: str
    progress: int
    thumbnail_url: Optional[str]
    error_message: Optional[str]

    class Config:
        from_attributes = True

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "ai-video-clipper-backend",
        "version": "1.0.0"
    }

@router.get("/jobs", response_model=List[JobResponse])
def list_jobs(db: Session = Depends(get_db)):
    jobs = db.query(Job).order_by(Job.created_at.desc()).limit(50).all()
    return jobs

@router.post("/jobs/youtube")
def create_youtube_job(
    payload: YouTubeJobRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    url = payload.url.strip()
    if not url.startswith("http"):
        raise HTTPException(status_code=400, detail="Invalid YouTube URL")

    # Initial probe or title extraction
    job = Job(
        title=payload.title or "Ingesting YouTube Video...",
        source_type="youtube",
        source_url=url,
        status="pending",
        current_stage="queued",
        progress=5,
        metadata=json.dumps({
            "caption_style": payload.caption_style,
            "min_virality": payload.min_virality
        })
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    # Dispatch to Celery or background task
    try:
        from workers.tasks import process_video_pipeline
        process_video_pipeline.delay(job.id)
    except Exception:
        # Fallback to local background runner if Celery/Redis is not running locally
        from workers.tasks import process_video_pipeline
        background_tasks.add_task(process_video_pipeline, job.id)

    return {"job_id": job.id, "status": "queued", "message": "Video ingestion started"}

@router.post("/jobs/upload")
async def create_upload_job(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    title: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    content = await file.read()
    if len(content) > settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=413, detail=f"File exceeds maximum size of {settings.MAX_UPLOAD_SIZE_MB}MB")

    saved_info = downloader_service.save_upload(content, file.filename)

    job = Job(
        title=title or saved_info["title"],
        source_type="upload",
        video_path=saved_info["video_path"],
        duration=saved_info["duration"],
        thumbnail_url=saved_info["thumbnail_url"],
        status="pending",
        current_stage="queued",
        progress=10
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    try:
        from workers.tasks import process_video_pipeline
        process_video_pipeline.delay(job.id)
    except Exception:
        from workers.tasks import process_video_pipeline
        background_tasks.add_task(process_video_pipeline, job.id)

    return {"job_id": job.id, "status": "queued", "message": "Uploaded video processing started"}

@router.get("/jobs/{job_id}")
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    clips = db.query(Clip).filter(Clip.job_id == job_id).order_by(Clip.virality_score.desc()).all()
    transcript = db.query(Transcript).filter(Transcript.job_id == job_id).first()

    return {
        "job": {
            "id": job.id,
            "title": job.title,
            "source_type": job.source_type,
            "source_url": job.source_url,
            "video_path": job.video_path,
            "thumbnail_url": job.thumbnail_url,
            "duration": job.duration,
            "status": job.status,
            "current_stage": job.current_stage,
            "progress": job.progress,
            "error_message": job.error_message,
            "created_at": job.created_at.isoformat() if job.created_at else None
        },
        "clips": [
            {
                "id": c.id,
                "title": c.title,
                "start_time": c.start_time,
                "end_time": c.end_time,
                "duration": c.duration,
                "virality_score": c.virality_score,
                "hook_rating": c.hook_rating,
                "pacing_rating": c.pacing_rating,
                "retention_rating": c.retention_rating,
                "virality_reason": c.virality_reason,
                "transcript_snippet": c.transcript_snippet,
                "suggested_headline": c.suggested_headline,
                "hashtags": c.hashtags,
                "video_url": c.video_url,
                "aspect_ratio": c.aspect_ratio,
                "caption_style": c.caption_style
            }
            for c in clips
        ],
        "transcript": {
            "text": transcript.full_text if transcript else "",
            "language": transcript.language if transcript else "en",
            "word_timestamps": json.loads(transcript.word_timestamps) if transcript and transcript.word_timestamps else []
        } if transcript else None
    }

@router.get("/storage/clips/{filename}")
def serve_clip(filename: str):
    file_path = os.path.join(settings.STORAGE_DIR, "clips", filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Clip file not found")
    return FileResponse(file_path, media_type="video/mp4", filename=filename)

@router.get("/storage/uploads/{filename}")
def serve_upload(filename: str):
    file_path = os.path.join(settings.STORAGE_DIR, "uploads", filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Uploaded file not found")
    media_type = "image/jpeg" if filename.endswith((".jpg", ".jpeg")) else "video/mp4"
    return FileResponse(file_path, media_type=media_type)
