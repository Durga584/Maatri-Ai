import os
import joblib
import pandas as pd
import numpy as np
import shap
import matplotlib.pyplot as plt

MODELS_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    'models'
)

class MaatriSHAPExplainer:
    def __init__(self, models_dir=MODELS_DIR):
        self.models_dir = models_dir
        self.model_path = os.path.join(models_dir, 'best_model.joblib')
        self.scaler_path = os.path.join(models_dir, 'preprocessor.joblib')
        
        self.model_package = None
        self.model = None
        self.scaler = None
        self.explainer = None
        
        self._load_explainer()

    def _load_explainer(self):
        if not os.path.exists(self.model_path) or not os.path.exists(self.scaler_path):
            return
            
        self.model_package = joblib.load(self.model_path)
        self.model = self.model_package['model']
        self.scaler = joblib.load(self.scaler_path)
        
        # Initialize SHAP explainer
        # TreeExplainer is suitable for RandomForestClassifier and XGBClassifier
        self.explainer = shap.TreeExplainer(self.model)

    def explain_instance(self, input_dict, predicted_class_idx):
        """
        Compute SHAP values for a single input dictionary and return feature contributions
        for the predicted class.
        """
        if self.explainer is None:
            self._load_explainer()
            if self.explainer is None:
                raise FileNotFoundError("Model files not loaded. Train the model first.")
                
        # Format and scale input
        df = pd.DataFrame([input_dict])[self.model_package['features']]
        scaled_input = self.scaler.transform(df)
        
        # Compute SHAP values
        # For multiclass, shap_values returns a list of arrays (one per class) or a 3D array
        shap_values_raw = self.explainer.shap_values(scaled_input)
        
        # Determine structure
        if isinstance(shap_values_raw, list):
            # Typically a list for RandomForest in shap
            class_shap = shap_values_raw[predicted_class_idx][0]
        elif isinstance(shap_values_raw, np.ndarray):
            # If 3D array: (n_samples, n_features, n_classes)
            if len(shap_values_raw.shape) == 3:
                class_shap = shap_values_raw[0, :, predicted_class_idx]
            else:
                # If 2D array (for binary classification or shape varies)
                class_shap = shap_values_raw[0]
        else:
            raise TypeError(f"Unexpected SHAP values type: {type(shap_values_raw)}")
            
        # Pair feature names with their SHAP values
        feature_contributions = {}
        for feat, val in zip(self.model_package['features'], class_shap):
            feature_contributions[feat] = float(val)
            
        # Get expected value (base value) for the predicted class
        if isinstance(self.explainer.expected_value, list):
            base_value = float(self.explainer.expected_value[predicted_class_idx])
        elif isinstance(self.explainer.expected_value, np.ndarray):
            if len(self.explainer.expected_value.shape) > 0:
                base_value = float(self.explainer.expected_value[predicted_class_idx])
            else:
                base_value = float(self.explainer.expected_value)
        else:
            base_value = float(self.explainer.expected_value)
            
        return {
            'feature_contributions': feature_contributions,
            'base_value': base_value,
            'features_raw_values': input_dict
        }

    def generate_explanation_plot(self, explanation_data, save_path=None):
        """
        Generates a horizontal bar chart of feature contributions and saves or returns it.
        """
        contributions = explanation_data['feature_contributions']
        raw_values = explanation_data['features_raw_values']
        
        # Sort features by absolute contribution
        sorted_feats = sorted(contributions.keys(), key=lambda x: abs(contributions[x]))
        
        y_pos = np.arange(len(sorted_feats))
        widths = [contributions[f] for f in sorted_feats]
        
        # Color based on positive/negative contribution
        # Pink (#EC4899) for pushing risk higher, Sky Blue (#38BDF8) for pushing risk lower
        colors = ['#EC4899' if w >= 0 else '#38BDF8' for w in widths]
        
        # Create labels with raw values (e.g. "BS = 7.2 (mmol/L)")
        labels = []
        for f in sorted_feats:
            val = raw_values[f]
            if f == 'Age':
                labels.append(f"{f} ({val} yrs)")
            elif f == 'SystolicBP':
                labels.append(f"Systolic BP ({val} mmHg)")
            elif f == 'DiastolicBP':
                labels.append(f"Diastolic BP ({val} mmHg)")
            elif f == 'BS':
                labels.append(f"Blood Sugar ({val} mmol/L)")
            elif f == 'BodyTemp':
                labels.append(f"Temp ({val} °F)")
            elif f == 'HeartRate':
                labels.append(f"Heart Rate ({val} bpm)")
            else:
                labels.append(f"{f} ({val})")
                
        fig, ax = plt.subplots(figsize=(8, 4.5), facecolor='#1E293B')
        ax.set_facecolor('#1E293B')
        
        bars = ax.barh(y_pos, widths, align='center', color=colors, height=0.6)
        
        # Add labels and style tick colors
        ax.set_yticks(y_pos)
        ax.set_yticklabels(labels, fontsize=10, color='#F8FAFC')
        ax.tick_params(axis='x', colors='#94A3B8', labelsize=9)
        ax.tick_params(axis='y', colors='#F8FAFC', labelsize=9)
        ax.invert_yaxis()  # top-down feature order (most important at top)
        
        # Add midline
        ax.axvline(0, color='#94A3B8', linestyle='--', linewidth=0.8)
        
        ax.set_xlabel('SHAP Value (Feature Influence)', fontsize=10, color='#94A3B8', labelpad=8)
        ax.set_title('AI Risk Prediction Explanation (Local SHAP Analysis)\nPink: Increases Risk | Blue: Decreases Risk', fontsize=11, fontweight='bold', pad=15, color='#F8FAFC')
        
        # Style spines
        for spine in ['top', 'right', 'left', 'bottom']:
            if spine in ['top', 'right']:
                ax.spines[spine].set_visible(False)
            else:
                ax.spines[spine].set_color('#334155')
            
        plt.tight_layout()
        
        if save_path:
            os.makedirs(os.path.dirname(save_path), exist_ok=True)
            plt.savefig(save_path, dpi=150, bbox_inches='tight', facecolor=fig.get_facecolor(), edgecolor='none')
            plt.close()
            return save_path
        else:
            return fig
