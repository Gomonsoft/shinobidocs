"""Tarea 0387: «senal D» (ADR 0024 §1, opcion D). Alinea la letra ENTERA (sin usar sus tiempos) sobre cada voz del
mismo idioma y mide si la confianza separa la letra propia de las ajenas y de las de otra version.
Solo lectura; usa las emisiones guardadas (.npy). Imprime SOLO cifras e ids abreviados.

Definiciones (por par letra L, voz V):
  conf        = media de la probabilidad a posteriori (exp logp[t, etiqueta]) de TODOS los fotogramas no-blanco de la
                alineacion de Viterbi (CTC, forced_align) de toda la letra (palabras separadas por '|'; lineas separadas por '|').
  conf_linea  = la misma media restringida a los fotogramas de los tokens de una linea.
  Delta_linea = inicio de la primera palabra alineada de la linea - (inicio_LRC + d); d = desplazamiento aplicado a la letra.
  sesgo       = mediana de Delta; p90 = percentil 90 de |Delta - sesgo|; frac_1s = fraccion de lineas con |Delta - sesgo| > 1 s.
  Regla 'coincide' (cMin): conf >= cMin y p90 <= 600 ms y |sesgo| <= 500 ms.
  Par no alineable (voz con menos fotogramas que tokens de la letra): conf = 0, rechazado.
Uso: uv run python encaje_alineacion.py <biblioteca> <modelos> <emis> --idioma es=a,b,.. --idioma en=.. --propias a,b,..
"""

import argparse
import json
from pathlib import Path

import numpy as np
import torch
import torchaudio.functional as AF

import alinear as A

CMINS = (0.3, 0.4, 0.5, 0.6, 0.7)
DESPL = (800, 1500, 3000)
P90_MAX, SESGO_MAX = 600, 500


def preparar(letra, vocab):
    sep = vocab["|"]
    obj, lineas = [], []  # lineas: (inicio_lrc, pos_ini, pos_fin, pos_primer_token)
    for el in letra["lineas"]:
        if el["tipo"] != "linea" or el["inicio_ms"] is None:
            continue
        vivas = [w for w in (A.normalizar_palabra(p, vocab) for p in A.tokenizar_linea(el["texto"])) if w]
        if not vivas:
            continue
        ini = len(obj) + (1 if obj else 0)
        for w in vivas:
            if obj:
                obj.append(sep)
            obj.extend(w)
        lineas.append((el["inicio_ms"], ini, len(obj), ini))
    return obj, lineas


def alinear_par(obj, lineas, logp):
    T = logp.shape[0]
    rep = sum(1 for a, b in zip(obj, obj[1:]) if a == b)
    if T < len(obj) + rep + 1:
        return None
    lab, _ = AF.forced_align(logp[None], torch.tensor([obj], dtype=torch.int32), blank=0)
    et = lab[0].numpy()
    tr = A.tramos(et, len(obj))
    p = np.exp(logp.numpy()[np.arange(T), et]) * (et != 0)
    acum = np.concatenate(([0.0], np.cumsum(p)))
    nb = np.concatenate(([0], np.cumsum(et != 0)))
    conf = float(acum[-1] / max(nb[-1], 1))
    cl, delta = [], []
    for inicio, a, b, primero in lineas:
        f0, f1 = tr[a][0], tr[b - 1][1]
        cl.append(float((acum[f1] - acum[f0]) / max(nb[f1] - nb[f0], 1)))
        delta.append(tr[primero][0] * A.FRAME_MS - inicio)
    return conf, np.array(cl), np.array(delta, float)


def resumen(conf, cl, delta, d=0):
    dl = delta - d
    s = float(np.median(dl))
    return dict(conf=conf, p90=float(np.percentile(np.abs(dl - s), 90)), sesgo=s,
                f05=float((cl >= 0.5).mean()), mcl=float(np.median(cl)), f1s=float((np.abs(dl - s) > 1000).mean()))


