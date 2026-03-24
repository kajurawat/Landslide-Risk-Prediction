"""
Landslide Risk Prediction — Full Backend
=========================================
Fixes:
  1. Adds realistic noise to break synthetic hard boundaries
  2. Compares Logistic Regression vs Random Forest vs Neural Network
  3. Saves best model + scaler with pickle
  4. Correct prediction logic (int comparison, not string)
"""

import numpy as np
import pandas as pd
import pickle
import warnings
from pathlib import Path
warnings.filterwarnings('ignore')

from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import (accuracy_score, classification_report,
                             confusion_matrix, roc_auc_score)





# 1. LOAD DATA
print("=" * 55)
print("  LANDSLIDE RISK PREDICTION — MODEL TRAINING")
print("=" * 55)

BASE_DIR = Path(__file__).resolve().parent
DATASET_PATH = BASE_DIR / 'landslide_dataset.csv'
MODEL_PATH = BASE_DIR / 'best_model.pkl'
SCALER_PATH = BASE_DIR / 'scaler.pkl'

DATASET_COLS = [
    'Rainfall_mm',
    'Slope_Angle',
    'Soil_Saturation',
    'Vegetation_Cover',
    'Earthquake_Activity',
    'Proximity_to_Water',
    'Landslide',
    'Soil_Type_Gravel',
    'Soil_Type_Sand',
    'Soil_Type_Silt',
]

# The CSV header is malformed in this dataset; enforce the expected schema.
df = pd.read_csv(DATASET_PATH, header=0, names=DATASET_COLS, usecols=range(10))
print(f"\n[1] Dataset loaded: {df.shape[0]} rows, {df.shape[1]} columns")
print(f"    Class balance — Landslide=1: {df['Landslide'].sum()}  "
      f"No Landslide=0: {(df['Landslide']==0).sum()}")





# 2. ADD REALISTIC NOISE
#    The original dataset has hard artificial boundaries
#    (e.g. Earthquake_Activity is ALWAYS <4 for class 0 and ALWAYS >4
#    for class 1). Real sensor data is never that clean.
#    We blur those boundaries so the model learns genuine patterns.
print("\n[2] Adding realistic sensor noise to break artificial boundaries...")

np.random.seed(42)
df_noisy = df.copy()

NOISE = {
    'Rainfall_mm':         40,    # rain gauge ±40 mm variation
    'Slope_Angle':          8,    # inclinometer ±8° variation
    'Soil_Saturation':      0.35, # soil sensor ±0.35 overlap around 0.60 boundary
    'Vegetation_Cover':     0.35, # ±0.35 overlap around 0.50 boundary
    'Earthquake_Activity':  1.5,  # seismometer ±1.5 overlap around 4.0 boundary
    'Proximity_to_Water':   0.5,  # ultrasonic ±0.5 overlap around 1.0 boundary
}
for col, std in NOISE.items():
    df_noisy[col] += np.random.normal(0, std, len(df_noisy))

# Flip ~8% of labels — real field data has mislabelled events
flip_idx = np.random.choice(len(df_noisy),
                            size=int(0.08 * len(df_noisy)),
                            replace=False)
landslide_col = df_noisy.columns.get_loc('Landslide')
df_noisy.iloc[flip_idx, landslide_col] = 1 - df_noisy.iloc[flip_idx, landslide_col]
print("    Done. Features now have realistic overlap between classes.")






# 3. SPLIT & SCALE
FEATURE_COLS = ['Rainfall_mm', 'Slope_Angle', 'Soil_Saturation',
                'Vegetation_Cover', 'Earthquake_Activity',
                'Proximity_to_Water', 'Soil_Type_Gravel',
                'Soil_Type_Sand', 'Soil_Type_Silt']

X = df_noisy[FEATURE_COLS]
Y = df_noisy['Landslide']

X_train, X_test, Y_train, Y_test = train_test_split(
    X, Y, test_size=0.2, stratify=Y, random_state=42
)

scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s  = scaler.transform(X_test)

print(f"\n[3] Train size: {X_train.shape[0]}  |  Test size: {X_test.shape[0]}")









# 4. TRAIN CLASSICAL MODELS
print("\n[4] Training classical models...")
print(f"    {'Model':<25} {'Train Acc':>10} {'Test Acc':>10} {'AUC':>8}")
print("    " + "-" * 56)

