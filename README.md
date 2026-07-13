# 🤱 Maatri AI – Intelligent Maternal Healthcare Assistant

## Overview

Maatri AI is an AI-powered maternal healthcare intelligence system designed to assist pregnant women and new mothers through personalized risk assessment, explainable machine learning, evidence-based recommendations, and conversational AI support.

The project combines **Machine Learning**, **Large Language Models (LLMs)**, **Retrieval-Augmented Generation (RAG)**, and **Explainable AI (SHAP)** to provide safe, transparent, and context-aware maternal healthcare guidance.

> **Disclaimer:** Maatri AI is an educational and informational assistant. It does not replace professional medical advice, diagnosis, or treatment.

---

# Features

### 🤖 AI Chat Assistant

* Conversational maternal healthcare assistant powered by Gemini.
* Answers pregnancy, postpartum, nutrition, and newborn care questions.
* Uses prompt engineering and safety guardrails to minimize unsafe responses.

### 📚 Retrieval-Augmented Generation (RAG)

* Retrieves relevant information from a curated maternal healthcare knowledge base.
* Generates context-aware and evidence-based responses instead of relying only on the LLM's internal knowledge.

### 🩺 Pregnancy Risk Prediction

Predicts maternal health risk as:

* Low Risk
* Mid Risk
* High Risk

using clinical parameters including:

* Age
* Systolic Blood Pressure
* Diastolic Blood Pressure
* Blood Sugar
* Body Temperature
* Heart Rate

### 📊 Explainable AI

Uses SHAP (SHapley Additive Explanations) to explain:

* Why a prediction was made
* Which health parameters contributed most
* Individual feature importance for each prediction

### 💡 Personalized Recommendations

Provides:

* Lifestyle recommendations
* Nutrition guidance
* Supplement awareness
* Health precautions
* Risk-specific suggestions

### 📈 Interactive Dashboard

* User-friendly Streamlit interface
* Risk prediction visualization
* SHAP explanation plots
* AI-generated healthcare summaries
* Conversational chatbot interface

---

# Project Architecture

```
Maatri AI
│
├── Streamlit Frontend
│
├── FastAPI Backend
│
├── Database Layer
│
├── Machine Learning Module
│      ├── Data Preprocessing
│      ├── Model Training
│      ├── Risk Prediction
│      └── SHAP Explainability
│
├── Recommendation Engine
│
├── RAG Pipeline
│      ├── Document Loader
│      ├── Text Chunking
│      ├── Embedding Generation
│      ├── Vector Database
│      └── Context Retrieval
│
└── Gemini LLM
       │
       └── Final AI Response
```

---

# Tech Stack

## Programming Languages

* Python

## Frontend

* Streamlit

## Backend

* FastAPI

## Machine Learning

* Scikit-learn
* Random Forest
* XGBoost
* Pandas
* NumPy

## Explainable AI

* SHAP

## LLM & AI

* Google Gemini
* LangChain
* Prompt Engineering

## RAG

* ChromaDB
* FAISS
* HuggingFace Embeddings (all-MiniLM-L6-v2)

## Database

* SQLite

## Visualization

* Matplotlib

---

# Project Structure

```
maatri-ai/
│
├── backend/
├── database/
├── datasets/
├── llm/
├── ml/
│   ├── explainability/
│   ├── recommendation_engine/
│   └── risk_prediction/
│
├── notebooks/
├── models/
├── requirements.txt
├── README.md
└── .env
```

---

# Installation

Clone the repository:

```bash
git clone <repository-url>
cd maatri-ai
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the environment:

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file:

```env
GEMINI_API_KEY=your_api_key_here
```

---

# Running the Project

Start the backend:

```bash
uvicorn backend.main:app --reload
```

If using Streamlit:

```bash
streamlit run backend/main.py
```

---

# Machine Learning Workflow

1. Load maternal health dataset.
2. Perform preprocessing.
3. Train ML models.
4. Select the best-performing model.
5. Predict maternal health risk.
6. Generate SHAP explanations.
7. Produce personalized recommendations.
8. Display results in the dashboard.

---

# AI Workflow

1. User submits a healthcare query.
2. Relevant documents are retrieved from the vector database.
3. Retrieved context is combined with the prompt.
4. Gemini generates a context-aware response.
5. Safety guardrails validate the output.
6. The final response is displayed to the user.

---

# Key Highlights

* AI-powered maternal healthcare assistant
* Explainable Machine Learning
* Retrieval-Augmented Generation (RAG)
* Prompt Engineering
* Context-aware healthcare chatbot
* Personalized recommendations
* Interactive dashboard
* Modular project architecture
* Production-ready code organization

---

# Future Enhancements

* Voice-based interaction
* Multi-language support
* Appointment scheduling
* Doctor dashboard
* Electronic Health Record (EHR) integration
* Mobile application
* Wearable device integration
* Cloud deployment

---

# Medical Disclaimer

Maatri AI is intended for educational and informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Users should always consult qualified healthcare professionals for medical concerns.
