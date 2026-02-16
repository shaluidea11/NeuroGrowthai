"""
NeuroGrowth AI - Daily Log Routes
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date

from database import get_db, DailyLog, Student, SkillType
from utils.auth import get_current_user, TokenData

router = APIRouter(tags=["Daily Logs"])


# ─── Schemas ──────────────────────────────────────────────────────────────────

class DailyLogRequest(BaseModel):
    student_id: int
    date: Optional[date] = None
    study_hours: float = Field(..., ge=0, le=24)
    topics_completed: int = Field(default=0, ge=0)
    problems_solved: int = Field(default=0, ge=0)
    mock_score: Optional[float] = Field(default=None, ge=0, le=100)
    confidence: int = Field(..., ge=1, le=5)
    mood: int = Field(..., ge=1, le=5)
    revision_done: bool = False
    skill_practiced: Optional[str] = "Other"


class DailyLogResponse(BaseModel):
    id: int
    student_id: int
    date: date
    study_hours: float
    topics_completed: int
    problems_solved: int
    mock_score: Optional[float]
    confidence: int
    mood: int
    revision_done: bool
    skill_practiced: Optional[str]

    class Config:
        from_attributes = True


# ─── Routes ──────────────────────────────────────────────────────────────────

@router.post("/log-daily", response_model=DailyLogResponse, status_code=201)
def log_daily(req: DailyLogRequest, db: Session = Depends(get_db)):
    """Log daily study progress."""
    student = db.query(Student).filter(Student.id == req.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # Parse skill type
    try:
        skill = SkillType(req.skill_practiced) if req.skill_practiced else SkillType.OTHER
    except ValueError:
        skill = SkillType.OTHER

    log = DailyLog(
        student_id=req.student_id,
        date=req.date or date.today(),
        study_hours=req.study_hours,
        topics_completed=req.topics_completed,
        problems_solved=req.problems_solved,
        mock_score=req.mock_score,
        confidence=req.confidence,
        mood=req.mood,
        revision_done=req.revision_done,
        skill_practiced=skill,
    )
    db.add(log)
    db.commit()
    db.refresh(log)

    return DailyLogResponse(
        id=log.id, student_id=log.student_id, date=log.date,
        study_hours=log.study_hours, topics_completed=log.topics_completed,
        problems_solved=log.problems_solved, mock_score=log.mock_score,
        confidence=log.confidence, mood=log.mood,
        revision_done=log.revision_done,
        skill_practiced=log.skill_practiced.value if log.skill_practiced else "Other",
    )


@router.get("/logs/{student_id}", response_model=List[DailyLogResponse])
def get_logs(student_id: int, limit: int = 30, db: Session = Depends(get_db)):
    """Get daily logs for a student."""
    logs = (
        db.query(DailyLog)
        .filter(DailyLog.student_id == student_id)
        .order_by(DailyLog.date.desc())
        .limit(limit)
        .all()
    )
    return [
        DailyLogResponse(
            id=l.id, student_id=l.student_id, date=l.date,
            study_hours=l.study_hours, topics_completed=l.topics_completed,
            problems_solved=l.problems_solved, mock_score=l.mock_score,
            confidence=l.confidence, mood=l.mood,
            revision_done=l.revision_done,
            skill_practiced=l.skill_practiced.value if l.skill_practiced else "Other",
        )
        for l in logs
    ]
