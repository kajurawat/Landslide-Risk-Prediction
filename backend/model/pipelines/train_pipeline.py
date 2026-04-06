from data.loader import load_dataset
from features.noise import add_realistic_noise
from preprocessing.split_scale import split_and_scale
from evaluation.metrics import (
    train_classical_models,
    train_neural_network,
    select_best_model,
    generate_classification_report,
)
from artifacts.serializer import save_artifacts

def run_training_pipeline():
    print("\n=== Landslide Model Training Pipeline ===")

    # 1. load + augement data
    df = load_dataset()
    df_noisy = add_realistic_noise(df)

    #2 split + scale
    X_train, X_test, y_train, y_test, X_train_s, X_test_s, scaler = split_and_scale(df_noisy)

    # convert labels to numpy for stable behavior across sklearn + custom NN
    y_train_np = y_train.to_numpy() if hasattr(y_train, "to_numpy") else y_train
    y_test_np = y_test.to_numpy() if hasattr(y_test, "to_numpy") else y_test

    #3 Train/evaluate classical models
    classical_results = train_classical_models(
        X_train_s, X_test_s, y_train_np, y_test_np
    )

    #4 Train/ evaluate neural network
    nn_result = train_neural_network(
        X_train_s, X_test_s, y_train_np, y_test_np
    )

    # 5 compare and pick best
    all_results = {
        "classical" : classical_results,
        "neural_net": nn_result,
    }
    best_name, best_model_dict = select_best_model(all_results)

    #6 Report
    generate_classification_report(
        y_test_np,
        best_model_dict["predictions"],
        best_name,
    )

    #7 Save artifacts
    all_models = {name: item["model"] for name, item in classical_results.items()}
    all_models["Neural Network"] = nn_result["model"]
    save_artifacts(best_name, best_model_dict["model"], scaler, all_models=all_models)

    print("\n=== Pipeline Complete ===")
    return {
        "best_model_name": best_name,
        "best_auc": best_model_dict["auc"],
        "best_accuracy": best_model_dict["accuracy"],
    }

if __name__ == "__main__":
    summary = run_training_pipeline()
    print("\nSummary: ", summary)