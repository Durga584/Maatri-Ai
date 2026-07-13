# 🤱 Maatri AI – Intelligent Maternal Healthcare Assistant

Maatri AI is an AI-powered maternal healthcare application designed to assist pregnant women by combining **Machine Learning**, **Explainable AI**, and **Generative AI**. The application predicts maternal health risks, explains the prediction using SHAP, provides personalized healthcare recommendations, and answers pregnancy-related questions through Google's Gemini AI.

---

## 🌟 Features

### 🩺 Maternal Health Risk Prediction
- Predicts pregnancy risk as:
  - Low Risk
  - Mid Risk
  - High Risk
- Built using a trained **Random Forest Classifier**.

### 📊 Explainable AI (SHAP)
- Explains why the model predicted a particular risk level.
- Displays feature importance for every prediction.
- Improves transparency and trust in AI-assisted healthcare.

### 💡 Personalized Recommendations
- Generates health recommendations based on the predicted risk.
- Provides guidance on lifestyle, nutrition, and medical precautions.

### 🤖 AI Healthcare Chatbot
- Powered by **Google Gemini 2.5 Flash**.
- Answers pregnancy and maternal healthcare questions.
- Uses prompt engineering and safety instructions to provide responsible responses.

### 🗄 Assessment History
- Stores previous assessments using **SQLite**.
- Enables users to review past predictions.

### 📈 Data Visualization
- Displays prediction results and SHAP visualizations through an interactive Streamlit interface.

---

# 🏗 Project Architecture

```
                    User
                      │
                      ▼
             Streamlit Application
                      │
      ┌───────────────┼────────────────┐
      │               │                │
      ▼               ▼                ▼
Risk Prediction   AI Chatbot     Assessment History
      │               │                │
      ▼               ▼                ▼
Random Forest     Gemini API        SQLite
      │
      ▼
SHAP Explainability
      │
      ▼
Recommendation Engine
```

---

# 📂 Project Structure

```
Maatri-AI/
│
├── backend/
│   └── main.py                 # Streamlit application
│
├── database/
│   └── database.py             # SQLite operations
│
├── datasets/
│   └── download_dataset.py
│
├── llm/
│   ├── chatbot.py
│   ├── prompts.py
│   └── summary_generator.py
│
├── ml/
│   ├── preprocessing.py
│   ├── predict.py
│   ├── train_model.py
│   ├── evaluate.py
│   ├── shap_explainer.py
│   └── recommendations.py
│
├── notebooks/
│
├── requirements.txt
└── README.md
```

---

# 🔄 Application Workflow

1. User enters maternal health parameters.
2. Input data is preprocessed.
3. The trained Random Forest model predicts the maternal health risk.
4. SHAP explains which features influenced the prediction.
5. Personalized healthcare recommendations are generated.
6. The assessment is stored in SQLite.
7. Users can ask pregnancy-related questions to the Gemini-powered chatbot.
8. All outputs are displayed through the Streamlit interface.

---

# 🧠 Machine Learning Pipeline

Input Features:

- Age
- Systolic Blood Pressure
- Diastolic Blood Pressure
- Blood Sugar
- Body Temperature
- Heart Rate

↓

Preprocessing

↓

Random Forest Model

↓

Risk Prediction

↓

SHAP Explainability

↓

Healthcare Recommendations

---

# 🤖 AI Chatbot Workflow

```
User Question
      │
      ▼
Prompt Engineering
      │
      ▼
Google Gemini API
      │
      ▼
AI Response
      │
      ▼
Streamlit Interface
```

---

# 💾 Database

SQLite is used to store maternal health assessments including:

- Patient health parameters
- Predicted risk level
- Confidence score
- Timestamp

---

# 🛠 Technologies Used

| Technology | Purpose |
|------------|----------|
| Python | Core programming language |
| Streamlit | Web application interface |
| Scikit-learn | Machine Learning |
| Random Forest | Maternal risk prediction |
| SHAP | Explainable AI |
| Google Gemini 2.5 Flash | AI chatbot |
| Google GenAI SDK | Gemini integration |
| SQLite | Local database |
| Pandas | Data processing |
| NumPy | Numerical operations |
| Matplotlib | Data visualization |
| python-dotenv | Environment variable management |

---

# 🚀 Installation

Clone the repository

```bash
git clone https://github.com/Durga584/Maatri-Ai.git
```

Navigate to the project

```bash
cd Maatri-Ai
```

Install dependencies

```bash
pip install -r requirements.txt
```

Create a `.env` file

```text
GEMINI_API_KEY=your_api_key_here
```

Run the application

```bash
streamlit run backend/main.py
```

---

# 📌 Future Improvements

- User authentication
- Cloud database integration
- Multi-language support
- Doctor dashboard
- Appointment scheduling
- PDF health report generation
- Wearable device integration

---

# 👩‍💻 Author

**Durga Lakshmi Velagala**

B.Tech Computer Science and Engineering

Rajiv Gandhi University of Knowledge Technologies (RGUKT)

GitHub: https://github.com/Durga584

---

# 📜 License

This project is developed for educational and research purposes.
