const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const Module = require("node:module");
const root = path.resolve(__dirname, "../..");
const originalLoad = Module._load;
Module._load = function (name, ...args) {
  if (name === "server-only") return {};
  return originalLoad.call(this, name, ...args);
};
const load = require("./load-ts.cjs")(root, {
  [path.join(root, "src/lib/evial/upstream.ts")]: {
    fetchEvialUpstream: (...args) => global.fetch(...args),
  },
  [path.join(root, "src/lib/backend/client.ts")]: {
    buildBackendUrl: (p) => "https://api.example.test" + p,
  },
});
const { evialRoute, proxyEvial } = load("src/lib/evial/proxy.ts");
Module._load = originalLoad;
const { NextRequest } = require("next/server");
const originalFetch = global.fetch;
const req = (
  method,
  path,
  body,
  cookies = "",
  origin = "https://portal.example.test",
) =>
  new NextRequest("https://portal.example.test/api/evial/" + path, {
    method,
    headers: {
      origin,
      ...(cookies ? { cookie: cookies } : {}),
      ...(body ? { "content-type": "application/json" } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
test.afterEach(() => {
  global.fetch = originalFetch;
});
test("solo expone métodos y rutas EVIAL autorizados", () => {
  assert.equal(evialRoute("GET", ["..", "auth", "profile"]), null);
  assert.equal(evialRoute("DELETE", ["eventos", "21"]), null);
  assert.equal(evialRoute("POST", ["administracion", "asistencia"]), null);
  assert.equal(
    evialRoute("PATCH", ["administracion", "asistencia"]).scope,
    "staff",
  );
  assert.equal(
    evialRoute("POST", ["mi-curso", "examen", "responder"]).scope,
    "course",
  );
  assert.equal(evialRoute("GET", ["evaluacion"]).scope, "evaluation");
  assert.equal(
    evialRoute("PUT", ["administracion", "eventos", "21", "contenidos", "2"])
      .scope,
    "staff",
  );
});
test("sin cookie específica no consulta ni usa BACKEND_TOKEN", async () => {
  let calls = 0;
  global.fetch = async () => {
    calls++;
    throw new Error();
  };
  const response = await proxyEvial(
    req(
      "GET",
      "administracion/eventos",
      undefined,
      "evial_course_token=learner",
    ),
    ["administracion", "eventos"],
  );
  assert.equal(response.status, 401);
  assert.equal(calls, 0);
});
test("acceso guarda sesión HttpOnly sin devolver token al navegador", async () => {
  let sent;
  global.fetch = async (url, init) => {
    sent = { url, init };
    return Response.json({
      token: "learner-token",
      expiresIn: 7200,
      codigo: 500,
    });
  };
  const response = await proxyEvial(
    req("POST", "eventos/21/acceso", {
      codigo: 500,
      dpi: "1234567890123",
      telefono: "55551234",
    }),
    ["eventos", "21", "acceso"],
  );
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { expiresIn: 7200, codigo: 500 });
  const cookie = response.headers.get("set-cookie");
  assert.match(cookie, /evial_course_token=learner-token/);
  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /SameSite=lax/);
  assert.match(cookie, /Path=\/api\/evial/);
  assert.equal(sent.init.headers.get("authorization"), null);
});
test("gestión usa solo cookie institucional y búsqueda por POST sin PII en la URL", async () => {
  let sent;
  global.fetch = async (url, init) => {
    sent = { url, init };
    return Response.json({ items: [] });
  };
  await proxyEvial(
    req(
      "POST",
      "administracion/buscar",
      { evento: 21, page: 1, busqueda: "Persona Prueba" },
      "evial_course_token=learner; evial_staff_token=staff",
    ),
    ["administracion", "buscar"],
  );
  assert.equal(sent.init.headers.get("authorization"), "Bearer staff");
  assert.equal(
    sent.url,
    "https://api.example.test/evial/administracion/buscar",
  );
  assert.equal(
    JSON.parse(new TextDecoder().decode(sent.init.body)).busqueda,
    "Persona Prueba",
  );
});
test("rechaza cambios de origen externo sin contactar al API", async () => {
  let calls = 0;
  global.fetch = async () => {
    calls++;
    throw new Error();
  };
  const response = await proxyEvial(
    req(
      "POST",
      "mi-curso/examen/iniciar",
      {},
      "evial_course_token=learner",
      "https://externo.example.test",
    ),
    ["mi-curso", "examen", "iniciar"],
  );
  assert.equal(response.status, 403);
  assert.equal(calls, 0);
});
test("conserva bytes PDF y cabeceras privadas", async () => {
  global.fetch = async () =>
    new Response("%PDF-1.7\ncomprobante", {
      headers: {
        "content-type": "application/pdf",
        "content-disposition": 'inline; filename="EVIAL.pdf"',
      },
    });
  const response = await proxyEvial(
    req("GET", "mi-curso/comprobante", undefined, "evial_course_token=learner"),
    ["mi-curso", "comprobante"],
  );
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "application/pdf");
  assert.equal(response.headers.get("cache-control"), "private, no-store");
  assert.match(await response.text(), /^%PDF-/);
});
test("evaluaciones usan su Bearer separado sin cookies de otras personas", async () => {
  let auth;
  global.fetch = async (_, init) => {
    auth = init.headers.get("authorization");
    return Response.json({ preguntas: [] });
  };
  const request = req(
    "GET",
    "evaluacion",
    undefined,
    "evial_staff_token=staff",
  );
  request.headers.set("authorization", "Bearer pupil");
  await proxyEvial(request, ["evaluacion"]);
  assert.equal(auth, "Bearer pupil");
});
test("error de red conserva referencia segura y no filtra URL ni credenciales", async () => {
  global.fetch = async () => {
    throw new Error("https://usuario:secreto@db.example.test ORA-01031");
  };
  const response = await proxyEvial(
    req("GET", "mi-curso", undefined, "evial_course_token=learner"),
    ["mi-curso"],
  );
  assert.equal(response.status, 503);
  const json = await response.json();
  assert.match(json.referencia, /^[a-f0-9-]{36}$/);
  assert.doesNotMatch(JSON.stringify(json), /secreto|db\.example|ORA-/);
});
test("401 del API elimina solamente la sesión que falló", async () => {
  global.fetch = async () =>
    Response.json({ message: "Acceso vencido" }, { status: 401 });
  const response = await proxyEvial(
    req(
      "GET",
      "administracion/eventos",
      undefined,
      "evial_staff_token=staff; evial_course_token=learner",
    ),
    ["administracion", "eventos"],
  );
  assert.equal(response.status, 401);
  assert.match(
    response.headers.get("set-cookie"),
    /evial_staff_token=;.*Max-Age=0/,
  );
  assert.doesNotMatch(response.headers.get("set-cookie"), /evial_course_token/);
});
test("cerrar acceso es local y conserva separadas las sesiones", async () => {
  let calls = 0;
  global.fetch = async () => {
    calls++;
    throw new Error();
  };
  const response = await proxyEvial(req("DELETE", "sesion"), ["sesion"]);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("set-cookie"), /evial_course_token=;/);
  assert.doesNotMatch(response.headers.get("set-cookie"), /evial_staff_token/);
  assert.equal(calls, 0);
});
test("tamaño de formulario se valida antes de enviar al backend", async () => {
  let calls = 0;
  global.fetch = async () => {
    calls++;
    throw new Error();
  };
  const response = await proxyEvial(
    req("POST", "eventos/21/acceso", { dato: "x".repeat(140000) }),
    ["eventos", "21", "acceso"],
  );
  assert.equal(response.status, 413);
  assert.equal(calls, 0);
});
