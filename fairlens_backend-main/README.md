# FairLens Backend — AI Bias Auditor API

<div align="center">

![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Grok](https://img.shields.io/badge/Grok_AI-xAI-000000?style=for-the-badge&logo=x&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**Fairness Analysis Engine + Grok AI for Indian Public Datasets**

[Frontend Repo](https://github.com/NAME-ASHWANIYADAV/fairlens_frontend) · [API Docs](#api-endpoints) · [Setup Guide](#quick-start)

</div>

---

## 🔍 What is FairLens?

FairLens is an AI-powered bias auditor that detects discrimination in datasets and AI systems — built specifically for the Indian context. It identifies bias across **caste, gender, religion, location, income**, and other protected attributes using statistical fairness tests.

### Key Features

- 🧮 **4 Statistical Fairness Tests** — Demographic Parity, Disparate Impact (80% Rule), Equalized Odds, Group Size Balance
- 🤖 **Grok AI Integration** — Auto-detects protected attributes, generates AI explanations, powers conversational bias explorer
- 🇮🇳 **India-First** — Recognizes caste categories (General/OBC/SC/ST), Indian terms (jati, ling, tehsil), Hindi/English chat
- 📊 **Full Pipeline** — Upload CSV → Auto-detect → Analyze → Score → AI Report → Chat
- 🔒 **Heuristic Fallback** — Works even without API key using keyword-based column detection

---

## 🏗️ Architecture

```
backend/
├── main.py              # FastAPI app + CORS middleware
├── .env                 # Grok API key (not in git)
├── .env.example         # Template for .env
├── requirements.txt     # Python dependencies
├── engine/
│   ├── __init__.py
│   └── fairness.py      # 4 statistical fairness tests + scoring
├── services/
│   ├── __init__.py
│   └── grok.py          # Grok API client (xAI)
└── routes/
    ├── __init__.py
    ├── upload.py         # POST /api/upload
    ├── analyze.py        # POST /api/analyze + GET /api/report/:id
    └── chat.py           # POST /api/chat
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- [Grok API Key](https://console.x.ai/) (optional — heuristic fallback available)

### Setup

```bash
# Clone the repo
git clone https://github.com/NAME-ASHWANIYADAV/fairlens_backend.git
cd fairlens_backend

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your Grok API key

# Start the server
python -m uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/upload` | Upload CSV/JSON/XLSX file → returns session_id + metadata |
| `POST` | `/api/analyze` | Run fairness analysis → returns score, findings, AI explanation |
| `GET` | `/api/report/:id` | Retrieve a saved report by session ID |
| `POST` | `/api/chat` | Chat with Grok AI about bias findings |

### Example: Upload & Analyze

```bash
# Upload
curl -X POST http://localhost:8000/api/upload \
  -F "file=@sample_data/UP_Loan_Approvals_2024.csv"

# Analyze (use session_id from upload response)
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"session_id": "YOUR_SESSION_ID", "description": "Loan approval data"}'
```

---

## 🧮 Fairness Tests

| # | Test | What It Checks | Threshold |
|---|------|---------------|-----------|
| 1 | **Demographic Parity** | Equal positive outcome rate across groups | < 10% disparity = Fair |
| 2 | **Disparate Impact (80% Rule)** | Minority rate / Majority rate | ≥ 0.80 = Fair |
| 3 | **Equalized Odds** | Rate gap across groups | < 10% = Fair |
| 4 | **Group Size Balance** | Representation of minority groups | ≥ 0.30 ratio = Fair |

### Sample Output
```
Score: 18/100 (High Risk)
├── Caste: CRITICAL — SC/ST approval 15% vs General 85%
├── Gender: CRITICAL — Female 30% vs Male 70%  
├── Religion: WARNING — Muslim 35% vs Hindu 65%
└── Age: PASS — Consistent across groups
```

---

## 🔗 Frontend

The React frontend is in a separate repo:
👉 [fairlens_frontend](https://github.com/NAME-ASHWANIYADAV/fairlens_frontend)

Make sure to update the CORS origins in `main.py` if your frontend runs on a different port.

---

## 📄 License

MIT License — Built for the [Google Solution Challenge 2026](https://developers.google.com/community/gdsc-solution-challenge)
