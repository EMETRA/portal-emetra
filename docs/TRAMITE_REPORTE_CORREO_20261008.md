# Ruta única del reporte del correo

`/tramite-reporte/{CODIGO_CASO}` usa las APIs reales a través del BFF de Next. El worker entrega los tokens de ambas opciones en el fragmento de la URL (`#accion=aceptar&aceptar=...&refutar=...` o `accion=refutar`). El fragmento no se envía en el GET de la página ni por Referrer. No se guardan los tokens en cookies ni localStorage. Las páginas llevan noindex y no-referrer.

El trámite comprueba que el número de caso devuelto por la consulta corresponde a la ruta antes de habilitar aceptación o PDF. Abrir el enlace no impone multas. La confirmación con consentimiento llama a POST /vivi/aceptaciones, conserva requestId en el reintento y muestra la remisión/pago devueltos por la API. Refutar consulta el caso y descarga el PDF real; no registra una defensa web. Una URL de número de caso sin token, incluido el antiguo D-2026-000123 de ejemplo, no muestra datos dummy ni permite actuar.

Se conservan `/vivi/correo/aceptar/{token}` y `/vivi/correo/refutar/{token}` para correos anteriores, incluidos los casos 505/506 ya enviados. No es necesario renovarlos ni reenviarlos.

## Despliegue

Desde el checkout del Portal unificado:

```bash
git switch estado-recuperado
git pull --ff-only origin estado-recuperado
pnpm install --frozen-lockfile
docker compose -f docker-compose.qa.yml up -d --build --no-deps portal
```

Conservar API_BASE_URL con el backend api-portal (en la red QA: http://api-portal-vivi-qa:4001). El dominio público test-emetra.muniguate.com debe seguir enviando al contenedor del Portal. No apuntar el BFF a ese mismo dominio porque causaría un bucle.

La carta nueva se activa después de aplicar este Portal y obtener QA del worker; ver docs/CORREO_VECINO_20261008.md en portal-worker.

## Validación

```bash
node --test test/integracion/*.test.cjs
pnpm run build
node test/integracion/tramite-browser.cjs
```

Las pruebas de navegador levantan Next de producción y un backend controlado en 127.0.0.1:3731/3732, comprueban consulta sin efectos, 503, idempotencia, ambas acciones, PDF y rechazo del caso cruzado. No envían SMTP ni emiten multas en Oracle. En el servidor se verifica luego el flujo real desde el correo de un caso nuevo.
