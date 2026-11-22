# Traspaso · Empezar la implementación de 0.2.2 en otro equipo

Escrito el 2026-11-22 al cerrar la sesión en la que se publicó 0.2.1, se separó la documentación y se definieron 0.2.2 y 0.2.3. Sirve para que una sesión nueva (otro equipo, sin el historial de la conversación) continúe sin perder contexto.

## Estado al cerrar

| Qué | Estado |
|---|---|
| 0.2.1 | Publicada (`v0.2.1`, «Latest»). `main` y `develop` de la app contienen 0.2.1 y la separación de la documentación. |
| Documentación | Repositorio propio, `Gomonsoft/shinobidocs`, montado como submódulo en `docs/`. `main` = lo vigente; `version-0.2.2` = definición de 0.2.2 y 0.2.3. |
| 0.2.2 | **Definida, sin empezar**: once features, tareas 0284–0339, ADR 0022–0028 ([plan](plan-4.md), [backlog](backlog.md)). |
| 0.2.3 | Aprobada, por definir: varios cantantes y coros ([plan](../0.2.3/plan-5.md)). 0.2.2 solo la prepara. |
| Rama de trabajo | `version-0.2.2` en la app (sale de `develop`), con `docs/` apuntando a `version-0.2.2` de shinobidocs. Un único PR por versión hacia `develop`. |

## Preparar el equipo

```sh
git clone --recurse-submodules https://github.com/Gomonsoft/shinobi-karaoke.git
cd shinobi-karaoke
git switch version-0.2.2
git submodule update --init
cd docs && git switch version-0.2.2 && cd ..
```

Requisitos: Node 24 (`app/.nvmrc`), `uv` 0.13.7 (versión fijada en `.github/workflows/ci.yml`) y `gh` con sesión iniciada. Después: `npm ci` en `app/`, `uv sync --locked` en `worker/`. Comandos y variables de pruebas: `app/README.md` y `docs/pruebas.md`.

## Cómo se trabaja

- **Una feature = una fase**, en el orden del [backlog](backlog.md). Cuatro entregas recomendadas: alpha.1 (features 3, 1, 2, 4 y el resultado de la prueba técnica de la 10), alpha.2 (6, 5, 11), alpha.3 (7, 8, 9) y alpha.4 (10, solo si la prueba técnica sale bien).
- **Decisiones abiertas:** se aplica la opción recomendada por el agente, se anota como provisional en una pregunta `Para: usuario` y se sigue. Esto no cubre acciones hacia fuera o difíciles de deshacer (etiquetar, publicar una Release, fusionar un PR, borrar datos): esas necesitan la orden expresa del usuario.
- **Documentación:** dos commits, primero dentro de `docs/` (rama `version-0.2.2` de shinobidocs) y luego el puntero en la app ([workflow](../../workflow.md)).
- **Datos del usuario:** la biblioteca real de canciones no está en el repositorio ni se copia a él. Nunca se escribe en la carpeta de datos real; las pruebas usan copias temporales o la semilla.

## Antes de la primera tarea

1. **Correcciones de specs pendientes** que listó el arquitecto y aún no están aplicadas (las hace el diseñador):
   - Desfase mínimo de «comprobar la letra con la voz»: 0,15 s → 0,5 s en `ux/05-letra.md`.
   - `edi.comprobar.falta.lineas`: 3 → 5 líneas.
   - Feature 10: valor de «origen del fin» y progreso de una sola línea.
   - Preparación desatendida: usa «Ajustar los silencios» en modo prudente.
   - Feature 3: redacción de privacidad. Feature 9: ZIP truncado.
   - Feature 11: el wireframe de la tarjeta frente a la insignia de la feature 5.
   - Orden de la pestaña «Funciones» y la nota de «Probar» en `ux/07-reproductor.md`.
   - Varios cantantes: un cantante recién añadido tiene su carril visible aunque no tenga líneas (indicación del usuario, pregunta 0160).
2. **Preparación para 0.2.3**: los seis ajustes sin efecto visible ya están como criterios en las tareas 0287, 0289, 0290, 0293, 0294 y 0296.
3. **Defecto conocido de 0.2.1** (hallado leyendo el código, sin reproducir en la app): corregir el texto en la vista Letra quita las palabras hechas a mano de las líneas que no cambian (`app/src/shared/letras/editar.ts`). Se arregla en la tarea 0296.

## Preguntas abiertas para el usuario

Todas con la opción recomendada aplicada: 0154, 0155, 0158 y 0159 (0.2.2); 0160 y 0165 (varios cantantes y coros); 0147, 0148 y 0152 (0.2.1).

## Cabos sueltos de 0.2.1

- Tareas 0281 y 0282 sin cerrar y estados del backlog de 0.2.1 sin actualizar.
- Sin probar a oído: el editor preciso con canciones reales (voz a 0,5× y 0,75×).
- No hay prueba E2E del menú contextual de la fila.

## Lo que depende del equipo anterior

- **La biblioteca de canciones de muestra** (las canciones corregidas a mano) vive solo en el equipo con Windows. La feature 4 (comprobar la letra con la voz) y la prueba técnica de la feature 10 se calibraron y se validan con ellas: para repetir esas medidas hace falta copiar la carpeta de datos al equipo nuevo, fuera del repositorio.
- **Windows con GPU**: la exportación a 2560 × 1440 o más y el instalador NSIS solo se han probado ahí. En macOS, la exportación de video y el icono nuevo siguen sin probar a mano.

## Pendientes del usuario

- README con los botones de descarga (plantilla en `lanzamientos/plantillas/estado-e-medio.md` del repositorio de la app).
- Canal de compilaciones de desarrollo (repositorio, token y secreto).
- Proteger las etiquetas `v*` y hacer inmutables las Releases.
- Firma de código: [pendientes-usuario/001](../../pendientes-usuario/001-solicitar-signpath.md).
- Prueba del reproductor en una segunda pantalla real.
