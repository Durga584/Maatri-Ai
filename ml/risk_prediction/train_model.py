import os
import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier

from ml.risk_prediction.preprocessing import preprocess_train_data, clean_and_inspect_data
from ml.risk_prediction.evaluate import evaluate_predictions, print_evaluation_report

# Paths
DEFAULT_CSV_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    'datasets',
    'maternal_health_risk.csv'
)
MODELS_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    'models'
)

def train_and_select_best_model(csv_path=DEFAULT_CSV_PATH):
    print(f"Loading data from {csv_path}...")
    
    # 1. Preprocess data
    scaler_path = os.path.join(MODELS_DIR, 'preprocessor.joblib')
    X_train, X_test, y_train, y_test, scaler, inspect_info = preprocess_train_data(
        csv_path, test_size=0.2, random_state=42, save_scaler_path=scaler_path
    )
    
    print("\nData inspection info:")
    print(f"Shape: {inspect_info['shape']}")
    print(f"Duplicates: {inspect_info['duplicates']}")
    print(f"Target Distribution: {inspect_info['target_distribution']}")
    print("-" * 60)
    
    # 2. Train Random Forest
    print("\nTraining Random Forest model...")
    rf_model = RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced')
    rf_model.fit(X_train, y_train)
    rf_preds = rf_model.predict(X_test)
    rf_metrics = evaluate_predictions(y_test, rf_preds)
    print_evaluation_report("Random Forest", rf_metrics)
    
    # 3. Train XGBoost
    print("\nTraining XGBoost model...")
    # XGBClassifier handles multiclass. objective='multi:softprob' is default for multiclass
    xgb_model = XGBClassifier(
        n_estimators=100,
        random_state=42,
        eval_metric='mlogloss',
        use_label_encoder=False
    )
    xgb_model.fit(X_train, y_train)
    xgb_preds = xgb_model.predict(X_test)
    xgb_metrics = evaluate_predictions(y_test, xgb_preds)
    print_evaluation_report("XGBoost", xgb_metrics)
    
    # 4. Compare models and select best
    # We choose the model with the highest macro F1-score
    rf_f1 = rf_metrics['f1_macro']
    xgb_f1 = xgb_metrics['f1_macro']
    
    print("\n" + "=" * 60)
    print(" MODEL SELECTION RESULTS ".center(60, "="))
    print(f"Random Forest Macro F1: {rf_f1:.4f}")
    print(f"XGBoost Macro F1:       {xgb_f1:.4f}")
    
    best_model_name = ""
    best_model = None
    best_metrics = None
    
    if rf_f1 >= xgb_f1:
        best_model_name = "Random Forest"
        best_model = rf_model
        best_metrics = rf_metrics
    else:
        best_model_name = "XGBoost"
        best_model = xgb_model
        best_metrics = xgb_metrics
        
    print(f"--> Selected Best Model: {best_model_name}")
    print("=" * 60)
    
    # 5. Save best model
    os.makedirs(MODELS_DIR, exist_ok=True)
    best_model_path = os.path.join(MODELS_DIR, 'best_model.joblib')
    
    # Save a wrapper dictionary with metadata
    model_data = {
        'model_name': best_model_name,
        'model': best_model,
        'metrics': best_metrics,
        'features': list(X_train.columns)
    }
    
    joblib.dump(model_data, best_model_path)
    print(f"Saved best model details to {best_model_path}")
    
    return best_model_name, best_model_path, best_metrics

if __name__ == "__main__":
    train_and_select_best_model()
