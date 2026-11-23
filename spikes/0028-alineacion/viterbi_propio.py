"""Viterbi CTC en numpy (ADR 0028 §3.2). Misma convencion que torchaudio.functional.forced_align."""

import numpy as np


def forced_align_np(logp: np.ndarray, objetivo: list[int], blanco: int = 0) -> np.ndarray:
    """logp (T, V) log-probabilidades; objetivo = ids sin blancos. Devuelve la etiqueta por fotograma (T,)."""
    T = logp.shape[0]
    L = len(objetivo)
    S = 2 * L + 1
    ext = np.full(S, blanco, dtype=np.int64)
    ext[1::2] = objetivo
    NEG = -1e30
    d = np.full((T, S), NEG, dtype=np.float64)
    bp = np.zeros((T, S), dtype=np.int8)  # 0: misma, 1: desde s-1, 2: desde s-2
    em = logp[:, ext].astype(np.float64)
    d[0, 0] = em[0, 0]
    if S > 1:
        d[0, 1] = em[0, 1]
    permite_salto = np.zeros(S, dtype=bool)
    for s in range(2, S):
        permite_salto[s] = ext[s] != blanco and ext[s] != ext[s - 2]
    for t in range(1, T):
        prev = d[t - 1]
        c0 = prev
        c1 = np.concatenate(([NEG], prev[:-1]))
        c2 = np.concatenate(([NEG, NEG], prev[:-2]))
        c2 = np.where(permite_salto, c2, NEG)
        pila = np.stack([c0, c1, c2])
        idx = pila.argmax(axis=0)
        d[t] = pila[idx, np.arange(S)] + em[t]
        bp[t] = idx
    s = S - 1 if d[T - 1, S - 1] >= d[T - 1, S - 2] else S - 2
    out = np.zeros(T, dtype=np.int64)
    for t in range(T - 1, -1, -1):
        out[t] = ext[s]
        s -= int(bp[t, s])
    return out
