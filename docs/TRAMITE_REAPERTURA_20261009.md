# Reapertura y pantallas del trámite VIVI — 9 de octubre de 2026

## Resultado confirmado en la base

Las consultas compartidas desde la base real identifican dos aceptaciones de casos distintos:

| Caso | Código | Remisión | Aceptación | Estado |
| --- | --- | --- | --- | --- |
| 601 | QA-E0910A-ACE_P | 1-V-31 | 201 | REMISION_EMITIDA |
| 602 | QA-E0910A-PDF_P | 1-V-32 | 202 | REMISION_EMITIDA |

El caso 601 conserva una sola aceptación. La segunda remisión pertenece a 602, cuya plantilla se había descargado antes. Descargar una plantilla no registra una defensa ni consume la acción de aceptación; por eso ese segundo caso pudo aceptarse después. Ambos enlaces de aceptación deben mostrar «Esta denuncia ya fue aceptada» al reabrirse. Este cambio no modifica las denuncias ni las multas existentes.

## Comportamiento del Portal

- Consulta el estado antes de abrir la confirmación y vuelve a consultarlo antes de enviar la aceptación. Una pestaña que quedó abierta antes de aceptar recupera la remisión existente.
- La aceptación confirmada deshabilita nuevas solicitudes. Los reintentos por un fallo temporal conservan el mismo `requestId`.
- Al recargar o restaurar la página, muestra la remisión existente. «Consultar disponibilidad de pago» solo consulta el estado; no acepta de nuevo.
- Un enlace vencido o revocado muestra una tarjeta propia sin aceptación ni descarga. Una defensa registrada o un trámite en juzgado muestra su estado correspondiente, sin aceptación.
- Los tokens permanecen en el fragmento del enlace del correo y se envían al backend en el cuerpo de la petición. La ruta debe coincidir con el código del caso devuelto por la API.

## Diseño

Se tomaron como referencia los diez PDF de «Portal Emetra VIVI Defensa.zip»: botones morados, tarjetas blancas, títulos y campos, confirmación, resultado, estados del enlace y descarga del PDF. Se corrigieron estilos que no se aplicaban por nombres de clase distintos, listas y el tamaño del lugar. El monto aparece pendiente porque la API no lo proporciona; el enlace de pago solo se ofrece cuando la API lo confirma.

El ZIP no contiene un PDF de «Enlace vencido»; esa tarjeta usa los mismos estilos que «Ya aceptado». La descarga mantiene el texto de plantilla presencial: no muestra «Defensa registrada» si solo se descargó el PDF. La cabecera corrige «SERVICIOS5» y marca Remisiones durante el trámite.

Las capturas en [capturas-tramite-20261009](capturas-tramite-20261009) corresponden a casos y respuestas controlados del navegador. No contienen enlaces privados ni representan una consulta a Oracle.

## Despliegue, API primero

La versión de api-portal indicada en eme02 (`ce87d26e6546c7aaee7c68353e15afbfd236be92`) no devuelve `codigoCaso` ni la vista pública del caso en una respuesta `USADO`. El Portal requiere estos datos para comprobar el enlace y recuperar la pantalla de aceptación existente. La rama QA ya incluye ese contrato y ahora cubre además una lectura de acción anterior al COMMIT con una lectura del caso posterior al COMMIT.

En la carpeta real de **api-portal en eme02**:

```bash
git switch QA
git pull --ff-only origin QA
pnpm install --frozen-lockfile
docker compose build api
docker compose up -d --no-deps api
git rev-parse HEAD
```

Después, en la carpeta real de **portal-emetra en consultan**:

```bash
git switch estado-recuperado
git pull --ff-only origin estado-recuperado
pnpm install --frozen-lockfile
docker compose build portal
docker compose up -d --no-deps portal
git rev-parse HEAD
```

Si el despliegue existente utiliza archivos adicionales de Compose, conservar los mismos argumentos `-f` en los comandos de build y up. No añadir un nuevo montaje vacío de evidencias. Los Dockerfile copian `node_modules` del host; la instalación previa permite compilar también cuando las dependencias se habían reducido a producción.

## Verificación después del despliegue

1. Abrir de nuevo los enlaces completos de los correos 601 y 602. Deben mostrar «Ya aceptado» con 1-V-31 y 1-V-32 respectivamente, sin botón de aceptación.
2. Consultar la disponibilidad de pago y recargar. Debe conservar el número; en Red puede aparecer la consulta, pero no una petición al endpoint que registra la aceptación.
3. Comprobar desde Oracle, con esta consulta de solo lectura, que cada caso mantiene una aceptación y su remisión:

```sql
SELECT d.ID_DENUNCIA, d.CODIGO_CASO, d.ESTADO,
       d.CIUDAD_REMISION, d.SERIE_REMISION, d.NUMERO_REMISION,
       (SELECT COUNT(*)
          FROM ADMEMETRAVEHICULAR.TB_VIVI_ACEPTACIONES a
         WHERE a.ID_DENUNCIA = d.ID_DENUNCIA) ACEPTACIONES
FROM ADMEMETRAVEHICULAR.TB_VIVI_DENUNCIAS d
WHERE d.ID_DENUNCIA IN (601, 602)
ORDER BY d.ID_DENUNCIA;
```

602 ya fue aceptado; no usarlo para una nueva defensa. Un ensayo nuevo requiere casos nuevos. El acceso desde el panel depende además de `VIVI_JUZGADO_CONSULTAR`, que faltaba en la verificación anterior; este cambio del Portal no asigna permisos.

## Validación local

- api-portal: 29 pruebas de aceptación, emisión y controlador; compilación Nest correcta. Incluye repetición con distintos requestId y recuperación de una aceptación confirmada entre lecturas.
- Portal: 8 pruebas de contrato, compilación Next correcta y prueba Playwright de resumen, confirmación, dos pestañas, doble clic, fallo 503/reintento, reapertura, pago pendiente/disponible, vencimiento y revocación, defensa registrada y descarga PDF con reintento. También comprueba que no se acepta ni descarga con un caso cruzado y que no hay desbordamiento en móvil.
- Las pruebas de navegador usan backend controlado. El despliegue y la reapertura en los servidores reales quedan por verificar con los pasos anteriores.
