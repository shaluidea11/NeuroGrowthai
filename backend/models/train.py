"""
NeuroGrowth AI - Model Training Pipeline
"""

import os
import json
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from sklearn.preprocessing import StandardScaler
from loguru import logger

from models.dl_model import StudentGrowthLSTM, get_model

SAVED_MODEL_DIR = "saved_models"
SEQUENCE_LENGTH = 14  # Look at last 14 days

# ─── Skill encoding map ──────────────────────────────────────────────────────
SKILL_MAP = {
    "DSA": 0, "ML": 1, "DBMS": 2, "OS": 3, "CN": 4,
    "Web Dev": 5, "Math": 6, "Aptitude": 7, "Soft Skills": 8, "Other": 9
}


class StudentDataset(Dataset):
    """PyTorch dataset for time-series student logs."""

    def __init__(self, sequences: np.ndarray, targets: np.ndarray):
        self.sequences = torch.FloatTensor(sequences)
        self.targets = torch.FloatTensor(targets)

    def __len__(self):
        return len(self.sequences)

    def __getitem__(self, idx):
        return self.sequences[idx], self.targets[idx]


def prepare_features(logs: list[dict]) -> np.ndarray:
    """Convert raw log dicts into feature matrix."""
    features = []
    for log in logs:
        skill_val = SKILL_MAP.get(log.get("skill_practiced", "Other"), 9) / 9.0
        features.append([
            log.get("study_hours", 0),
            log.get("topics_completed", 0),
            log.get("problems_solved", 0),
            log.get("mock_score", 0) / 100.0,
            log.get("confidence", 3) / 5.0,
            log.get("mood", 3) / 5.0,
            1.0 if log.get("revision_done", False) else 0.0,
            skill_val,
        ])
    return np.array(features, dtype=np.float32)


def create_sequences(features: np.ndarray, targets: np.ndarray, seq_len: int = SEQUENCE_LENGTH):
    """Create sliding-window sequences for LSTM input."""
    X, y = [], []
    for i in range(len(features) - seq_len):
        X.append(features[i : i + seq_len])
        y.append(targets[i + seq_len])
    return np.array(X), np.array(y)


def compute_targets(logs: list[dict]) -> np.ndarray:
    """
    Compute target labels from logs:
    [mock_score, burnout_risk, improvement_velocity, conf_lower, conf_upper]
    """
    targets = []
    for i, log in enumerate(logs):
        score = log.get("mock_score", 50.0)
        # Burnout heuristic: low mood + high hours + low confidence
        mood = log.get("mood", 3)
        conf = log.get("confidence", 3)
        hours = log.get("study_hours", 4)
        burnout = max(0, min(1, (hours / 12.0) * (1 - mood / 5.0) * (1 - conf / 5.0)))

        # Improvement velocity: score difference from recent average
        if i >= 3:
            recent_scores = [logs[j].get("mock_score", 50) for j in range(max(0, i - 3), i)]
            velocity = score - np.mean(recent_scores)
        else:
            velocity = 0.0

        targets.append([
            score / 100.0,
            burnout,
            velocity / 20.0,
            max(0, (score - 8)) / 100.0,
            min(100, (score + 8)) / 100.0,
        ])
    return np.array(targets, dtype=np.float32)


def train_model(
    all_logs: list[list[dict]],
    epochs: int = 50,
    batch_size: int = 32,
    lr: float = 0.001,
    device: str = "cpu",
) -> StudentGrowthLSTM:
    """
    Train the LSTM model on student logs.

    Args:
        all_logs: list of student log lists, each list contains dicts per day
        epochs: training epochs
        batch_size: batch size
        lr: learning rate
        device: 'cpu' or 'cuda'
    """
    logger.info(f"Training model on {len(all_logs)} students, {epochs} epochs")

    all_X, all_y = [], []
    for student_logs in all_logs:
        if len(student_logs) <= SEQUENCE_LENGTH:
            continue
        features = prepare_features(student_logs)
        targets = compute_targets(student_logs)
        X, y = create_sequences(features, targets)
        all_X.append(X)
        all_y.append(y)

    if not all_X:
        logger.warning("Not enough data for training, need > 14 days of logs")
        return get_model(device=device)

    X_train = np.concatenate(all_X)
    y_train = np.concatenate(all_y)

    dataset = StudentDataset(X_train, y_train)
    loader = DataLoader(dataset, batch_size=batch_size, shuffle=True)

    model = get_model(device=device)
    optimizer = torch.optim.AdamW(model.parameters(), lr=lr, weight_decay=1e-4)
    scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(optimizer, patience=5, factor=0.5)
    loss_fn = nn.MSELoss()

    model.train()
    for epoch in range(epochs):
        total_loss = 0
        for batch_X, batch_y in loader:
            batch_X, batch_y = batch_X.to(device), batch_y.to(device)

            outputs = model(batch_X)
            predictions = torch.stack([
                outputs["predicted_score"],
                outputs["burnout_risk"],
                outputs["improvement_velocity"],
                outputs["confidence_lower"],
                outputs["confidence_upper"],
            ], dim=1)

            loss = loss_fn(predictions, batch_y)
            optimizer.zero_grad()
            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
            optimizer.step()

            total_loss += loss.item()

        avg_loss = total_loss / len(loader)
        scheduler.step(avg_loss)

        if (epoch + 1) % 10 == 0:
            logger.info(f"Epoch {epoch+1}/{epochs} | Loss: {avg_loss:.4f}")

    # Save model
    os.makedirs(SAVED_MODEL_DIR, exist_ok=True)
    torch.save(model.state_dict(), os.path.join(SAVED_MODEL_DIR, "growth_model.pt"))
    logger.info("✅ Model saved to saved_models/growth_model.pt")

    return model
