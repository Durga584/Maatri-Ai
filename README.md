# 🤱 Maatri AI – Enterprise Full-Stack Maternal Healthcare Intelligence Platform

Maatri AI is a production-grade AI-powered maternal healthcare platform combining **Machine Learning**, **Explainable AI (SHAP)**, **Generative AI (Gemini RAG)**, **FastAPI REST Services**, and a modern **React 19 + TypeScript** frontend.

The application predicts maternal health risks, provides SHAP-based feature impact explainability, offers personalized clinical care recommendations, answers pregnancy questions via Gemini RAG, generates downloadable PDF reports, and maintains patient assessment logs in SQLite.

---

## 🌟 Key Features

### 🩺 1. Maternal Health Risk Prediction
- Evaluates 6 key physiological parameters: Age, Systolic BP, Diastolic BP, Blood Glucose (BS), Body Temperature, and Heart Rate.
- Categorizes risk into **Low Risk**, **Mid Risk**, or **High Risk** with AI confidence scores and category probability distributions using a trained **Random Forest Classifier**.

### 📊 2. Explainable AI (SHAP)
- Quantifies positive and negative force contributions of each vital sign using **SHAP (SHapley Additive exPlanations)**.
- Renders interactive feature impact bar graphs detailing how specific blood pressure or blood sugar values influenced the prediction score.

### 💡 3. Clinical Guidelines & Recommendations
- Generates rule-based clinical alerts for elevated blood pressure (>130 mmHg), elevated glucose (>7.0 mmol/L), or fever.
- Provides actionable lifestyle guidance on prenatal hydration, nutrition, and vital sign monitoring.

### 🤖 4. AI Healthcare Chatbot (Gemini RAG)
- Powered by **Google Gemini LLM** with Retrieval-Augmented Generation (RAG) and medical guardrails.
- Supports multi-turn conversations, typing indicators, suggested prompt pills, copy actions, and **Markdown / GFM rendering**.

### 📈 5. Population Analytics & Interactive Dashboard
- Displays risk category distribution donut charts, monthly prediction volume area charts, and aggregate feature importance rankings using **Recharts**.

### 📜 6. PDF Health Report Generation
- Generates formal clinical PDF reports complete with patient details, vital metrics table, risk breakdown, and recommendations using **jsPDF**.

### 🗄 7. Assessment History & SQLite Database
- Persists all patient risk predictions in a local **SQLite database** (`maatri.db`).
- Supports search, risk level filtering, column sorting, pagination, record deletion, and CSV export.

---

## 🏗 Full-Stack System Architecture

```text
React 19 Frontend (Vite + TypeScript + Tailwind CSS)
          │
          │ REST API (Axios / TanStack Query)
          ▼
FastAPI REST Backend (backend/api.py)
          │
  ├── ML Model (Random Forest Risk Prediction in ml/risk_prediction/predict.py)
  ├── SHAP Explainer (MaatriSHAPExplainer in ml/explainability/shap_explainer.py)
  ├── Gemini Chatbot & RAG (MaatriChatbot in llm/chatbot.py)
  ├── Recommendations Engine (get_recommendations in ml/recommendation_engine/recommendations.py)
  └── SQLite Database (database/database.py)
```

---

## 📂 Project Structure

