"""DIAGNOSTICO informativo (no entra en el veredicto): repite las medidas de la fase 1 con otras ventanas
de inicio sobre las emisiones guardadas (.npy) para entender de donde viene el error. Solo cifras.
Uso: uv run python variantes.py <biblioteca> <carpeta-emisiones> <idioma:modelos=...> id8:idioma ..."""

import json
import sys
from pathlib import Path

import numpy as np

import alinear as A

biblio, emis, modelos = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3])
pares = [p.split(":") for p in sys.argv[4:]]
vocabs = {i: A.cargar_vocab(modelos / i) for i in {p[1] for p in pares}}
for antes in (1000, 500, 250, 0):
    A.VENTANA_ANTES_MS = antes
    todas, dev, neg = [], [], 0
    por = []
    for id8, idioma in pares:
        d = A.resolver(biblio, id8)
        c = json.loads((d / "cancion.json").read_text())
        import torch
        logp = torch.from_numpy(np.load(emis / f"{id8}.npy"))
        ls = A.alinear_cancion(c["letra"], logp, vocabs[idioma], logp.shape[0] * A.FRAME_MS, False)
        dl = np.array([l["inicio_alin"] - l["inicio_lrc"] for l in ls if "inicio_alin" in l], float)
        s = np.median(dl)
        todas.extend(np.abs(dl)); dev.extend(np.abs(dl - s)); neg += int((dl < -500).sum())
        por.append((id8, float(np.median(np.abs(dl))), float(np.percentile(np.abs(dl - s), 90)), float(s)))
    print(f"ventana -{antes} ms: n {len(todas)}; mediana |D| {np.median(todas):.0f}; p90 |D-sesgo| {np.percentile(dev,90):.0f}; "
          f"D < -500 ms: {neg/len(todas):.1%}")
    print("   por cancion (med|D|/p90/sesgo):", " ".join(f"{i}:{m:.0f}/{p:.0f}/{s:.0f}" for i, m, p, s in por))


# --- Diagnostico 2: toda la letra de una vez (sin ventanas por linea: no hay ancla al LRC) ---
import torch  # noqa: E402
import torchaudio.functional as AF  # noqa: E402

print("\nToda la letra alineada de una vez sobre la pista completa (sin ventana por linea; sin ancla al LRC):")
todas, dev, neg = [], [], 0
for id8, idioma in pares:
    d = A.resolver(biblio, id8)
    c = json.loads((d / "cancion.json").read_text())
    vocab = vocabs[idioma]
    sep = vocab["|"]
    logp = torch.from_numpy(np.load(emis / f"{id8}.npy"))
    objetivo, marca = [], []  # marca: (indice de linea, posicion del primer token de su primera palabra viva)
    for i, el in enumerate(c["letra"]["lineas"]):
        if el["tipo"] != "linea" or el["inicio_ms"] is None:
            continue
        vivas = [x for x in (A.normalizar_palabra(p, vocab) for p in A.tokenizar_linea(el["texto"])) if x]
        if not vivas:
            continue
        for k, w in enumerate(vivas):
            if objetivo:
                objetivo.append(sep)
            if k == 0:
                marca.append((i, len(objetivo)))
            objetivo.extend(w)
    lab, _ = AF.forced_align(logp[None], torch.tensor([objetivo], dtype=torch.int32), blank=0)
    tr = A.tramos(lab[0].numpy(), len(objetivo))
    dl = np.array([tr[pos][0] * A.FRAME_MS - c["letra"]["lineas"][i]["inicio_ms"] for i, pos in marca], float)
    s = np.median(dl)
    todas.extend(np.abs(dl)); dev.extend(np.abs(dl - s)); neg += int((dl < -500).sum())
    print(f"  {id8}: lineas {len(dl)}; mediana |D| {np.median(np.abs(dl)):.0f}; p90 |D-sesgo| {np.percentile(np.abs(dl - s), 90):.0f}; sesgo {s:.0f}; "
          f"D<-500: {(dl < -500).mean():.0%}; D>500: {(dl > 500).mean():.0%}")
print(f"  GLOBAL: n {len(todas)}; mediana |D| {np.median(todas):.0f}; p90 |D-sesgo| {np.percentile(dev,90):.0f}; D<-500 ms: {neg/len(todas):.1%}")
