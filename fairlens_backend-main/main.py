"""
FairLens Backend — FastAPI Application
AI-powered bias auditor for Indian public datasets
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from routes.upload import router as upload_router
from routes.analyze import router as analyze_router
from routes.chat import router as chat_router

app = FastAPI(
    title="FairLens API",
    description="AI Bias Auditor Backend — Fairness analysis engine + Grok AI",
    version="1.0.0",
)

# CORS — allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(upload_router, prefix="/api")
app.include_router(analyze_router, prefix="/api")
app.include_router(chat_router, prefix="/api")


@app.get("/")
def root():
    return {"status": "ok", "service": "FairLens API", "version": "1.0.0"}


@app.get("/api/health")
def health():
    return {"status": "healthy"}
