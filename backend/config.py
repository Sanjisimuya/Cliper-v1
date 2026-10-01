import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # App
    PROJECT_NAME: str = "AI Video Clipper"
    DEBUG: bool = False
    
    # Database & Redis
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://clipper:clipper_secret@localhost:5432/clipper_db")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # AI Providers
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    LLM_MODEL: str = os.getenv("LLM_MODEL", "gpt-4o")
    WHISPER_MODEL: str = os.getenv("WHISPER_MODEL", "base")
    
    # Virality Settings
    VIRALITY_MIN_SCORE: int = int(os.getenv("VIRALITY_MIN_SCORE", "75"))
    MIN_CLIP_DURATION: int = 15  # seconds
    MAX_CLIP_DURATION: int = 60  # seconds
    
    # Storage
    STORAGE_DIR: str = os.getenv("STORAGE_DIR", "/tmp/clipper_storage")
    MAX_UPLOAD_SIZE_MB: int = int(os.getenv("MAX_UPLOAD_SIZE_MB", "500"))
    
    # CORS
    ALLOWED_ORIGINS: str = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000,*")
    
    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()

# Ensure directories exist
os.makedirs(os.path.join(settings.STORAGE_DIR, "uploads"), exist_ok=True)
os.makedirs(os.path.join(settings.STORAGE_DIR, "processed"), exist_ok=True)
os.makedirs(os.path.join(settings.STORAGE_DIR, "clips"), exist_ok=True)
os.makedirs(os.path.join(settings.STORAGE_DIR, "temp"), exist_ok=True)