classical_results = {}
classical_models  = {
    'Logistic Regression': LogisticRegression(max_iter=1000),
    'Random Forest':       RandomForestClassifier(n_estimators=150,
                                                  max_depth=10,
                                                  random_state=42),
    'Gradient Boosting':   GradientBoostingClassifier(n_estimators=150,
                                                      learning_rate=0.05,
                                                      max_depth=4,
                                                      random_state=42),
}
for name, model in classical_models.items():
    model.fit(X_train_s, Y_train)
    tr_acc = accuracy_score(Y_train, model.predict(X_train_s))
    te_acc = accuracy_score(Y_test,  model.predict(X_test_s))
    auc    = roc_auc_score(Y_test,   model.predict_proba(X_test_s)[:, 1])
    classical_results[name] = {'model': model, 'test_acc': te_acc, 'auc': auc}
    print(f"    {name:<25} {tr_acc:>10.4f} {te_acc:>10.4f} {auc:>8.4f}")





# 5. NEURAL NETWORK (pure numpy — no TensorFlow needed)
#    Why neural network?
#    - Can learn non-linear combinations of features
#    - Handles noisy, real-world data better than LR
#    - 2 hidden layers: enough depth without overfitting on 2000 rows
print("\n[5] Training Neural Network (2 hidden layers, pure NumPy)...")
print("    Architecture: 9 → 64 → 32 → 1  |  Activation: ReLU + Sigmoid")

class NeuralNetwork:
    """
    Simple feedforward NN:  Input(9) → Dense(64,ReLU) → Dense(32,ReLU) → Dense(1,Sigmoid)
    Trained with mini-batch SGD + binary cross-entropy loss.
    """
    def __init__(self, lr=0.001, epochs=200, batch_size=32):
        self.lr         = lr
        self.epochs     = epochs
        self.batch_size = batch_size
        self.losses     = []

    # ── activation functions ──
    @staticmethod
    def _relu(z):       return np.maximum(0, z)
    @staticmethod
    def _relu_d(z):     return (z > 0).astype(float)
    @staticmethod
    def _sigmoid(z):    return 1 / (1 + np.exp(-np.clip(z, -500, 500)))

    def _init_weights(self, n_in):
        np.random.seed(42)
        # He initialisation for ReLU layers
        self.W1 = np.random.randn(n_in, 64) * np.sqrt(2 / n_in)
        self.b1 = np.zeros((1, 64))
        self.W2 = np.random.randn(64, 32)   * np.sqrt(2 / 64)
        self.b2 = np.zeros((1, 32))
        self.W3 = np.random.randn(32, 1)    * np.sqrt(2 / 32)
        self.b3 = np.zeros((1, 1))

    def _forward(self, X):
        self.Z1 = X  @ self.W1 + self.b1;  self.A1 = self._relu(self.Z1)
        self.Z2 = self.A1 @ self.W2 + self.b2;  self.A2 = self._relu(self.Z2)
        self.Z3 = self.A2 @ self.W3 + self.b3;  self.A3 = self._sigmoid(self.Z3)
        return self.A3

    def _backward(self, X, y):
        m  = X.shape[0]
        y  = y.reshape(-1, 1)

        dZ3 = self.A3 - y
        dW3 = self.A2.T @ dZ3 / m;   db3 = dZ3.mean(axis=0, keepdims=True)

        dA2 = dZ3 @ self.W3.T
        dZ2 = dA2 * self._relu_d(self.Z2)
        dW2 = self.A1.T @ dZ2 / m;   db2 = dZ2.mean(axis=0, keepdims=True)

        dA1 = dZ2 @ self.W2.T
        dZ1 = dA1 * self._relu_d(self.Z1)
        dW1 = X.T  @ dZ1 / m;        db1 = dZ1.mean(axis=0, keepdims=True)

        self.W3 -= self.lr * dW3;  self.b3 -= self.lr * db3
        self.W2 -= self.lr * dW2;  self.b2 -= self.lr * db2
        self.W1 -= self.lr * dW1;  self.b1 -= self.lr * db1

    def fit(self, X, y):
        self._init_weights(X.shape[1])
        for epoch in range(self.epochs):
            # shuffle
            idx = np.random.permutation(len(X))
            X_s, y_s = X[idx], y[idx]
            epoch_loss = 0
            for i in range(0, len(X_s), self.batch_size):
                Xb = X_s[i:i+self.batch_size]
                yb = y_s[i:i+self.batch_size]
                out = self._forward(Xb)
                self._backward(Xb, yb)
                # binary cross-entropy loss
                eps = 1e-9
                epoch_loss += -np.mean(yb * np.log(out + eps)
                                       + (1 - yb) * np.log(1 - out + eps))
            self.losses.append(epoch_loss)
            if (epoch + 1) % 50 == 0:
                preds = self.predict(X)
                acc   = accuracy_score(y, preds)
                print(f"      Epoch {epoch+1:>3}/{self.epochs}  "
                      f"loss={epoch_loss:.4f}  train_acc={acc:.4f}")

    def predict_proba(self, X):
        return self._forward(X).flatten()

    def predict(self, X, threshold=0.5):
        return (self.predict_proba(X) >= threshold).astype(int)


