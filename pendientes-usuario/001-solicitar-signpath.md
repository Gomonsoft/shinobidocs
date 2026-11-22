# 001 · Solicitar firma de código gratuita a SignPath Foundation

- **Estado:** Pendiente
- **Creada:** 2026-11-21
- **Tiempo estimado:** unos días de preparación (página web y release pública) más la espera de la respuesta, que SignPath no publica.
- **Requisitos leídos en:** <https://signpath.org/terms> el 2026-11-21. Reléelos antes de enviar la solicitud: pueden cambiar.

## Para qué

El instalador de Windows de Shinobi Karaoke sale **sin firmar**. Por eso:

- Chrome marca la descarga como peligrosa y la bloquea.
- SmartScreen avisa al ejecutarlo.
- El Control inteligente de aplicaciones de Windows 11 lo bloquea sin opción de saltarlo.

La firma de código es lo único que lo resuelve de verdad. SignPath Foundation la ofrece gratis a proyectos de software libre, y es la única opción realista sin coste: los certificados comerciales cuestan cientos de dólares al año.

## Qué hay que saber antes

- **El editor que verá el usuario será «SignPath Foundation»**, no Gomonsoft ni Shinobi Karaoke. El certificado es de ellos.
- **Pueden rechazar la solicitud** sin dar motivo y no hay recurso. También pueden revocar la firma si se incumplen las reglas.
- **La firma no quita los avisos al instante.** La reputación en SmartScreen y Chrome se gana con el tiempo y las descargas.
- **Cada versión necesita una aprobación manual** de la firma (un clic tuyo en SignPath).

## Qué necesito

### 1. Del proyecto

| Requisito | Estado hoy | Qué falta |
|---|---|---|
| Licencia libre aprobada por OSI en todos los componentes, sin doble licencia comercial | GPL-3.0-or-later | Revisar `THIRD_PARTY_NOTICES.md` por si algo incluido en el instalador no es libre |
| Sin componentes propietarios | Por confirmar | Comprobar qué va dentro del instalador (el modelo de separación y el descargador se bajan después, no van dentro) |
| Proyecto mantenido | Sí | — |
| **Ya publicado en la forma que se va a firmar** | Por confirmar | Tener al menos una Release pública en GitHub con el instalador de Windows |
| Repositorio público y del mismo equipo que firma | Por confirmar | El repo `Gomonsoft/shinobi-karaoke` debe ser público |
| Instalador con desinstalación | Sí (NSIS) | — |
| Compilación automática y verificable desde el código | Sí (GitHub Actions) | — |

### 2. Página web (lo que tarda unos días)

SignPath pide una «home page» y una página de descargas. **No aclara si basta el README del repositorio**; una página propia sencilla evita la duda (puede ser GitHub Pages o una sección en la web de Gomonsoft). Debe tener:

1. **Qué es y qué hace Shinobi Karaoke**, junto al enlace de descarga.
2. **Una sección titulada exactamente «Code signing policy»**, visible desde la página principal y desde la de descargas, con:
   - El texto literal, con sus dos enlaces:
     > Free code signing provided by [SignPath.io](https://about.signpath.io), certificate by [SignPath Foundation](https://signpath.org)
   - Los roles y quién los ocupa, con enlace a su perfil o equipo de GitHub:
     - **Committers and reviewers:** quién puede cambiar el código y quién revisa los cambios de terceros.
     - **Approvers:** quién aprueba cada firma.
3. **Política de privacidad.** Qué conexiones hace la app y cuándo: buscar letras, descargar de YouTube, bajar el motor y el modelo. Todas ocurren porque el usuario lo pide. Hay que mencionar también los servicios de terceros implicados.

### 3. De seguridad

- Verificación en dos pasos activa en GitHub para todos los miembros con acceso.
- Verificación en dos pasos en la cuenta de SignPath cuando la creen.

## Guía rápida

1. **Confirmar los puntos «Por confirmar»** de la tabla: repo público, Release pública, nada propietario dentro del instalador.
2. **Activar la verificación en dos pasos** en GitHub (cuenta y organización Gomonsoft).
3. **Publicar la página web** con descripción, descarga, «Code signing policy» y privacidad.
4. **Enlazar la política** desde el README y desde las notas de cada Release.
5. **Enviar la solicitud** en <https://signpath.org/apply>. El formulario solo se ve en el navegador; ten a mano la URL del repo, de la web, de la página de descargas y de la política.
6. **Esperar la respuesta.** Si piden cambios, suelen ser sobre la página de política.
7. **Si aceptan:** crear la cuenta, conectar el repositorio y pasar el resto al proyecto (tarea para el arquitecto):
   - Añadir el paso de firma al workflow de empaquetado.
   - Fijar el nombre de producto y la versión en los metadatos del instalador, iguales en cada compilación.
   - Revisar la decisión de «publicar sin firma» en los ADR 0012 y 0020.
8. **Si rechazan:** quedan las alternativas sin coste, que no eliminan el aviso: distribuir solo desde GitHub Releases, documentar el aviso de Chrome en `INSTALAR.md` y publicar en winget.

## Dudas abiertas

- ¿Basta el README del repositorio como «home page» o exigen web propia? No lo dicen.
- Plazo de respuesta: no lo publican.
- Qué datos pide exactamente el formulario: no se pudo leer sin navegador.

## Hecho cuando

- La solicitud está enviada y hay respuesta de SignPath (aceptada o rechazada) anotada aquí.
