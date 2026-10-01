from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from api.routes import router as api_router
from database.session import engine, Base

# Initialize DB tables if needed
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="High-performance AI Video Clipper backend with face tracking, virality scoring, and dynamic caption rendering.",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

@app.get("/")
def root():
    return {
        "name": settings.PROJECT_NAME,
        "status": "online",
        "docs_url": "/docs",
        "health": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
