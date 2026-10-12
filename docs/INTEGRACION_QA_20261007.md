# Integración QA del Portal — 7 de octubre de 2026

Rama **estado-recuperado**. Noticias usa la API por defecto. Para una
presentación con datos de ejemplo se puede compilar explícitamente con
`NEXT_PUBLIC_NEWS_DUMMY=true`; en QA mantenerlo en `false`.

## Preparación y arranque

Mantener `api-portal/QA` en la red `vivi-qa-cierre`, alias
`api-portal-vivi-qa`. En el checkout del Portal:

```bash
git switch estado-recuperado
git pull --ff-only origin estado-recuperado
# Completar env.qa.example en .env conservando las demás variables.
corepack pnpm install --frozen-lockfile
corepack pnpm test:integracion
docker compose -p vivi-portal-front -f docker-compose.qa.yml up -d --build
```

El Compose independiente publica **4010**. El puerto 3002 ya corresponde a
otra API en eme02. No combinar este archivo con el Compose de producción.
Abrir `http://IP_DEL_SERVIDOR:4010`. Si se utiliza el dominio
`test-emetra.muniguate.com`, su proxy debe apuntar al frontend del Portal.
Los JSON y PDF del navegador pasan por `/api/*` del mismo origen; la URL del
backend permanece en el servidor.

## Correo VIVI: aceptación y plantilla

El worker genera estas rutas exactas:

- `/vivi/correo/aceptar/TOKEN_ACEPTAR`
- `/vivi/correo/refutar/TOKEN_REFUTAR`

`VIVI_PORTAL_BASE_URL` del worker debe ser la URL que abre este frontend.
Para probar correos existentes en el puerto 4010 se puede sustituir solamente
el dominio/base del enlace, conservando su ruta y token completos. No es
necesario crear otra denuncia ni renovar tokens. No compartir los enlaces.

1. Abrir **Aceptar**. La consulta muestra el caso sin emitir multa. La multa
   solo se solicita tras marcar la confirmación y pulsar «Confirmar aceptación».
   Si la API falla, la pantalla informa el fallo. Un reintento usa la misma
   clave; recargar después de aceptar recupera la remisión existente.
2. El caso **505** de E0710C ya está aceptado: debe recuperar la remisión
   **V-30, ciudad 1**, conservando la única multa ya comprobada en Oracle.
   El botón de pago aparece únicamente cuando la API devuelve DISPONIBLE y
   una URL HTTPS. Si devuelve PREPARANDO, se puede consultar de nuevo.
3. Abrir **Refutar** del caso **506**. Pulsar «Descargar plantilla PDF»,
   abrirla y comprobar **QA-E0710C-PDF_P**. Descargar no registra una defensa,
   no genera multa ni consume el token. La defensa se presenta en el juzgado.
4. Ejecutar el SQL de comprobación E0710C que ya existe: 505 mantiene una
   aceptación y una multa; 506 conserva cero aceptaciones/defensas/multas y
   sus acciones sin consumo ni revocación.

Las rutas antiguas basadas solo en número de caso indican que debe abrirse
el enlace del correo. Ya no muestran multas ni respuestas de defensa simuladas.
Las páginas del correo tienen cabeceras privadas, sin cache ni referrer, y
no se indexan. El token se reenvía a la API solo en el cuerpo POST.

## Noticias

Publicar una noticia desde el Panel, comprobar el listado en la portada y
abrir `/noticias/SLUG`. Revisar portada, secciones, galería y video. Archivar
la noticia en el Panel debe retirarla del listado público. El Portal consume
GET /public/news y GET /public/news/:slug/:idioma, sin token de editor.

## Alcance comprobado

Build de Next y pruebas de consulta/aceptación/PDF contra APIs controladas.
SMTP, DSN y multa real de E0710C ya fueron confirmados por las salidas del
servidor. Falta verificar las pantallas desplegadas con esos mismos enlaces.
