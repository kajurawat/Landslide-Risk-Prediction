from sklearn.metrics import accuracy_score, roc_auc_score, classification_report
from models.classical import get_classical_models
from models.neural_net import NeuralNetwork

def train_classical_models(X_train_s, X_test_s, y_train, y_test):
    """
    Train all 3 sklearn models and return their metrics.

    Returns:
        dict: {model_name: {'model': model, 'accuracy' : float, 'auc': float}}
    """

    models = get_classical_models()
    results = {}

    for model_name, model in models.items():
        print(f"\n Training {model_name}...")
        model.fit(X_train_s, y_train)

        y_pred = model.predict(X_test_s)
        y_pred_proba = model.predict_proba(X_test_s)[:, 1]

        accuracy = accuracy_score(y_test, y_pred)
        auc = roc_auc_score(y_test, y_pred_proba)

        results[model_name] = {
            'model' : model,
            'accuracy' : accuracy,
            'auc' : auc,
            'predictions': y_pred
        }

        print(f"    Accuracy: {accuracy:.4f}  |  AUC: {auc:.4f}")
    
    return results

def train_neural_network(X_train_s, X_test_s, y_train, y_test):
    """
    Train custom neural network and return metrics.

    Returns:
        dict: {'model': NeuralNetwork, 'accuracy': float, 'auc': float, 'predictions': array}
    """
    print(f"\n  Training Neural Network...")
    nn = NeuralNetwork(lr=0.001, epoches=200, batch_size=32)
    nn.fit(X_train_s, y_train)

    y_pred = nn.predict(X_test_s)
    y_pred_proba = nn.predict_proba(X_test_s)

    accuracy = accuracy_score(y_test, y_pred)
    auc = roc_auc_score(y_test, y_pred_proba)

    print(f"    Accuracy: {accuracy:.4f}  |  AUC: {auc:.4f}")

    return {
        'model' : nn,
        'accuracy' : accuracy,
        'auc' : auc,
        'predictions' : y_pred
    }

def select_best_model(all_results):
    """
    Compare all models and select best by AUC score.

    Args:
        all_results: dict with 'classical' and 'neural_net' keys

    Returns:
        tuple: (best_model_name, best_model_dict)
    """

    print("\n Model Comparison:")
    print(" " + "-" * 50)

    best_name = None
    best_auc = -1
    best_model_dict = None

    #Check classical models
    for model_name, metrics in all_results['classical'].items():
        auc = metrics['auc']
        print(f"  {model_name:.<30} AUC={auc:.4f}")
        if auc > best_auc:
            best_auc = auc
            best_name = model_name
            best_model_dict = metrics

    # check neural network
    nn_auc = all_results['neural_net']['auc']
    print(f"  {'Neural Network':.<30} AUC={nn_auc:.4f}")
    if nn_auc > best_auc:
        best_auc = nn_auc
        best_name = 'Neural Network'
        best_model_dict = all_results['neural_net']

    print("  " + "-" * 50)
    print(f"    BEST: {best_name} (AUC={best_auc:.4f})\n")

    return best_name, best_model_dict

def generate_classification_report(y_test, y_pred, model_name):
    """
    Generate and print classification report.
    """
    print(f"\n  Classification Report - {model_name}:")
    print("  " + "-" * 50)
    report = classification_report(y_test, y_pred, digits=4)
    print(report)
    return report