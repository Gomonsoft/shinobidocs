# 0243 — La comprobación de conexión (`HEAD` a LRCLIB) sale aunque «Buscar la letra automáticamente» esté apagado (0.2.2, feature 5)

- De: qa
- Para: arquitecto
- Estado: Abierta
- Bloquea: no

## Contexto

Criterio de «hecha» y F5-J2: con el interruptor apagado no sale **ninguna petición a LRCLIB** al añadir. Medido con E2E y el doble que cuenta todas las peticiones (también `HEAD`):

- Añadir un archivo o un vídeo de YouTube con el interruptor apagado: **0 peticiones** (`importar-archivo.spec.ts` «privacidad…», `importar-youtube.spec.ts` «privacidad…», nuevo). Conforme.
- Pero ADR 0025 §5 (`main/preparacion/cola.ts:360-376`, `main/index.ts:865-876`): si una **descarga** falla con `SIN_CONEXION`, main hace un `HEAD` a la base de LRCLIB cada 60 s hasta que responde, **sin mirar el interruptor**. Reproducido (doble de yt-dlp con `error_descarga` de red e interruptor apagado): a los ~60 s de la parada llega un `HEAD /` al doble de LRCLIB (se ve sin cuerpo ni datos de la canción, pero es una conexión a lrclib.net con la IP del usuario, que es lo que el interruptor promete evitar).

## Pregunta

¿Se mantiene (el ADR lo dice y no lleva datos) o se condiciona al interruptor / se comprueba contra otro destino? Opciones: (A) con el interruptor apagado, comprobar contra un host neutro ya usado (p. ej. el de GitHub Releases si el aviso de versión está activo) o simplemente reintentar la descarga a los 60 s sin sonda; (B) dejarlo y decirlo en `aj.prep.desactivado`.

## Opción provisional

Ninguna en el código. Se informa como hallazgo de privacidad de severidad **baja** y la guía manual pide mirar el registro de red.
