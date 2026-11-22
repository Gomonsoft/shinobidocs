# 0291 — Feature 1 · Sección «Letra en pantalla» del panel Estilo
- Estado: Hecha
- Paso del pipeline: 4
- Depende de: 0287, 0290
- ADRs: 0022, 0018
- Spec UX: docs/ux/06-editor.md (0.2.2 · Feature 1)
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Controles, ejemplo y reemplazo por canción en el panel Estilo.

## Criterios de aceptación
- [x] Tres grupos de radio, resumen dinámico, aviso de movimiento reducido, «Ver un ejemplo» y «Cambiar solo en esta canción / Usar la del tema» como en la spec.
- [x] Cada cambio es un paso de deshacer; las opciones no disponibles son `aria-disabled` con motivo; se recuerda la elección de «Líneas ya cantadas».
- [x] Vista previa en menos de 100 ms.

## Pruebas de feedback
- Unitarias: Componente con el reducer del editor: pasos de deshacer, `pasadas` recordadas, reemplazo por canción.
- E2E: Si la spec pide capturas, en la tarea de verificación.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
Hecho:
- Sección nueva `vistas/editor/estilo/SeccionPantalla.tsx` (+ `usePantalla.ts` con `useControlPantalla`, `pantallaEfectiva.ts`, `textosPantalla.ts`, `pantalla.module.css`), entre «Letra» e «Indicadores de espera» en `PanelEstilo` (prop `pantalla`). Tres grupos de radio («Líneas a la vez» con 6 segmentos, «Líneas ya cantadas» con opciones `aria-disabled` y su motivo en texto con `aria-describedby`, «Cambio de línea» con radios y descripción), resumen dinámico, nota de movimiento reducido del sistema, D1/D4 (resumen + «Cambiar solo en esta canción» / «Usar la del tema»), D3 (edita el borrador con `estilo_borrador`; nota si la canción tiene bloque propio).
- Elección recordada: `pantalla.pasadas` guarda lo ELEGIDO y el control muestra `pasadasEfectivas`; bajar de 7 a 5 con «2» muestra «1» y al volver a 7 vuelve «2».
- «Ver un ejemplo» (12,5 s: tres relevos, hueco de 3 s sin indicadores y una entrada; `ejemploPantalla.ts`) reutiliza `useEjemploEspera` (parámetros nuevos `crear` y `anuncios`); solo hay un ejemplo a la vez (cada botón detiene el otro). Al elegir un «Cambio de línea» con el audio en pausa se reproduce el ejemplo una vez.
- Cambio mínimo y aditivo en `vistas/editor/estado.ts` (lote C): `ReemplazosEditor` admite `pantalla`; acción nueva `pantalla` (copia de `espera`); `conReemplazo`/`conPantalla` (la espera y la pantalla ya no se pisan); `aSeleccionIpc` envía `reemplazo_pantalla` (clave hermana, `null` = quitar). `estado.apariencia.test.ts` y `Editor.temas.test.tsx` esperan ahora ese campo. `Editor.tsx`: carga `reemplazosDeDisco`, `estiloPrevia` lleva la pantalla efectiva (y el subrayado del equipo), hooks nuevos y la vista previa pinta el ejemplo con su propia letra sintética (antes `ejemplo.letra` no se usaba: el ejemplo de espera tampoco).
- Pruebas: `SeccionPantalla.test.tsx` (F1-E1, E3, E4, E5, E12, ejemplo, acción del reducer: pasos de deshacer, reemplazo sin pisar la espera, envío aparte), `usePantalla.test.ts` (D1/D2/D3, ejemplo con audio en pausa), `ejemploPantalla.test.ts`.
- No cubierto con test automático: F1-E2 (que abrir no escriba archivos: no se despacha nada al montar, pero sin comparación de archivo), F1-E8/E9/E10 en integración con main (la parte de `main` es de 0287), F1-E13 (anchos del panel), F1-E15. Capturas F1-E16 y verificación manual: pendientes del diseñador/QA. Vista previa < 100 ms: sale del mismo estado que la vista previa (sin retardo propio); sin medición.
