// Requiere el portal con API_BASE_URL apuntando al fixture local evial-api.cjs.
// No usa Oracle, SMTP, cámara física ni autenticación institucional real.
const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const base = process.env.EVIAL_E2E_URL || "http://127.0.0.1:4020";
(async () => {
  assert.ok(
    ["127.0.0.1", "localhost"].includes(new URL(base).hostname),
    "Este recorrido solo admite un portal local de pruebas",
  );
  const reset = await fetch("http://127.0.0.1:4021/__reset");
  assert.equal(reset.headers.get("x-evial-fixture"), "local");
  assert.equal((await reset.json()).fixture, "EVIAL_LOCAL");
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    headless: true,
    args: ["--no-sandbox"],
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  try {
    await page.goto(base + "/evial");
    await page
      .getByRole("heading", { name: "Capacitaciones disponibles" })
      .waitFor();
    await page
      .getByRole("link", { name: "Ver capacitación" })
      .first()
      .waitFor();
    await fs.mkdir("/tmp/evial-preview", { recursive: true });
    await page.screenshot({
      path: "/tmp/evial-preview/inicio-desktop.png",
      fullPage: true,
    });
    await page.getByRole("link", { name: "Ver capacitación" }).first().click();
    await page.getByRole("heading", { name: "Inscríbete en línea" }).waitFor();
    await page.getByLabel("Nombres", { exact: true }).fill("Persona");
    await page.getByLabel("Apellidos", { exact: true }).fill("Prueba");
    await page.getByLabel("DPI", { exact: true }).fill("1234567890123");
    await page
      .getByLabel("Correo electrónico (opcional)", { exact: true })
      .fill("persona@example.test");
    await page.getByLabel("Teléfono", { exact: true }).fill("55551234");
    await page.getByLabel("Departamento", { exact: true }).selectOption("1");
    await page.getByLabel("Municipio", { exact: true }).selectOption("1");
    await page.getByLabel("Zona", { exact: true }).fill("1");
    await page
      .getByLabel("Dirección", { exact: true })
      .fill("Dirección de prueba");
    await page
      .getByLabel("Fecha de nacimiento", { exact: true })
      .fill("1990-01-01");
    await page.getByLabel("Tipo de placa", { exact: true }).selectOption("P");
    await page.getByLabel("Placa", { exact: true }).fill("123ABC");
    await page.route(
      "**/api/evial/eventos/21/inscripciones",
      (route) =>
        route.fulfill({
          status: 503,
          contentType: "application/json",
          body: JSON.stringify({
            message: "Fallo simulado de prueba",
            referencia: "11111111-1111-4111-8111-111111111111",
          }),
        }),
      { times: 1 },
    );
    await page.getByRole("button", { name: "Confirmar inscripción" }).click();
    await page.getByText("Fallo simulado de prueba").waitFor();
    assert.equal(
      await page.getByLabel("Nombres", { exact: true }).inputValue(),
      "Persona",
    );
    await page.getByRole("button", { name: "Confirmar inscripción" }).click();
    await page.waitForURL("**/evial/mi-curso");
    await page
      .getByText("Guía para compartir la vía", { exact: true })
      .waitFor();
    await page.getByLabel("Revisado", { exact: false }).check();
    await page.getByRole("button", { name: "Comenzar evaluación" }).click();
    await page
      .getByRole("radio", { name: "La seguridad de las personas" })
      .check();
    await page
      .getByRole("button", { name: "Enviar evaluación", exact: true })
      .click();
    await page
      .getByText("Evaluación de conocimientos aprobada.", { exact: false })
      .waitFor();
    await page
      .getByRole("heading", {
        name: "Comparte tu aprendizaje con cinco personas",
      })
      .waitFor();
    await page.screenshot({
      path: "/tmp/evial-preview/curso-desktop.png",
      fullPage: true,
    });
    // Legacy event link must preserve a reachable entry point.
    await page.goto(base + "/events/21");
    await page.waitForURL("**/evial/21");
    // Institutional access is checked before showing operational controls.
    await page.route(
      "https://challenges.cloudflare.com/turnstile/v0/api.js*",
      (route) =>
        route.fulfill({
          contentType: "application/javascript",
          body: 'window.turnstile={render:function(el,o){setTimeout(function(){o.callback("captcha-fixture")},0);return "fixture"},remove:function(){}}',
        }),
    );
    await page.goto(base + "/evial/gestion");
    await page
      .getByRole("heading", { name: "Acceso del personal de EVIAL" })
      .waitFor();
    assert.equal(
      await page
        .getByRole("button", { name: "Confirmar paso seleccionado" })
        .count(),
      0,
    );
    await page
      .getByLabel("Correo institucional", { exact: true })
      .fill("persona@example.test");
    await page
      .getByLabel("Contraseña", { exact: true })
      .fill("fixture-only-password");
    await page.getByRole("button", { name: "Entrar a gestión EVIAL" }).click();
    await page
      .getByRole("button", { name: "Ver participante" })
      .first()
      .click();
    await page
      .getByRole("checkbox", { name: "Confirmo la identidad", exact: false })
      .check();
    await page
      .getByRole("button", { name: "Confirmar paso seleccionado" })
      .click();
    await page.getByText("Operación confirmada.", { exact: false }).waitFor();
    await page
      .getByRole("button", { name: "Editar capacitación y materiales" })
      .click();
    await page
      .getByRole("heading", { name: "Editar capacitación", exact: true })
      .waitFor();
    await page.screenshot({
      path: "/tmp/evial-preview/gestion-desktop.png",
      fullPage: true,
    });
    await page.goto(base + "/evial/evaluar#token=pupil-fixture");
    await page
      .getByLabel("1. ¿Qué aprendiste en la actividad?")
      .fill("Aprendí a priorizar la seguridad de las personas.");
    assert.equal(new URL(page.url()).hash, "");
    await page
      .getByRole("button", { name: "Enviar evaluación", exact: true })
      .click();
    await page
      .getByRole("heading", { name: "Gracias por compartir tu experiencia" })
      .waitFor();
    // Narrow layouts must not overflow the viewport; horizontal tables scroll internally.
    for (const width of [390, 320]) {
      await page.setViewportSize({ width, height: 844 });
      for (const route of [
        "/evial",
        "/evial/21",
        "/evial/mi-curso",
        "/evial/gestion",
      ]) {
        await page.goto(base + route);
        await page.locator("main").waitFor();
        await page.waitForTimeout(250);
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth + 1,
          ),
          `Desbordamiento ${width} ${route}`,
        );
      }
      if (width === 390) {
        await page.goto(base + "/evial");
        await page
          .getByRole("link", { name: "Ver capacitación" })
          .first()
          .waitFor();
        await page.screenshot({
          path: "/tmp/evial-preview/inicio-mobile.png",
          fullPage: true,
        });
      }
    }
    assert.deepEqual(errors, []);
    console.log(
      JSON.stringify({
        comprobacion: "EVIAL_NAVEGADOR",
        correcta: true,
        flujos: [
          "catalogo",
          "inscripcion",
          "curso",
          "examen",
          "enlace-heredado",
          "gestion-permisos",
          "asistencia",
          "editor",
          "evaluacion-alumno",
        ],
        anchos: [1440, 390, 320],
        capturas: "/tmp/evial-preview",
      }),
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
