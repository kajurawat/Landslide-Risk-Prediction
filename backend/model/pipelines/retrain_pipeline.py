import pandas as pd
from sklearn.metrics import accuracy_score, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

from model.artifacts.serializer import save_artifacts
from model.config.settings import FEATURE_COLS
from model.models.classical import get_classical_models


REQUIRED_COLS = FEATURE_COLS + ["Landslide"]


def _clean_dataset(df: pd.DataFrame) -> pd.DataFrame:
    cleaned = df.copy()

    for col in REQUIRED_COLS:
        cleaned[col] = pd.to_numeric(cleaned[col], errors="coerce")

    cleaned = cleaned.dropna(subset=REQUIRED_COLS)

    # Keep only valid target labels and one-hot encoded soil rows.
    cleaned = cleaned[cleaned["Landslide"].isin([0, 1])]
    soil_sum = (
        cleaned["Soil_Type_Gravel"]
        + cleaned["Soil_Type_Sand"]
        + cleaned["Soil_Type_Silt"]
    )
    cleaned = cleaned[soil_sum == 1]

    if cleaned.empty:
        raise ValueError("Combined dataset has no valid rows after cleaning")

    cleaned["Landslide"] = cleaned["Landslide"].astype(int)
    return cleaned


def _train_best_classical_model(df: pd.DataFrame):
    X = df[FEATURE_COLS]
    y = df["Landslide"].astype(int)

    if y.nunique() < 2:
        raise ValueError("Training requires at least two target classes in combined dataset")

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y,
    )

    scaler = StandardScaler()
    X_train_s = scaler.fit_transform(X_train)
    X_test_s = scaler.transform(X_test)

    models = get_classical_models()

    best_name = ""
    best_model = None
    best_auc = -1.0
    best_accuracy = 0.0
    trained_models: dict[str, object] = {}

    for name, model in models.items():
        model.fit(X_train_s, y_train)
        trained_models[name] = model
        y_pred = model.predict(X_test_s)
        y_proba = model.predict_proba(X_test_s)[:, 1]

        auc = float(roc_auc_score(y_test, y_proba))
        acc = float(accuracy_score(y_test, y_pred))

        if auc > best_auc:
            best_name = name
            best_model = model
            best_auc = auc
            best_accuracy = acc

    if best_model is None:
        raise ValueError("No model was selected during retraining")

    save_artifacts(best_name, best_model, scaler, all_models=trained_models)
    return best_name, best_auc, best_accuracy


def run_retraining_pipeline(main_df: pd.DataFrame, request_df: pd.DataFrame) -> dict:
    combined_df = pd.concat([main_df, request_df], ignore_index=True)
    combined_df = _clean_dataset(combined_df)

    best_name, best_auc, best_accuracy = _train_best_classical_model(combined_df)

    return {
        "status": "success",
        "message": "Model retrained and artifacts updated",
        "rows_original": int(len(main_df)),
        "rows_requests": int(len(request_df)),
        "rows_combined": int(len(combined_df)),
        "best_model": best_name,
        "best_auc": round(best_auc, 4),
        "best_accuracy": round(best_accuracy, 4),
    }
