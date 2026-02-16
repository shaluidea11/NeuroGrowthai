"""
NeuroGrowth AI - LSTM + Attention Deep Learning Model
PyTorch implementation for student performance prediction
"""

import torch
import torch.nn as nn
import math


class AttentionLayer(nn.Module):
    """Scaled dot-product self-attention for time-series features."""

    def __init__(self, hidden_size: int):
        super().__init__()
        self.query = nn.Linear(hidden_size, hidden_size)
        self.key = nn.Linear(hidden_size, hidden_size)
        self.value = nn.Linear(hidden_size, hidden_size)
        self.scale = math.sqrt(hidden_size)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # x: (batch, seq_len, hidden)
        Q = self.query(x)
        K = self.key(x)
        V = self.value(x)

        scores = torch.bmm(Q, K.transpose(1, 2)) / self.scale
        weights = torch.softmax(scores, dim=-1)
        attended = torch.bmm(weights, V)
        return attended


class StudentGrowthLSTM(nn.Module):
    """
    LSTM + Attention model for predicting student performance.

    Input features (per timestep):
        study_hours, topics_completed, problems_solved, mock_score,
        confidence, mood, revision_done, skill_encoded

    Outputs:
        predicted_score, burnout_risk, improvement_velocity,
        confidence_lower, confidence_upper
    """

    def __init__(
        self,
        input_size: int = 8,
        hidden_size: int = 128,
        num_layers: int = 2,
        dropout: float = 0.3,
        output_size: int = 5,
    ):
        super().__init__()

        self.input_size = input_size
        self.hidden_size = hidden_size
        self.num_layers = num_layers

        # Input normalization
        self.input_norm = nn.LayerNorm(input_size)

        # LSTM layers
        self.lstm = nn.LSTM(
            input_size=input_size,
            hidden_size=hidden_size,
            num_layers=num_layers,
            batch_first=True,
            dropout=dropout if num_layers > 1 else 0,
            bidirectional=False,
        )

        # Attention mechanism
        self.attention = AttentionLayer(hidden_size)

        # Output layers
        self.fc = nn.Sequential(
            nn.Linear(hidden_size, 64),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(64, 32),
            nn.ReLU(),
            nn.Dropout(dropout / 2),
            nn.Linear(32, output_size),
        )

        # Separate heads for different outputs
        self.score_head = nn.Linear(output_size, 1)       # predicted_score
        self.burnout_head = nn.Sequential(                  # burnout_risk (0-1)
            nn.Linear(output_size, 1),
            nn.Sigmoid()
        )
        self.velocity_head = nn.Linear(output_size, 1)     # improvement_velocity
        self.confidence_head = nn.Linear(output_size, 2)   # lower, upper bounds

    def forward(self, x: torch.Tensor) -> dict:
        """
        Args:
            x: (batch_size, seq_len, input_size)
        Returns:
            dict with predicted_score, burnout_risk, improvement_velocity,
                  confidence_lower, confidence_upper
        """
        # Normalize input
        x = self.input_norm(x)

        # LSTM encoding
        lstm_out, _ = self.lstm(x)  # (batch, seq, hidden)

        # Attention
        attended = self.attention(lstm_out)  # (batch, seq, hidden)

        # Use last timestep
        last_hidden = attended[:, -1, :]  # (batch, hidden)

        # Shared features
        features = self.fc(last_hidden)  # (batch, output_size)

        # Multi-head outputs
        pred_score = self.score_head(features).squeeze(-1)
        burnout = self.burnout_head(features).squeeze(-1)
        velocity = self.velocity_head(features).squeeze(-1)
        conf_bounds = self.confidence_head(features)

        return {
            "predicted_score": pred_score,
            "burnout_risk": burnout,
            "improvement_velocity": velocity,
            "confidence_lower": conf_bounds[:, 0],
            "confidence_upper": conf_bounds[:, 1],
        }


def get_model(input_size: int = 8, device: str = "cpu") -> StudentGrowthLSTM:
    """Factory function to create and return the model."""
    model = StudentGrowthLSTM(input_size=input_size)
    return model.to(device)
