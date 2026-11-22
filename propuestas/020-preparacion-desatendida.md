# 020 — Preparación desatendida: la canción llega sola a «Lista para revisar»

- Estado: Idea
- Origen: exploración 0.2.2 del diseñador UX ([mejoras de experiencia](../versiones/0.2.2/exploracion/mejoras-de-experiencia.md) §2.2 y §3.4); uso real
- Fecha: 2026-11-21
- Relacionadas: specs [04](../ux/04-progreso-pipeline.md), [05](../ux/05-letra.md) y [02](../ux/02-biblioteca.md); [ADR 0005](../adr/0005-letras-y-formato-de-sincronia.md); propuestas 019, 021, 022 y 023

## Problema
El pipeline automático termina en la separación. A partir de ahí todo espera a que alguien entre en la canción.

- El 10 de noviembre se añadieron 9 canciones de un álbum. Once días después, 5 siguen como borrador: pistas separadas, sin letra, y con el paso «Letra» sin tocar. La búsqueda en LRCLIB solo se lanza al entrar en la vista Letra, y nadie entró.
- Separar tarda 28 s de media en el equipo del usuario. El consejo «Busca la letra mientras tanto» llega tarde: la canción ya está separada y el usuario ya se fue a añadir la siguiente.
- Las 12 canciones terminadas usan letra de LRCLIB, y 13 de 17 siguen el tema de su álbum. Lo que una persona decide en esos pasos casi siempre es lo mismo.

## Propuesta
Tras confirmar la fuente, la app sigue sola: busca la letra, elige el mejor candidato, lo comprueba contra la voz, ajusta los fines y deja la canción en «Lista para revisar». La persona entra una vez, al final, a revisar y marcar como lista.

Detalles para decidir:

- **Pasos que se encadenan.** Descarga, separación, búsqueda de letra, elección del candidato (022), fines de línea (alineación de la 019 si existe; si no, «Ajustar los silencios»), tema (ya se hereda del álbum, del artista o del predeterminado).
- **Cuándo se elige sola la letra.** Solo con confianza alta: coincidencia exacta de LRCLIB con duración a 2 s o menos, letra sincronizada y, cuando la voz esté separada, buena puntuación de la 022. Si no, la canción se queda en «Elige la letra» con los candidatos ya cargados y ordenados.
- **Estados de la tarjeta.** «Lista para revisar» ya existe como línea de paso de un borrador. Se añaden «Elige la letra» (hay candidatos pero ninguno claro) y «No encontramos la letra». La tarjeta «Lista para revisar» ofrece «Revisar» (abre la revisión guiada, 023) y «Probar» (reproductor en modo prueba).
- **Nunca se marca «Lista» sola.** La app prepara; el usuario confirma. Se puede valorar un ajuste opcional «Dejar como Letra lista automáticamente» si el usuario lo pide.
- **Bandeja de pendientes.** Sobre la rejilla de la Biblioteca, una línea con recuentos: «3 listas para revisar · 2 esperan letra», que filtra al pulsarla.
- **Reanudar al reabrir.** Los trabajos en cola al cerrar la app se reanudan solos al abrirla, con un aviso que permite detenerlos. Hoy quedan «Interrumpido» y se reintentan uno a uno.
- **Privacidad.** Hoy título y artista solo se envían a LRCLIB cuando el usuario entra en Letra o pulsa «Buscar» (ADR 0005). Aquí se enviarían al añadir la canción. Hace falta revisar esa regla y un interruptor en Ajustes: «Buscar la letra automáticamente».
- **Canciones existentes.** Acción «Preparar» para los borradores que ya hay (los 5 actuales), sola o por lotes (028).

## Valor y coste
- Valor: muy alto. Quita la parada que hoy deja canciones a medias y es la base para que los lotes (021) sirvan de algo.
- Coste estimado: M–L. Encadenado de trabajos en el proceso principal, estados nuevos de la tarjeta, bandeja, reanudación de la cola y ajuste de privacidad. Reutiliza la búsqueda, la cola y «Ajustar los silencios».
- Riesgos o dudas abiertas:
  - Elegir mal la letra en silencio. Mitigación: umbral estricto, la 022 como segunda comprobación y el origen siempre visible en la tarjeta.
  - Peticiones a LRCLIB en ráfaga con lotes: en serie y con pausa de 200 a 500 ms, como pide su documentación.
  - Decisión de producto: ¿la tarjeta «Lista para revisar» se puede reproducir desde la Biblioteca o solo probar?

## Decisión
(la rellena el usuario o la sesión principal con su respuesta)
