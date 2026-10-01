# AI Video Clipper Pro

A complete, production-grade autonomous AI Video Repurposing web application that ingests long-form video content (via YouTube URL or direct file upload), extracts audio, transcribes speech with word-level precision, leverages LLMs to identify high-engagement segments based on virality scoring, re-frames horizontal 16:9 video to vertical 9:16 format using speaker face tracking, burns dynamic TikTok/Reels-style animated captions, and serves rendered MP4 clips via a Next.js web dashboard.

---

## Architecture Overview

```text
ai-video-clipper/
├── docker-compose.yml          # Multi-container orchestration (FastAPI, Celery, Redis, Postgres, Next.js)
├── .env.example                # Configuration blueprint
├── netlify.toml                # Netlify deployment configuration
├── db/                         # Netlify Database schema & Drizzle client
│   ├── schema.ts
│   └── index.ts
├── netlify/database/migrations # Drizzle SQL migrations
├── backend/                    # Python FastAPI & Celery Computer Vision Services
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── main.py                 # FastAPI application
│   ├── config.py               # Pydantic settings
│   ├── database/               # SQLAlchemy models & session
│   │   ├── session.py
│   │   └── models.py
│   ├── workers/                # Celery distributed task pipeline
│   │   ├── celery_app.py
│   │   └── tasks.py
│   ├── services/
│   │   ├── downloader.py       # YouTube & upload stream ingestion (yt-dlp)
│   │   ├── transcriber.py      # Word-level speech transcription (Whisper)
│   │   ├── virality_analyzer.py# LLM virality scoring & hook detection
│   │   ├── face_tracker.py     # MediaPipe/OpenCV speaker face tracking (16:9 -> 9:16)
│   │   └── video_renderer.py   # FFmpeg vertical re-framing & karaoke captions
│   └── api/
│       └── routes.py           # REST endpoints
└── frontend/                   # Next.js Creator Studio Web Application
    ├── Dockerfile
    ├── package.json
    ├── tailwind.config.js
    └── src/
        ├── app/
        │   ├── page.tsx                    # Landing page & ingestion dropzone
        │   ├── dashboard/[jobId]/page.tsx  # Studio workspace & clip editor
        │   └── api/                        # Serverless Netlify Database & AI routes
        ├── components/
        │   ├── VideoUploader.tsx           # Dual YouTube URL & drag-and-drop uploader
        │   ├── ProgressBar.tsx             # Multi-stage animated pipeline tracker
        │   ├── ClipCard.tsx                # Virality score cards with social previews
        │   └── VideoPlayer.tsx             # 9:16 mobile frame with karaoke captions
        └── lib/
            ├── api.ts                      # Client API interface
            ├── ai.ts                       # Netlify AI Gateway virality analyzer
            └── db.ts                       # Drizzle ORM Netlify Database connection
```

---

## Key Features

1. **Speaker Face Tracking & Dynamic Re-Framing (16:9 → 9:16)**
   - MediaPipe and OpenCV face detection tracks active speakers frame-by-frame.
   - Exponential moving average smoothing eliminates camera jitter and generates smooth cinematic pan-and-scan camera trajectories.

2. **LLM Virality Scoring Engine**
   - Analyzes full transcripts with word-level timestamps.
   - Evaluates hook power (0-100), emotional tension, pacing, and retention curves to isolate the 3 to 5 highest-performing clips.
   - Integrates with Netlify AI Gateway (Gemini 2.5 Flash, OpenAI GPT-4o) with zero configuration.

3. **Dynamic Kinetic Karaoke Captions**
   - Word-level synchronization with scale bounce and drop-shadow styling.
   - Multiple aesthetic themes: Karaoke Neon, Cyber Cyan Glow, Sunset Pink Wave, Bold Impact.
   - Burned directly into rendered MP4 video via ASS subtitle filters.

4. **Interactive 9:16 Mobile Studio Player**
   - High-fidelity smartphone mockup with TikTok/Reels social overlays.
   - Real-time animated caption preview synchronized to video timestamp.
   - Aspect ratio toggle (9:16 Reel, 1:1 Square, 16:9 Full).
   - Speaker face tracking bounding box overlay toggle.

5. **Netlify Native Persistence**
   - Managed Postgres storage with `@netlify/database` and Drizzle ORM.
   - Automatic migrations generated into `netlify/database/migrations/`.

---

## Local Development (Docker Compose)

To launch the full distributed system locally:

```bash
# 1. Clone repository and copy environment config
cp .env.example .env

# 2. Launch multi-service stack with Docker Compose
docker compose up --build
```

Access the services:
- **Next.js Web Dashboard:** `http://localhost:3000`
- **FastAPI API & OpenAPI Docs:** `http://localhost:8000/docs`
- **Postgres Database:** `localhost:5432`
- **Redis Broker:** `localhost:6379`
