from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.pdf_utils import extract_pdf_text
from backend.redis_client import redis_client

from backend.auth.auth_routes import router as auth_router
from backend.auth.auth_dependency import get_current_user

from backend.services.chat_service import career_chat_service
from backend.services.analyzer_service import analyze_resume_service
from backend.services.matcher_service import match_jd_service
from backend.services.cover_service import generate_cover_letter_service

# Request models for JSON body
class CareerChatRequest(BaseModel):
    question: str

class JobDescRequest(BaseModel):
    job_description: str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)


def _get_resume_or_raise(user: str) -> str:
    resume = redis_client.get(f"resume:{user}")
    if not resume:
        raise HTTPException(400, "Upload a resume first")
    return resume

# ============================================================
# Upload Resume
# ============================================================
@app.post("/upload-resume")
async def upload_resume(
    file: UploadFile = File(...),
    user: str = Depends(get_current_user)
):

    text = await extract_pdf_text(file)

    redis_client.set(f"resume:{user}", text)

    return {"message": "Resume uploaded"}

# ============================================================
# Career Chat
# ============================================================
@app.post("/career-chat")
async def career_chat(
    body: CareerChatRequest,
    user: str = Depends(get_current_user)
):
    resume = _get_resume_or_raise(user)
    response = career_chat_service(user, resume, body.question)
    return {"response": response}

# ============================================================
# Resume Analyzer
# ============================================================
@app.post("/analyze-resume")
async def analyze_resume(
    user: str = Depends(get_current_user)
):
    resume = _get_resume_or_raise(user)
    response = analyze_resume_service(resume)
    return {"analysis": response}

# ============================================================
# JD Matcher
# ============================================================
@app.post("/match-jd")
async def match_jd(
    body: JobDescRequest,
    user: str = Depends(get_current_user)
):
    resume = _get_resume_or_raise(user)
    response = match_jd_service(resume, body.job_description)
    return {"match": response}

# ============================================================
# Cover Letter
# ============================================================
@app.post("/generate-cover-letter")
async def cover_letter(
    body: JobDescRequest,
    user: str = Depends(get_current_user)
):
    resume = _get_resume_or_raise(user)
    response = generate_cover_letter_service(resume, body.job_description)
    return {"cover_letter": response}
