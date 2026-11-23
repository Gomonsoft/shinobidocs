"""Criterio 6 (ADR 0028 §2.4): emisiones del codificador propio frente a transformers (max |dlogits| < 1e-3)
y Viterbi propio (numpy) frente a torchaudio forced_align (mismas etiquetas por fotograma).
Uso: uv run python equivalencia.py <biblioteca> <modelos> <id8>:<idioma> ... Imprime solo cifras."""

import json
import sys
from pathlib import Path

import numpy as np
import torch

import alinear as A
from encoder_propio import EncoderPropio
from transformers import Wav2Vec2ForCTC

torch.set_num_threads(4)
biblio, modelos = Path(sys.argv[1]), Path(sys.argv[2])
for par in sys.argv[3:]:
    id8, idioma = par.split(":")
    cm = modelos / idioma
    vocab = A.cargar_vocab(cm)
    hf = Wav2Vec2ForCTC.from_pretrained(str(cm)).eval()
    propio = EncoderPropio(cm)
    d = A.resolver(biblio, id8)
    audio = A.leer_audio(d / "pistas" / "voz.flac")
    dur_ms = audio.shape[0] * 1000 / A.SR
    # 1) logits de 3 trozos de 30 s (tal cual, sin log-softmax) y de la pista completa por trozos
    difs = []
    for ini_s in (0, 60, 120):
        x = audio[ini_s * A.SR : (ini_s + 30) * A.SR]
        with torch.inference_mode():
            a = hf(x[None]).logits[0]
        b = propio.logits(x)
        difs.append(float((a - b).abs().max()))
    print(f"{id8} {idioma}: max |dlogits| en 3 trozos de 30 s: {[f'{v:.2e}' for v in difs]}")
    fa = lambda x: hf(x[None]).logits[0]  # noqa: E731
    lp_hf = A.emisiones(fa, audio)
    lp_pr = A.emisiones(propio.logits, audio)
    print(f"{id8}: pista completa max |dlog-softmax| {float((lp_hf - lp_pr).abs().max()):.2e}")
    # 2) Viterbi propio frente a forced_align, mismas emisiones (las de transformers)
    c = json.loads((d / "cancion.json").read_text())
    ta = A.alinear_cancion(c["letra"], lp_hf, vocab, dur_ms, False)
    tn = A.alinear_cancion(c["letra"], lp_hf, vocab, dur_ms, True)
    iguales = sum(1 for x, y in zip(ta, tn) if x.get("etiquetas_sha") == y.get("etiquetas_sha"))
    n = sum(1 for x in ta if "etiquetas_sha" in x)
    print(f"{id8}: Viterbi propio == forced_align en {iguales}/{n} lineas (etiquetas por fotograma identicas)")
    # 3) pipeline propio completo (codificador + Viterbi) frente al de referencia
    tp = A.alinear_cancion(c["letra"], lp_pr, vocab, dur_ms, True)
    ig2 = sum(1 for x, y in zip(ta, tp) if x.get("inicio_alin") == y.get("inicio_alin") and x.get("fin_alin") == y.get("fin_alin"))
    dif = [abs(x["inicio_alin"] - y["inicio_alin"]) for x, y in zip(ta, tp) if "inicio_alin" in x and "inicio_alin" in y]
    print(f"{id8}: pipeline propio == referencia en {ig2}/{n} lineas; max |d inicio| {max(dif) if dif else 0} ms")
