"""Fase 1 de la tarea 0328 (ADR 0028): alineacion forzada CTC de la letra sobre la voz separada.

Solo lectura sobre la biblioteca. Escribe en --salida un JSON por cancion con SOLO tiempos y
recuentos (nada de texto). Uso:
  uv run python alinear.py <biblioteca> --idioma es=<id8,..> --idioma en=<id8,..> \
      --modelos <carpeta con es/ y en/> --salida <carpeta>
"""

import argparse
import hashlib
import json
import re
import resource
import time
import unicodedata
from pathlib import Path

import numpy as np
import soundfile as sf
import torch
import torchaudio.functional as AF

SR = 16000
FRAME_MS = 20.0
VENTANA_ANTES_MS = 1000
TROZO_S, SOLAPE_S = 30, 2  # trozos de 30 s con 2 s de solape (se descarta 1 s en cada borde interno)


def cargar_vocab(carpeta: Path) -> dict[str, int]:
    return json.loads((carpeta / "vocab.json").read_text())


def normalizar_palabra(palabra: str, vocab: dict[str, int]) -> list[int]:
    """Minusculas, sin puntuacion; los caracteres fuera del vocabulario se reducen a su base o se descartan."""
    ids = []
    for ch in unicodedata.normalize("NFC", palabra.lower()):
        if ch in vocab and ch not in "|":
            ids.append(vocab[ch])
            continue
        base = unicodedata.normalize("NFD", ch)[0]
        if base in vocab and base.isalpha():
            ids.append(vocab[base])
    return ids


def tokenizar_linea(texto: str) -> list[str]:  # = tokenizarLinea de shared/letra.ts
    return [t for t in re.split(r"\s+", texto.strip()) if t]


def leer_audio(ruta: Path) -> torch.Tensor:
    x, sr = sf.read(str(ruta), dtype="float32", always_2d=True)
    x = torch.from_numpy(x.mean(axis=1))
    if sr != SR:
        x = AF.resample(x, sr, SR)
    return (x - x.mean()) / torch.sqrt(x.var() + 1e-7)


