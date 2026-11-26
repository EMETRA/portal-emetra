# EVIAL dentro de portal-emetra

La rama `feat/integracion-evial` parte de `estado-recuperado`, confirmada como línea desplegada. El API correspondiente se prepara en `EMETRA/api-portal`, rama homónima sobre QA. Es una integración nativa React/Next + Nest, conservando los datos de los repositorios EVIAL originales y la identidad visual institucional: Montserrat, azul/verde, tarjetas blancas, controles y estados de error adaptables a móvil.

## Pantallas

| Ruta | Función |
| --- | --- |
| `/evial` | Portada, catálogo real, recursos y FAQ; accesos a curso y gestión. |
| `/evial/:evento` | Información, requisitos, beneficios, programación, inscripción o acceso con código/DPI/teléfono. |
| `/evial/mi-curso` | Materiales, dos intentos, actividad con cinco participantes, enlaces de evaluación y comprobante QR. |
| `/evial/evaluar#token=...` | Evaluación individual por enlace firmado; el fragmento se retira de la barra tras leerlo. |
| `/evial/gestion` | Acceso institucional, consulta, lectura QR, asistencia por paso, corrección DPI, retirada sin actividad, eventos/materiales. |

El menú y los servicios del inicio enlazan a Educación vial. `/events/:id` mantiene el enlace que abre VIVI. Las rutas antiguas `/exam/:persona/:evento/*`, `/impresion/:persona/:evento` y `/grade/:persona/:evento` llevan al acceso seguro del evento; `/consulta/*`, `/verificacion/*`, `/qr/:evento` llevan a gestión. Un enlace antiguo de alumno con IDs necesita ser sustituido por un enlace firmado; no concede acceso automáticamente.

## Configuración y operación

1. Preparar primero api-portal con su guía `docs/EVIAL_INTEGRACION.md`: objetos/columnas/permisos Oracle, sesión EVIAL, correo institucional, CA si corresponde, volumen de evidencia, geografía y medios estáticos actuales. El código no ejecuta migraciones ni concede permisos.
2. Mantener `API_BASE_URL` del portal apuntando a ese API, incluyendo cualquier prefijo real de publicación. Los handlers EVIAL añaden `/evial` a esa base. Configurar `PORTAL_PUBLIC_ORIGIN` con el origen externo exacto, por ejemplo `https://emetra.muniguate.com`, especialmente detrás de proxies. No usar un origen ficticio del ejemplo.
3. El API publica `EVIAL_TURNSTILE_SITE_KEY`; permitir ese dominio en la configuración del widget institucional. La verificación privada sigue en api-autenticacion; no se introduce un bypass de CAPTCHA.
4. El BFF usa cookies HttpOnly separadas para curso y personal. No comparte BACKEND_TOKEN, APP_AUTH_TOKEN ni IDs de usuario de otras aplicaciones. El acceso del curso dura hasta dos horas; el del personal tiene cookie de quince minutos y requiere entrar de nuevo cuando venza. No se guardan tokens en localStorage.
5. La conexión EVIAL hacia api-portal utiliza TLS normal de Node. Si el servidor necesita una CA institucional, montarla e indicar NODE_EXTRA_CA_CERTS. No deshabilitar la verificación global para habilitar esta integración.
6. Mantener todos los montajes y redes del despliegue actual al recrear el frontend. Esta rama no cambia DNS ni sustituye por sí sola evial.muniguate.com. Antes del corte, preservar imágenes y `/content` del host anterior: no están versionados en los repositorios.

El registro y acceso se bloquean antes de pedir datos si falta el secreto del API. La actividad de participantes y el correo también indican si les falta configuración. Los controles administrativos aparecen según permisos efectivos (`EVIAL_CONSULTAR`, `EVIAL_ASISTENCIA`, `EVIAL_ADMINISTRAR`) y cada petición vuelve a comprobarse en el API.

En las inscripciones de seguimiento tipo S se conservan los datos de la persona ya aprobada: se solicita DPI, teléfono y placa, sin sobrescribir su perfil. El evento 20 conserva su regla exclusiva de zona 12 en configuración del API. Las reglas definitivas se revisan con el responsable del evento antes de publicar otros eventos.

El material «Revisado» es una ayuda local para recorrer el curso, no una prueba de lectura. La nota, cupos, intentos y opciones válidas los decide el servidor. Se conservan los datos del formulario cuando falla una petición. Un 503 al escribir requiere consultar el estado antes de repetir.

## Evidencia y correo

La foto/video se envía por multipart real (PNG/JPEG/MP4, 10 MiB), nunca como cadena URL-encoded. Solo se sirve mediante sesión institucional autorizada. Los enlaces individuales de los cinco participantes se copian y comparten manualmente; no se envía correo automáticamente a esos participantes.

El comprobante es un PDF de inscripción con QR `{evento,persona}`. No certifica aprobación ni descuento. Pedir correo es una acción explícita dirigida únicamente al correo registrado en Oracle, con el remitente que autorice el SMTP. «Aceptado por SMTP» no prueba entrega al buzón.

## Desarrollo y comprobaciones reproducibles

```bash
pnpm install --frozen-lockfile
pnpm run build
pnpm run test:evial
node test/integracion/vivi.test.cjs
```

Pruebas de navegador aisladas, en terminales separadas:

```bash
# Terminal 1: fixture local. No tiene acceso a Oracle/SMTP.
node test/integracion/fixtures/evial-api.cjs
```

```bash
# Terminal 2: servidor local del portal ya compilado.
API_BASE_URL=http://127.0.0.1:4021 \
PORTAL_PUBLIC_ORIGIN=http://127.0.0.1:4020 \
pnpm exec next start -H 127.0.0.1 -p 4020
```

```bash
# Terminal 3: Chromium instalado, con ruta configurable. Las pruebas TLS requieren OpenSSL.
CHROMIUM_PATH=/usr/bin/chromium node test/integracion/evial-browser.cjs
```

El fixture se vincula solo a loopback y devuelve datos inventados. El script solo admite un portal local y exige la marca del fixture. Simula CAPTCHA y autenticación; no sustituye sus pruebas reales. Recorre catálogo, conservación de datos tras error, inscripción, examen, acceso del personal, asistencia, edición y evaluación individual. Comprueba ausencia de errores de página/desbordamiento en 1440, 390 y 320 px. Las capturas se guardan en `/tmp/evial-preview`.

La prueba BFF ejecuta funciones reales con upstream simulado: cookies separadas, bloqueo por origen, rutas/métodos cerrados, formulario limitado, PDF privado, caducidad y errores sin secretos. No hay cuenta de prueba especial en el código de producción.

Las validaciones institucionales pendientes son las de Oracle real, medios existentes, entrega de correo, Turnstile en el dominio y cámara física. No se ha desplegado ni promovido la integración.

El parche Next/eslint-config-next 15.3.9 mantiene la línea 15.3 y corrige el aviso de seguridad de la versión 15.3.5 heredada. El BFF EVIAL fija verificación TLS por petición para que una omisión global del proxy antiguo no afecte a este módulo; una prueba con certificado autofirmado comprueba el rechazo incluso con ese ajuste global desactivado.
