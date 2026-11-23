"""Codificador wav2vec2 (XLSR-53, norma estable) en inferencia, solo con torch (ADR 0028 §3.2).

Carga el `state_dict` de HF (`pytorch_model.bin` con `weights_only=True`) o de `model.safetensors`.
Sirve para comprobar el criterio 6: sus emisiones deben igualar a las de `transformers`.
"""

import json
from pathlib import Path

import torch
import torch.nn.functional as F


def _cargar_pesos(carpeta: Path) -> dict:
    st = carpeta / "model.safetensors"
    if st.exists():
        from safetensors.torch import load_file

        return load_file(str(st))
    return torch.load(carpeta / "pytorch_model.bin", weights_only=True, map_location="cpu")


class EncoderPropio:
    def __init__(self, carpeta: Path, dtype=torch.float32):
        cfg = json.loads((carpeta / "config.json").read_text())
        sd = _cargar_pesos(carpeta)
        self.sd = {k: v.to(dtype) for k, v in sd.items()}
        self.cfg = cfg
        self.heads = cfg["num_attention_heads"]
        self.capas = cfg["num_hidden_layers"]
        self.kernels, self.strides = cfg["conv_kernel"], cfg["conv_stride"]
        self.eps = cfg["layer_norm_eps"]
        # weight_norm (dim=2): w = g * v / ||v|| con la norma sobre todos los ejes salvo el 2.
        # Los pesos pueden venir como weight_g/weight_v o como parametrizations (safetensors nuevos).
        p = "wav2vec2.encoder.pos_conv_embed.conv."
        if p + "weight_g" in self.sd:
            g, v = self.sd[p + "weight_g"], self.sd[p + "weight_v"]
        else:
            g = self.sd[p + "parametrizations.weight.original0"]
            v = self.sd[p + "parametrizations.weight.original1"]
        norma = v.norm(dim=(0, 1), keepdim=True)
        self.w_pos = g * v / norma
        self.b_pos = self.sd[p + "bias"]
        self.grupos = cfg["num_conv_pos_embedding_groups"]
        self.k_pos = cfg["num_conv_pos_embeddings"]

    def _ln(self, x, base):
        return F.layer_norm(x, x.shape[-1:], self.sd[base + ".weight"], self.sd[base + ".bias"], self.eps)

    def _lin(self, x, base):
        return F.linear(x, self.sd[base + ".weight"], self.sd[base + ".bias"])

    @torch.inference_mode()
    def logits(self, audio: torch.Tensor) -> torch.Tensor:
        """audio (T,) ya normalizado a media 0 y varianza 1 -> logits (frames, vocab)."""
        sd = self.sd
        x = audio[None, None, :]
        for i in range(7):
            b = f"wav2vec2.feature_extractor.conv_layers.{i}"
            x = F.conv1d(x, sd[b + ".conv.weight"], sd[b + ".conv.bias"], stride=self.strides[i])
            x = x.transpose(1, 2)
            x = self._ln(x, b + ".layer_norm")
            x = F.gelu(x).transpose(1, 2)
        x = x.transpose(1, 2)  # (1, frames, 512)
        x = self._ln(x, "wav2vec2.feature_projection.layer_norm")
        x = self._lin(x, "wav2vec2.feature_projection.projection")
        pos = F.conv1d(x.transpose(1, 2), self.w_pos, self.b_pos, padding=self.k_pos // 2, groups=self.grupos)
        pos = pos[:, :, :-1]  # SamePad con kernel par
        x = x + F.gelu(pos).transpose(1, 2)
        n, d = x.shape[1], x.shape[2]
        h = self.heads
        for i in range(self.capas):
            b = f"wav2vec2.encoder.layers.{i}"
            r = x
            y = self._ln(x, b + ".layer_norm")
            q = self._lin(y, b + ".attention.q_proj").view(1, n, h, d // h).transpose(1, 2)
            k = self._lin(y, b + ".attention.k_proj").view(1, n, h, d // h).transpose(1, 2)
            v = self._lin(y, b + ".attention.v_proj").view(1, n, h, d // h).transpose(1, 2)
            a = F.scaled_dot_product_attention(q, k, v).transpose(1, 2).reshape(1, n, d)
            x = r + self._lin(a, b + ".attention.out_proj")
            y = self._ln(x, b + ".final_layer_norm")
            y = F.gelu(self._lin(y, b + ".feed_forward.intermediate_dense"))
            x = x + self._lin(y, b + ".feed_forward.output_dense")
        x = self._ln(x, "wav2vec2.encoder.layer_norm")
        return self._lin(x, "lm_head")[0]
