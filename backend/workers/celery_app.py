from celery import Celery
from config import settings

celery = Celery(
    "clipper_tasks",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=["workers.tasks"]
)

celery.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=1800,  # 30 minutes max per task
)
