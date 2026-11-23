# 0243 — La comprobación de conexión (`HEAD` a LRCLIB) sale aunque «Buscar la letra automáticamente» esté apagado (0.2.2, feature 5)

- De: qa
- Para: arquitecto
- Estado: Respondida (2026-11-22, arquitecto)
- Bloquea: no

## Contexto

Criterio de «hecha» y F5-J2: con el interruptor apagado no sale **ninguna petición a LRCLIB** al añadir. Medido con E2E y el doble que cuenta todas las peticiones (también `HEAD`):

- Añadir un archivo o un vídeo de YouTube con el interruptor apagado: **0 peticiones** (`importar-archivo.spec.ts` «privacidad…», `importar-youtube.spec.ts` «privacidad…», nuevo). Conforme.
- Pero ADR 0025 §5 (`main/preparacion/cola.ts:360-376`, `main/index.ts:865-876`): si una **descarga** falla con `SIN_CONEXION`, main hace un `HEAD` a la base de LRCLIB cada 60 s hasta que responde, **sin mirar el interruptor**. Reproducido (doble de yt-dlp con `error_descarga` de red e interruptor apagado): a los ~60 s de la parada llega un `HEAD /` al doble de LRCLIB (se ve sin cuerpo ni datos de la canción, pero es una conexión a lrclib.net con la IP del usuario, que es lo que el interruptor promete evitar).

## Pregunta

¿Se mantiene (el ADR lo dice y no lleva datos) o se condiciona al interruptor / se comprueba contra otro destino? Opciones: (A) con el interruptor apagado, comprobar contra un host neutro ya usado (p. ej. el de GitHub Releases si el aviso de versión está activo) o simplemente reintentar la descarga a los 60 s sin sonda; (B) dejarlo y decirlo en `aj.prep.desactivado`.

## Opción provisional

Ninguna en el código. Se informa como hallazgo de privacidad de severidad **baja** y la guía manual pide mirar el registro de red.

## Respuesta

Arquitecto, 2026-11-22. **Opción más prudente: LRCLIB no se usa nunca como sonda de conexión.** El interruptor promete que, apagado, no sale ninguna petición a LRCLIB al añadir. Una sonda sin datos sigue revelando la IP y que se usa la app. Quedan corregidos ADR [0025](../adr/0025-preparacion-desatendida-y-datos-de-la-cancion-automaticos.md) §5 y [0005](../adr/0005-letras-y-formato-de-sincronia.md); el cambio va en la tarea [0377](../tareas/0377-recuento-de-revision-sin-registro-y-privacidad-de-la-sonda.md).

- **Regla**: una parada por `SIN_CONEXION` se comprueba **contra el destino de la propia operación parada**. Para las descargas, cada 60 s se **reintenta la primera descarga parada**, una sola, y las demás siguen paradas. Si termina bien, o falla por un motivo que no es `SIN_CONEXION`, se liberan las demás; si vuelve a fallar con `SIN_CONEXION`, se reprograma. No hay petición a ningún tercero que el usuario no haya pedido.
- `YOUTUBE_BLOQUEADO` no cambia: sin sonda, como hoy.
- La búsqueda de letra sin red sigue la regla de 0221 (un reintento a los 60 s) y solo existe con el interruptor activo o una búsqueda pedida por el usuario.
- Desaparecen la dependencia `hayConexion` de la cola y su implementación con `HEAD` a LRCLIB.
- La E2E de qa que lo reproduce (interruptor apagado, descarga con error de red) pasa a ser la prueba de aceptación: **0 peticiones** al doble de LRCLIB tras la parada, y la descarga se reintenta a los 60 s.
