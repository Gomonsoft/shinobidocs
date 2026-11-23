# 0240 — Pruebas frágiles de `main/preparacion/servicio.test.ts` (cancelar y eliminar durante una corrida) y un borde de la cancelación de la separación (0.2.2, feature 5)

- De: qa
- Para: programador
- Estado: Abierta
- Bloquea: no

## Contexto

La suite de la preparación (42 pruebas) pasa siempre en solitario y casi siempre con carga, pero **se reprodujo un fallo**: con 6 procesos `yes` ocupando la CPU, `detenciones › cancelar la separación detiene la cadena sin borrar las candidatas` (línea 580) agotó los 5 s (5045 ms) en 1 de 3 ejecuciones (luego 0 de 6). Otras dos del mismo bloque (`cancelar a mitad deja detenida…`, línea 538, y `eliminar la canción detiene la corrida sin escribir más`, línea 590) dependen del mismo patrón.

Causa (por lectura):

1. **Esperas fijas como sincronía** (`await new Promise(r => setTimeout(r, 20))` en 584, `30` en 594, `20` en 617 y `30` en 761): se supone que en ese margen la corrida ya observó el estado. Bajo carga no es cierto. La de 30 ms de `eliminar…` se «arregló» alargándola, que solo mueve el problema.
2. **`vi.waitFor` sobre el registro** (`paso === 'esperando_separacion'`) garantiza que el paso se escribió, no que `esperarCancion` ya tenga su primera lectura de la canción. En `pasoEsperar` (`servicio.ts:455-463`) la parada solo se produce si la corrida vio antes `en_curso` (`vistaEnCurso`). Si la prueba escribe `pendiente` sin que la corrida haya visto `en_curso`, **la corrida no se detiene nunca** y `enReposo()` no vuelve: es exactamente el cuelgue de 5 s.

## Pregunta

1. Prueba: sustituir las esperas fijas por una condición observable (p. ej. un contador o una promesa «la corrida leyó la canción n veces» que el doble de `esperar`/`sondeo` expone, o relojes falsos de Vitest con `advanceTimersByTimeAsync`), y esperar con `vi.waitFor` a que el número de eventos `emitir` se estabilice en vez de dormir. ¿Lo haces así?
2. Producto: ¿es intencionado que una separación que pasa a `pendiente` **sin que la corrida haya llegado a ver `en_curso`** no detenga la cadena? En producción esa ventana existe (el usuario cancela la separación apenas empieza; la corrida se suscribe a los cambios de la biblioteca y podría perder una transición si dos escrituras seguidas se funden). Si no es intencionado, `pendiente` posterior a «haber empezado la espera con la separación ya lanzada» (`hayTrabajo` o `en_curso` al entrar) debería contar como parada.

## Opción provisional

Ninguna en el código. Las tres pruebas se clasifican como **inestables de la prueba bajo carga** (no regresión) y la segunda cuestión, como defecto **bajo** hasta que se decida.
