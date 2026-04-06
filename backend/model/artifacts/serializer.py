import pickle
from model.config.settings import ARTIFACTS_DIR, MODEL_PATH, SCALER_PATH

def save_artifacts(best_model_name, best_model_obj, scaler, all_models=None):
    """
    Save best model + scaler to disk.

    Args:
        best_model_name (str) : Name of selected best model
        best_model_obj; trained Model object.
        scaler: Fitted StandardScaler
    """

    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)

    model_payload = {
        "model_name": best_model_name,
        "model" : best_model_obj,
    }

    if all_models:
        model_payload["all_models"] = all_models

    with open(MODEL_PATH, "wb") as f:
        pickle.dump(model_payload, f)

    with open(SCALER_PATH, "wb") as f:
        pickle.dump(scaler, f)

    print(f"Saved model to: {MODEL_PATH}")
    print(f"Saved scaler to: {SCALER_PATH}")

def load_artifacts():
    """
    Load best model + scaler from disk.

    Returns:
        tuple: (model_name, model_obj, scaler)
    """

    with open(MODEL_PATH, "rb") as f:
        model_payload = pickle.load(f)

    with open(SCALER_PATH, "rb") as f:
        scaler = pickle.load(f)

    return model_payload['model_name'], model_payload["model"], scaler

# Example usage
if __name__ == "__main__":
    from sklearn.linear_model import LogisticRegression
    from sklearn.preprocessing import StandardScaler

    m = LogisticRegression()
    s = StandardScaler()

    save_artifacts('Logistic Regression', m, s)
    name, model, scaler = load_artifacts()
    print('Loaded:', name, type(model).__name__, type(scaler).__name__)