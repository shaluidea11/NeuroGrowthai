"""
NeuroGrowth AI - AI Roadmap Engine
Rule-based roadmap generation with optional HuggingFace model
"""

import json
from datetime import datetime, timedelta
from loguru import logger
from typing import Optional


def generate_roadmap(
    predicted_score: float,
    target_gpa: float,
    career_goal: str,
    weak_areas: list[str],
    learning_style: str,
    current_stats: Optional[dict] = None,
) -> dict:
    """
    Generate a personalized 30-day roadmap.

    Args:
        predicted_score: current predicted exam score (0-100)
        target_gpa: student's target GPA
        career_goal: e.g. "Software Engineer", "Data Scientist"
        weak_areas: list of weak subjects/skills
        learning_style: cluster label name
        current_stats: optional dict of current performance stats
    """
    logger.info(f"Generating roadmap: score={predicted_score}, goal={career_goal}, style={learning_style}")

    gap = (target_gpa * 25) - predicted_score  # Approximate score needed
    intensity = _calculate_intensity(gap, learning_style)
    today = datetime.now()

    roadmap = {
        "summary": _generate_summary(predicted_score, target_gpa, career_goal, gap),
        "intensity_level": intensity,
        "learning_style": learning_style,
        "duration_days": 30,
        "start_date": today.strftime("%Y-%m-%d"),
        "end_date": (today + timedelta(days=30)).strftime("%Y-%m-%d"),
        "daily_plan": _generate_daily_plan(weak_areas, intensity, career_goal, learning_style),
        "mock_test_schedule": _generate_mock_schedule(today),
        "revision_cycles": _generate_revision_cycles(weak_areas, today),
        "skill_growth_plan": _generate_skill_plan(career_goal, weak_areas),
        "weekly_milestones": _generate_milestones(gap, weak_areas),
    }

    return roadmap


def _calculate_intensity(gap: float, style: str) -> str:
    if gap > 20:
        return "high"
    elif gap > 10:
        return "medium"
    else:
        return "light"


def _generate_summary(score: float, gpa: float, goal: str, gap: float) -> str:
    urgency = "significantly increase" if gap > 20 else "improve" if gap > 5 else "maintain"
    return (
        f"Based on your predicted score of {score:.1f} and target GPA of {gpa}, "
        f"you need to {urgency} your performance. This roadmap is tailored for your "
        f"goal of becoming a {goal}. Follow this 30-day plan to maximize improvement."
    )


def _generate_daily_plan(weak_areas: list, intensity: str, career_goal: str, style: str) -> list:
    """Generate 30-day task breakdown."""
    hours_map = {"high": 8, "medium": 6, "light": 4}
    daily_hours = hours_map.get(intensity, 6)

    # Adjust for learning style
    if style == "Last-Minute Crammer":
        daily_hours += 1  # More structured hours
    elif style == "Burnout Prone":
        daily_hours -= 1  # Prevent overload

    plan = []
    for day in range(1, 31):
        week = (day - 1) // 7 + 1
        day_of_week = (day - 1) % 7

        # Cycle through weak areas
        focus_area = weak_areas[day % len(weak_areas)] if weak_areas else "General Study"

        tasks = []
        if day_of_week < 5:  # Weekday
            tasks = [
                {"time": "09:00-10:30", "task": f"Deep study: {focus_area}", "type": "study"},
                {"time": "10:45-12:00", "task": "Practice problems", "type": "practice"},
                {"time": "14:00-15:30", "task": f"Concept revision: {weak_areas[(day+1) % len(weak_areas)] if weak_areas else 'Review'}", "type": "revision"},
                {"time": "16:00-17:00", "task": f"Career skill: {_get_career_skill(career_goal)}", "type": "skill"},
            ]
            if intensity == "high":
                tasks.append({"time": "19:00-20:30", "task": "Extra practice session", "type": "practice"})
        elif day_of_week == 5:  # Saturday
            tasks = [
                {"time": "10:00-12:00", "task": "Weekly revision of all topics", "type": "revision"},
                {"time": "14:00-16:00", "task": "Mock test preparation", "type": "test_prep"},
            ]
        else:  # Sunday
            tasks = [
                {"time": "10:00-11:00", "task": "Light review and planning", "type": "planning"},
                {"time": "15:00-16:00", "task": "Self-assessment and reflection", "type": "reflection"},
            ]

        plan.append({
            "day": day,
            "week": week,
            "focus_area": focus_area,
            "study_hours": daily_hours if day_of_week < 5 else daily_hours // 2,
            "tasks": tasks,
            "problems_target": 15 if day_of_week < 5 else 5,
        })

    return plan


