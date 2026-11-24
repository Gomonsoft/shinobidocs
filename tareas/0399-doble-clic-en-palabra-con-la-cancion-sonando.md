# 0399 — I-3 · Editor preciso: doble clic en una palabra con la canción sonando
- Estado: Hecha
- Paso del pipeline: 6
- Depende de: —
- ADRs: 0021
- Spec UX: docs/ux/06-editor.md (tira de palabras del editor preciso; el diseñador la ajusta en paralelo)
- Tamaño: XS
- Versión: 0.2.3 ([incidencia I-3](../Test-manuales/0.2.3/incidencias-2026-11-23-windows.md))

## Objetivo
Con la canción sonando, el doble clic en una palabra reproduce desde ella y no vuelve a la posición anterior.

## Criterios de aceptación
Los de la spec 06 (plan 6 › «Doble clic en una palabra del editor preciso», I3-1 a I3-7):
- [x] I3-1 sonando sin bucle: salta a `inicio − 250 ms` y sigue sin saltos. Test unitario (llamada a `reproducir({desdeMs})`, sin `pausar` ni `buscar`) y E2E de posición muestreada (sin ejecutar).
- [x] I3-2 en pausa: empieza a sonar desde ahí y no vuelve ni se pausa.
- [x] I3-3 con bucle: `buscar(máx(inicio − 250, inicio del bucle))`, el bucle sigue y no se relanza si sonaba.
- [x] I3-4 un clic solo selecciona.
- [x] I3-5 «▶ Palabra» / Mayús + Espacio: vuelve a la posición previa y, si sonaba, sigue sonando desde ahí.
- [x] I3-6 sin comprobación al mover bordes con el editor preciso abierto (ya era así); el doble clic cancela una comprobación en curso sin volver (`alReproducirPropio` → `escucha.cancelar()`).
- [x] I3-7 Mayús + Intro equivale al doble clic y no marca; Intro marca; el diálogo de atajos lo incluye.

## Pruebas de feedback
- Unitarias: `EditorPreciso.test.tsx` (3 casos nuevos), `escuchaComprobacion.test.ts` (sin cambios, pasa).
- E2E: ninguna.
- Manual: doble clic en una palabra con la canción sonando, oír que sigue; repetir en pausa y con «Bloquear enunciado».

## Notas de implementación
**Causa original.** `escucharPalabra` (`app/src/renderer/src/vistas/editor/preciso/EditorPreciso.tsx`) guardaba siempre `previa = motor.posicionMs()`, reproducía `[inicio − 250, fin + 250]` y al parar hacía `buscar(previa)`; el doble clic usaba esa misma función que ▶ Palabra. Sonando, `previa` era la posición en marcha: de ahí el salto de vuelta (63,5 s + el tiempo de la escucha). `EscuchaComprobacion` no intervenía (se ignora si suena).
**Arreglo.** Dos funciones: `reproducirDesdePalabra` (doble clic y Mayús + Intro) y `escucharPalabra` (▶ Palabra, Mayús + Espacio; ahora, si sonaba, reanuda desde la posición previa). Props nuevas `alReproducirPropio(vuelve)` y `alTerminarEscuchaPropia` para que el editor cancele su escucha de comprobación (si no, al acabar la reproducción restauraría la posición vieja) y conserve el modo de la vista previa (tarea 0400). Atajo añadido a `DialogoAtajos.tsx`.
**Pruebas.** `EditorPreciso.test.tsx` (sonando, pausa, bucle, ▶ Palabra sonando, Mayús + Intro, un clic). E2E sin ejecutar: `app/e2e/editor-previa-pausa.spec.ts` («doble clic en una palabra con la canción sonando no salta atrás»).
**Fuera del editor preciso** el doble clic en una región (`PistaSincronia`) y en una fila de la lista no restaura nunca: no comparten código.
**Preexistente:** sí, de 0.2.1.
**No cubierto:** la «pasada de Marcar al vuelo empieza en esa palabra» (provisional 0388) solo queda como la palabra seleccionada; no se probó con audio real. Manual: el gesto del video de I-3 con una canción real.