def coincide(r, cmin):
    return r is not None and r["conf"] >= cmin and r["p90"] <= P90_MAX and abs(r["sesgo"]) <= SESGO_MAX


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("biblioteca", type=Path); ap.add_argument("modelos", type=Path); ap.add_argument("emis", type=Path)
    ap.add_argument("--idioma", action="append", required=True)
    ap.add_argument("--propias", required=True)
    ap.add_argument("--numeros", default="")
    a = ap.parse_args()
    num = dict(p.split("=") for p in a.numeros.split(",") if p)
    propias = a.propias.split(",")
    idi = {}
    for par in a.idioma:
        k, v = par.split("=")
        for i in v.split(","):
            idi[i] = k
    vocabs = {k: A.cargar_vocab(a.modelos / k) for k in set(idi.values())}
    emis = {i: torch.from_numpy(np.load(a.emis / f"{i}.npy")) for i in idi}
    letras = {}
    for i in idi:
        c = json.loads((A.resolver(a.biblioteca, i) / "cancion.json").read_text())
        letras[i] = preparar(c["letra"], vocabs[idi[i]])
    # pares (letra, voz) del mismo idioma
    res = {}
    for L in idi:
        for V in idi:
            if idi[L] != idi[V] or (L != V and L not in propias and L not in OTRAS(idi, propias)):
                continue
            obj, lin = letras[L]
            r = alinear_par(obj, lin, emis[V])
            res[(L, V)] = None if r is None else (r, resumen(*r))
    # tabla por cancion
    print("| id | cancion | idioma | conf propia | p90 (ms) | sesgo (ms) | lineas conf>=0,5 | med conf linea | frac >1 s | mejor ajena (voz) | conf ajena | margen | alineables ajenas |")
    print("|---|---|---|---|---|---|---|---|---|---|---|---|---|")
    maxaj = {}
    for L in list(propias) + [i for i in OTRAS(idi, propias)]:
        p = res[(L, L)][1]
        aj = [(V, res[(L, V)][1]["conf"] if res[(L, V)] else 0.0) for V in idi if V != L and (L, V) in res]
        mejor = max(aj, key=lambda x: x[1]) if aj else (None, float("nan"))
        maxaj[L] = mejor[1]
        etiqueta = "" if L in propias else " (otra version/informativa)"
        print(f"| {L} | {num.get(L,'?')}{etiqueta} | {idi[L]} | {p['conf']:.3f} | {p['p90']:.0f} | {p['sesgo']:.0f} | {p['f05']:.0%} | {p['mcl']:.2f} | {p['f1s']:.0%} | {mejor[0]} | {mejor[1]:.3f} | {p['conf']-mejor[1]:+.3f} | {sum(1 for V,_ in aj if res[(L,V)])}/{len(aj)} |")
    # resumen por cMin
    print("\n| cMin | propias aceptadas | ajenas aceptadas | 5 y 8 aceptadas | desplazadas aceptadas | margen (min propia aceptada - max ajena) | cumple 1 | 2 | 3 | 4 | 5 | TODO |")
    print("|---|---|---|---|---|---|---|---|---|---|---|---|")
    veredicto = []
    for cm in CMINS:
        pa = [L for L in propias if coincide(res[(L, L)][1] if res[(L, L)] else None, cm)]
        aj_ok = [(L, V) for (L, V), r in res.items() if L != V and L in propias and r and coincide(r[1], cm)]
        aj_ok_otras = [(L, V) for (L, V), r in res.items() if L != V and L not in propias and r and coincide(r[1], cm)]
        o58 = [L for L in OTRAS(idi, propias) if num.get(L) in ("5", "8") and coincide(res[(L, L)][1], cm)]
        des = 0; ndes = 0
        for L in propias:
            r, rs = res[(L, L)]
            for d in DESPL:
                for sg in (1, -1):
                    ndes += 1
                    if coincide(resumen(r[0], r[1], r[2], sg * d), cm):
                        des += 1
        # el margen: la menor confianza de las propias aceptadas frente a la mayor de TODAS las ajenas (las de las 13 letras)
        mx = max(maxaj[L] for L in propias)
        marg = min((res[(L, L)][1]["conf"] for L in pa), default=float("nan")) - mx
        c1, c2, c3, c4, c5 = len(aj_ok) == 0, len(o58) == 0, des == 0, len(pa) >= 7, (marg >= 0.1 if pa else False)
        todo = all((c1, c2, c3, c4, c5)); veredicto.append(todo)
        print(f"| {cm} | {len(pa)}/13 | {len(aj_ok)} (+{len(aj_ok_otras)} de letras de otra version) | {len(o58)} | {des}/{ndes} | {marg:+.3f} | {c1} | {c2} | {c3} | {c4} | {c5} | {todo} |")
    print(f"\nmax conf ajena (13 letras propias contra las otras voces del mismo idioma): {max(maxaj[L] for L in propias):.3f}")
    print(f"Criterio de adopcion (senal D): {'SI' if any(veredicto) else 'NO'}")


def OTRAS(idi, propias):
    return [i for i in idi if i not in propias]


if __name__ == "__main__":
    main()
