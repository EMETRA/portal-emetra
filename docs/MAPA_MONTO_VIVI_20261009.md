# Ubicación y monto base del trámite VIVI

El resumen, la confirmación y la reapertura de un caso aceptado permiten abrir el punto registrado mediante «Ver ubicación en OpenStreetMap». El enlace incluye únicamente latitud, longitud y zoom; no incluye el código del caso, la placa ni los tokens del correo. Se abre en una pestaña nueva y no envía el Referer del trámite. Se validan los rangos de las coordenadas antes de ofrecer el enlace.

Esta solución abre el visor de OpenStreetMap sin contratar una API, incrustar teselas ni consultar un geocodificador. Los nombres de calles que se ven en el mapa pertenecen a ese servicio. El Portal conserva las coordenadas registradas y no inventa una dirección. OpenStreetMap publica sus datos bajo ODbL con atribución; las políticas de sus servidores de teselas y de Nominatim son independientes de la licencia de datos:

- [Licencia y atribución de OpenStreetMap](https://www.openstreetmap.org/copyright).
- [Uso de teselas](https://operations.osmfoundation.org/policies/tiles/).
- [Uso de Nominatim](https://operations.osmfoundation.org/policies/nominatim/).

Los mapas existentes de Predice y desplazamiento también conservan la atribución visible a OpenStreetMap y usan la URL canónica de sus teselas. El enlace nuevo del trámite no realiza solicitudes de teselas desde el Portal.

El monto base se obtiene de `ADMEMETRAVEHICULAR.TB_VIVI_REGLAMENTO.MULTA`, unido por la regla de la denuncia. Se muestra en quetzales en resumen, confirmación, resultado y caso reabierto. La consulta REFUTAR también devuelve monto, fecha y coordenadas para los enlaces que solo permiten defensa. Un valor desconocido mantiene «Por confirmar»; cero se muestra como `Q 0.00`.

Este monto es una referencia del catálogo vigente. El saldo final, descuentos y recargos se confirman en el portal de pago; esta presentación no cambia la emisión de remisiones ni los importes de cobro.

## Despliegue

Primero actualizar y reconstruir api-portal en la rama `QA`, siguiendo su [documento de despliegue](https://github.com/EMETRA/api-portal/blob/QA/docs/SERVICIOS_PORTAL_MONTO_20261009.md). El Portal requiere los campos nuevos de las consultas públicas.

Después, en la carpeta real de portal-emetra en consultan:

```bash
git switch estado-recuperado
git pull --ff-only origin estado-recuperado
pnpm install --frozen-lockfile
docker compose up -d --build --no-deps portal
```

Conservar los argumentos `-f` y de proyecto del despliegue existente.

## Validación

Once pruebas de contrato y presentación; compilación Next; prueba de navegador de monto y enlace correcto en resumen/confirmación/resultado/reapertura y consulta con solo REFUTAR, junto con la protección previa de aceptación y PDF. Las capturas usan un backend controlado y datos ficticios; no representan una emisión ni una consulta a Oracle.

Las pantallas de FAQ, Predice y desplazamiento consultan sus endpoints reales. Sus ORA-00942 requieren la corrección de propietarios y permisos en api-portal; no se sustituyen esos fallos por datos ficticios.

## Capturas de la verificación

| Pantalla | Escritorio | Móvil |
| --- | --- | --- |
| Resumen con monto y mapa | [Ver captura](capturas-mapa-monto-20261009/resumen.png) | [Ver captura](capturas-mapa-monto-20261009/resumen-movil.png) |
| Confirmación / caso aceptado | [Confirmación](capturas-mapa-monto-20261009/confirmacion.png) | [Ya aceptado](capturas-mapa-monto-20261009/ya-aceptado-movil.png) |
