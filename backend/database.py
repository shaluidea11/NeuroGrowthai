"""
NeuroGrowth AI - Database Models & Configuration
SQLAlchemy ORM models for PostgreSQL
"""

import os
from datetime import datetime, date
from sqlalchemy import (
    create_engine, Column, Integer, String, Float, Boolean,
    Date, DateTime, ForeignKey, Text, JSON, Enum as SQLEnum
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from dotenv import load_dotenv
import enum

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/neurogrowth")

if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL, 
        connect_args={"check_same_thread": False},
        pool_pre_ping=True
    )
else:
    engine = create_engine(DATABASE_URL, pool_pre_ping=True, pool_size=10, max_overflow=20)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# ─── Enums ────────────────────────────────────────────────────────────────────

class UserRole(str, enum.Enum):
    STUDENT = "student"
    ADMIN = "admin"


class SkillType(str, enum.Enum):
    DSA = "DSA"
    ML = "ML"
    DBMS = "DBMS"
    OS = "OS"
    CN = "CN"
    WEB_DEV = "Web Dev"
    MATH = "Math"
    APTITUDE = "Aptitude"
    SOFT_SKILLS = "Soft Skills"
    OTHER = "Other"


# ─── Models ───────────────────────────────────────────────────────────────────

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(SQLEnum(UserRole), default=UserRole.STUDENT, nullable=False)
    target_gpa = Column(Float, nullable=True)
    career_goal = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    daily_logs = relationship("DailyLog", back_populates="student", cascade="all, delete-orphan")
    predictions = relationship("Prediction", back_populates="student", cascade="all, delete-orphan")
    roadmaps = relationship("Roadmap", back_populates="student", cascade="all, delete-orphan")


class DailyLog(Base):
    __tablename__ = "daily_logs"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    date = Column(Date, default=date.today, nullable=False)
    study_hours = Column(Float, nullable=False)
    topics_completed = Column(Integer, default=0)
    problems_solved = Column(Integer, default=0)
    mock_score = Column(Float, nullable=True)
    confidence = Column(Integer, nullable=False)  # 1-5
    mood = Column(Integer, nullable=False)  # 1-5 (1=stressed, 5=great)
    revision_done = Column(Boolean, default=False)
    skill_practiced = Column(SQLEnum(SkillType), default=SkillType.OTHER)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    student = relationship("Student", back_populates="daily_logs")


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    predicted_score = Column(Float, nullable=False)
    burnout_risk = Column(Float, nullable=False)  # 0.0 - 1.0
    improvement_velocity = Column(Float, nullable=False)
    confidence_lower = Column(Float, nullable=True)
    confidence_upper = Column(Float, nullable=True)
    feature_importance = Column(JSON, nullable=True)  # SHAP values
    generated_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    student = relationship("Student", back_populates="predictions")


class Roadmap(Base):
    __tablename__ = "roadmaps"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    roadmap_json = Column(JSON, nullable=False)
    generated_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    student = relationship("Student", back_populates="roadmaps")


# ─── Database Helpers ─────────────────────────────────────────────────────────

def get_db():
    """Dependency to get database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Create all tables."""
    Base.metadata.create_all(bind=engine)
