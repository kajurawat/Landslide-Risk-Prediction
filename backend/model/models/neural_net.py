import numpy as np
from sklearn.metrics import accuracy_score

class NeuralNetwork:
    """
    Simple feedforward NN: Input(9) -> Dense(62, ReLU) -> Dense(32, ReLU) -> Dense(1, Sigmoid)
    Trained with mini - batch SGD + binary cross-entropy loss.
    """

    def __init__(self, lr=0.001, epoches=200, batch_size=32):
        self.lr = lr
        self.epochs = epoches
        self.batch_size = batch_size
        self.losses = []

    @staticmethod
    def _relu(z):
        return np.maximum(0, z)
    
    @staticmethod
    def _relu_d(z):
        return (z > 0).astype(float)
    
    @staticmethod
    def _sigmoid(z):
        return 1 / ( 1 + np.exp(-np.clip(z, -500, 500)))
    
    def _init_weights(self, n_in):
        np.random.seed(42)
        self.W1 = np.random.randn(n_in, 64) * np.sqrt(2 / n_in)
        self.b1 = np.zeros((1, 64))
        self.W2 = np.random.randn(64, 32) * np.sqrt(2 / 64)
        self.b2 = np.zeros((1, 32))
        self.W3 = np.random.randn(32, 1) * np.sqrt(2 / 32)
        self.b3 = np.zeros((1, 1))

    def _forward(self, X):
        self.Z1 = X @ self.W1 + self.b1
        self.A1 = self._relu(self.Z1)

        self.Z2 = self.A1 @ self.W2 + self.b2
        self.A2 = self._relu(self.Z2)

        self.Z3 = self.A2 @ self.W3 + self.b3
        self.A3 = self._sigmoid(self.Z3)
        return self.A3
    
    def _backward(self, X, y):
        m = X.shape[0]
        y = y.reshape(-1, 1)

        dZ3 = self.A3 - y
        dW3 = self.A2.T @ dZ3 / m
        db3 = dZ3.mean(axis=0, keepdims=True)

        dA2 = dZ3 @ self.W3.T
        dZ2 = dA2 * self._relu_d(self.Z2)
        dW2 = self.A1.T @ dZ2 / m
        db2 = dZ2.mean(axis=0, keepdims=True)

        dA1 = dZ2 @ self.W2.T
        dZ1 = dA1 * self._relu_d(self.Z1)
        dW1 = X.T @ dZ1 / m
        db1 = dZ1.mean(axis=0, keepdims=True)

        self.W3 -= self.lr * dW3
        self.b3 -= self.lr * db3
        self.W2 -= self.lr * dW2
        self.b2 -= self.lr * db2
        self.W1 -= self.lr * dW1
        self.b1 -= self.lr * db1

    def fit(self, X, y):
        self._init_weights(X.shape[1])

        for epoch in range(self.epochs):
            idx = np.random.permutation(len(X))
            X_s, y_z = X[idx], y[idx]
            epoch_loss = 0

            for i in range(0, len(X_s), self.batch_size):
                Xb = X_s[i:i + self.batch_size]
                yb = y_z[i:i + self.batch_size]

                out = self._forward(Xb)
                self._backward(Xb, yb)

                eps = 1e-9
                epoch_loss += -np.mean(
                    yb * np.log(out + eps) + (1 - yb) * np.log(1 - out + eps)
                )

            self.losses.append(epoch_loss)

            if (epoch + 1) % 50 == 0:
                preds = self.predict(X)
                acc = accuracy_score(y, preds)
                print(
                    f"      Epoch {epoch+1:>3}/{self.epochs}  "
                    f"loss={epoch_loss:.4f}  train_acc={acc:.4f}"
                )


    def predict_proba(self, X):
        return self._forward(X).flatten()
    
    def predict(self, X, threshold=0.5):
        return (self.predict_proba(X) >= threshold).astype(int)