"""
NeuroGrowth AI - Chat Assistant & Dashboard Routes
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from typing import Optional, List

from database import get_db, Student, DailyLog, Prediction, Roadmap
from services.assistant import get_assistant
from services.clustering import get_student_cluster

router = APIRouter(tags=["Assistant"])


# ─── Schemas ──────────────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    student_id: int
    message: str


class ChatResponse(BaseModel):
    response: str


# ─── Routes ──────────────────────────────────────────────────────────────────

@router.post("/chat-assistant", response_model=ChatResponse)
def chat(req: ChatRequest, db: Session = Depends(get_db)):
    """Chat with AI assistant."""
    student = db.query(Student).filter(Student.id == req.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # Build context from student data
    latest_pred = (
        db.query(Prediction)
        .filter(Prediction.student_id == req.student_id)
        .order_by(Prediction.generated_at.desc())
        .first()
    )

    logs = db.query(DailyLog).filter(DailyLog.student_id == req.student_id).all()
    log_dicts = [
        {"study_hours": l.study_hours, "mock_score": l.mock_score or 50,
         "confidence": l.confidence, "mood": l.mood,
         "problems_solved": l.problems_solved, "revision_done": l.revision_done,
         "skill_practiced": l.skill_practiced.value if l.skill_practiced else "Other"}
        for l in logs
    ]

    cluster_info = get_student_cluster(log_dicts, {})

    context = {
        "predicted_score": latest_pred.predicted_score if latest_pred else 50.0,
        "burnout_risk": latest_pred.burnout_risk if latest_pred else 0.3,
        "improvement_velocity": latest_pred.improvement_velocity if latest_pred else 0,
        "career_goal": student.career_goal or "Software Engineer",
        "learning_style": cluster_info["style"]["name"],
    }

    assistant = get_assistant()
    response = assistant.chat(req.message, context)
    return ChatResponse(response=response)


@router.get("/dashboard/{student_id}")
def dashboard(student_id: int, db: Session = Depends(get_db)):
    """Get complete dashboard data for a student."""
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # Get recent logs
    logs = (
        db.query(DailyLog)
        .filter(DailyLog.student_id == student_id)
        .order_by(DailyLog.date.desc())
        .limit(30)
        .all()
    )

    log_data = [
        {
            "date": l.date.isoformat(),
            "study_hours": l.study_hours,
            "topics_completed": l.topics_completed,
            "problems_solved": l.problems_solved,
            "mock_score": l.mock_score,
            "confidence": l.confidence,
            "mood": l.mood,
            "revision_done": l.revision_done,
            "skill_practiced": l.skill_practiced.value if l.skill_practiced else "Other",
        }
        for l in logs
    ]

    # Get latest prediction
    latest_pred = (
        db.query(Prediction)
        .filter(Prediction.student_id == student_id)
        .order_by(Prediction.generated_at.desc())
        .first()
    )

    prediction_data = None
    if latest_pred:
        prediction_data = {
            "predicted_score": latest_pred.predicted_score,
            "burnout_risk": latest_pred.burnout_risk,
            "improvement_velocity": latest_pred.improvement_velocity,
            "confidence_lower": latest_pred.confidence_lower,
            "confidence_upper": latest_pred.confidence_upper,
            "feature_importance": latest_pred.feature_importance,
            "generated_at": latest_pred.generated_at.isoformat() if latest_pred.generated_at else None,
        }

    # Get latest roadmap
    latest_roadmap = (
        db.query(Roadmap)
        .filter(Roadmap.student_id == student_id)
        .order_by(Roadmap.generated_at.desc())
        .first()
    )

    # Get learning style
    log_dicts = [
        {"study_hours": l.study_hours, "mock_score": l.mock_score or 50,
         "confidence": l.confidence, "mood": l.mood,
         "problems_solved": l.problems_solved, "revision_done": l.revision_done,
         "skill_practiced": l.skill_practiced.value if l.skill_practiced else "Other"}
        for l in logs
    ]
    cluster_info = get_student_cluster(log_dicts, {})

    # Calculate streak (consecutive days with logs)
    from datetime import date as dt_date, timedelta
    all_log_dates = set(
        row[0] for row in
        db.query(DailyLog.date)
        .filter(DailyLog.student_id == student_id)
        .all()
    )
    streak = 0
    check_date = dt_date.today()
    # Allow starting from today or yesterday
    if check_date not in all_log_dates:
        check_date = check_date - timedelta(days=1)
    while check_date in all_log_dates:
        streak += 1
        check_date -= timedelta(days=1)

    return {
        "student": {
            "id": student.id,
            "name": student.name,
            "email": student.email,
            "target_gpa": student.target_gpa,
            "career_goal": student.career_goal,
        },
        "daily_logs": log_data,
        "prediction": prediction_data,
        "roadmap": latest_roadmap.roadmap_json if latest_roadmap else None,
        "learning_style": cluster_info,
        "streak": streak,
        "stats": {
            "total_logs": db.query(DailyLog).filter(DailyLog.student_id == student_id).count(),
            "avg_study_hours": round(float(
                db.query(func.avg(DailyLog.study_hours))
                .filter(DailyLog.student_id == student_id)
                .scalar() or 0
            ), 1),
            "avg_mock_score": round(float(
                db.query(func.avg(DailyLog.mock_score))
                .filter(DailyLog.student_id == student_id)
                .scalar() or 0
            ), 1),
        }
    }
