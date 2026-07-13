import os
import joblib
from ml.risk_prediction.preprocessing import (
    preprocess_input,
    INV_RISK_MAPPING
)

MODELS_DIR = os.path.join(
    os.path.dirname(
        os.path.dirname(
            os.path.dirname(os.path.abspath(__file__))
        )
    ),
    'models'
)

def predict_risk(input_dict, models_dir=MODELS_DIR):

    model_path = os.path.join(models_dir, 'best_model.joblib')
    scaler_path = os.path.join(models_dir, 'preprocessor.joblib')

    if not os.path.exists(model_path):
        raise FileNotFoundError(
            f"Model file not found: {model_path}"
        )

    if not os.path.exists(scaler_path):
        raise FileNotFoundError(
            f"Scaler file not found: {scaler_path}"
        )

    model_package = joblib.load(model_path)

    if isinstance(model_package, dict):
        model = model_package["model"]
    else:
        model = model_package

    scaled_input_df = preprocess_input(
        input_dict,
        scaler_path
    )

    pred_idx = int(model.predict(scaled_input_df)[0])

    probs = model.predict_proba(
        scaled_input_df
    )[0]

    predicted_label = INV_RISK_MAPPING[pred_idx]

    confidence_score = float(
        probs[pred_idx]
    )

    probabilities = {
        INV_RISK_MAPPING[0]: float(probs[0]),
        INV_RISK_MAPPING[1]: float(probs[1]),
        INV_RISK_MAPPING[2]: float(probs[2])
    }

    elevated_factors = []

    if (
        input_dict["SystolicBP"] > 130
        or input_dict["DiastolicBP"] > 85
    ):
        elevated_factors.append(
            "elevated blood pressure"
        )

    if input_dict["BS"] > 7.0:
        elevated_factors.append(
            "elevated blood sugar"
        )

    if input_dict["BodyTemp"] > 100.0:
        elevated_factors.append(
            "elevated body temperature"
        )

    if (
        input_dict["HeartRate"] > 100
        or input_dict["HeartRate"] < 60
    ):
        elevated_factors.append(
            "abnormal heart rate"
        )

    if input_dict["Age"] >= 35:
        elevated_factors.append(
            "maternal age (35 or older)"
        )

    elif input_dict["Age"] <= 18:
        elevated_factors.append(
            "maternal age (18 or younger)"
        )

    if len(elevated_factors) == 0:
        reason = (
            "All measured health indicators "
            "are within typical ranges."
        )
    else:
        reason = (
            "Factors such as "
            + ", ".join(elevated_factors)
            + " contributed to the risk prediction."
        )

    return {
        "risk_category": predicted_label,
        "confidence_score": confidence_score,
        "probabilities": probabilities,
        "heuristic_reason": reason
    }