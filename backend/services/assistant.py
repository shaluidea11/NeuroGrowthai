"""
NeuroGrowth AI - AI Chat Assistant
Rule-based educational assistant with optional HuggingFace integration
"""

import os
from loguru import logger
from typing import Optional

# Try to import transformers for AI-powered responses
try:
    from transformers import pipeline
    HF_AVAILABLE = True
except ImportError:
    HF_AVAILABLE = False
    logger.info("HuggingFace not available, using rule-based assistant")


class AssistantEngine:
    """AI-powered or rule-based educational assistant."""

    def __init__(self):
        self.model = None
        self._try_load_model()

    def _try_load_model(self):
        """Attempt to load HuggingFace model."""
        if not HF_AVAILABLE:
            return

        model_name = os.getenv("HUGGINGFACE_MODEL", "")
        if not model_name:
            logger.info("No HuggingFace model specified, using rule-based fallback")
            return

        try:
            self.model = pipeline("text2text-generation", model=model_name, max_length=512)
            logger.info(f"✅ Loaded HuggingFace model: {model_name}")
        except Exception as e:
            logger.warning(f"Failed to load model {model_name}: {e}")
            self.model = None

    def chat(self, message: str, context: Optional[dict] = None) -> str:
        """
        Process a student message and return a helpful response.

        Args:
            message: student's question or request
            context: optional dict with student performance data
        """
        context = context or {}

        if self.model:
            return self._ai_response(message, context)
        return self._rule_based_response(message, context)

    def _ai_response(self, message: str, context: dict) -> str:
        """Generate response using HuggingFace model."""
        prompt = self._build_prompt(message, context)
        try:
            result = self.model(prompt)
            return result[0]["generated_text"]
        except Exception as e:
            logger.error(f"AI generation failed: {e}")
            return self._rule_based_response(message, context)

    def _build_prompt(self, message: str, context: dict) -> str:
        score = context.get("predicted_score", "N/A")
        burnout = context.get("burnout_risk", "N/A")
        style = context.get("learning_style", "N/A")

        return (
            f"You are an educational AI assistant for a student. "
            f"The student's predicted exam score is {score}, "
            f"burnout risk is {burnout}, and learning style is {style}. "
            f"Student asks: {message}. "
            f"Provide a helpful, encouraging, and actionable response."
        )

    def _rule_based_response(self, message: str, context: dict) -> str:
        """Generate rule-based response for common queries."""
        msg_lower = message.lower()
        score = context.get("predicted_score", 50)
        burnout = context.get("burnout_risk", 0.3)
        style = context.get("learning_style", "Consistent Learner")

        # Study advice
        if any(word in msg_lower for word in ["study", "prepare", "learn", "how to"]):
            return self._study_advice(score, style, context)

        # Burnout / stress
        if any(word in msg_lower for word in ["burnout", "stress", "tired", "exhausted", "overwhelm"]):
            return self._burnout_advice(burnout, style)

        # Score / prediction
        if any(word in msg_lower for word in ["score", "predict", "exam", "grade", "performance"]):
            return self._score_advice(score, context)

        # Motivation
        if any(word in msg_lower for word in ["motivat", "inspire", "discourag", "give up", "quit"]):
            return self._motivation_advice(score, style)

        # Schedule / time management
        if any(word in msg_lower for word in ["schedule", "time", "plan", "routine", "organize"]):
            return self._schedule_advice(style)

        # Weak areas
        if any(word in msg_lower for word in ["weak", "improve", "struggle", "difficult", "hard"]):
            return self._weakness_advice(context)

        # Career
        if any(word in msg_lower for word in ["career", "job", "future", "placement", "intern"]):
            return self._career_advice(context)

        # Default
        return (
            f"I'm here to help you succeed! 🎓 Based on your profile, your predicted score is "
            f"{score:.1f} and your learning style is {style}. "
            f"Feel free to ask me about:\n"
            f"• 📚 Study strategies and tips\n"
            f"• 🎯 Improving your weak areas\n"
            f"• 😌 Managing stress and burnout\n"
            f"• 📊 Understanding your predictions\n"
            f"• 📅 Creating an effective study schedule\n"
            f"• 🚀 Career guidance and planning"
        )

    def _study_advice(self, score: float, style: str, context: dict) -> str:
        tips = {
            "Fast Improver": (
                "You're showing great momentum! 🚀 To maintain your rapid improvement:\n"
                "• Focus on deepening understanding, not just speed\n"
                "• Tackle harder problems to challenge yourself\n"
                "• Teach concepts to others to solidify your knowledge\n"
                "• Don't skip revisions — your strength is consistency"
            ),
            "Consistent Learner": (
                "Your consistency is your superpower! 💪 To level up:\n"
                "• Try increasing problem difficulty gradually\n"
                "• Add one new topic per week to expand breadth\n"
                "• Use active recall instead of passive reading\n"
                "• Set stretch goals to push beyond your comfort zone"
            ),
            "Last-Minute Crammer": (
                "Let's turn your energy into structured preparation! ⚡\n"
                "• Start with just 30 min of daily study, then increase\n"
                "• Use the Pomodoro technique (25 min focus, 5 min break)\n"
                "• Create a weekly micro-plan with small daily goals\n"
                "• Reward yourself for maintaining streaks"
            ),
            "Burnout Prone": (
                "Your dedication is admirable, but balance is key! 🌱\n"
                "• Limit study sessions to 4-5 hours max per day\n"
                "• Take mandatory breaks every 50 minutes\n"
                "• Include physical activity and relaxation in your routine\n"
                "• Focus on quality of study over quantity"
            ),
        }
        return tips.get(style, tips["Consistent Learner"])

    def _burnout_advice(self, burnout: float, style: str) -> str:
        if burnout > 0.7:
            return (
                "⚠️ Your burnout risk is high. Please prioritize your well-being:\n\n"
                "1. **Take a break today** — rest is productive\n"
                "2. **Reduce study hours by 30%** this week\n"
                "3. **Sleep 7-8 hours** — it improves memory consolidation\n"
                "4. **Exercise 20 min daily** — even a short walk helps\n"
                "5. **Talk to someone** about how you're feeling\n\n"
                "Remember: burning out helps nobody. A refreshed mind learns 3x faster. 💚"
            )
        elif burnout > 0.4:
            return (
                "😊 You're doing okay, but let's keep stress in check:\n\n"
                "• Make sure you're sleeping well\n"
                "• Include fun activities in your day\n"
                "• Take short breaks during study sessions\n"
                "• Practice deep breathing when feeling overwhelmed\n"
                "• Remember — progress over perfection! 🌟"
            )
        return (
            "You're managing stress well! 🎉 Keep it up by:\n"
            "• Maintaining your current work-life balance\n"
            "• Celebrating small wins regularly\n"
            "• Staying connected with friends and family\n"
            "• Continuing your self-care routine"
        )

    def _score_advice(self, score: float, context: dict) -> str:
        velocity = context.get("improvement_velocity", 0)
        trend = "improving" if velocity > 0 else "declining" if velocity < 0 else "stable"
        return (
            f"📊 **Your Performance Analysis:**\n\n"
            f"• Predicted Score: **{score:.1f}/100**\n"
            f"• Trend: **{trend.capitalize()}** (velocity: {velocity:+.1f})\n"
            f"• Burnout Risk: **{context.get('burnout_risk', 0.3):.0%}**\n\n"
            f"{'🟢 Great progress! Keep up the momentum!' if velocity > 0 else '🟡 Focus on consistency and targeted practice to improve.'}"
        )

    def _motivation_advice(self, score: float, style: str) -> str:
        return (
            "🌟 **Remember why you started!**\n\n"
            "Every expert was once a beginner. Here's some perspective:\n\n"
            "• Your predicted score shows you HAVE the capability\n"
            "• Small daily progress compounds into massive results\n"
            "• Comparing yourself to others steals your joy\n"
            "• Setbacks are setups for comebacks\n\n"
            f"As a {style}, your unique strength is what makes you special. "
            "Embrace your learning style and trust the process! 💪✨"
        )

    def _schedule_advice(self, style: str) -> str:
        return (
            "📅 **Optimized Study Schedule:**\n\n"
            "**Morning (Peak focus):** Complex problem solving, new concepts\n"
            "**Afternoon:** Practice problems, coding exercises\n"
            "**Evening:** Light revision, note review, planning\n\n"
            "**Tips:**\n"
            "• Use Pomodoro: 25 min study + 5 min break\n"
            "• Block social media during study sessions\n"
            "• Review today's learning before sleep\n"
            "• Plan tomorrow's tasks tonight\n"
            "• Keep weekends lighter for mental recharge"
        )

    def _weakness_advice(self, context: dict) -> str:
        return (
            "💡 **Improving Weak Areas:**\n\n"
            "1. **Identify** the exact gap — is it concept or practice?\n"
            "2. **Break down** the topic into 3-4 sub-topics\n"
            "3. **Study each** sub-topic for 30 minutes max\n"
            "4. **Practice** 5-10 problems for each sub-topic\n"
            "5. **Revise** using spaced repetition (Day 1, 3, 7, 14)\n"
            "6. **Test yourself** with a mini-mock on the topic\n\n"
            "Pro tip: Teaching a concept to someone else is the fastest way to master it! 🎯"
        )

    def _career_advice(self, context: dict) -> str:
        career = context.get("career_goal", "Software Engineer")
        return (
            f"🚀 **Career Roadmap for {career}:**\n\n"
            f"Your roadmap is aligned with becoming a {career}. Focus on:\n\n"
            "1. **Core fundamentals** — they never go out of style\n"
            "2. **Project portfolio** — build 2-3 solid projects\n"
            "3. **Problem solving** — practice DSA regularly\n"
            "4. **Soft skills** — communication is 50% of success\n"
            "5. **Networking** — connect with professionals\n\n"
            "💡 Start applying early, learn from rejections, and iterate!"
        )


# Singleton instance
_assistant: Optional[AssistantEngine] = None


def get_assistant() -> AssistantEngine:
    global _assistant
    if _assistant is None:
        _assistant = AssistantEngine()
    return _assistant
