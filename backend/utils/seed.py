"""
NeuroGrowth AI - Synthetic Data Generator & Seed Script
Generates realistic student data for testing
"""

import random
import sys
import os
from datetime import date, timedelta

# Add parent to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import SessionLocal, init_db, Student, DailyLog, SkillType
from utils.auth import get_password_hash

NAMES = [
    "Aarav Sharma", "Priya Patel", "Rahul Kumar", "Sneha Reddy",
    "Vikram Singh", "Neha Gupta", "Arjun Mehta", "Kavya Nair",
    "Rishi Joshi", "Ananya Mishra", "Deepak Verma", "Ishita Banerjee",
    "Karan Malhotra", "Pooja Iyer", "Siddharth Das", "Meera Chauhan",
    "Aditya Saxena", "Divya Hegde", "Manish Tiwari", "Shruti Kapur"
]

CAREER_GOALS = [
    "Software Engineer", "Data Scientist", "ML Engineer",
    "Web Developer", "DevOps Engineer", "Product Manager"
]

SKILLS = list(SkillType)


def generate_student_logs(style: str, days: int = 30) -> list[dict]:
    """Generate realistic daily logs based on learning style."""
    logs = []
    base_score = random.uniform(35, 65)

    for day in range(days):
        if style == "fast_improver":
            study_hours = random.uniform(5, 9) + day * 0.05
            problems = random.randint(10, 25) + day // 3
            score = min(100, base_score + day * 0.8 + random.uniform(-3, 5))
            confidence = min(5, max(1, 3 + day // 10 + random.randint(-1, 1)))
            mood = min(5, max(1, 3 + random.randint(0, 1)))
        elif style == "consistent":
            study_hours = random.uniform(4, 6)
            problems = random.randint(8, 15)
            score = base_score + day * 0.3 + random.uniform(-2, 2)
            confidence = random.randint(3, 4)
            mood = random.randint(3, 5)
        elif style == "crammer":
            # Low effort most days, spikes near "exam" days
            near_exam = (day % 10) > 6
            study_hours = random.uniform(6, 12) if near_exam else random.uniform(1, 3)
            problems = random.randint(15, 30) if near_exam else random.randint(0, 5)
            score = base_score + random.uniform(-5, 10) if near_exam else base_score + random.uniform(-5, 2)
            confidence = random.randint(2, 4) if near_exam else random.randint(1, 3)
            mood = random.randint(2, 4)
        else:  # burnout_prone
            study_hours = random.uniform(8, 14) - day * 0.1
            problems = max(0, random.randint(15, 25) - day // 5)
            score = base_score + day * 0.2 - day * 0.1 + random.uniform(-3, 3)
            confidence = max(1, 4 - day // 8)
            mood = max(1, 4 - day // 6)

        logs.append({
            "study_hours": round(max(0, min(24, study_hours)), 1),
            "topics_completed": random.randint(1, 5),
            "problems_solved": max(0, int(problems)),
            "mock_score": round(max(0, min(100, score)), 1),
            "confidence": int(max(1, min(5, confidence))),
            "mood": int(max(1, min(5, mood))),
            "revision_done": random.random() > 0.4,
            "skill_practiced": random.choice(SKILLS),
        })

    return logs


def seed_database():
    """Seed the database with synthetic data."""
    init_db()
    db = SessionLocal()

    try:
        # Check if already seeded
        if db.query(Student).count() > 0:
            print("⚠️  Database already has data. Skipping seed.")
            return

        styles = ["fast_improver", "consistent", "crammer", "burnout_prone"]
        today = date.today()

        print("🌱 Seeding database...")

        # Create admin
        admin = Student(
            name="Admin User",
            email="admin@neurogrowth.ai",
            hashed_password=get_password_hash("admin123"),
            role="admin",
            target_gpa=4.0,
            career_goal="Product Manager",
        )
        db.add(admin)
        print("  ✅ Created admin user (admin@neurogrowth.ai / admin123)")

        # Create students
        for i, name in enumerate(NAMES):
            style = styles[i % len(styles)]
            email = name.lower().replace(" ", ".") + "@student.edu"

            student = Student(
                name=name,
                email=email,
                hashed_password=get_password_hash("student123"),
                role="student",
                target_gpa=round(random.uniform(3.0, 4.0), 1),
                career_goal=random.choice(CAREER_GOALS),
            )
            db.add(student)
            db.flush()  # Get student.id

            # Generate 30 days of logs
            logs = generate_student_logs(style, days=30)
            for day_offset, log_data in enumerate(logs):
                log = DailyLog(
                    student_id=student.id,
                    date=today - timedelta(days=30 - day_offset),
                    study_hours=log_data["study_hours"],
                    topics_completed=log_data["topics_completed"],
                    problems_solved=log_data["problems_solved"],
                    mock_score=log_data["mock_score"],
                    confidence=log_data["confidence"],
                    mood=log_data["mood"],
                    revision_done=log_data["revision_done"],
                    skill_practiced=log_data["skill_practiced"],
                )
                db.add(log)

            print(f"  ✅ {name} ({style}) - {len(logs)} daily logs")

        db.commit()
        print(f"\n🎉 Seeded {len(NAMES)} students + 1 admin with daily logs!")
        print("   Login: any student email / student123")
        print("   Admin: admin@neurogrowth.ai / admin123")

    except Exception as e:
        db.rollback()
        print(f"❌ Seed failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
