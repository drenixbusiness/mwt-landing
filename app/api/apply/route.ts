import { NextResponse } from "next/server";
import { isValidUSPhone } from "@/lib/phone";
import { EXPERIENCE_OPTIONS, POSITION_LABELS, US_STATES, type Position } from "@/lib/site";

type Application = {
  name: string;
  phone: string;
  email: string;
  state: string;
  position: string;
  experience: string;
  source: string;
  submittedAt: string;
};

const clean = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot filled → silently accept and drop
  if (clean(body.website)) return NextResponse.json({ ok: true });

  const position = clean(body.position) as Position;
  const app: Application = {
    name: clean(body.name, 120),
    phone: clean(body.phone, 30),
    email: clean(body.email, 160),
    state: (US_STATES as readonly string[]).includes(clean(body.state)) ? clean(body.state) : "",
    position: POSITION_LABELS[position] ?? POSITION_LABELS.company,
    experience: (EXPERIENCE_OPTIONS as readonly string[]).includes(clean(body.experience))
      ? clean(body.experience)
      : "Not specified",
    source: clean(body.source, 40) === "/offer" ? "Owner-operator offer page" : "Main page",
    submittedAt: new Date().toISOString(),
  };

  if (!app.name) return NextResponse.json({ error: "Full name is required." }, { status: 422 });
  if (!isValidUSPhone(app.phone))
    return NextResponse.json({ error: "Enter a valid US phone number." }, { status: 422 });
  if (!app.state) return NextResponse.json({ error: "Please select your state." }, { status: 422 });
  if (app.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(app.email))
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 422 });

  // TODO: configure at least one delivery channel via env variables (see .env.example).
  // Each one below runs only when its env vars are set; with none set, applications
  // are only written to the server log.
  const deliveries: Promise<unknown>[] = [];
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) deliveries.push(sendTelegram(app));
  if (process.env.RESEND_API_KEY && process.env.APPLY_EMAIL_TO) deliveries.push(sendEmail(app));
  if (process.env.APPLY_WEBHOOK_URL) deliveries.push(sendWebhook(app));

  if (deliveries.length === 0) {
    console.warn("[apply] No delivery channel configured. Application:", app);
    return NextResponse.json({ ok: true });
  }

  const results = await Promise.allSettled(deliveries);
  const failed = results.filter((r) => r.status === "rejected") as PromiseRejectedResult[];
  failed.forEach((f) => console.error("[apply] delivery failed:", f.reason));

  // Succeed if at least one channel got the application
  if (failed.length === results.length) {
    return NextResponse.json(
      { error: "We couldn't send your application. Please call (704) 661-5180." },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true });
}

function summary(a: Application) {
  return [
    "New driver application — MWT Transport",
    `Name: ${a.name}`,
    `Phone: ${a.phone}`,
    `Email: ${a.email || "—"}`,
    `Home state: ${a.state}`,
    `Position: ${a.position}`,
    `CDL-A experience: ${a.experience}`,
    `Page: ${a.source}`,
    `Submitted: ${a.submittedAt}`,
  ].join("\n");
}

const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Group message: bold labels, Central time (MWT is in Tennessee). Telegram auto-links the phone. */
function telegramText(a: Application) {
  const time = new Date(a.submittedAt).toLocaleString("en-US", {
    timeZone: "America/Chicago",
    dateStyle: "medium",
    timeStyle: "short",
  });
  return [
    "🚛 <b>New driver application</b>",
    "",
    `👤 <b>Name:</b> ${esc(a.name)}`,
    `📞 <b>Phone:</b> ${esc(a.phone)}`,
    `✉️ <b>Email:</b> ${a.email ? esc(a.email) : "—"}`,
    `📍 <b>Home state:</b> ${esc(a.state)}`,
    `🪪 <b>Position:</b> ${esc(a.position)}`,
    `🛣 <b>CDL-A experience:</b> ${esc(a.experience)}`,
    "",
    `<i>${esc(a.source)} · ${time} CT</i>`,
  ].join("\n");
}

async function ensureOk(res: Response, channel: string) {
  if (!res.ok) throw new Error(`${channel} responded ${res.status}: ${await res.text()}`);
}

async function sendTelegram(a: Application) {
  const res = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: telegramText(a),
      parse_mode: "HTML",
      link_preview_options: { is_disabled: true },
    }),
  });
  await ensureOk(res, "Telegram");
}

async function sendEmail(a: Application) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.APPLY_EMAIL_FROM ?? "MWT Applications <onboarding@resend.dev>",
      to: process.env.APPLY_EMAIL_TO!.split(",").map((s) => s.trim()),
      reply_to: a.email || undefined,
      subject: `Driver application: ${a.name} (${a.position})`,
      text: summary(a),
    }),
  });
  await ensureOk(res, "Resend");
}

/** Generic JSON webhook — e.g. a Google Apps Script web app that appends a row to a Sheet. */
async function sendWebhook(a: Application) {
  const res = await fetch(process.env.APPLY_WEBHOOK_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(a),
  });
  await ensureOk(res, "Webhook");
}
