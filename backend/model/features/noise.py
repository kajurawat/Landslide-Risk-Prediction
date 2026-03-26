import numpy as np
import pandas as pd
from config.settings import NOISE


def add_realistic_noise(df: pd.DataFrame, seed: int = 42, flip_ratio: float = 0.08) -> pd.DataFrame:
    """
    Add feature noise and flip a small percent of labels
    to simulate real-world noisy data.
    """
    np.random.seed(seed)
    df_noisy = df.copy()

    for col, std in NOISE.items():
        df_noisy[col] += np.random.normal(0, std, len(df_noisy))

    flip_idx = np.random.choice(
        len(df_noisy),
        size=int(flip_ratio * len(df_noisy)),
        replace=False,
    )
    landslide_col = df_noisy.columns.get_loc("Landslide")
    df_noisy.iloc[flip_idx, landslide_col] = 1 - df_noisy.iloc[flip_idx, landslide_col]

    return df_noisy
