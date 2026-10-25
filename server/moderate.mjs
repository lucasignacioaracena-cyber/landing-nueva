import { openStore } from "./store.mjs";

const [action = "list", id] = process.argv.slice(2);
if (
  !["list", "contacts", "publish", "reject"].includes(action) ||
  (!["list", "contacts"].includes(action) && !id)
) {
  console.error(
    "Uso: node server/moderate.mjs list | contacts | publish ID | reject ID",
  );
  process.exitCode = 1;
} else {
  const db = openStore();
  try {
    if (action === "list") {
      console.log(
        JSON.stringify(
          db
            .prepare(
              "SELECT id, name, rating, comment, status, created_at AS createdAt FROM testimonials ORDER BY created_at DESC",
            )
            .all(),
          null,
          2,
        ),
      );
    } else if (action === "contacts") {
      console.log(
        JSON.stringify(
          db
            .prepare(
              "SELECT id, name, email, phone, subject, message, created_at AS createdAt FROM contact_messages ORDER BY created_at DESC",
            )
            .all(),
          null,
          2,
        ),
      );
    } else {
      const status = action === "publish" ? "approved" : "rejected";
      const result = db
        .prepare("UPDATE testimonials SET status = ? WHERE id = ?")
        .run(status, id);
      if (!result.changes) {
        console.error("No se encontró ese testimonio.");
        process.exitCode = 1;
      } else console.log(JSON.stringify({ id, status }));
    }
  } finally {
    db.close();
  }
}