def _get_career_skill(career_goal: str) -> str:
    career_skills = {
        "Software Engineer": "System Design & Coding",
        "Data Scientist": "ML Model Building",
        "Web Developer": "Frontend/Backend Projects",
        "ML Engineer": "Deep Learning Implementation",
        "DevOps Engineer": "CI/CD & Cloud",
        "Product Manager": "Case Study Analysis",
    }
    return career_skills.get(career_goal, "Technical Skills Practice")


def _generate_mock_schedule(start_date: datetime) -> list:
    """Generate mock test schedule."""
    schedule = []
    for week in range(1, 5):
        test_date = start_date + timedelta(days=week * 7 - 1)
        schedule.append({
            "week": week,
            "date": test_date.strftime("%Y-%m-%d"),
            "type": "Full Mock" if week % 2 == 0 else "Subject Mock",
            "duration_minutes": 180 if week % 2 == 0 else 90,
            "focus": f"Week {week} cumulative assessment",
        })
    return schedule


def _generate_revision_cycles(weak_areas: list, start_date: datetime) -> list:
    """Generate spaced repetition revision cycles."""
    cycles = []
    for i, area in enumerate(weak_areas):
        cycles.append({
            "subject": area,
            "cycle_1": (start_date + timedelta(days=i * 2 + 1)).strftime("%Y-%m-%d"),
            "cycle_2": (start_date + timedelta(days=i * 2 + 4)).strftime("%Y-%m-%d"),
            "cycle_3": (start_date + timedelta(days=i * 2 + 10)).strftime("%Y-%m-%d"),
            "cycle_4": (start_date + timedelta(days=i * 2 + 20)).strftime("%Y-%m-%d"),
            "method": "Active recall + Spaced repetition",
        })
    return cycles


def _generate_skill_plan(career_goal: str, weak_areas: list) -> list:
    """Generate career-aligned skill growth plan."""
    base_skills = {
        "Software Engineer": ["DSA", "System Design", "Clean Code", "Testing"],
        "Data Scientist": ["Statistics", "ML Algorithms", "Python", "SQL"],
        "ML Engineer": ["PyTorch", "Model Optimization", "MLOps", "Math"],
        "Web Developer": ["React", "Node.js", "Databases", "APIs"],
    }

    skills = base_skills.get(career_goal, ["Problem Solving", "Technical Writing", "Collaboration"])
    plan = []
    for i, skill in enumerate(skills):
        plan.append({
            "skill": skill,
            "priority": "High" if skill in weak_areas else "Medium",
            "start_week": i + 1,
            "target": f"Achieve proficiency in {skill}",
            "resources": [f"Practice {skill} daily", f"Complete {skill} project"],
        })
    return plan


def _generate_milestones(gap: float, weak_areas: list) -> list:
    """Weekly milestones."""
    weekly_improvement = gap / 4 if gap > 0 else 2
    return [
        {
            "week": 1,
            "target": f"Improve score by {weekly_improvement:.0f} points",
            "focus": weak_areas[0] if weak_areas else "General",
            "deliverable": "Complete baseline assessment"
        },
        {
            "week": 2,
            "target": f"Cumulative improvement: {weekly_improvement * 2:.0f} points",
            "focus": weak_areas[1] if len(weak_areas) > 1 else "Practice",
            "deliverable": "Pass first mock test with improvement"
        },
        {
            "week": 3,
            "target": f"Cumulative improvement: {weekly_improvement * 3:.0f} points",
            "focus": "Integration & Review",
            "deliverable": "Complete all weak area cycles"
        },
        {
            "week": 4,
            "target": f"Reach target score",
            "focus": "Final preparation",
            "deliverable": "Full mock test at target score"
        },
    ]
