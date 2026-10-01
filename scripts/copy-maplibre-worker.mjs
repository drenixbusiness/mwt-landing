// MapLibre 6 loads its worker from a file next to its own module, which the
// Next.js bundler doesn't emit. Serve the worker (and the shared chunk it
// imports) from /public/maplibre instead; MapFigure points setWorkerUrl here.
import { copyFileSync, mkdirSync } from "node:fs";

const src = "node_modules/maplibre-gl/dist";
const dest = "public/maplibre";
mkdirSync(dest, { recursive: true });
for (const f of ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"]) copyFileSync(`${src}/${f}`, `${dest}/${f}`);
console.log("[maplibre] worker copied to /public/maplibre");
