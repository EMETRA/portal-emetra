# Pantalla de error de consulta VIVI — 9 de octubre de 2026

Cuando la consulta inicial del enlace devuelve un error 5xx o falla la conexión, el Portal muestra una tarjeta centrada con el estilo morado del trámite, el título «No pudimos consultar la denuncia» y un mensaje para intentar de nuevo. Sustituye el texto técnico «Error Interno de Servidor» y el botón nativo por las acciones «Reintentar consulta» e «Ir al inicio».

Si api-portal proporciona una referencia UUID válida en el cuerpo o en `X-Request-Id`, se muestra como «Referencia de atención». Se descartan otros valores. El estado 429 muestra un mensaje que pide esperar antes de repetir la consulta. Los estados del enlace vencido, revocado o ya aceptado mantienen sus pantallas propias.

«Reintentar consulta» vuelve a leer el estado del mismo caso. No envía una aceptación ni crea una remisión. La protección de reapertura de casos aceptados y los reintentos de aceptación con el mismo `requestId` continúan vigentes.

## Capturas verificadas

Las capturas corresponden a una respuesta controlada 500 con una referencia ficticia, sin datos ni tokens de los correos reales:

- [Escritorio](capturas-tramite-20261009/portal-error-consulta.png).
- [Móvil](capturas-tramite-20261009/portal-error-consulta-movil.png).

## Despliegue

Primero recuperar el error anterior de api-portal antes de recrear su contenedor, siguiendo `docs/DIAGNOSTICO_CONSULTA_VIVI_20261009.md` de ese repositorio. El mensaje anterior estaba registrado en archivos diarios y no necesariamente aparecía en la consola Docker. La recuperación al recargar no identifica la causa concreta.

Después actualizar api-portal para obtener la referencia de errores futuros. En la carpeta real de **portal-emetra en consultan**:

```bash
git switch estado-recuperado
git pull --ff-only origin estado-recuperado
pnpm install --frozen-lockfile
docker compose up -d --build --no-deps portal
```

Conservar los argumentos de proyecto y archivos `-f` del despliegue existente. La instalación previa es necesaria porque el Dockerfile copia las dependencias del host.

## Validación local

- Nueve pruebas de contrato del cliente VIVI, incluidas referencia en cuerpo, referencia en cabecera y rechazo de una referencia arbitraria.
- Compilación Next correcta.
- Prueba de navegador con fallo de consulta 500 y recuperación al pulsar el reintento, comprobando que no aumenta el número de peticiones de aceptación. Conserva la cobertura de pestañas simultáneas, reapertura, enlace vencido, defensa y descarga del PDF.
- Pantalla revisada visualmente en escritorio y móvil; sin desbordamiento horizontal.

Las pruebas usan un backend controlado. La causa del fallo transitorio real y el despliegue en los servidores requieren el diagnóstico indicado arriba.
