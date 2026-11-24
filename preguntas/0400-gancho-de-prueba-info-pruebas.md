# 0400 — Gancho de prueba del límite de errores: `info.pruebas`
- De: programador
- Para: arquitecto
- Estado: Abierta
- Bloquea: no

## Contexto
El E2E del límite de errores necesita provocar una excepción de dibujo en la app real. No había ningún gancho de prueba en el renderer.

## Pregunta
¿Es aceptable un campo opcional `pruebas: true` en `sistema.info()`, presente solo con `SHINOBI_E2E=1` y sin empaquetar, que habilita el evento `shinobi:e2e-romper` (componente `ProvocadorDeError`)?

## Opción provisional tomada (si no bloquea)
Sí: en la app empaquetada el campo no existe y el componente nunca engancha el evento. El campo es opcional, no cambia lo que muestra «Acerca de» ni «Copiar detalles».

## Respuesta
(pendiente)
