# Documentación de Shinobi Karaoke

Decisiones, diseño, tareas y pruebas de concepto de [Shinobi Karaoke](https://github.com/Gomonsoft/shinobi-karaoke). El código de la app vive en ese repositorio; este se monta dentro de él como submódulo en `docs/`.

```sh
git clone --recurse-submodules https://github.com/Gomonsoft/shinobi-karaoke.git
# o, en un clon ya hecho:
git submodule update --init
```

Por eso los documentos citan las rutas tal como se ven desde la app: `docs/adr/…` es `adr/…` de este repositorio, y `app/…`, `worker/…` o `lanzamientos/…` son carpetas del repositorio de la app. Los enlaces relativos hacia la app (`../../app/…`) solo funcionan con el submódulo montado.

## Mapa

| Carpeta o documento | Contenido | Responsable |
|---|---|---|
| **Producto** | | |
| [00-vision-y-alcance.md](00-vision-y-alcance.md) | Qué es la app y qué entra en cada versión | Usuario |
| [roadmap.md](roadmap.md) | Estado de las versiones | — |
| [versiones/](versiones/) | Por versión: plan, backlog, informes de fase y feedback | Arquitecto |
| [propuestas/](propuestas/) | Ideas fuera del alcance, una por archivo, y propuestas de diseño | Todos |
| [pendientes-usuario/](pendientes-usuario/) | Gestiones que solo puede hacer el usuario (firma de código, cuentas) | Usuario |
| **Técnica** | | |
| [arquitectura.md](arquitectura.md) | Visión técnica global | Arquitecto |
| [01-pipeline.md](01-pipeline.md) | Pasos del pipeline | Arquitecto |
| [adr/](adr/) | Decisiones de arquitectura (ADR) | Arquitecto |
| [spikes/](spikes/) | Pruebas de concepto desechables, con su código | Arquitecto |
| **Diseño** | | |
| [ux/](ux/) | Mapa de vistas, una spec por vista y sistema visual | Diseñador UX |
| [ux/revisiones/](ux/revisiones/) | Capturas de revisión de cada fase | Diseñador UX / QA |
| **Trabajo** | | |
| [02-flujo-de-agentes.md](02-flujo-de-agentes.md) | Cómo colaboran los agentes y formatos de tareas y preguntas | — |
| [tareas/](tareas/) | Tareas de implementación, numeradas | Arquitecto (crea) / Programador (ejecuta) |
| [preguntas/](preguntas/) | Dudas entre agentes y para el usuario, numeradas | Todos |
| [workflow.md](workflow.md) | Ramas, PR, los dos repositorios y publicación | — |
| **Calidad** | | |
| [pruebas.md](pruebas.md) | Qué pruebas se pasan y cuándo | QA |
| [Test-manuales/](Test-manuales/) | Guías de verificación manual y sus ejecuciones | QA |

## Qué no está aquí

Lo que la app necesita para construirse y publicarse se queda en su repositorio, en `lanzamientos/`: las notas de cada versión (`lanzamientos/notas/<X.Y.Z>/<versión>.md`), los botones de descarga y la plantilla del README. Así el CI de la app no depende de este repositorio.

## Ramas

- `main`: la documentación vigente. El submódulo de `develop` y de `main` de la app apunta a un commit de esta rama.
- `version-X.Y.Z`: definición de una versión que todavía no se ha empezado a implementar.

Cada cambio de documentación se confirma aquí y, después, se actualiza el puntero del submódulo en el repositorio de la app ([workflow.md](workflow.md#dos-repositorios)).

## Licencia

GPL-3.0, la misma que la app ([LICENSE](LICENSE)).
