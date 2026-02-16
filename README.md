# 🎓 NeuroGrowth AI

**Deep Learning–Based Student Growth Prediction & AI Roadmap Assistant System**

A production-ready, full-stack application that predicts upcoming exam performance based on daily improvement logs and provides personalized AI-generated roadmaps aligned with academic and career goals.

---

## 🚀 Features

| Feature | Description |
|---------|-------------|
| 📊 **Daily Growth Tracking** | Log study hours, problems solved, mock scores, confidence, mood, and more |
| 🤖 **LSTM + Attention Prediction** | Deep learning model predicts exam scores, burnout risk, and improvement velocity |
| 🗺️ **AI Roadmap Generator** | Personalized 30-day roadmap with daily tasks, mock test schedule, and revision cycles |
| 💬 **AI Chat Assistant** | Context-aware educational assistant for study tips, motivation, and career guidance |
| 🎯 **Learning Pattern Clustering** | KMeans + PCA clustering identifies learning styles (Fast Improver, Consistent Learner, etc.) |
| ⚡ **Performance Simulator** | "What-if" analysis: see how changes affect your predicted score |
| 🧠 **SHAP Explainability** | Gradient-based feature importance shows what impacts predictions most |
| 🔐 **JWT Authentication** | Role-based access control (Student / Admin) |
| 🛡️ **Admin Dashboard** | Risk heatmap, performance distribution, student clustering visualization |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js, React, Tailwind CSS, Recharts |
| **Backend** | FastAPI, SQLAlchemy |
| **Database** | PostgreSQL |
| **ML/DL** | PyTorch (LSTM + Attention), Scikit-learn |
| **AI** | HuggingFace Transformers (optional) / Rule-based fallback |
| **Auth** | JWT (python-jose, passlib) |
| **Deploy** | Docker, Docker Compose |

---

## 📁 Project Structure

```
neurogrowth-ai/
├── frontend/
│   ├── pages/              # Next.js pages (index, dashboard, admin)
│   ├── components/         # React components (9 components)
│   ├── services/           # API client
│   ├── styles/             # Global CSS with Tailwind
│   ├── Dockerfile
│   └── package.json
├── backend/
│   ├── main.py             # FastAPI entry point
│   ├── database.py         # SQLAlchemy models
│   ├── models/
│   │   ├── dl_model.py     # LSTM + Attention architecture
│   │   ├── train.py        # Training pipeline
│   │   └── inference.py    # Prediction + SHAP
│   ├── services/
│   │   ├── roadmap_engine.py   # 30-day roadmap generator
│   │   ├── assistant.py        # AI chat assistant
│   │   └── clustering.py       # KMeans + PCA
│   ├── routes/
│   │   ├── auth.py         # Register, login, profile
│   │   ├── logs.py         # Daily log CRUD
│   │   ├── prediction.py   # Predict + simulate
│   │   ├── roadmap.py      # Roadmap generation
│   │   ├── assistant.py    # Chat endpoint + dashboard
│   │   └── admin.py        # Admin endpoints
│   ├── utils/
│   │   ├── auth.py         # JWT utilities
│   │   └── seed.py         # Synthetic data generator
│   └── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── .env.example
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites
- **Python 3.11+**
- **Node.js 18+**
- **PostgreSQL** (or use Docker)

### 1. Clone & Configure

```bash
cd neurogrowth-ai
cp .env.example .env
# Edit .env with your database credentials
```

### 2. Backend Setup

```bash
# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Start backend
cd backend
uvicorn main:app --reload --port 8000
```

### 3. Seed Database (Optional)

```bash
cd backend
python utils/seed.py
# Creates 20 students + 1 admin with 30 days of synthetic data
# Admin: admin@neurogrowth.ai / admin123
# Students: <name>@student.edu / student123
```

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:3000
```

### 5. Docker (Alternative)

```bash
docker-compose up --build
# Backend: http://localhost:8000
# Frontend: http://localhost:3000
```

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login (returns JWT) |
| GET | `/auth/me` | Get current user profile |
| POST | `/log-daily` | Submit daily study log |
| GET | `/logs/{student_id}` | Get student's logs |
| GET | `/predict/{student_id}` | Get AI prediction |
| POST | `/simulate` | Run what-if simulation |
| POST | `/generate-roadmap` | Generate 30-day roadmap |
| GET | `/roadmap/{student_id}` | Get latest roadmap |
| POST | `/chat-assistant` | Chat with AI assistant |
| GET | `/dashboard/{student_id}` | Get full dashboard data |
| GET | `/admin/students` | List all students |
| GET | `/admin/clustering` | Get clustering data |
| GET | `/admin/risk-heatmap` | Get burnout risk heatmap |
| POST | `/admin/retrain` | Retrain ML model |

---

## 🧠 ML Model Architecture

```
Input (8 features × 14 days) → LayerNorm → LSTM (2 layers, 128 hidden)
    → Self-Attention → Dense (128→64→32→5) → Multi-Head Output:
        ├── Score Head → Predicted Exam Score
        ├── Burnout Head (Sigmoid) → Burnout Risk (0-1)
        ├── Velocity Head → Improvement Velocity
        └── Confidence Head → [Lower, Upper] Bounds
```

---

## 📜 License

MIT License — Feel free to use, modify, and distribute.
