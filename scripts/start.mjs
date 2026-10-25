import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const production = args.includes("--production");
const viteArgs = production
  ? ["preview", "--host", "0.0.0.0", "--port", "4173"]
  : ["--host", "0.0.0.0"];
const children = [
  spawn(process.execPath, ["server/api.mjs"], { cwd: root, stdio: "inherit" }),
  spawn(
    process.execPath,
    [
      "node_modules/vite/bin/vite.js",
      ...viteArgs,
      ...args.filter((a) => a !== "--production"),
    ],
    { cwd: root, stdio: "inherit" },
  ),
];
let stopping = false;
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  children.forEach((c) => c.kill("SIGTERM"));
  process.exitCode = code;
}
process.on("SIGINT", () => stop());
process.on("SIGTERM", () => stop());
children.forEach((c) => {
  c.on("error", (e) => {
    console.error(e.message);
    stop(1);
  });
  c.on("exit", (code) => {
    if (!stopping) stop(code || 0);
  });
});
