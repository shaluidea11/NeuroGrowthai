"""
NeuroGrowth AI - Inference Engine with SHAP Explainability
"""

import os
import numpy as np
import torch
from loguru import logger
from typing import Optional

from models.dl_model import StudentGrowthLSTM, get_model
from models.train import prepare_features, SEQUENCE_LENGTH, SAVED_MODEL_DIR

FEATURE_NAMES = [
    "study_hours", "topics_completed", "problems_solved", "mock_score",
    "confidence", "mood", "revision_done", "skill_practiced"
]


def load_model(device: str = "cpu") -> Optional[StudentGrowthLSTM]:
    """Load the trained model from disk."""
    model_path = os.path.join(SAVED_MODEL_DIR, "growth_model.pt")
    if not os.path.exists(model_path):
        logger.warning("No trained model found, using untrained model")
        return get_model(device=device)

    model = get_model(device=device)
    model.load_state_dict(torch.load(model_path, map_location=device, weights_only=True))
    model.eval()
    logger.info("✅ Model loaded from disk")
    return model


def predict_performance(logs: list[dict], device: str = "cpu") -> dict:
    """
    Predict student performance from their daily logs.

    Args:
        logs: list of daily log dicts (at least SEQUENCE_LENGTH days)

    Returns:
        dict with predicted_score, burnout_risk, improvement_velocity,
             confidence_lower, confidence_upper, feature_importance
    """
    if len(logs) < SEQUENCE_LENGTH:
        # Fallback: heuristic-based prediction
        return _heuristic_prediction(logs)

    model = load_model(device)
    features = prepare_features(logs)

    # Take the last SEQUENCE_LENGTH days
    seq = features[-SEQUENCE_LENGTH:]
    seq_tensor = torch.FloatTensor(seq).unsqueeze(0).to(device)

    model.eval()
    with torch.no_grad():
        outputs = model(seq_tensor)

    result = {
        "predicted_score": round(float(outputs["predicted_score"][0]) * 100, 2),
        "burnout_risk": round(float(outputs["burnout_risk"][0]), 3),
        "improvement_velocity": round(float(outputs["improvement_velocity"][0]) * 20, 2),
        "confidence_lower": round(float(outputs["confidence_lower"][0]) * 100, 2),
        "confidence_upper": round(float(outputs["confidence_upper"][0]) * 100, 2),
    }

    # SHAP-like feature importance via gradient-based attribution
    result["feature_importance"] = _compute_feature_importance(model, seq_tensor, device)

    return result


def simulate_performance(logs: list[dict], adjustments: dict, device: str = "cpu") -> dict:
    """
    Simulate 'what if' scenarios.

    Args:
        logs: student daily logs
        adjustments: dict of feature adjustments, e.g. {"study_hours": 1.0}

    Returns:
        New prediction with adjusted features
    """
    if len(logs) < SEQUENCE_LENGTH:
        return _heuristic_prediction(logs)

    modified_logs = []
    for log in logs:
        new_log = log.copy()
        for key, delta in adjustments.items():
            if key in new_log:
                new_log[key] = new_log[key] + delta
        modified_logs.append(new_log)

    return predict_performance(modified_logs, device)


def _compute_feature_importance(model: StudentGrowthLSTM, x: torch.Tensor, device: str) -> dict:
    """Compute gradient-based feature importance for explainability."""
    x_grad = x.clone().requires_grad_(True)

    model.zero_grad()
    outputs = model(x_grad)
    score = outputs["predicted_score"].sum()
    score.backward()

    if x_grad.grad is not None:
        # Average absolute gradients across time steps
        importance = x_grad.grad.abs().mean(dim=1).squeeze(0).cpu().numpy()
        total = importance.sum()
        if total > 0:
            importance = importance / total

        return {name: round(float(val), 4) for name, val in zip(FEATURE_NAMES, importance)}

    return {name: 0.0 for name in FEATURE_NAMES}


def _heuristic_prediction(logs: list[dict]) -> dict:
    """Fallback heuristic when not enough data for LSTM."""
    if not logs:
        return {
            "predicted_score": 50.0,
            "burnout_risk": 0.3,
            "improvement_velocity": 0.0,
            "confidence_lower": 42.0,
            "confidence_upper": 58.0,
            "feature_importance": {n: 1.0 / len(FEATURE_NAMES) for n in FEATURE_NAMES},
        }

    recent = logs[-min(len(logs), 7):]
    avg_score = np.mean([l.get("mock_score", 50) for l in recent])
    avg_mood = np.mean([l.get("mood", 3) for l in recent])
    avg_conf = np.mean([l.get("confidence", 3) for l in recent])
    avg_hours = np.mean([l.get("study_hours", 4) for l in recent])

    burnout = max(0, min(1, (avg_hours / 12.0) * (1 - avg_mood / 5.0) * (1 - avg_conf / 5.0)))

    scores = [l.get("mock_score", 50) for l in recent]
    velocity = (scores[-1] - scores[0]) / max(len(scores), 1) if len(scores) > 1 else 0

    return {
        "predicted_score": round(float(avg_score), 2),
        "burnout_risk": round(float(burnout), 3),
        "improvement_velocity": round(float(velocity), 2),
        "confidence_lower": round(float(avg_score - 8), 2),
        "confidence_upper": round(float(avg_score + 8), 2),
        "feature_importance": {
            "study_hours": 0.20, "topics_completed": 0.10,
            "problems_solved": 0.18, "mock_score": 0.22,
            "confidence": 0.12, "mood": 0.08,
            "revision_done": 0.05, "skill_practiced": 0.05,
        },
    }
