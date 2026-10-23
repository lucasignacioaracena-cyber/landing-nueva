import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const project = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(project, "dist");
const output = resolve(
  process.argv[2] || resolve(project, "exports/Matrona-Guia.html"),
);
const mimeTypes = {
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".mp4": "video/mp4",
  ".vtt": "text/vtt",
};
const dataUrl = async (path) =>
  `data:${mimeTypes[extname(path)] || "application/octet-stream"};base64,${(await readFile(path)).toString("base64")}`;
let html = await readFile(resolve(dist, "index.html"), "utf8");

for (const match of [
  ...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"[^>]*>/g),
]) {
  const cssPath = resolve(dist, match[1].replace(/^\//, ""));
  let css = await readFile(cssPath, "utf8");
  for (const resource of [...css.matchAll(/url\(([^)]+)\)/g)]) {
    const url = resource[1].replace(/^["']|["']$/g, "");
    if (url.startsWith("data:")) continue;
    const localPath = url.startsWith("/")
      ? resolve(dist, url.slice(1))
      : resolve(dirname(cssPath), url);
    css = css.replaceAll(resource[0], `url(${await dataUrl(localPath)})`);
  }
  html = html.replace(match[0], () => `<style>${css}</style>`);
}

for (const match of [
  ...html.matchAll(/<script[^>]+src="([^"]+)"[^>]*><\/script>/g),
]) {
  let javascript = await readFile(
    resolve(dist, match[1].replace(/^\//, "")),
    "utf8",
  );
  const collectAssets = async (directory, prefix = "") => {
    const entries = await readdir(directory, { withFileTypes: true });
    const results = await Promise.all(
      entries.map((entry) =>
        entry.isDirectory()
          ? collectAssets(
              resolve(directory, entry.name),
              `${prefix}${entry.name}/`,
            )
          : [`${prefix}${entry.name}`],
      ),
    );
    return results.flat();
  };
  const bundledAssets = await collectAssets(resolve(project, "public"));
  for (const asset of bundledAssets) {
    if (!javascript.includes(`/${asset}`)) continue;
    javascript = javascript.replaceAll(
      `/${asset}`,
      await dataUrl(resolve(dist, asset)),
    );
  }
  html = html.replace(
    match[0],
    () =>
      `<script type="module">${javascript.replaceAll("</script", "<\\/script")}</script>`,
  );
}

html = html.replaceAll(
  "/favicon.svg",
  await dataUrl(resolve(dist, "favicon.svg")),
);
if (/(?:src|href)="\/(?!\/)/.test(html))
  throw new Error("The exported HTML still references a local asset.");
await mkdir(dirname(output), { recursive: true });
await writeFile(output, html);
console.log(
  `HTML independiente guardado en ${output} (${Buffer.byteLength(html)} bytes)`,
);
