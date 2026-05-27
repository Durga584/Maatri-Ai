import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib

# Risk level mappings
RISK_MAPPING = {
    'low risk': 0,
    'mid risk': 1,
    'high risk': 2
}

INV_RISK_MAPPING = {
    0: 'Low Risk',
    1: 'Mid Risk',
    2: 'High Risk'
}

FEATURE_COLS = ['Age', 'SystolicBP', 'DiastolicBP', 'BS', 'BodyTemp', 'HeartRate']
TARGET_COL = 'RiskLevel'

def clean_and_inspect_data(df):
    """
    Perform basic data quality checks and return diagnostic info.
    """
    info = {
        'shape': df.shape,
        'missing_values': df.isnull().sum().to_dict(),
        'duplicates': int(df.duplicated().sum()),
        'dtypes': df.dtypes.astype(str).to_dict()
    }
    
    # Analyze target distribution
    if TARGET_COL in df.columns:
        # Standardize target strings
        df[TARGET_COL] = df[TARGET_COL].str.strip().str.lower()
        info['target_distribution'] = df[TARGET_COL].value_counts().to_dict()
        
    return df, info

def preprocess_train_data(csv_path, test_size=0.2, random_state=42, save_scaler_path=None):
    """
    Load training data, inspect it, map targets, scale features, and perform train-test split.
    """
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Dataset not found at {csv_path}")
        
    df = pd.read_csv(csv_path)
    
    # Inspect and clean
    df, inspect_info = clean_and_inspect_data(df)
    
    # Drop duplicates if any (or keep them - in medical data, identical rows can exist, 
    # but we can optionally drop or keep. Let's keep them as they could represent different patients,
    # but note them in EDA).
    
    # Separate features and target
    X = df[FEATURE_COLS].copy()
    y = df[TARGET_COL].map(RISK_MAPPING)
    
    # Check for unmapped targets
    if y.isnull().any():
        # Fallback or drop rows with unmapped target
        unmapped_mask = y.isnull()
        print(f"Warning: Found unmapped target values: {df.loc[unmapped_mask, TARGET_COL].unique()}")
        df = df.dropna(subset=[TARGET_COL])
        X = df[FEATURE_COLS].copy()
        y = df[TARGET_COL].map(RISK_MAPPING)
        
    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state, stratify=y
    )
    
    # Scaling
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Convert scaled arrays back to DataFrames to retain column names for SHAP
    X_train_scaled_df = pd.DataFrame(X_train_scaled, columns=FEATURE_COLS)
    X_test_scaled_df = pd.DataFrame(X_test_scaled, columns=FEATURE_COLS)
    
    if save_scaler_path:
        os.makedirs(os.path.dirname(save_scaler_path), exist_ok=True)
        joblib.dump(scaler, save_scaler_path)
        print(f"Saved scaler to {save_scaler_path}")
        
    return X_train_scaled_df, X_test_scaled_df, y_train, y_test, scaler, inspect_info

def preprocess_input(input_dict, scaler_path):
    """
    Preprocess a single user input dictionary for inference.
    """
    if not os.path.exists(scaler_path):
        raise FileNotFoundError(f"Scaler not found at {scaler_path}")
        
    scaler = joblib.load(scaler_path)
    
    # Create DataFrame from input
    df = pd.DataFrame([input_dict])
    
    # Ensure columns match
    df = df[FEATURE_COLS]
    
    # Scale
    scaled_values = scaler.transform(df)
    scaled_df = pd.DataFrame(scaled_values, columns=FEATURE_COLS)
    
    return scaled_df
