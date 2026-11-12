const http = require("node:http");
const event = {
  EVENTO: 21,
  NOMBRE: "Formación para una movilidad responsable",
  TIPO: "V",
  ESTATUS: "A",
  LUGAR: "Ciudad de Guatemala",
  FECHA_INICIO: "2026-12-01",
  FECHA_FINAL: "2026-12-31",
  PARTICIPANTES: 100,
  DESCRIPCION: "Aprende a compartir la vía de forma segura y responsable.",
  INSCRIPCION_ABIERTA: 1,
};
let exams = 0,
  registered = false,
  attended = false;
const server = http.createServer(async (req, res) => {
  let raw = "";
  for await (const chunk of req) raw += chunk;
  let body = {};
  try {
    body = JSON.parse(raw);
  } catch {}
  const url = new URL(req.url, "http://localhost");
  const p = url.pathname.replace(/^\/evial\/?/, "");
  res.setHeader("x-evial-fixture", "local");
  res.setHeader("content-type", "application/json");
  res.setHeader("cache-control", "no-store");
  const send = (status, data) => {
    res.writeHead(status);
    res.end(JSON.stringify(data));
  };
  if (p === "__reset" || p === "/__reset") {
    exams = 0;
    registered = false;
    attended = false;
    return send(200, { fixture: "EVIAL_LOCAL" });
  }
  if (p === "inicio")
    return send(200, {
      eventos: [event],
      videos: [],
      preguntas: [
        {
          DESCRIPCION: "¿Cómo continúo mi curso?",
          RESPUESTA:
            "Utiliza tu código de inscripción y los datos registrados.",
        },
      ],
    });
  if (p === "configuracion")
    return send(200, {
      registroDisponible: true,
      evidenciaDisponible: true,
      correoDisponible: true,
      staffSiteKey: "1x00000000000000000000AA",
    });
  if (p === "eventos") return send(200, [event]);
  if (p === "eventos/21")
    return send(200, {
      evento: event,
      requisitos: [
        { REQUISITO: 1, DESCRIPCION: "Documento de identificación" },
      ],
      reglas: [],
      beneficios: [
        {
          BENEFICIO: 1,
          NOMBRE: "Aprendizaje práctico",
          DESCRIPCION: "Conceptos para una mejor convivencia vial",
        },
      ],
      actividades: [],
      patrocinadores: [],
    });
  if (p === "catalogos/paises")
    return send(200, [{ PAIS: 1, NOMBRE: "Guatemala" }]);
  if (p === "catalogos/departamentos")
    return send(200, [{ DEPARTAMENTO: 1, NOMBRE: "Guatemala" }]);
  if (p === "catalogos/municipios")
    return send(200, [{ MUNICIPIO: 1, NOMBRE: "Guatemala" }]);
  if (/eventos\/21\/(acceso|inscripciones)/.test(p)) {
    registered = true;
    return send(200, {
      token: "learner-fixture",
      expiresIn: 7200,
      codigo: 500,
    });
  }
  if (
    p === "mi-curso" &&
    req.headers.authorization === "Bearer learner-fixture"
  )
    return send(200, {
      evento: event,
      inscripcion: { PERSONA: 500, GRUPO: 1 },
      participante: { NOMBRES: "Persona", APELLIDOS: "Prueba" },
      estado: {
        aprobado: exams > 0,
        agotado: false,
        intentos: exams,
        intentosRestantes: 2 - exams,
        punteo: exams ? 100 : null,
        fase1: true,
        fase2: exams > 0,
        fase3: false,
        fase4: false,
      },
      contenidos: [
        {
          CONTENIDO_ID: 1,
          NOMBRE: "Guía para compartir la vía",
          MODULO: 1,
          URL: "https://example.test/guia.pdf",
        },
      ],
    });
  if (p === "mi-curso/examen/iniciar")
    return send(200, {
      intento: 1,
      intentoToken: "exam-fixture",
      duracionSegundos: 120,
      preguntas: [
        {
          MODULO: 1,
          PREGUNTA: 1,
          DESCRIPCION: "¿Qué prioridad debemos respetar?",
          IMAGEN: null,
          opciones: [
            { OPCION: 1, DESCRIPCION: "La seguridad de las personas" },
            { OPCION: 2, DESCRIPCION: "La velocidad" },
          ],
        },
      ],
    });
  if (p === "mi-curso/examen/responder") {
    exams++;
    return send(200, { punteo: 100, aprobado: true });
  }
  if (p === "mi-curso/alumnos") return send(200, []);
  if (p === "mi-curso/comprobante/correo")
    return send(200, {
      mensaje: "El servidor de correo aceptó el envío de prueba simulado.",
    });
  if (p === "mi-curso/comprobante") {
    res.setHeader("content-type", "application/pdf");
    return res.end("%PDF-1.4\nfixture");
  }
  if (p === "staff/acceso")
    return send(200, { token: "staff-fixture", expiresIn: 900 });
  if (
    p.startsWith("administracion/") &&
    req.headers.authorization !== "Bearer staff-fixture"
  )
    return send(401, { message: "Acceso requerido" });
  if (p === "administracion/contexto")
    return send(200, {
      actor: { id: 9, correo: "persona@example.test" },
      capabilities: { consultar: true, asistencia: true, administrar: true },
    });
  if (p === "administracion/eventos") return send(200, [event]);
  if (p === "administracion/buscar")
    return send(200, {
      items: [
        {
          PERSONA: 500,
          NOMBRES: "Persona",
          APELLIDOS: "Prueba",
          DPI: "1234567890123",
          TELEFONO: "55551234",
          CORREO_ELECTRONICO: "persona@example.test",
          GRUPO: 1,
          ASISTENCIA: attended ? "S" : null,
          TEORICO: null,
          PRACTICO: null,
        },
      ],
      total: 1,
      page: 1,
      limit: 50,
    });
  if (p === "administracion/asistencia") {
    attended = true;
    return send(200, { confirmado: true });
  }
  if (p === "administracion/eventos/21/editor")
    return send(200, { evento: event, contenidos: [] });
  if (p === "evaluacion")
    return send(200, {
      participante: "Participante Prueba",
      facilitador: "Persona Prueba",
      respondido: false,
      preguntas: [
        { PREGUNTA: 1, DESCRIPCION: "¿Qué aprendiste en la actividad?" },
      ],
    });
  return send(401, { codigo: "ACCESO_REQUERIDO", message: "Acceso requerido" });
});
server.listen(4021, "127.0.0.1", () => console.log("EVIAL_MOCK_READY"));
