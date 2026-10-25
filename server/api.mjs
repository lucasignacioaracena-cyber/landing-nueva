import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { openStore } from "./store.mjs";

const DEFAULT_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
];
const MAX_BODY = 16 * 1024;
const clean = (value) => (typeof value === "string" ? value.trim() : "");
const validText = (value, min, max) =>
  typeof value === "string" &&
  value.length >= min &&
  value.length <= max &&
  !value.includes("\0");

class RequestError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function readJson(request) {
  if (
    !(request.headers["content-type"] || "")
      .toLowerCase()
      .startsWith("application/json")
  )
    throw new RequestError(415, "Envía el formulario como JSON.");
  let bytes = 0;
  const chunks = [];
  for await (const chunk of request) {
    bytes += chunk.length;
    if (bytes <= MAX_BODY) chunks.push(chunk);
  }
  if (bytes > MAX_BODY)
    throw new RequestError(413, "El mensaje es demasiado extenso.");
  try {
    const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!body || typeof body !== "object" || Array.isArray(body))
      throw new Error();
    return body;
  } catch {
    throw new RequestError(400, "No pudimos leer los datos del formulario.");
  }
}

export function createApi(db, origins = DEFAULT_ORIGINS) {
  const allowed = new Set(origins);
  const server = createServer(async (request, response) => {
    const send = (status, data) => {
      response.writeHead(status, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      });
      response.end(JSON.stringify(data));
    };
    try {
      const origin = request.headers.origin;
      let sameOrigin = false;
      if (origin) {
        try {
          const source = new URL(origin);
          sameOrigin =
            ["http:", "https:"].includes(source.protocol) &&
            source.host === request.headers.host?.toLowerCase();
        } catch {
          /* invalid origins are rejected below */
        }
      }
      if (origin && !allowed.has(origin) && !sameOrigin)
        throw new RequestError(403, "Este origen no está autorizado.");
      if (origin) {
        response.setHeader("Access-Control-Allow-Origin", origin);
        response.setHeader("Vary", "Origin");
      }
      const path = new URL(request.url || "/", "http://127.0.0.1").pathname;
      if (request.method === "OPTIONS") {
        response.setHeader(
          "Access-Control-Allow-Methods",
          "GET, POST, OPTIONS",
        );
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.writeHead(204);
        response.end();
        return;
      }
      if (path === "/api/status" && request.method === "GET")
        return send(200, { ok: true });
      if (path === "/api/testimonials" && request.method === "GET") {
        const testimonials = db
          .prepare(
            `SELECT id, name, rating, comment, created_at AS createdAt FROM testimonials WHERE status = 'approved' ORDER BY created_at DESC LIMIT 50`,
          )
          .all();
        return send(200, { ok: true, testimonials });
      }
      if (path === "/api/contact" && request.method === "POST") {
        const body = await readJson(request);
        const name = clean(body.name),
          email = clean(body.email),
          phone = clean(body.phone),
          subject = clean(body.subject),
          message = clean(body.message);
        if (!validText(name, 2, 80))
          throw new RequestError(
            400,
            "Escribe tu nombre (entre 2 y 80 caracteres).",
          );
        if (
          !validText(email, 3, 254) ||
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        )
          throw new RequestError(400, "Escribe un correo válido.");
        if (
          phone &&
          (!validText(phone, 6, 30) || !/^[+\d\s().-]+$/.test(phone))
        )
          throw new RequestError(400, "Revisa tu número de teléfono.");
        if (!validText(subject, 2, 120))
          throw new RequestError(400, "Selecciona el motivo de tu consulta.");
        if (!validText(message, 10, 3000))
          throw new RequestError(
            400,
            "Escribe un mensaje de entre 10 y 3.000 caracteres.",
          );
        if (body.consent !== true)
          throw new RequestError(
            400,
            "Necesitamos tu autorización para responder esta consulta.",
          );
        const id = randomUUID(),
          createdAt = new Date().toISOString();
        db.prepare(
          "INSERT INTO contact_messages (id, name, email, phone, subject, message, consent, created_at) VALUES (?, ?, ?, ?, ?, ?, 1, ?)",
        ).run(id, name, email, phone, subject, message, createdAt);
        return send(201, { ok: true, id, createdAt });
      }
      if (path === "/api/testimonials" && request.method === "POST") {
        const body = await readJson(request);
        const name = clean(body.name),
          comment = clean(body.comment),
          rating = body.rating;
        if (!validText(name, 1, 80))
          throw new RequestError(
            400,
            "Escribe tu nombre o tus iniciales (hasta 80 caracteres).",
          );
        if (!Number.isInteger(rating) || rating < 1 || rating > 5)
          throw new RequestError(400, "Selecciona una valoración de 1 a 5.");
        if (!validText(comment, 10, 2000))
          throw new RequestError(
            400,
            "Escribe una experiencia de entre 10 y 2.000 caracteres.",
          );
        if (body.consent !== true)
          throw new RequestError(
            400,
            "Autoriza la revisión y posible publicación de tu experiencia.",
          );
        const id = randomUUID(),
          createdAt = new Date().toISOString();
        db.prepare(
          "INSERT INTO testimonials (id, name, rating, comment, status, consent, created_at) VALUES (?, ?, ?, ?, 'pending', 1, ?)",
        ).run(id, name, rating, comment, createdAt);
        return send(201, { ok: true, id, status: "pending", createdAt });
      }
      if (["/api/contact", "/api/testimonials", "/api/status"].includes(path)) {
        response.setHeader(
          "Allow",
          path === "/api/testimonials"
            ? "GET, POST, OPTIONS"
            : path === "/api/status"
              ? "GET, OPTIONS"
              : "POST, OPTIONS",
        );
        throw new RequestError(405, "Este método no está disponible.");
      }
      throw new RequestError(404, "No encontramos esta página.");
    } catch (error) {
      if (error instanceof RequestError)
        return send(error.status, { ok: false, error: error.message });
      console.error("Matrona Guía API: no se pudo completar una operación.");
      send(500, {
        ok: false,
        error: "No pudimos guardar tu mensaje. Inténtalo nuevamente.",
      });
    }
  });
  server.requestTimeout = 15000;
  server.headersTimeout = 10000;
  return server;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const db = openStore();
  const port = Number(process.env.MATRONAGUIA_PORT || 3001);
  if (!Number.isInteger(port) || port < 1 || port > 65535)
    throw new Error("MATRONAGUIA_PORT debe ser un puerto válido.");
  const configuredOrigins = process.env.MATRONAGUIA_ALLOWED_ORIGINS?.split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const server = createApi(
    db,
    configuredOrigins?.length ? configuredOrigins : DEFAULT_ORIGINS,
  );
  server.listen(port, "127.0.0.1", () =>
    console.log(`Matrona Guía API disponible en http://127.0.0.1:${port}`),
  );
  for (const signal of ["SIGTERM", "SIGINT"])
    process.on(signal, () =>
      server.close(() => {
        db.close();
        process.exit(0);
      }),
    );
}
