# 0224 — Contrato del aviso `tanda` y E2E que ahora salen a LRCLIB con la búsqueda automática activa (0.2.2, feature 5/7)

- De: programador
- Para: arquitecto
- Estado: Respondida (2026-11-22, arquitecto)
- Bloquea: no (opciones conservadoras aplicadas en la tarea [0309](../tareas/0309-tanda-pausa-paradas-y-reanudar-al-abrir.md))

## Contexto

1. El catálogo de avisos de `ServicioAvisos` gana el tipo `tanda` (`shared/avisos.ts`): `cancionId: ""`, `texto` = `act.cola.fin`, `etiqueta` «Ver resultado» y un `destino` nuevo `"biblioteca"`. Si el usuario pulsa la notificación del sistema, main emite `abrirCancion` con `cancionId: ""` y destino `biblioteca`; el renderer (tarea 0311) debe tratar ese caso como «abrir el resultado de la preparación» y no como una canción.
2. Con `config.preparacion.automatica` activo por defecto, todo E2E que importe un archivo o descargue un vídeo sin `SHINOBI_LRCLIB_URL` dispara ahora una búsqueda a `lrclib.net` real (o `SIN_CONEXION` sin red, con reintento a los 60 s). Las specs de separación que toco apagan el interruptor en su `config.json`; el resto de specs que añaden canciones no.

## Pregunta

1. ¿Se confirma el contrato del aviso `tanda` (sin canción, destino `biblioteca`)?
2. ¿Se apaga el interruptor (o se apunta `SHINOBI_LRCLIB_URL` al doble) en las fixtures comunes de los E2E que añaden canciones, para que ninguna salga a la red real? Lo propondría como tarea de QA.

## Opción provisional tomada (si no bloquea)

1. Sí; el renderer lo resuelve en la 0311.
2. Solo en `separacion.spec.ts` (esta tarea); el resto queda como está hasta tu respuesta.

## Respuesta

Arquitecto, 2026-11-22. Queda fijado en ADR [0025](../adr/0025-preparacion-desatendida-y-datos-de-la-cancion-automaticos.md), «Revisión 2026-11-22 (pregunta 0224)».

1. **Aviso `tanda`**: el tipo, su texto y el destino `biblioteca` se confirman, y también `enCurso` en el diario `trabajos/pendientes.json`, que sirve para sumar `interrupciones` solo a lo que estaba en curso. **Corrijo** el clic en la notificación: en lugar de `abrirCancion` con un id vacío, que es un caso especial escondido en un contrato de canciones, main emite un **evento propio `preparacion:abrirResultado`** (sin carga). El renderer lo traduce en «ir a la Biblioteca y abrir el diálogo "Resultado de la preparación"». Sigue siendo un tipo más del catálogo de avisos. El criterio queda en la tarea [0311](../tareas/0311-preparacion-en-progreso-letra-editor-y-ajustes.md) y el cambio de main en la tarea nueva [0372](../tareas/0372-avisos-de-tanda-y-pruebas-sin-red-real.md).
2. **Red en las pruebas**: **regla**: ninguna prueba automática (Vitest, E2E, críticos, CI) sale a un servicio real (lrclib.net, YouTube, GitHub). Va al doble local o a un host que no resuelve. La regla queda escrita en ADR 0005 y 0025. La protección global de Playwright es de qa. **Además recomiendo una defensa en el producto**, porque un E2E nuevo que olvide la fixture no debe poder salir a la red: sin empaquetar y con `SHINOBI_E2E=1`, si no hay `SHINOBI_LRCLIB_URL` válida, la URL base de LRCLIB es `http://lrclib.invalid`. Eso cubre las búsquedas y el `HEAD` de conexión, que usan la misma función. `SHINOBI_E2E=1` lo pone qa en el lanzador común de los E2E. Cambio exacto en la tarea 0372.
