# 0310 — Feature 5 · «Lista para revisar», bandeja de pendientes y «Probar» en la Biblioteca
- Estado: Hecha
- Paso del pipeline: 3
- Depende de: 0306, 0308
- ADRs: 0025
- Spec UX: docs/ux/02-biblioteca.md (0.2.2 · Feature 5)
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Insignia, línea de paso, bandeja, «Preparar» de una canción, «Probar» y avisos de reanudación.

## Criterios de aceptación
- [x] Criterios de la spec 02 · Feature 5.
- [x] «Probar» abre el reproductor local con la canción guardada (ADR 0025 §1).

## Pruebas de feedback
- Unitarias: Componentes con la semilla ampliada.
- E2E: Ampliar `biblioteca.spec.ts` con la semilla nueva.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
**Hecho**
- **Tarjeta «Lista para revisar»** (`vistas/biblioteca/tarjeta.ts`, `TarjetaCancion.tsx`, `InsigniaEstado`): insignia `list-checks` en `info` (`esListaParaRevisar`: usa `estadoPreparacion` de main y, sin él, lo deduce de los pasos), línea de origen (`bib.prep.origen.auto|autoCorregida`, solo con `eleccionAutomatica` y sin revisar), botones **Revisar** y **▶ Probar**, menú ⋯ (Revisar, Probar, Editar datos…), sin «A la cola» ni «Exportar». Portada, Intro y Espacio abren el editor. Con sesión: candado y `edi.bloqueo` en Revisar, Elegir la letra y Añadir la letra; «Probar» `aria-disabled` con `bib.prep.probar.sesion`.
- **Líneas de paso nuevas**: ⟳ Buscando / Comprobando / Ajustando los fines (barra indeterminada), «Elige la letra · n candidatas», «No encontramos la letra», «Instrumental, según LRCLIB» (icono `circle-alert` en `aviso`, texto `texto-1`) y «Letra pendiente: sin conexión» (`wifi-off`), cada una con su botón (Elegir la letra, Añadir la letra, Reintentar). [Reintentar] llama a `preparacion.preparar([id])` sin salir de la Biblioteca.
- **«Preparar»** en el ⋯ de un borrador al que le falta algo (sin letra, fuente o pistas), con `bib.prep.menu.ayuda` si va a buscar letra (`ItemMenu.descripcion`, nuevo en `MenuContextual`); toast `bib.prep.toast.preparando`; si main lo omite, toast informativo.
- **Bandeja de pendientes** (`BandejaPendientes.tsx`, `filtrado.ts`: `casillaDe`, `contarBandeja`): usa `recuentosBandeja`; una casilla activa a la vez, filtra a «Borradores», se quita al pulsarla de nuevo o al elegir un filtro, se desactiva sola en 0 y dura la sesión. Se puede pedir desde fuera con `Vista.biblioteca.casilla`.
- **Aviso de reanudación** (`avisoReanudacion.ts`, suscrito en `main.tsx` porque `preparacion:reanudada` sale al cargar la ventana): `bib.prep.retomando` con [Detener] (`preparacion.pausar`) y `bib.prep.enPausa` con [Reanudar]; se cierra solo al vaciarse la tanda.
- **«Probar»** (`navegacion/reproductor.tsx`, `ReproductorBiblioteca.tsx`, `useProbar.ts`): `abrir(id, { prueba, alCerrar })` admite un borrador con pistas (ADR 0025 §1), no cambia su estado; al salir, el foco vuelve a la tarjeta y sale `bib.prep.toast.probada` (10 s; `Toast.duracionMs`, nuevo) con [Marcar como lista] (`marcarLista` + toast + resalte) y [Revisar].
- **Diálogo «Resultado de la preparación»** (`DialogoResultadoPreparacion.tsx`, `trabajos/useTandaPreparacion.ts`), que necesita la 0311 para abrirse desde el aviso de la tanda: resumen, filas con icono y texto y acción por fila (Revisar, Elegir la letra, Añadir la letra, Copiar detalles), [Reintentar las fallidas], [Ver en la biblioteca]. Lo abre `Vista.biblioteca.abrirResultado`. El toast `act.cola.fin` y la cabecera del panel de actividad son de la 0316.
- **Pruebas**: `Biblioteca.preparacion.test.tsx` (16 casos: tarjeta, líneas, Preparar, bandeja, reanudación, resultado), `tarjeta.test.tsx` y `Biblioteca.acciones/cola` ajustados. E2E **escrita, sin ejecutar**: `e2e/biblioteca.spec.ts` («la preparación se ve…»), que parchea dos borradores de la semilla (5: «Elige la letra»; 6: «Lista para revisar») para no tocar `main/biblioteca/semilla.ts`.

**Para 0336 (revisión guiada desde la Biblioteca)**: `AccionesTarjeta.revisar(id)` hoy solo navega al editor (`Biblioteca.tsx`, `acciones`); ahí hay que pedir la revisión guiada. `useProbar.marcarLista` y el menú ⋯ no muestran todavía `bib.revision.dialogo` ni los ítems «Marcar como lista / letra lista»; `bib.revision.linea` (⚑) tampoco está: el recuento está en `resumen.preparacion.dudosas`. El diálogo de resultado ya muestra «n líneas por revisar» por fila.

**Deuda / límites**
- «Letra pendiente» siempre dice «sin conexión»: el resumen no lleva el motivo (`SERVICIO_NO_DISPONIBLE`).
- «Preparar» decide en local si aplica (falta letra, fuente o pistas); `preparacion.previsualizar` no se usa por tarjeta.
- Manual: ver el cambio en vivo de una tarjeta con la Biblioteca abierta durante una preparación real; probar una canción en una TV; reanudación tras cerrar con trabajos en cola.
