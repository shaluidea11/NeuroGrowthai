"""
NeuroGrowth AI - Prediction Routes
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime

from database import get_db, DailyLog, Prediction, Student
from models.inference import predict_performance, simulate_performance

router = APIRouter(tags=["Predictions"])


# ─── Schemas ──────────────────────────────────────────────────────────────────

class PredictionResponse(BaseModel):
    predicted_score: float
    burnout_risk: float
    improvement_velocity: float
    confidence_lower: float
    confidence_upper: float
    feature_importance: Dict[str, float]


class SimulateRequest(BaseModel):
    student_id: int
    adjustments: Dict[str, float]  # e.g. {"study_hours": 1.0}


# ─── Routes ──────────────────────────────────────────────────────────────────

@router.get("/predict/{student_id}", response_model=PredictionResponse)
def predict(student_id: int, db: Session = Depends(get_db)):
    """Get performance prediction for a student."""
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    logs = (
        db.query(DailyLog)
        .filter(DailyLog.student_id == student_id)
        .order_by(DailyLog.date.asc())
        .all()
    )

    log_dicts = [
        {
            "study_hours": l.study_hours,
            "topics_completed": l.topics_completed,
            "problems_solved": l.problems_solved,
            "mock_score": l.mock_score or 50.0,
            "confidence": l.confidence,
            "mood": l.mood,
            "revision_done": l.revision_done,
            "skill_practiced": l.skill_practiced.value if l.skill_practiced else "Other",
        }
        for l in logs
    ]

    result = predict_performance(log_dicts)

    # Save prediction
    pred = Prediction(
        student_id=student_id,
        predicted_score=result["predicted_score"],
        burnout_risk=result["burnout_risk"],
        improvement_velocity=result["improvement_velocity"],
        confidence_lower=result.get("confidence_lower"),
        confidence_upper=result.get("confidence_upper"),
        feature_importance=result.get("feature_importance"),
        generated_at=datetime.utcnow(),
    )
    db.add(pred)
    db.commit()

    return PredictionResponse(**result)


@router.post("/simulate", response_model=PredictionResponse)
def simulate(req: SimulateRequest, db: Session = Depends(get_db)):
    """Simulate performance with adjusted parameters."""
    student = db.query(Student).filter(Student.id == req.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    logs = (
        db.query(DailyLog)
        .filter(DailyLog.student_id == req.student_id)
        .order_by(DailyLog.date.asc())
        .all()
    )

    log_dicts = [
        {
            "study_hours": l.study_hours,
            "topics_completed": l.topics_completed,
            "problems_solved": l.problems_solved,
            "mock_score": l.mock_score or 50.0,
            "confidence": l.confidence,
            "mood": l.mood,
            "revision_done": l.revision_done,
            "skill_practiced": l.skill_practiced.value if l.skill_practiced else "Other",
        }
        for l in logs
    ]

    result = simulate_performance(log_dicts, req.adjustments)
    return PredictionResponse(**result)
