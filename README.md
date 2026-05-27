# Maatri AI — LLM-Integrated Maternal Healthcare Intelligence System

Maatri AI is a maternal healthcare intelligence system that combines machine learning-based pregnancy risk prediction, explainable AI, personalized healthcare recommendations, and conversational AI support to provide intelligent maternal healthcare assistance for pregnant and postpartum women.

## Project Structure

```
maatri-ai/
│
├── datasets/
│   ├── download_dataset.py       # Helper script to fetch dataset
│   └── maternal_health_risk.csv  # Maternal Health Risk Dataset (downloded)
│
├── notebooks/
│   ├── maternal_risk_eda.ipynb   # Exploratory Data Analysis (EDA) notebook
│   ├── model_training.ipynb      # Interactive model training & selection
│   ├── shap_analysis.ipynb       # SHAP global and local explainability analysis
│   └── llm_testing.ipynb         # Testing Gemini API chatbot and summary generator
│
├── ml/
│   ├── risk_prediction/
│   │   ├── preprocessing.py      # Cleans, maps labels, and scales datasets
│   │   ├── train_model.py        # Compares Random Forest & XGBoost, saves the best model
│   │   ├── predict.py            # Runs inference & outputs risk and confidence
│   │   └── evaluate.py           # Generates classification reports and confusion matrices
│   │
│   ├── explainability/
│   │   └── shap_explainer.py     # Computes local SHAP contributions and generates plots
│   │
│   └── recommendation_engine/
│       └── recommendations.py    # Rule-based recommendations & supplement education notes
│
├── llm/
│   ├── chatbot.py                # Interfaces with Gemini API for postpartum and pregnancy chat
│   ├── prompts.py                # Stores system prompts and templates for LLM
│   └── summary_generator.py      # Generates natural-language reports combining ML + SHAP + rules
│
├── backend/
│   └── main.py                   # Streamlit demonstration user interface
│
├── models/                       # Folder where joblib models and scalers are saved
│
├── requirements.txt              # Project library dependencies
└── README.md                     # Documentation
```

## Features

1. **Pregnancy Risk Prediction**: Uses Random Forest and XGBoost to predict if a pregnancy is at **Low Risk**, **Mid Risk**, or **High Risk** based on clinical indicators (Age, BP, Blood Sugar, Temperature, Heart Rate).
2. **Explainable AI (SHAP)**: Identifies the exact physiological factors that contribute to a patient's risk category. Generates horizontal bar charts explaining predictions locally.
3. **Clinical Recommendation Engine**: Implements rules to guide users (e.g. limiting sodium for elevated BP, small meals for low blood sugar) and maps standard supplements (like Iron, Calcium, Folic Acid) to their educational purpose.
4. **Conversational Assistant**: Integrates Gemini API to answer pregnancy nutrition, symptom awareness, and postpartum care questions in a safe, educational, and supportive tone.
5. **Generative AI Health Summary**: Uses context-aware reasoning to synthesize ML outputs, SHAP explainability values, and recommendations into a natural-language report.
6. **Simple Streamlit Interface**: Demonstration interface to enter inputs, view outputs and plots, manage medication schedules, and chat.

## Installation & Setup

1. **Install Python 3.10+** (if not already installed).
2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
3. **Configure Gemini API**:
   Create a `.env` file in the root of the project:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *Alternatively, you can input your API key directly into the Streamlit UI.*

## Running the Application

1. **Launch the Interface**:
   Run the following command to start the Streamlit application:
   ```bash
   streamlit run backend/main.py
   ```
2. **Initialize/Train Model**:
   If launching the app for the first time, click the **"Train Model Now"** button in the sidebar to download the UCI Maternal Health Risk dataset and train/select the best ML model.

## Running the Jupyter Notebooks

To interact with the research and development notebooks:
1. Register the python kernel:
   ```bash
   python -m ipykernel install --user --name=maatri-ai
   ```
2. Open Jupyter:
   ```bash
   jupyter notebook
   ```
3. Run notebooks sequentially:
   - `notebooks/maternal_risk_eda.ipynb`
   - `notebooks/model_training.ipynb`
   - `notebooks/shap_analysis.ipynb`
   - `notebooks/llm_testing.ipynb`

## Medical Disclaimer

⚠️ **IMPORTANT**: Maatri AI is an educational tool. It does **not** prescribe medications, perform medical diagnoses, or replace professional care. Always consult an obstetrician or healthcare professional for medical concerns.
