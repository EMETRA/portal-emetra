const test = require("node:test"),
  assert = require("node:assert/strict"),
  path = require("node:path"),
  fs = require("node:fs/promises"),
  os = require("node:os"),
  http = require("node:http"),
  https = require("node:https"),
  { execFileSync } = require("node:child_process"),
  Module = require("node:module");
const root = path.resolve(__dirname, "../.."),
  original = Module._load;
Module._load = function (name, ...args) {
  return name === "server-only" ? {} : original.call(this, name, ...args);
};
const { fetchEvialUpstream } = require("./load-ts.cjs")(root)(
  "src/lib/evial/upstream.ts",
);
Module._load = original;
const listen = (server) =>
  new Promise((resolve) =>
    server.listen(0, "127.0.0.1", () => resolve(server.address().port)),
  );
const close = (server) => new Promise((resolve) => server.close(resolve));
test("transporte EVIAL conserva cuerpo, bytes PDF y respuesta sin contenido", async () => {
  const server = http.createServer(async (req, res) => {
    if (req.url === "/empty") {
      res.writeHead(204);
      return res.end();
    }
    let body = "";
    for await (const chunk of req) body += chunk;
    assert.equal(body, '{"dato":1}');
    assert.equal(req.headers.authorization, "Bearer fixture");
    res.setHeader("content-type", "application/pdf");
    res.end("%PDF-1.7\nprueba");
  });
  try {
    const port = await listen(server);
    const response = await fetchEvialUpstream(`http://127.0.0.1:${port}/pdf`, {
      method: "POST",
      headers: new Headers({ authorization: "Bearer fixture" }),
      body: new TextEncoder().encode('{"dato":1}'),
      signal: AbortSignal.timeout(5000),
    });
    assert.equal(response.headers.get("content-type"), "application/pdf");
    assert.equal(await response.text(), "%PDF-1.7\nprueba");
    const empty = await fetchEvialUpstream(`http://127.0.0.1:${port}/empty`, {
      method: "GET",
      headers: new Headers(),
      signal: AbortSignal.timeout(5000),
    });
    assert.equal(empty.status, 204);
    assert.equal(await empty.text(), "");
  } finally {
    await close(server);
  }
});
test("EVIAL rechaza certificado no confiable aunque el proxy heredado desactive TLS global", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "evial-tls-"));
  let server;
  const previous = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
  try {
    execFileSync(
      "openssl",
      [
        "req",
        "-x509",
        "-newkey",
        "rsa:2048",
        "-nodes",
        "-keyout",
        path.join(dir, "key.pem"),
        "-out",
        path.join(dir, "cert.pem"),
        "-days",
        "1",
        "-subj",
        "/CN=localhost",
      ],
      { stdio: "ignore" },
    );
    server = https.createServer(
      {
        key: await fs.readFile(path.join(dir, "key.pem")),
        cert: await fs.readFile(path.join(dir, "cert.pem")),
      },
      (_, res) => res.end("NO_DEBE_ACEPTARLO"),
    );
    const port = await listen(server);
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    await assert.rejects(
      () =>
        fetchEvialUpstream(`https://127.0.0.1:${port}/`, {
          method: "GET",
          headers: new Headers(),
          signal: AbortSignal.timeout(5000),
        }),
      (error) =>
        ["DEPTH_ZERO_SELF_SIGNED_CERT", "SELF_SIGNED_CERT_IN_CHAIN"].includes(
          error.code,
        ),
    );
  } finally {
    if (previous === undefined) delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
    else process.env.NODE_TLS_REJECT_UNAUTHORIZED = previous;
    if (server) await close(server);
    await fs.rm(dir, { recursive: true, force: true });
  }
});
