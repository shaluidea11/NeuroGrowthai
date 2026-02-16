"""
NeuroGrowth AI - FastAPI Application Entry Point
"""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger
from dotenv import load_dotenv

from database import init_db
from routes import logs, prediction, roadmap, assistant as assistant_route, auth, admin

load_dotenv()

# ─── Logging setup ───────────────────────────────────────────────────────────
logger.add("logs/app.log", rotation="10 MB", retention="30 days", level="INFO")


# ─── Lifespan ────────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 Starting NeuroGrowth AI Backend...")
    os.makedirs("saved_models", exist_ok=True)
    os.makedirs("logs", exist_ok=True)
    init_db()
    logger.info("✅ Database initialized")
    yield
    logger.info("🛑 Shutting down NeuroGrowth AI Backend")


# ─── App ─────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="NeuroGrowth AI",
    description="Deep Learning–Based Student Growth Prediction & AI Roadmap Assistant",
    version="1.0.0",
    lifespan=lifespan,
)

# ─── Middleware ────────────────────────────────────────────────────────────────
@app.middleware("http")
async def log_requests(request, call_next):
    logger.info(f"Incoming request: {request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Response status: {response.status_code}")
    return response

# ─── CORS ────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:3000"), "http://127.0.0.1:3000", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Routes ──────────────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(logs.router)
app.include_router(prediction.router)
app.include_router(roadmap.router)
app.include_router(assistant_route.router)
app.include_router(admin.router)


@app.get("/", tags=["Health"])
async def health_check():
    return {"status": "healthy", "app": "NeuroGrowth AI", "version": "1.0.0"}
