from sklearn.metrics import accuracy_score, precision_recall_fscore_support, classification_report, confusion_matrix
import pandas as pd
import numpy as np

def evaluate_predictions(y_true, y_pred):
    """
    Evaluate predicted labels against true labels and return a dict of metrics.
    """
    accuracy = accuracy_score(y_true, y_pred)
    
    # Calculate macro-averaged precision, recall, f1
    precision, recall, f1, _ = precision_recall_fscore_support(y_true, y_pred, average='macro', zero_division=0)
    
    # Generate full classification report
    report = classification_report(y_true, y_pred, target_names=['Low Risk', 'Mid Risk', 'High Risk'], zero_division=0)
    
    # Generate confusion matrix
    cm = confusion_matrix(y_true, y_pred)
    
    # Convert CM to list of lists for JSON serializability
    cm_list = cm.tolist()
    
    return {
        'accuracy': float(accuracy),
        'precision_macro': float(precision),
        'recall_macro': float(recall),
        'f1_macro': float(f1),
        'classification_report': report,
        'confusion_matrix': cm_list
    }

def print_evaluation_report(model_name, metrics):
    """
    Print a neat evaluation report to terminal.
    """
    print("=" * 60)
    print(f" Evaluation Report for {model_name} ".center(60, "="))
    print("=" * 60)
    print(f"Accuracy:        {metrics['accuracy']:.4f}")
    print(f"Macro Precision: {metrics['precision_macro']:.4f}")
    print(f"Macro Recall:    {metrics['recall_macro']:.4f}")
    print(f"Macro F1-Score:  {metrics['f1_macro']:.4f}")
    print("\nClassification Report:")
    print(metrics['classification_report'])
    print("Confusion Matrix:")
    cm = np.array(metrics['confusion_matrix'])
    classes = ['Low Risk', 'Mid Risk', 'High Risk']
    cm_df = pd.DataFrame(cm, index=[f"Actual {c}" for c in classes], columns=[f"Pred {c}" for c in classes])
    print(cm_df)
    print("=" * 60)