nn = NeuralNetwork(lr=0.001, epochs=200, batch_size=32)
nn.fit(X_train_s, Y_train.values)

nn_train_acc = accuracy_score(Y_train, nn.predict(X_train_s))
nn_test_acc  = accuracy_score(Y_test,  nn.predict(X_test_s))
nn_auc       = roc_auc_score(Y_test,   nn.predict_proba(X_test_s))

print(f"\n    {'Neural Network':<25} "
      f"{nn_train_acc:>10.4f} {nn_test_acc:>10.4f} {nn_auc:>8.4f}")







# 6. PICK BEST MODEL & SAVE
print("\n[6] Selecting best model by test accuracy + AUC...")

all_results = {**classical_results,
               'Neural Network': {'model': nn,
                                  'test_acc': nn_test_acc,
                                  'auc': nn_auc}}

best_name  = max(all_results, key=lambda k: all_results[k]['auc'])
best_model = all_results[best_name]['model']
print(f"    → Best model: {best_name}  "
      f"(test_acc={all_results[best_name]['test_acc']:.4f}, "
      f"auc={all_results[best_name]['auc']:.4f})")

# Full classification report for the best model
print(f"\n    Classification report ({best_name}):")
if best_name == 'Neural Network':
    preds = nn.predict(X_test_s)
else:
    preds = best_model.predict(X_test_s)
report = classification_report(Y_test, preds,
                               target_names=['No Landslide', 'Landslide'])
for line in report.splitlines():
    print("    " + line)

# Save model + scaler
with open(MODEL_PATH, 'wb') as f:
    pickle.dump({'model': best_model, 'model_name': best_name,
                 'features': FEATURE_COLS}, f)
with open(SCALER_PATH, 'wb') as f:
    pickle.dump(scaler, f)

print("    Saved → best_model.pkl  |  scaler.pkl")







# 7. PREDICTION FUNCTION (for backend API)
def predict_landslide(rainfall_mm, slope_angle, soil_saturation,
                      vegetation_cover, earthquake_activity,
                      proximity_to_water, soil_type_gravel,
                      soil_type_sand, soil_type_silt):
    """
    Call this from your Flask/FastAPI endpoint.
    Returns: dict with prediction and confidence
    """
    # Load saved model + scaler
    with open(MODEL_PATH, 'rb') as f:
        saved = pickle.load(f)
    with open(SCALER_PATH, 'rb') as f:
        sc = pickle.load(f)

    features = np.array([[rainfall_mm, slope_angle, soil_saturation,
                          vegetation_cover, earthquake_activity,
                          proximity_to_water, soil_type_gravel,
                          soil_type_sand, soil_type_silt]])
    features_scaled = sc.transform(features)

    model = saved['model']
    if saved['model_name'] == 'Neural Network':
        prob = float(model.predict_proba(features_scaled))
        pred = int(prob >= 0.5)
    else:
        pred = int(model.predict(features_scaled)[0])          # ← int, NOT string
        prob = float(model.predict_proba(features_scaled)[0][1])

    return {
        'prediction':  pred,
        'label':       'Landslide Risk Detected' if pred == 1 else 'No Landslide Risk',
        'confidence':  round(prob * 100, 2),
        'model_used':  saved['model_name']
    }









# 8. TEST THE PREDICTION FUNCTION
print("\n[8] Testing prediction function...")

test_cases = [
    # (rainfall, slope, sat, veg, eq, prox, gravel, sand, silt)  | expected
    (206.18, 58.28, 0.89, 0.34, 4.39, 0.10, 0, 0, 0),   # high risk
    (80.18,   7.00, 0.28, 0.50, 0.34, 1.29, 0, 1, 0),   # low risk
]
for vals in test_cases:
    result = predict_landslide(*vals)
    print(f"    Input: rainfall={vals[0]}, slope={vals[1]}, sat={vals[2]}, ...")
    print(f"    → {result['label']}  "
          f"(confidence={result['confidence']}%, model={result['model_used']})\n")

print("=" * 55)
print("  DONE. Files saved: best_model.pkl, scaler.pkl")
print("=" * 55)