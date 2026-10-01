import { ImageResponse } from "next/og";

export const alt = "MWT Transport — Your miles. Your home time. Our word.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function font(weight: 600) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@${weight}`,
  ).then((r) => r.text());
  const url = css.match(/src: url\((.+?)\) format/)?.[1];
  return url ? fetch(url).then((r) => r.arrayBuffer()) : null;
}

export default async function OpengraphImage() {
  const data = await font(600).catch(() => null);
  const grid = "rgba(89,128,166,0.12)";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#f2f2f3",
          backgroundImage: `linear-gradient(to right, ${grid} 1px, transparent 1px), linear-gradient(to bottom, ${grid} 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
          color: "#1d1f20",
          fontFamily: "Barlow Condensed",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28, color: "#416180", letterSpacing: 3 }}>
          <div style={{ width: 16, height: 16, background: "#5980a6" }} />
          NOW HIRING · CDL-A · USDOT 4041419
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 128, lineHeight: 0.9 }}>
          <span>YOUR MILES.</span>
          <span>YOUR HOME TIME.</span>
          <span style={{ color: "#5980a6" }}>OUR WORD.</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 32, letterSpacing: 2 }}>
          <span>MWT TRANSPORT LLC</span>
          <span style={{ color: "#416180" }}>(704) 661-5180</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: data ? [{ name: "Barlow Condensed", data, weight: 600, style: "normal" }] : undefined,
    },
  );
}
