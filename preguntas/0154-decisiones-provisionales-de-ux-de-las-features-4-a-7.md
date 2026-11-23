# 0154 — Decisiones provisionales de UX de las features 4 a 7 de 0.2.2

- De: disenador-ux
- Para: usuario
- Estado: Abierta
- Bloquea: no (opciones provisionales aplicadas en las specs [02](../ux/02-biblioteca.md#022--feature-5--lista-para-revisar-y-bandeja-de-pendientes), [03](../ux/03-anadir-cancion.md#022--feature-6--datos-de-la-canción-automáticos), [04](../ux/04-progreso-pipeline.md#022--feature-5--preparación-desatendida), [05](../ux/05-letra.md#022--feature-4--comprobar-la-letra-contra-el-audio-y-corregir-el-desfase), [06](../ux/06-editor.md#022--feature-4--comprobar-la-letra-con-la-voz-y-corregir-el-desfase) y [08](../ux/08-ajustes-y-acerca.md#022--feature-5--letras-y-preparación-automática); resumen en [00 · Features 4 a 7](../ux/00-mapa-de-vistas.md#022--features-4-a-7--flujo-de-entrada))

## Contexto

Siguiendo tu regla («por defecto se aplica la opción recomendada por el agente»), en cada duda de producto de las features 4 a 7 he aplicado la opción que recomiendo y la he marcado en la spec como «decisión provisional». Las reúno aquí para que cambies la que quieras. La **A** es siempre la aplicada. Las dos primeras son las que más pesan: privacidad y aviso legal.

## Pregunta

**Privacidad y legal**

1. **Buscar la letra sin que entres en «Letra»** (feature 5). Para que una canción llegue sola a «Lista para revisar», su título, artista, álbum y duración salen hacia LRCLIB al añadirla.
   - **A (provisional).** Activado por defecto, también al actualizar desde 0.2.1. El formulario de «Añadir canción» lo dice cada vez («Al continuar buscaremos la letra en LRCLIB con estos datos») y en Ajustes hay una casilla para apagarlo.
   - B. Desactivado por defecto; la primera vez que añades una canción se te pregunta si quieres activarlo.
2. **Aviso de YouTube con listas enteras** (feature 7). Descargar una lista aumenta la exposición legal que ya describía el aviso.
   - **A (provisional).** El aviso que ya aceptaste vale; su texto gana un punto sobre listas y álbumes, y la tabla del lote lleva siempre un recordatorio con «Leer el aviso».
   - B. Pedir que lo aceptes de nuevo la primera vez que añadas una lista.

**Comprobar la letra y corregir el desfase (feature 4)**

3. **Letra adelantada o atrasada al elegirla.**
   - **A (provisional).** Se corrige sola al usarla (el candidato ya dice «Va 0,8 s adelantada: la corregiremos») y queda un botón «Quitar la corrección».
   - B. Se guarda sin corregir y se te pregunta.
4. **Letra elegida antes de separar.** Al terminar la separación se comprueba.
   - **A (provisional).** Si va desfasada y no has tocado ningún tiempo, se corrige sola; si ya ajustaste algo, solo se propone. En canciones Lista nunca se corrige sola.
   - B. Siempre se propone, nunca sola.
5. **Tiempos por palabra hechos a mano al mover toda la letra.**
   - **A (provisional).** Se mueven con su línea y se conservan (excepción a la regla de 0.2.1 de descartarlos al cambiar inicio o fin).
   - B. Se descartan, como con cualquier otro cambio.

**Preparación desatendida (feature 5)**

6. **Cuándo se elige sola la letra.**
   - **A (provisional).** Solo si es la coincidencia exacta de LRCLIB (título, artista y duración a 2 s), está sincronizada y coincide con la voz. Si no, «Elige la letra».
   - B. También si no hay coincidencia exacta pero una sola candidata coincide con la voz.
7. **Ajustar los fines sin la sincronía automática (feature 10).**
   - **A (provisional).** Se usa «Ajustar los silencios» en versión prudente: solo en líneas con fin automático, sin tocar fines que traía la letra y sin activar la cuenta 3·2·1. Se quita con un botón en el editor.
   - B. No ajustar fines en la preparación; lo haces tú en el editor.
8. **Tarjeta «Lista para revisar».**
   - **A (provisional).** Insignia propia (distinta de «Borrador» y de «Lista»), cuenta en el filtro «Borradores», y ofrece «Revisar» y «Probar». Se puede probar a pantalla completa, pero no poner en la cola ni exportar hasta marcarla.
   - B. También se puede poner en la cola y cantar en un evento sin marcarla.
9. **Marcar como lista automáticamente.**
   - **A (provisional).** Nunca: la app prepara y tú confirmas. Sin ajuste para cambiarlo.
   - B. Un ajuste «Dejar como Letra lista automáticamente» cuando la comprobación es buena.
10. **Bandeja de pendientes.**
    - **A (provisional).** Una fila bajo la barra de la Biblioteca con casillas que filtran: «listas para revisar», «esperan letra», «con error».
    - B. Un cuarto filtro «Por revisar» junto a Todas, Listas y Borradores, sin bandeja.
11. **Borradores que ya tienes** (los 5 sin letra del 10 de noviembre).
    - **A (provisional).** No se preparan solos al actualizar: usas «Preparar» en su menú o los seleccionas y pulsas «Preparar».
    - B. Se preparan solos la primera vez que abras 0.2.2.
12. **Al reabrir la app con trabajos a medias.**
    - **A (provisional).** Se retoman solos, con un aviso y un botón «Detener».
    - B. Como hoy: quedan «Interrumpido» y los reintentas tú.

**Datos de la canción (feature 6)**

13. **Álbum vacío y letra de LRCLIB con álbum.**
    - **A (provisional).** El álbum se rellena solo (rellenar un campo vacío no es sobrescribir), se indica «Tomado de LRCLIB» y se puede quitar. Título y artista nunca se cambian solos: solo se sugieren.
    - B. Nunca se rellena solo: siempre como sugerencia.
14. **Servicio externo de datos musicales** (MusicBrainz).
    - **A (provisional).** No en 0.2.2: solo el archivo, YouTube, tu biblioteca y LRCLIB.
    - B. Añadirlo cuando falte el álbum (otro acceso a red, con su casilla).

**Importación por lotes (feature 7)**

15. **Límite por lote.**
    - **A (provisional).** 50 canciones; el resto, en otra tanda (los duplicados salen desmarcados, así que repetir la lista marca las siguientes).
    - B. Otro número: dime cuál.
16. **Enlace de un video que está dentro de una lista.**
    - **A (provisional).** Se añade ese video y se ofrece «Añadir la lista entera».
    - B. Se abre la lista directamente.
17. **Sesión en otra pantalla con la cola en marcha.**
    - **A (provisional).** La cola sigue; una nota sugiere pausarla si hay cortes de sonido.
    - B. La cola se pausa sola al abrir el reproductor en otra pantalla y se reanuda al cerrarlo.

Añadidas el 2026-11-22, tras medir con 18 canciones tuyas (contexto en [0280](0280-que-hace-hoy-la-comprobacion-de-la-letra-con-tus-canciones.md)):

18. **Canciones con letra de una versión anterior** (MVP o 0.2.1).
    - **A (provisional).** No se les ofrece «Preparar» sino «Ajustar los fines…», que pide confirmación y solo pone fin a las líneas que no lo tienen, donde la voz se para claramente. Nunca mueve inicios ni la letra entera, y esos fines se pueden quitar. También en canciones ya «Lista».
    - B. No ofrecer nada para esas canciones.
    - C. Hacerlo sin preguntar.
19. **Cómo se dice que la comprobación no puede saberlo.**
    - **A (provisional).** «No podemos comprobarla con tu audio», en gris (no como aviso), con el motivo en palabras llanas (la voz casi no tiene pausas, o la letra no marca dónde acaba cada línea), que no se ha cambiado nada y qué puedes hacer (escucharla y ajustarla a oído, o poner los fines). Con letras de LRCLIB será lo habitual.
    - B. No mostrar nada cuando no se puede comprobar.

## Opción provisional tomada (si no bloquea)

La A en los 19 puntos.

## Respuesta

(pendiente)
