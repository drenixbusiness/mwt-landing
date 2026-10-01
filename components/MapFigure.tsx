"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as MapLibreMap, StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { SITE } from "@/lib/site";

const KEY = process.env.NEXT_PUBLIC_CARTO_KEY;
const STYLE_URL = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";
// 69 Buck Trail Ln, Atoka, TN 38004
export const HQ: [number, number] = [-89.76135, 35.414];

const C = {
  bg: "#f2f2f3",
  accent: "#5980a6",
  accent700: "#416180",
  water: "#d6ebff",
  waterLine: "#a9c8e6",
  tint: "rgba(89,128,166,0.07)",
  ink: "rgba(29,31,32,0.35)",
};

/** Recolor CARTO Positron into the site's blueprint palette: paper fill, accent hairlines. */
function blueprint(style: StyleSpecification): StyleSpecification {
  for (const l of style.layers) {
    const id = l.id;
    const paint = ((l as { paint?: Record<string, unknown> }).paint ??= {});
    const layout = ((l as { layout?: Record<string, unknown> }).layout ??= {});

    if (l.type === "background") paint["background-color"] = C.bg;
    else if (l.type === "fill") {
      if (id.startsWith("water")) paint["fill-color"] = C.water;
      else if (id.startsWith("building")) layout.visibility = "none";
      else paint["fill-color"] = C.tint;
      paint["fill-outline-color"] = "rgba(0,0,0,0)";
    } else if (l.type === "line") {
      if (id === "waterway") paint["line-color"] = C.waterLine;
      else if (id.startsWith("boundary")) {
        paint["line-color"] = C.accent700;
        paint["line-dasharray"] = [3, 2];
        paint["line-opacity"] = 0.6;
      } else if (id.includes("rail")) paint["line-color"] = C.ink;
      else if (id.includes("_case")) {
        // Road outlines in accent, like an engineering drawing
        const major = /mot|trunk|pri/.test(id);
        paint["line-color"] = major ? C.accent : "rgba(89,128,166,0.45)";
      } else if (id.includes("_fill")) paint["line-color"] = C.bg;
      else if (id.startsWith("aeroway")) paint["line-color"] = C.ink;
    } else if (l.type === "symbol") {
      if (id.startsWith("poi") || id === "housenumber") {
        layout.visibility = "none";
        continue;
      }
      paint["text-color"] = id.startsWith("water") ? C.accent : C.accent700;
      paint["text-halo-color"] = C.bg;
      paint["text-halo-width"] = 1.5;
      if (id.startsWith("place")) {
        layout["text-transform"] = "uppercase";
        layout["text-letter-spacing"] = 0.12;
      }
    }
  }
  return style;
}

const withKey = (url: string) =>
  KEY && /cartocdn\.com/.test(url) && !/[?&]key=/.test(url)
    ? `${url}${url.includes("?") ? "&" : "?"}key=${encodeURIComponent(KEY)}`
    : url;

export function MapFigure() {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "ready" | "error">(KEY ? "idle" : "error");

  useEffect(() => {
    const el = ref.current;
    if (!el || !KEY) return;
    let map: MapLibreMap | undefined;
    let cancelled = false;

    async function init() {
      try {
        const [maplibregl, style] = await Promise.all([
          import("maplibre-gl"),
          fetch(withKey(STYLE_URL)).then((r) => {
            if (!r.ok) throw new Error(`style ${r.status}`);
            return r.json() as Promise<StyleSpecification>;
          }),
        ]);
        if (cancelled || !el) return;

        // Worker is served from /public (see scripts/copy-maplibre-worker.mjs)
        maplibregl.setWorkerUrl(`${location.origin}/maplibre/maplibre-gl-worker.mjs`);

        const m = new maplibregl.Map({
          container: el,
          style: blueprint(style),
          center: HQ,
          zoom: 11.2,
          minZoom: 4,
          maxZoom: 17,
          attributionControl: { compact: true },
          cooperativeGestures: true,
          transformRequest: (url: string) => ({ url: withKey(url) }),
        });
        map = m;
        m.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
        m.addControl(new maplibregl.ScaleControl({ unit: "imperial", maxWidth: 120 }), "bottom-left");

        const marker = document.createElement("div");
        marker.className = "hq-marker";
        marker.setAttribute("aria-hidden", "true");
        marker.innerHTML = '<span class="hq-pulse"></span><span class="hq-dot"></span><span class="hq-tag">MWT · HQ</span>';
        new maplibregl.Marker({ element: marker }).setLngLat(HQ).addTo(m);

        m.once("load", () => {
          if (cancelled) return;
          // Start the attribution collapsed (the ⓘ button still opens it)
          el.querySelector(".maplibregl-ctrl-attrib")?.classList.remove("maplibregl-compact-show");
          setState("ready");
        });
        m.on("error", (e) => console.warn("[map]", e.error?.message));
      } catch (err) {
        console.warn("[map] failed to load", err);
        if (!cancelled) setState("error");
      }
    }

    // Only load MapLibre when the map is about to scroll into view
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          init();
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(el);

    return () => {
      cancelled = true;
      io.disconnect();
      map?.remove();
    };
  }, []);

  return (
    <div className="blueprint-map relative h-[clamp(360px,42vw,520px)] overflow-hidden bg-bg">
      <div
        ref={ref}
        // Full size rather than absolute: maplibre-gl.css forces position: relative on the container
        className="h-full w-full"
        role="region"
        aria-label={`Map showing MWT Transport at ${SITE.address}`}
      />
      {/* Blueprint grid laid over the map */}
      <div aria-hidden className="map-grid pointer-events-none absolute inset-0 z-[1]" />

      {state !== "ready" && (
        <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center gap-2 text-center">
          <span className="kicker">{state === "error" ? "Map unavailable" : "Loading map…"}</span>
          <address className="display text-[clamp(22px,2.4vw,30px)] not-italic">{SITE.address}</address>
        </div>
      )}
    </div>
  );
}
