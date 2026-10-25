import { readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, "dist-pages");
const indexPath = resolve(output, "index.html");
const html = await readFile(indexPath, "utf8");
// Static hosting uses the existing WhatsApp forms instead of the local API.
await writeFile(
  indexPath,
  html.replace("<html ", '<html data-standalone="true" '),
);

// Vite rewrites imported assets; public assets also need relative URLs so the
// same build works under a repository path such as /landing-nueva/.
for (const name of await readdir(resolve(output, "assets"))) {
  if (!name.endsWith(".js")) continue;
  const file = resolve(output, "assets", name);
  const source = await readFile(file, "utf8");
  await writeFile(
    file,
    source.replace(/(["'`])\/(images|videos|resources)\//g, "$1./$2/"),
  );
}
await writeFile(resolve(output, ".nojekyll"), "");
console.log("Web estática lista en dist-pages/ con formularios por WhatsApp.");
