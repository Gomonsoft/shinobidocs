"""Descarta que la diferencia de logits (~1e-3) sea un error de la implementacion: en float64 deben coincidir (~1e-9).
Uso: uv run python equivalencia_fp64.py <biblioteca> <modelos> <id8>:<idioma>"""
import sys
from pathlib import Path
import torch
import alinear as A
from encoder_propio import EncoderPropio
from transformers import Wav2Vec2ForCTC

torch.set_num_threads(4)
biblio, modelos = Path(sys.argv[1]), Path(sys.argv[2])
id8, idioma = sys.argv[3].split(":")
d = A.resolver(biblio, id8)
x = A.leer_audio(d / "pistas" / "voz.flac")[0 : 30 * A.SR]
hf = Wav2Vec2ForCTC.from_pretrained(str(modelos / idioma)).eval()
with torch.inference_mode():
    a32 = hf(x[None]).logits[0]
hf = hf.double()
p64 = EncoderPropio(modelos / idioma, dtype=torch.float64)
p32 = EncoderPropio(modelos / idioma)
with torch.inference_mode():
    a64 = hf(x[None].double()).logits[0]
print("rango de logits", float(a64.min()), float(a64.max()))
print("propio fp64 vs transformers fp64: max |d|", float((a64 - p64.logits(x.double())).abs().max()))
print("transformers fp32 vs transformers fp64: max |d|", float((a32.double() - a64).abs().max()))
print("propio fp32 vs transformers fp64: max |d|", float((p32.logits(x).double() - a64).abs().max()))
