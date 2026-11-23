"""Agrega los JSON de alinear.py: cobertura, mediana |D|, p90 |D - sesgo| y sesgo (global y por cancion),
coste, y V2 (palabras de las canciones con tiempos por palabra). Imprime SOLO cifras e ids abreviados."""

import argparse
import json
from pathlib import Path

import numpy as np


def pct(x, q):
    return float(np.percentile(x, q)) if len(x) else float("nan")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("biblioteca", type=Path)
    ap.add_argument("salida", type=Path)
    ap.add_argument("--numeros", default="", help="id8=N, para llamarlas 'cancion N' (opcional)")
    a = ap.parse_args()
    num = dict(p.split("=") for p in a.numeros.split(",") if p)
    todas, desv_g, filas, v2 = [], [], [], []
    for f in sorted(a.salida.glob("????????.json")):
        s = json.loads(f.read_text())
        ls = s["lineas"]
        con = [l for l in ls if "inicio_alin" in l]
        d = np.array([l["inicio_alin"] - l["inicio_lrc"] for l in con], dtype=float)
        sesgo = float(np.median(d)) if len(d) else float("nan")
        dev = d - sesgo
        todas.extend(np.abs(d)); desv_g.extend(np.abs(dev))
        omit = {}
        for l in ls:
            if "omitida" in l: omit[l["omitida"]] = omit.get(l["omitida"], 0) + 1
        dur = s["duracion_s"]
        t = s["t_emisiones_s"] + s["t_alineacion_s"] + s["t_lectura_s"]
        filas.append((s["id8"], num.get(s["id8"], "?"), s["idioma"], len(ls), len(con), len(con) / len(ls),
                      float(np.median(np.abs(d))), pct(np.abs(dev), 90), sesgo, dur, t, s["pico_ram_mb"],
                      float(np.mean(np.abs(d) > 1000)), omit))
        # V2
        c = json.loads(next(a.biblioteca.glob(s["id8"] + "*")).joinpath("cancion.json").read_text())
        elems = c["letra"]["lineas"]
        if any(l.get("palabras") for l in elems):
            e = []
            for l in ls:
                if "palabras" not in l: continue
                ref = elems[l["i"]].get("palabras")
                if not ref or len(ref) != len(l["palabras"]): continue
                for r, p in zip(ref, l["palabras"]):
                    if p: e.append(p[0] - r["inicio_ms"])
            e = np.array(e, float)
            v2.append((s["id8"], len(e), float(np.median(np.abs(e))), float(np.median(e)),
                       float(np.mean(np.abs(e) <= 100)), float(np.mean(np.abs(e) <= 200))))
    print("| id | cancion | idioma | lineas | alineadas | cobertura | med abs D (ms) | p90 abs(D-sesgo) (ms) | sesgo (ms) | dur (s) | t emis+ali (s) | t/dur | RAM pico (MB) | frac abs D > 1000 | omitidas |")
    print("|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|")
    for r in filas:
        print(f"| {r[0]} | {r[1]} | {r[2]} | {r[3]} | {r[4]} | {r[5]:.0%} | {r[6]:.0f} | {r[7]:.0f} | {r[8]:.0f} | {r[9]:.0f} | {r[10]:.0f} | {r[10]/r[9]:.2f} | {r[11]} | {r[12]:.0%} | {r[13]} |")
    tl, al = sum(r[3] for r in filas), sum(r[4] for r in filas)
    print(f"\nGLOBAL: {len(filas)} canciones, {tl} lineas, {al} alineadas, cobertura {al/tl:.1%}; "
          f"mediana |D| {np.median(todas):.0f} ms; p90 |D-sesgo| {pct(desv_g,90):.0f} ms; "
          f"p50 |D-sesgo| {pct(desv_g,50):.0f}; mediana de medianas {np.median([r[6] for r in filas]):.0f}; "
          f"t/dur max {max(r[10]/r[9] for r in filas):.2f}; RAM max {max(r[11] for r in filas)} MB")
    for v in v2:
        print(f"V2 {v[0]}: {v[1]} palabras; mediana |e| {v[2]:.0f} ms; sesgo {v[3]:.0f} ms; <=100 ms {v[4]:.0%}; <=200 ms {v[5]:.0%}")


if __name__ == "__main__":
    main()