@torch.inference_mode()
def emisiones(logits_fn, audio: torch.Tensor) -> torch.Tensor:
    """log-softmax (frames, V) de toda la pista, por trozos de 30 s con solape."""
    n = audio.shape[0]
    trozo, hop = TROZO_S * SR, (TROZO_S - SOLAPE_S) * SR  # hop multiplo de 320 muestras
    descarte = (SOLAPE_S // 2) * 50  # frames
    partes, inicio = [], 0
    while True:
        fin = min(inicio + trozo, n)
        lg = logits_fn(audio[inicio:fin])
        f0 = inicio // 320
        ultimo = fin >= n
        a = 0 if inicio == 0 else descarte
        b = lg.shape[0] if ultimo else lg.shape[0] - descarte
        partes.append((f0 + a, lg[a:b]))
        if ultimo:
            break
        inicio += hop
    total = partes[-1][0] + partes[-1][1].shape[0]
    out = torch.zeros(total, partes[0][1].shape[1])
    for f, lg in partes:
        out[f : f + lg.shape[0]] = lg
    return torch.log_softmax(out, dim=-1)


def alinear_ventana(logp_np, logp_t, objetivo, usar_np=False):
    if usar_np:
        from viterbi_propio import forced_align_np

        return forced_align_np(logp_np, objetivo)
    lab, _ = AF.forced_align(logp_t[None], torch.tensor([objetivo], dtype=torch.int32), blank=0)
    return lab[0].numpy()


def tramos(etiquetas: np.ndarray, n_tokens: int):
    """Inicio/fin (frames, fin exclusivo) de cada token del objetivo a partir de la etiqueta por fotograma."""
    res, prev = [], 0
    for t, e in enumerate(etiquetas):
        if e != 0 and (e != prev):
            res.append([t, t + 1])
        elif e != 0:
            res[-1][1] = t + 1
        prev = e
    assert len(res) == n_tokens, (len(res), n_tokens)
    return res


def alinear_cancion(letra, logp, vocab, duracion_ms, usar_np=False):
    sep = vocab["|"]
    elems = letra["lineas"]
    off = letra.get("offset_ms") or 0
    lineas = []
    for i, el in enumerate(elems):
        if el["tipo"] != "linea" or el["inicio_ms"] is None:
            continue
        inicio = el["inicio_ms"] + off
        sig = next((e for e in elems[i + 1 :] if e["inicio_ms"] is not None), None)
        fin_v = (sig["inicio_ms"] + off) if sig else duracion_ms
        d0 = max(0, inicio - VENTANA_ANTES_MS)
        f0, f1 = int(d0 / FRAME_MS), min(int(fin_v / FRAME_MS), logp.shape[0])
        palabras = tokenizar_linea(el["texto"])
        idsp = [normalizar_palabra(p, vocab) for p in palabras]
        vivas = [k for k, x in enumerate(idsp) if x]
        reg = {"i": i, "inicio_lrc": inicio, "n_palabras": len(palabras), "n_alineables": len(vivas)}
        if not vivas:
            reg["omitida"] = "sin_caracteres"
            lineas.append(reg)
            continue
        objetivo = []
        for j, k in enumerate(vivas):
            if j:
                objetivo.append(sep)
            objetivo.extend(idsp[k])
        lp = logp[f0:f1]
        if lp.shape[0] < len(objetivo) + sum(1 for a, b in zip(objetivo, objetivo[1:]) if a == b) + 1:
            reg["omitida"] = "ventana_corta"
            lineas.append(reg)
            continue
        et = alinear_ventana(lp.numpy(), lp, objetivo, usar_np)
        tr = tramos(et, len(objetivo))
        # las palabras: tokens de caracteres entre separadores
        pos, pal = 0, [None] * len(palabras)
        for j, k in enumerate(vivas):
            n = len(idsp[k])
            a, b = tr[pos][0], tr[pos + n - 1][1]
            pal[k] = [round((f0 + a) * FRAME_MS), round((f0 + b) * FRAME_MS)]
            pos += n + 1  # y el separador
        probs = np.exp(lp.numpy()[np.arange(len(et)), et])[et != 0]
        reg.update(
            palabras=pal,
            inicio_alin=min(p[0] for p in pal if p),
            fin_alin=max(p[1] for p in pal if p),
            confianza=round(float(probs.mean()), 3),
            etiquetas_sha=hashlib.sha256(et.astype(np.int8).tobytes()).hexdigest()[:16],
        )
        lineas.append(reg)
    return lineas


def resolver(biblioteca: Path, id8: str) -> Path:
    c = [d for d in biblioteca.iterdir() if d.name.startswith(id8)]
    assert len(c) == 1, id8
    return c[0]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("biblioteca", type=Path)
    ap.add_argument("--idioma", action="append", default=[], help="es=id8,id8")
    ap.add_argument("--modelos", type=Path, required=True)
    ap.add_argument("--salida", type=Path, required=True)
    ap.add_argument("--hilos", type=int, default=4)
    ap.add_argument("--propio", action="store_true", help="emisiones con el codificador propio")
    ap.add_argument("--viterbi-propio", action="store_true")
    ap.add_argument("--guardar-emisiones", type=Path, help="carpeta donde guardar las emisiones (.npy, sin texto)")
    ap.add_argument("--sufijo", default="", help="sufijo del archivo de salida (p. ej. _b para la repeticion)")
    a = ap.parse_args()
    torch.set_num_threads(a.hilos)
    a.salida.mkdir(parents=True, exist_ok=True)
    for par in a.idioma:
        idioma, ids = par.split("=")
        carpeta_m = a.modelos / idioma
        vocab = cargar_vocab(carpeta_m)
        t0 = time.perf_counter()
        if a.propio:
            from encoder_propio import EncoderPropio

            enc = EncoderPropio(carpeta_m)
            fn = enc.logits
        else:
            from transformers import Wav2Vec2ForCTC

            m = Wav2Vec2ForCTC.from_pretrained(str(carpeta_m)).eval()
            fn = lambda x: m(x[None]).logits[0]  # noqa: E731
        t_carga = time.perf_counter() - t0
        for id8 in ids.split(","):
            d = resolver(a.biblioteca, id8)
            c = json.loads((d / "cancion.json").read_text())
            t1 = time.perf_counter()
            audio = leer_audio(d / "pistas" / "voz.flac")
            dur_ms = audio.shape[0] * 1000 / SR
            t2 = time.perf_counter()
            logp = emisiones(fn, audio)
            t3 = time.perf_counter()
            if a.guardar_emisiones:
                a.guardar_emisiones.mkdir(parents=True, exist_ok=True)
                np.save(a.guardar_emisiones / f"{id8}.npy", logp.numpy())
            lineas = alinear_cancion(c["letra"], logp, vocab, dur_ms, a.viterbi_propio)
            t4 = time.perf_counter()
            sal = {
                "id8": id8, "idioma": idioma, "duracion_s": round(dur_ms / 1000, 1),
                "t_carga_modelo_s": round(t_carga, 1), "t_lectura_s": round(t2 - t1, 1),
                "t_emisiones_s": round(t3 - t2, 1), "t_alineacion_s": round(t4 - t3, 1),
                "pico_ram_mb": round(resource.getrusage(resource.RUSAGE_SELF).ru_maxrss / 2**20),
                "hilos": a.hilos, "propio": a.propio, "viterbi_propio": a.viterbi_propio,
                "emisiones_sha": hashlib.sha256(logp.numpy().tobytes()).hexdigest()[:16],
                "lineas": lineas,
            }
            (a.salida / f"{id8}{a.sufijo}.json").write_text(json.dumps(sal))
            print(id8, idioma, sal["duracion_s"], "s audio; emis", sal["t_emisiones_s"], "ali", sal["t_alineacion_s"],
                  "RAM MB", sal["pico_ram_mb"], flush=True)


if __name__ == "__main__":
    main()
