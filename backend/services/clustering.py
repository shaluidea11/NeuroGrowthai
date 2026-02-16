"""
NeuroGrowth AI - Learning Pattern Clustering
KMeans-based student clustering with PCA visualization
"""

import numpy as np
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from loguru import logger
from typing import Optional


LEARNING_STYLES = {
    0: {"name": "Fast Improver", "description": "Rapidly improving scores with high engagement", "color": "#10B981"},
    1: {"name": "Consistent Learner", "description": "Steady, reliable study habits and scores", "color": "#3B82F6"},
    2: {"name": "Last-Minute Crammer", "description": "Low daily effort with spikes before exams", "color": "#F59E0B"},
    3: {"name": "Burnout Prone", "description": "High effort but declining mood and performance", "color": "#EF4444"},
}


def extract_student_profile(logs: list[dict]) -> Optional[np.ndarray]:
    """Extract aggregate features from a student's daily logs for clustering."""
    if not logs or len(logs) < 3:
        return None

    study_hours = [l.get("study_hours", 0) for l in logs]
    problems = [l.get("problems_solved", 0) for l in logs]
    scores = [l.get("mock_score", 50) for l in logs]
    confidence = [l.get("confidence", 3) for l in logs]
    mood = [l.get("mood", 3) for l in logs]
    revision = [1 if l.get("revision_done", False) else 0 for l in logs]

    # Feature engineering for clustering
    profile = [
        np.mean(study_hours),
        np.std(study_hours),
        np.mean(problems),
        np.mean(scores),
        np.std(scores),
        # Score trend (improvement velocity)
        (scores[-1] - scores[0]) / max(len(scores), 1),
        np.mean(confidence),
        np.mean(mood),
        # Mood trend
        (mood[-1] - mood[0]) / max(len(mood), 1) if len(mood) > 1 else 0,
        np.mean(revision),
        # Consistency (inverse of variance)
        1.0 / (np.std(study_hours) + 1),
    ]
    return np.array(profile, dtype=np.float32)


def cluster_students(all_logs: dict[int, list[dict]], n_clusters: int = 4) -> dict:
    """
    Cluster students by learning patterns.

    Args:
        all_logs: dict mapping student_id -> list of daily logs
        n_clusters: number of clusters

    Returns:
        dict with cluster_labels, pca_data, cluster_info
    """
    student_ids = []
    profiles = []

    for sid, logs in all_logs.items():
        profile = extract_student_profile(logs)
        if profile is not None:
            student_ids.append(sid)
            profiles.append(profile)

    if len(profiles) < n_clusters:
        logger.warning(f"Not enough students ({len(profiles)}) for {n_clusters} clusters")
        return {"cluster_labels": {}, "pca_data": [], "cluster_info": LEARNING_STYLES}

    X = np.array(profiles)
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # KMeans clustering
    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    labels = kmeans.fit_predict(X_scaled)

    # PCA for visualization
    pca = PCA(n_components=2)
    pca_coords = pca.fit_transform(X_scaled)

    # Build results
    cluster_labels = {int(sid): int(label) for sid, label in zip(student_ids, labels)}

    pca_data = []
    for i, sid in enumerate(student_ids):
        pca_data.append({
            "student_id": int(sid),
            "x": round(float(pca_coords[i, 0]), 4),
            "y": round(float(pca_coords[i, 1]), 4),
            "cluster": int(labels[i]),
            "style": LEARNING_STYLES.get(int(labels[i]), LEARNING_STYLES[0]),
        })

    logger.info(f"✅ Clustered {len(profiles)} students into {n_clusters} groups")

    return {
        "cluster_labels": cluster_labels,
        "pca_data": pca_data,
        "cluster_info": LEARNING_STYLES,
        "explained_variance": [round(float(v), 4) for v in pca.explained_variance_ratio_],
    }


def get_student_cluster(student_logs: list[dict], all_logs: dict[int, list[dict]]) -> dict:
    """Determine which learning style cluster a single student belongs to."""
    profile = extract_student_profile(student_logs)
    if profile is None:
        return {"cluster": 1, "style": LEARNING_STYLES[1]}

    # Get all profiles
    profiles = []
    for logs in all_logs.values():
        p = extract_student_profile(logs)
        if p is not None:
            profiles.append(p)

    if len(profiles) < 4:
        # Heuristic fallback
        scores = [l.get("mock_score", 50) for l in student_logs]
        mood = [l.get("mood", 3) for l in student_logs]
        velocity = (scores[-1] - scores[0]) / max(len(scores), 1) if len(scores) > 1 else 0

        if velocity > 2:
            return {"cluster": 0, "style": LEARNING_STYLES[0]}
        elif np.mean(mood) < 2.5:
            return {"cluster": 3, "style": LEARNING_STYLES[3]}
        elif np.std([l.get("study_hours", 0) for l in student_logs]) > 3:
            return {"cluster": 2, "style": LEARNING_STYLES[2]}
        else:
            return {"cluster": 1, "style": LEARNING_STYLES[1]}

    X = np.array(profiles + [profile])
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
    labels = kmeans.fit_predict(X_scaled)

    cluster = int(labels[-1])
    return {"cluster": cluster, "style": LEARNING_STYLES.get(cluster, LEARNING_STYLES[1])}
