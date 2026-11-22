# 0367 — Feature 4 · Comprobación diferida al terminar la separación y remates de 0299/0300
- Estado: Pendiente
- Paso del pipeline: 3
- Depende de: 0298, 0299, 0300
- ADRs: 0024 (revisiones 0172 y 0210), 0015
- Spec UX: docs/ux/05-letra.md#022--feature-4--comprobar-la-letra-contra-el-audio-y-corregir-el-desfase (F4-L7, F4-L11) y docs/ux/06-editor.md#022--feature-4--comprobar-la-letra-con-la-voz-y-corregir-el-desfase
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md)), entrega alpha.1 (feature 4)

## Objetivo
Cerrar lo que la feature 4 dejó pendiente: corregir sola la letra elegida antes de separar y los remates de la interfaz frente a la spec.

## Criterios de aceptación
- [ ] **Comprobación diferida** (F4-L7) en `main/letras/`, con una función reutilizable `comprobarLetraGuardada(cancionId)` que se llama desde `alPicosListos`. Cuando la letra guardada tiene tiempos, está `intacta` y sin `desfase_corregido_ms`, y la canción no es Lista ni Letra lista, si `evaluarEncaje` da `desfasada` se aplica la corrección (`offset_ms` y `desfase_corregido_ms`, sin tocar tiempos de línea) por el camino de escritura de `guardarTiempos`. Si se cambió algún tiempo, no se toca: C y el editor muestran la propuesta.
- [ ] Main emite un aviso (catálogo de `ServicioAvisos`, sin canal nuevo si el catálogo lo admite) y el renderer muestra el toast `let.comp.toast.corregida` con [Deshacer], que quita la corrección. Sin toast dentro de una tanda de varias canciones (spec 04, feature 7). C muestra `let.comp.actual.corregida`.
- [ ] `let.comp.error.guardar` ofrece [Copiar detalles] (F4-L11, spec 05).
- [ ] Al aplicar «Corregir el desfase» en el editor, el resalte de 2 s de las regiones usa borde `info` (spec 06 · Feature 4, «Aplicar»), no el de «Ajustar los silencios».
- [ ] [Buscar otra letra] del editor abre la vista Letra en «Buscar otra letra», no en C (spec 06 · Feature 4, mismo camino que «Corregir la letra»).
- [ ] **Doble de LRCLIB**: puede devolver un candidato con tiempos que encaja con la voz sintética de `pulsosFlac` (≥ 5 inicios), su variante desplazada 0,8 s (`desfasada`) y otro que no encaja (`no_coincide`).

## Pruebas de feedback
- Unitarias: servicio de letras con picos falsos (corrige solo si `intacta`; nunca en Lista o Letra lista; sin toast en tanda; deshacer), componentes del toast y del error.
- E2E: ampliar `letras.spec.ts` con el doble ampliado: un candidato `desfasada` se guarda corregido y uno `no_coincide` muestra sus motivos; y la diferida (elegir la letra con la separación en curso y ver la corrección al terminar).
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios`.

## Notas de implementación
(las rellena el programador al terminar)
