from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .session import Base

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    source_type = Column(String(50), nullable=False)  # 'youtube', 'upload', 'sample'
    source_url = Column(Text, nullable=True)
    video_path = Column(Text, nullable=True)
    thumbnail_url = Column(Text, nullable=True)
    duration = Column(Integer, default=0)
    status = Column(String(50), default="pending", nullable=False)  # pending, processing, completed, failed
    current_stage = Column(String(50), default="queued")  # queued, downloading, transcribing, analyzing, face_tracking, rendering, completed, error
    progress = Column(Integer, default=0)
    error_message = Column(Text, nullable=True)
    metadata = Column(Text, default="{}")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    clips = relationship("Clip", back_populates="job", cascade="all, delete-orphan")
    transcripts = relationship("Transcript", back_populates="job", cascade="all, delete-orphan")

class Clip(Base):
    __tablename__ = "clips"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    start_time = Column(Float, nullable=False)
    end_time = Column(Float, nullable=False)
    duration = Column(Float, nullable=False)
    virality_score = Column(Integer, default=85, nullable=False)
    hook_rating = Column(Integer, default=85)
    pacing_rating = Column(Integer, default=85)
    retention_rating = Column(Integer, default=85)
    virality_reason = Column(Text, default="")
    transcript_snippet = Column(Text, default="")
    suggested_headline = Column(Text, default="")
    hashtags = Column(Text, default="")
    video_url = Column(Text, nullable=True)
    aspect_ratio = Column(String(20), default="9:16")
    caption_style = Column(String(50), default="karaoke_neon")
    rendered = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    job = relationship("Job", back_populates="clips")

class Transcript(Base):
    __tablename__ = "transcripts"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    full_text = Column(Text, nullable=False)
    language = Column(String(10), default="en")
    word_timestamps = Column(Text, default="[]")  # JSON encoded list of word objects
    created_at = Column(DateTime, default=datetime.utcnow)

    job = relationship("Job", back_populates="transcripts")
