"""
NeuroGrowth AI - Authentication Routes
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional

from database import get_db, Student, UserRole
from utils.auth import (
    verify_password, get_password_hash, create_access_token,
    get_current_user, TokenData
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


# ─── Schemas ──────────────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: Optional[str] = "student"
    target_gpa: Optional[float] = None
    career_goal: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    target_gpa: Optional[float]
    career_goal: Optional[str]

    class Config:
        from_attributes = True


# ─── Routes ──────────────────────────────────────────────────────────────────

@router.post("/register", response_model=UserResponse, status_code=201)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    """Register a new student or admin."""
    existing = db.query(Student).filter(Student.email == req.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    student = Student(
        name=req.name,
        email=req.email,
        hashed_password=get_password_hash(req.password),
        role=UserRole.ADMIN if req.role == "admin" else UserRole.STUDENT,
        target_gpa=req.target_gpa,
        career_goal=req.career_goal,
    )
    db.add(student)
    db.commit()
    db.refresh(student)

    return UserResponse(
        id=student.id, name=student.name, email=student.email,
        role=student.role.value, target_gpa=student.target_gpa,
        career_goal=student.career_goal
    )


@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Login and receive a JWT token."""
    user = db.query(Student).filter(Student.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(data={"sub": user.email, "role": user.role.value, "user_id": user.id})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role.value,
        }
    }


@router.get("/me", response_model=UserResponse)
def get_me(current_user: TokenData = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get current user profile."""
    user = db.query(Student).filter(Student.email == current_user.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse(
        id=user.id, name=user.name, email=user.email,
        role=user.role.value, target_gpa=user.target_gpa,
        career_goal=user.career_goal
    )


@router.put("/profile")
def update_profile(
    target_gpa: Optional[float] = None,
    career_goal: Optional[str] = None,
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update student profile."""
    user = db.query(Student).filter(Student.email == current_user.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if target_gpa is not None:
        user.target_gpa = target_gpa
    if career_goal is not None:
        user.career_goal = career_goal

    db.commit()
    return {"message": "Profile updated"}
