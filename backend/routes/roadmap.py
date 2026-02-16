"""
NeuroGrowth AI - Roadmap Routes
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

from database import get_db, Student, DailyLog, Roadmap, Prediction
from services.roadmap_engine import generate_roadmap
from services.clustering import get_student_cluster

router = APIRouter(tags=["Roadmap"])


# ─── Schemas ──────────────────────────────────────────────────────────────────

class RoadmapRequest(BaseModel):
    student_id: int
    weak_areas: Optional[List[str]] = ["DSA", "Math"]
    target_gpa: Optional[float] = None
    career_goal: Optional[str] = None


# ─── Routes ──────────────────────────────────────────────────────────────────

@router.post("/generate-roadmap")
def create_roadmap(req: RoadmapRequest, db: Session = Depends(get_db)):
    """Generate a personalized 30-day roadmap."""
    student = db.query(Student).filter(Student.id == req.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # Get latest prediction
    latest_pred = (
        db.query(Prediction)
        .filter(Prediction.student_id == req.student_id)
        .order_by(Prediction.generated_at.desc())
        .first()
    )
    predicted_score = latest_pred.predicted_score if latest_pred else 50.0

    # Get learning style cluster
    logs = db.query(DailyLog).filter(DailyLog.student_id == req.student_id).all()
    log_dicts = [
        {
            "study_hours": l.study_hours, "problems_solved": l.problems_solved,
            "mock_score": l.mock_score or 50, "confidence": l.confidence,
            "mood": l.mood, "revision_done": l.revision_done,
            "skill_practiced": l.skill_practiced.value if l.skill_practiced else "Other"
        }
        for l in logs
    ]

    cluster_info = get_student_cluster(log_dicts, {})
    learning_style = cluster_info["style"]["name"]

    target_gpa = req.target_gpa or student.target_gpa or 3.5
    career_goal = req.career_goal or student.career_goal or "Software Engineer"

    roadmap_data = generate_roadmap(
        predicted_score=predicted_score,
        target_gpa=target_gpa,
        career_goal=career_goal,
        weak_areas=req.weak_areas or ["DSA", "Math"],
        learning_style=learning_style,
    )

    # Save to database
    roadmap = Roadmap(
        student_id=req.student_id,
        roadmap_json=roadmap_data,
        generated_at=datetime.utcnow(),
    )
    db.add(roadmap)
    db.commit()
    db.refresh(roadmap)

    return {"id": roadmap.id, "roadmap": roadmap_data}


@router.get("/roadmap/{student_id}")
def get_roadmap(student_id: int, db: Session = Depends(get_db)):
    """Get the latest roadmap for a student."""
    roadmap = (
        db.query(Roadmap)
        .filter(Roadmap.student_id == student_id)
        .order_by(Roadmap.generated_at.desc())
        .first()
    )
    if not roadmap:
        raise HTTPException(status_code=404, detail="No roadmap found. Generate one first.")
    return {"id": roadmap.id, "roadmap": roadmap.roadmap_json, "generated_at": roadmap.generated_at}
