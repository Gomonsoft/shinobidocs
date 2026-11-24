# 0394 — Textos de la letra elegida «sin comprobar con tu audio»
- De: arquitecto
- Para: disenador-ux
- Estado: Respondida
- Bloquea: tarea 0395 (y la entrega de 0393, que va en el mismo commit)

## Contexto

ADR 0025, revisión del 2026-11-23, punto 1: la preparación desatendida elegirá sola una letra de LRCLIB aunque la comprobación con la voz no pueda decir nada (`dudosa` con limitación `vozContinua` o `sinContraste`). La regla completa está en la tarea [0393](../tareas/0393-elegir-la-letra-sin-comprobar-con-tu-audio.md): mismo texto en todas las elegibles, duración a ±2 s, nunca se corrige el desfase y la canción queda en «Lista para revisar». El resumen de la IPC trae `preparacion.eleccionSinComprobar: boolean`. Es provisional ([pregunta 0393](0393-elegir-la-letra-sin-comprobarla-con-tu-audio.md), para el usuario).

Hoy, si la app elige, la vista Letra dice `let.prep.elegida` («… es la coincidencia exacta de LRCLIB y coincide con tu audio») y la tarjeta dice `bib.prep.origen.auto` («Letra elegida automáticamente»). Con esta regla, la primera frase sería falsa.

## Pregunta

Textos y superficies para la letra elegida sin comprobar, en las specs [05 · Feature 5](../ux/05-letra.md#022--feature-5--preparación-desatendida-la-vista-letra) y [02 · Feature 5](../ux/02-biblioteca.md) (y en la 04 si el bloque «Preparación automática» lo repite).

## Opción provisional tomada (si no bloquea)

Bloquea. Propuesta del arquitecto, para que la ajustes o la sustituyas:
- `let.prep.elegida.sinComprobar`: «Elegimos esta letra por ti: es la coincidencia exacta de LRCLIB, pero no hemos podido comprobarla con tu audio (la voz casi no tiene pausas o la letra no marca dónde acaba cada línea). Revisa que vaya a tiempo.» — [Ver otras candidatas] [×]
- `bib.prep.origen.autoSinComprobar`: «Letra elegida automáticamente · sin comprobar»

## Respuesta

**Diseñador UX, 2026-11-23.** Textos y superficies fijados en las specs. La tarea 0395 puede empezar. Los textos van tal cual.

- **Vista Letra (C)**: [05 · Letra elegida sin comprobar con tu audio](../ux/05-letra.md#letra-elegida-sin-comprobar-con-tu-audio), criterios F5-L9 a F5-L13.
  `let.prep.elegida.sinComprobar`: «Elegimos esta letra por ti: es la coincidencia exacta de LRCLIB, pero **no hemos podido comprobarla con tu audio**. Pasa a menudo y no quiere decir que esté mal: al revisarla, fíjate en que vaya a tiempo con la voz.» — [Ver otras candidatas] [×].
  Es el mismo aviso `info` con `role="status"`, pero con el icono `circle-help` y ese fragmento en negrita. El motivo técnico no va en el aviso: ya lo da la línea `let.comp.actual.limitada` de debajo, que no cambia.
- **Tarjeta**: [02 · Línea de origen «sin comprobar con tu audio»](../ux/02-biblioteca.md#línea-de-origen-sin-comprobar-con-tu-audio), criterios F5-B14 a F5-B18.
  Texto visible `bib.prep.origen.autoSinComprobar`: «Letra elegida automáticamente · sin comprobar», con el icono `circle-help` 14 px en `texto-2`.
  En `title` y en `bib.aria.tarjeta` va `bib.prep.origen.autoSinComprobar.ayuda`: «Letra elegida automáticamente, sin comprobar con tu audio. Al revisarla, fíjate en que vaya a tiempo con la voz.»
- **Progreso, bloque R1** (spec 04, criterio F5-P14, que enmienda F5-P4). Variante de `prog.prep.r1.letra`: «Letra de LRCLIB, coincidencia exacta. No hemos podido comprobarla con tu audio: al revisarla, fíjate en que vaya a tiempo con la voz.»
- **Editor, bloque «Preparación automática»** (spec 06, criterio F5-E7). Variante de `edi.prep.letra`: «Letra de LRCLIB, coincidencia exacta, sin comprobar con tu audio: fíjate en que vaya a tiempo con la voz.»

Respecto a tu propuesta:
- He quitado el motivo entre paréntesis del aviso, porque repetía la línea de comprobación.
- He añadido una frase para tranquilizar («Pasa a menudo y no quiere decir que esté mal»).
- En la tarjeta he dejado «· sin comprobar» y la frase completa va en `title` y en el lector de pantalla.
- La tarea 0395 debe cubrir también R1 (04) y el renglón del editor (06), porque las dos superficies ya mencionaban la letra elegida.

Las decisiones discutibles están anotadas como provisionales en la [pregunta 0393](0393-elegir-la-letra-sin-comprobarla-con-tu-audio.md), apartado «Textos de la letra sin comprobar».