```text
Maatri-AI/
├── backend/
│   ├── api.py                  # FastAPI REST API wrapper server
│   ├── main.py                 # Streamlit application (retained for demo)
│   └── test_api.py             # Integration test suite for REST endpoints
│
├── frontend/                   # React 19 + TypeScript Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/             # Button, Input, Card, Modal, Toast, Badge, Loader, Progress
│   │   │   ├── layout/         # Navbar, Sidebar, Footer, DashboardLayout
│   │   │   ├── charts/         # RiskDistributionChart, PredictionTrendsChart, FeatureImportanceChart
│   │   │   ├── prediction/     # PredictionForm, SHAPVisualization
│   │   │   ├── chat/           # ChatMessage, ChatInput
│   │   │   ├── history/        # HistoryTable, HistoryDetailModal
│   │   │   └── report/         # ReportPreview
│   │   ├── contexts/           # AuthContext, ThemeContext, ToastContext
│   │   ├── pages/              # LandingPage, LoginPage, RegisterPage, DashboardPage, PredictionPage, ChatPage, HistoryPage, AnalyticsPage, ReportsPage, ProfilePage, SettingsPage
│   │   ├── services/           # api.ts, predictionService.ts, chatService.ts, historyService.ts, analyticsService.ts, authService.ts
│   │   ├── styles/             # index.css (Tailwind CSS & Glassmorphism tokens)
│   │   ├── types/              # index.ts (TypeScript interface definitions)
│   │   └── utils/              # pdfGenerator.ts
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── database/
│   └── database.py             # SQLite CRUD operations
├── datasets/
│   └── download_dataset.py     # Maternal health dataset downloader
├── llm/
│   ├── chatbot.py              # Gemini LLM Chatbot engine
│   ├── prompts.py              # System prompts & medical guardrails
│   └── summary_generator.py    # Generative AI summary generator
├── ml/
│   ├── explainability/         # SHAP explainer module
│   ├── recommendation_engine/  # Recommendation rules
│   └── risk_prediction/        # Random Forest model training & inference
├── models/                     # Trained joblib model artifacts
├── maatri.db                   # SQLite Database
├── requirements.txt            # Python dependencies
└── README.md
```

---

## 📡 FastAPI REST Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Backend status & model readiness check |
| `POST` | `/api/predict` | Executes Random Forest model, SHAP explainer, & saves assessment |
| `POST` | `/api/chat` | Gemini RAG multi-turn AI chatbot endpoint |
| `GET` | `/api/history` | Fetches SQLite assessment history with optional risk filter |
| `DELETE` | `/api/history/{id}` | Deletes specific assessment record from SQLite |
| `GET` | `/api/analytics` | Computes risk distribution & monthly vital averages |
| `POST` | `/api/auth/login` | User authentication endpoint |
| `POST` | `/api/auth/register` | New user account registration |
| `GET` | `/api/auth/profile` | Fetches maternal user profile details |

---

## 🛠 Tech Stack

| Domain | Technology |
| :--- | :--- |
| **Frontend Core** | React 19, TypeScript, Vite, Tailwind CSS |
| **State & Fetching** | TanStack Query v5, Axios |
| **UI & Icons** | Lucide React, Framer Motion |
| **Data Charts** | Recharts (Donut, Area, Bar charts) |
| **Form Validation** | React Hook Form, Zod |
| **PDF Reports** | jsPDF |
| **Markdown** | React Markdown, Remark GFM |
| **Backend REST** | FastAPI, Uvicorn, Pydantic |
| **Machine Learning** | Scikit-Learn (Random Forest), SHAP |
| **Generative AI** | Google Gemini LLM (`google-genai` SDK) |
| **Database** | SQLite3 |

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.10+
- Node.js 18+ & npm

### 1. Clone & Setup Repository
```bash
git clone https://github.com/Durga584/Maatri-Ai.git
cd Maatri-Ai
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

### 3. Install Python Dependencies & Start FastAPI Server
```bash
pip install -r requirements.txt

# Launch FastAPI REST backend on port 8000
python -m uvicorn backend.api:app --host 127.0.0.1 --port 8000 --reload
```

### 4. Install Frontend Dependencies & Start React App
```bash
cd frontend
npm install

# Launch Vite dev server on port 5173
npm run dev
```
Open `http://localhost:5173` in your browser to view the application.

---

## 🧪 Running Automated Tests

Run the backend integration test suite verifying all FastAPI endpoints:
```bash
python backend/test_api.py
```

---

## 👩‍💻 Author

**Durga Lakshmi Velagala**  
B.Tech Computer Science and Engineering  
Rajiv Gandhi University of Knowledge Technologies (RGUKT)  
GitHub: [https://github.com/Durga584](https://github.com/Durga584)

---

## 📜 License

This project is developed for educational, clinical research, and demonstration purposes.
