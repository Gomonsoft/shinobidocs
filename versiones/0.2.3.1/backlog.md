# 0.2.3.1 · Versión de pruebas: lo atrasado hasta la 0.2.3-alpha.2

- Fecha: 2026-11-24
- Origen: orden del usuario del 2026-11-23: «Crearemos una versión 0.2.3.1 que será con 1. Lo que aún me falta probar 2. Cambios y arreglos 3. Tus preguntas».
- Rama: `version-0.2.3.1` en la app y en la documentación, con PR en borrador hacia `develop` (app) y `main` (documentación).
- Número en la app: `0.2.3-alpha.3` (el instalador solo admite tres partes; «0.2.3.1» es el nombre de trabajo).
- Punto de partida: `0.2.3-alpha.2`, publicada como versión preliminar para recoger feedback de uso real.

No se añade alcance nuevo sin decisión del usuario. Lo que llegue como feedback de la alpha.2 se anota en la sección 2.

## 1. Lo que falta probar a mano

Guías en `docs/Test-manuales/`. Ejecutado hasta hoy: solo el caso 1 de la feature 1 de 0.2.3 (Windows 11).

| Guía | Estado |
|---|---|
| 0.2.2 · features 1 a 9 y 11 (diez guías) | Sin ejecutar |
| 0.2.3 · feature 1, casos 2 en adelante | Sin ejecutar |
| 0.2.3 · feature 2, voz en los coros (hay que escucharla) | Sin ejecutar |
| 0.2.3 · feature 3, voces a la vez | Sin ejecutar |
| Plan 6: pantalla de error, vista previa en pausa (I2-5, I2-7, I2-8, I2-9), doble clic en palabra, letra elegida «sin comprobar», fines aplazados | Sin guía: escribirla |

Además:
- Confirmar en el equipo Windows que el editor ya no queda en negro; si ocurre, la pila está ahora en `app.log` (pregunta 0401).
- Medir con las canciones revisadas a mano de Windows: `calibrar:encaje --variantes` (ventana de 800 ms y elección sin comprobar) y `docs/spikes/0030-fin-tras-ultima-voz/` (propuesta 043).
- Capturas F5-L13 y F5-B18 de la tarea 0395; revisión de diseño del reproductor de la feature 3 de 0.2.3.

## 2. Cambios y arreglos

Propuestas valoradas, pendientes de la decisión del usuario (valoración de diseño y técnica dentro de cada archivo):

| Propuesta | Recomendación |
|---|---|
| 040 · Anticipar quién canta después | Hacerla: 2 s antes, la línea y su insignia suben de opacidad |
| 041 · Cantantes solo desde Funciones | Hacerla: quitar la franja «cantante nuevo» (la causa de I-1 ya se encontró) |
| 042 · Carril del Coro opcional | Hacerla sin casilla: el carril aparece cuando hay líneas de coro |
| 043 · Fin tras la voz que sigue a una pausa | Hacerla con la regla E2, tras medirla en las canciones de Windows |

Arreglos conocidos:
- Pruebas intermitentes del CI (ninguna reproduce en local): Vitest `LetraElegida.test.tsx`, `DialogoImportarPaquete.test.tsx`, `Editor.exportar.test.tsx` (EX7), `main/copias/copias.test.ts` y `main/runtime/falso/falso.test.ts` (Windows, 5 s); E2E `importar-lote.spec.ts:113`, `importar-youtube.spec.ts:385`, `exportacion-captura.spec.ts:89` a 640 × 480 (Windows), `editor.spec.ts:456`. El CI no guarda capturas ni trazas de los fallos: añadirlas como artefacto.
- Pantalla de error: botón «Abrir la carpeta de registros» y límite de la ventana de exportación (pregunta 0399); gancho de prueba `info.pruebas` (pregunta 0400).
- Pruebas de componente que faltan: F5-P14 y F5-E7.
- Feature 10 de 0.2.2 (sincronía automática con la voz): sin implementar, condicionada a su prueba técnica.
- Ideas del diseñador sobre el tiempo de reparto (pregunta 0390): asignar con una tecla la línea que suena; mismo cantante para líneas con el mismo texto.
- Lo que llegue del feedback de la alpha.2: (se rellena).

## 3. Preguntas para el usuario

Abiertas con `Para: usuario` a 2026-11-24. Casi todas son decisiones provisionales ya aplicadas, a confirmar o cambiar:

- Plan 6: 0387 (vista previa en pausa), 0388 (doble clic en palabra, casos sin confirmar), 0389 (pantalla de error), 0393 (letra elegida sin comprobar, ventana de 800 ms), 0401 (causa de I-1 sin confirmar), 0390 (tiempo de reparto).
- 0.2.3: 0160, 0165, 0170 (decisiones provisionales de varios cantantes y coros), 0167, 0386 (0.2.1 descarta el reparto al guardar).
- 0.2.2: 0154, 0155, 0158, 0159 (decisiones provisionales), 0280 (comprobación de la letra: cinco puntos, incluido el uso de red real).
- Anteriores: 0036 (política de versiones: decidir el nombre «0.2.3.1» frente al número de tres partes), 0044, 0045, 0100, 0110, 0120, 0130, 0147, 0148, 0150.
- Sin pregunta escrita: voces a la vez como provisional en 0.2.3; paquete «Completo» por defecto frente a «Ligero»; regla de «solo por PR» en shinobidocs; restos de la prueba técnica de sincronía (unos 3,3 GB en el Mac).
