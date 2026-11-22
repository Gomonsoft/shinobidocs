# 035 — Ajustes: almacenamiento y estado del motor

- Estado: Idea
- Origen: exploración 0.2.2 del diseñador UX ([mejoras de experiencia](../versiones/0.2.2/exploracion/mejoras-de-experiencia.md) §3.2 y §3.14); feedback de alpha.1 §1.6
- Fecha: 2026-11-21
- Relacionadas: spec [08](../ux/08-ajustes-y-acerca.md); [ADR 0004](../adr/0004-separacion-voz-instrumental.md) (la mezcla no se borra), [ADR 0006](../adr/0006-persistencia-y-modelo-de-datos.md); propuestas 021 y 025

## Problema
Ajustes no dice cuánto ocupa la app ni con qué está trabajando de verdad.

- Cada canción ocupa unos 100 MB (texto del error de espacio). Guarda tres audios sin pérdida: la mezcla original, la voz y el instrumental. En una canción terminada, la mezcla solo sirve para volver a separar.
- Los 5 borradores abandonados ocupan lo mismo que una canción terminada.
- El motor y el modelo ocupan varios GB, y las cachés (picos de voz, tramos del editor preciso) crecen sin que se vean.
- Con importación por lotes (021), 50 canciones son unos 5 GB de una vez.
- El registro repite `CUDAExecutionProvider not available` en cada separación (17 veces). Los tiempos indican que la GPU sí se usa, pero la app no lo muestra en ningún sitio y la duda quedó sin cerrar en el feedback.

## Propuesta
Dos secciones nuevas en Ajustes.

**Almacenamiento**
- Total y desglose: «Canciones 1,7 GB · Motor y modelo 4,2 GB · Cachés 120 MB», con la ruta y «Abrir carpeta de datos».
- **Liberar espacio**, con lo que se recupera en cada opción:
  - «Borrar el audio original de las canciones listas (680 MB)». Aviso: no se podrán volver a separar sin añadirlas otra vez.
  - «Vaciar las cachés (120 MB)». Se regeneran solas.
  - «Ver los borradores sin terminar (5)», que lleva a la Biblioteca filtrada.
- Aviso previo cuando el disco tiene poco espacio, antes de empezar una importación.

**Estado del motor** (amplía «Separación de voz»)
- Dispositivo usado **en la última separación**, no el previsto: «Tarjeta gráfica NVIDIA» o «Procesador».
- Tiempo de la última separación y media del equipo: «28 s de media por canción».
- Versión del descargador de YouTube y fecha de su última comprobación (hoy solo están en «Copiar información para soporte»).
- Botón «Comprobar el motor», que ejecuta el diagnóstico y dice si todo está bien.

Detalles para decidir:

- Las cifras de espacio se calculan al abrir la sección, no al arrancar.
- Nada se borra sin confirmación con la cifra y la consecuencia.
- El registro debe anotar el dispositivo real de cada separación (pendiente del feedback §1.6).

## Valor y coste
- Valor: medio. Poco visible hoy con 17 canciones; necesario cuando la biblioteca crezca con lotes. La parte del motor cierra una duda abierta y ayuda al soporte.
- Coste estimado: S–M. Recorrido de carpetas, tres acciones de limpieza con confirmación y lectura de datos que el proceso principal ya tiene.
- Riesgos o dudas abiertas:
  - Borrar la mezcla es irreversible: debe quedar reflejado en la canción («sin audio original») y la acción «Re-separar pistas» debe explicarlo.
  - Alternativa menos arriesgada: comprimir la mezcla en vez de borrarla. Lo valora el arquitecto.
  - Los tamaños reales de motor y cachés no los pude medir; las cifras de ejemplo son ilustrativas.

## Decisión
(la rellena el usuario o la sesión principal con su respuesta)
