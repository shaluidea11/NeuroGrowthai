"""
NeuroGrowth AI - Admin Routes
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from database import get_db, Student, DailyLog, Prediction
from services.clustering import cluster_students
from utils.auth import require_admin, TokenData

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/students")
def get_all_students(db: Session = Depends(get_db)):
    """Get all students with basic stats."""
    students = db.query(Student).all()
    result = []
    for s in students:
        latest_pred = (
            db.query(Prediction)
            .filter(Prediction.student_id == s.id)
            .order_by(Prediction.generated_at.desc())
            .first()
        )
        log_count = db.query(DailyLog).filter(DailyLog.student_id == s.id).count()

        result.append({
            "id": s.id,
            "name": s.name,
            "email": s.email,
            "role": s.role.value,
            "target_gpa": s.target_gpa,
            "career_goal": s.career_goal,
            "log_count": log_count,
            "latest_prediction": {
                "predicted_score": latest_pred.predicted_score,
                "burnout_risk": latest_pred.burnout_risk,
            } if latest_pred else None,
        })
    return result


@router.get("/clustering")
def get_clustering(db: Session = Depends(get_db)):
    """Get student clustering visualization data."""
    students = db.query(Student).all()
    all_logs = {}
    for s in students:
        logs = db.query(DailyLog).filter(DailyLog.student_id == s.id).order_by(DailyLog.date.asc()).all()
        if logs:
            all_logs[s.id] = [
                {
                    "study_hours": l.study_hours,
                    "problems_solved": l.problems_solved,
                    "mock_score": l.mock_score or 50,
                    "confidence": l.confidence,
                    "mood": l.mood,
                    "revision_done": l.revision_done,
                    "skill_practiced": l.skill_practiced.value if l.skill_practiced else "Other",
                }
                for l in logs
            ]

    result = cluster_students(all_logs)

    # Add student names to PCA data
    student_map = {s.id: s.name for s in students}
    for point in result.get("pca_data", []):
        point["name"] = student_map.get(point["student_id"], "Unknown")

    return result


@router.get("/risk-heatmap")
def get_risk_heatmap(db: Session = Depends(get_db)):
    """Get burnout risk heatmap data."""
    students = db.query(Student).all()
    data = []
    for s in students:
        pred = (
            db.query(Prediction)
            .filter(Prediction.student_id == s.id)
            .order_by(Prediction.generated_at.desc())
            .first()
        )
        if pred:
            data.append({
                "student_id": s.id,
                "name": s.name,
                "burnout_risk": pred.burnout_risk,
                "predicted_score": pred.predicted_score,
                "improvement_velocity": pred.improvement_velocity,
            })
    return data


@router.get("/performance-distribution")
def get_performance_distribution(db: Session = Depends(get_db)):
    """Get performance score distribution."""
    predictions = db.query(Prediction).order_by(Prediction.generated_at.desc()).all()

    # Get only latest per student
    seen = set()
    scores = []
    for p in predictions:
        if p.student_id not in seen:
            seen.add(p.student_id)
            scores.append(p.predicted_score)

    # Create distribution buckets
    buckets = {"0-20": 0, "20-40": 0, "40-60": 0, "60-80": 0, "80-100": 0}
    for score in scores:
        if score < 20: buckets["0-20"] += 1
        elif score < 40: buckets["20-40"] += 1
        elif score < 60: buckets["40-60"] += 1
        elif score < 80: buckets["60-80"] += 1
        else: buckets["80-100"] += 1

    return {
        "distribution": [{"range": k, "count": v} for k, v in buckets.items()],
        "total_students": len(scores),
        "avg_score": round(sum(scores) / len(scores), 1) if scores else 0,
    }


@router.post("/retrain")
def retrain_model(db: Session = Depends(get_db)):
    """Trigger model retraining pipeline."""
    from models.train import train_model

    students = db.query(Student).all()
    all_logs = []
    for s in students:
        logs = db.query(DailyLog).filter(DailyLog.student_id == s.id).order_by(DailyLog.date.asc()).all()
        if logs:
            log_dicts = [
                {
                    "study_hours": l.study_hours,
                    "topics_completed": l.topics_completed,
                    "problems_solved": l.problems_solved,
                    "mock_score": l.mock_score or 50,
                    "confidence": l.confidence,
                    "mood": l.mood,
                    "revision_done": l.revision_done,
                    "skill_practiced": l.skill_practiced.value if l.skill_practiced else "Other",
                }
                for l in logs
            ]
            all_logs.append(log_dicts)

    if not all_logs:
        raise HTTPException(status_code=400, detail="No training data available")

    model = train_model(all_logs, epochs=30)
    return {"message": "Model retrained successfully", "students_used": len(all_logs)}
