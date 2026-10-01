"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check, Phone } from "lucide-react";
import { EXPERIENCE_OPTIONS, POSITION_LABELS, SITE, US_STATES, type Position } from "@/lib/site";
import { isValidUSPhone } from "@/lib/phone";
import { Blueprint } from "./Blueprint";
import { usePosition } from "./PositionContext";
import { Select } from "./Select";
import { Kicker } from "./ui";

const POSITION_OPTIONS = (Object.keys(POSITION_LABELS) as Position[]).map((p) => ({ value: p, label: POSITION_LABELS[p] }));
const EXPERIENCE_OPTS = EXPERIENCE_OPTIONS.map((o) => ({ value: o, label: o }));
const STATE_OPTIONS = US_STATES.map((s) => ({ value: s, label: s }));

type Errors = Partial<Record<"name" | "phone" | "email" | "state" | "form", string>>;

function formatPhone(raw: string) {
  let d = raw.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("1")) d = d.slice(1);
  d = d.slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

function Label({ htmlFor, children, required }: { htmlFor: string; children: string; required?: boolean }) {
  return (
    <label id={`${htmlFor}-label`} htmlFor={htmlFor} className="kicker mb-2 block !text-ink/80">
      {children}
      {required && (
        <span className="text-accent-700" aria-hidden>
          {" "}
          *
        </span>
      )}
    </label>
  );
}

function FieldError({ id, msg }: { id: string; msg?: string }) {
  if (!msg) return null;
  return (
    <p id={id} className="mt-1.5 text-[14px] text-[#b42318]">
      {msg}
    </p>
  );
}

export function ApplyForm({ kicker = "06 · Apply" }: { kicker?: string }) {
  const { position, setPosition } = usePosition();
  const [phone, setPhone] = useState("");
  const [experience, setExperience] = useState<string>(EXPERIENCE_OPTIONS[0]);
  const [homeState, setHomeState] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    const next: Errors = {};
    if (!data.name?.trim()) next.name = "Please enter your full name.";
    if (!data.phone?.trim()) next.phone = "Please enter your phone number.";
    else if (!isValidUSPhone(data.phone)) next.phone = "Enter a valid US phone number, e.g. (704) 555-0123.";
    if (!data.state) next.state = "Please select your state.";
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) next.email = "Enter a valid email address.";
    setErrors(next);
    if (Object.keys(next).length) {
      const first = Object.keys(next)[0];
      document.getElementById(first)?.focus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: location.pathname }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error);
      }
      setStatus("done");
      form.reset();
      setPhone("");
      setExperience(EXPERIENCE_OPTIONS[0]);
      setHomeState("");
    } catch (err) {
      setStatus("idle");
      setErrors({
        form:
          (err instanceof Error && err.message) ||
          `Something went wrong. Please call us at ${SITE.phoneDisplay}.`,
      });
    }
  }

  return (
    <section
      id="apply"
      aria-labelledby="apply-title"
      className="mt-[var(--section-gap)] bg-accent-900 py-[var(--section-gap)] text-bg [background-image:linear-gradient(to_right,rgb(242_242_243/0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgb(242_242_243/0.06)_1px,transparent_1px)] [background-size:48px_48px]"
    >
      <div className="wrap grid items-start gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-20" data-reveal>
        <div>
          <Kicker className="!text-accent-200">{kicker}</Kicker>
          <h2 id="apply-title" className="display mt-4 text-[clamp(64px,10vw,144px)] leading-[0.88]">
            <span className="block">Ready</span>
            <span className="block">to roll?</span>
          </h2>
          <p className="mt-8 max-w-[28rem] text-[clamp(17px,1.4vw,20px)] text-accent-100">
            Leave your details and a recruiter calls you back. Prefer to talk now? Call or text.
          </p>
          <a
            href={SITE.phoneHref}
            className="display mt-10 inline-flex items-center gap-4 text-[clamp(36px,4.4vw,60px)] leading-none hover:text-accent-200"
          >
            <Phone size={40} strokeWidth={1.5} aria-hidden className="shrink-0 text-accent-200" />
            {SITE.phoneDisplay}
          </a>
        </div>

        <Blueprint className="border border-divider bg-bg text-ink [--mark:var(--accent-200)]">
          <div className="kicker flex justify-between gap-4 border-b border-divider px-[clamp(20px,3vw,40px)] py-4 !text-ink">
            <span>Driver application</span>
            <span className="text-accent-700">Form A-01</span>
          </div>

          {status === "done" ? (
            <div className="flex flex-col items-start gap-5 p-[clamp(20px,3vw,40px)] py-16" role="status">
              <span className="flex h-14 w-14 items-center justify-center bg-accent text-bg">
                <Check size={30} strokeWidth={1.5} aria-hidden />
              </span>
              <h3 className="display text-[clamp(36px,4vw,52px)]">Application received</h3>
              <p className="text-ink/80">A recruiter will call you shortly.</p>
              <button type="button" className="btn btn-secondary" onClick={() => setStatus("idle")}>
                Send another
              </button>
            </div>
          ) : (
            <form noValidate onSubmit={onSubmit} className="grid gap-5 p-[clamp(20px,3vw,40px)]">
              {/* Honeypot: hidden from people, bots tend to fill it */}
              <div aria-hidden className="absolute -left-[9999px] h-0 overflow-hidden">
                <label>
                  Company website
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                </label>
              </div>

              <div>
                <Label htmlFor="name" required>
                  Full name
                </Label>
                <input
                  id="name"
                  name="name"
                  autoComplete="name"
                  placeholder="John Smith"
                  required
                  className="field"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-err" : undefined}
                />
                <FieldError id="name-err" msg={errors.name} />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="phone" required>
                    Phone
                  </Label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel-national"
                    placeholder="(555) 555-0123"
                    required
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    className="field"
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "phone-err" : undefined}
                  />
                  <FieldError id="phone-err" msg={errors.phone} />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="field"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-err" : undefined}
                  />
                  <FieldError id="email-err" msg={errors.email} />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="position">Position</Label>
                  <Select
                    id="position"
                    labelId="position-label"
                    name="position"
                    value={position}
                    onChange={(v) => setPosition(v as Position)}
                    options={POSITION_OPTIONS}
                  />
                </div>
                <div>
                  <Label htmlFor="experience">CDL-A experience</Label>
                  <Select
                    id="experience"
                    labelId="experience-label"
                    name="experience"
                    value={experience}
                    onChange={setExperience}
                    options={EXPERIENCE_OPTS}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="state" required>
                  Home state
                </Label>
                <Select
                  id="state"
                  labelId="state-label"
                  name="state"
                  value={homeState}
                  onChange={(v) => {
                    setHomeState(v);
                    setErrors((e) => ({ ...e, state: undefined }));
                  }}
                  options={STATE_OPTIONS}
                  placeholder="Select your state"
                  invalid={!!errors.state}
                  describedBy={errors.state ? "state-err" : undefined}
                />
                <FieldError id="state-err" msg={errors.state} />
              </div>

              {errors.form && (
                <p role="alert" className="border border-[#b42318]/40 bg-[#b42318]/5 px-4 py-3 text-[15px] text-[#b42318]">
                  {errors.form}
                </p>
              )}

              <Blueprint
                as="button"
                type="submit"
                disabled={status === "sending"}
                className="btn btn-primary mt-2 w-full disabled:cursor-wait disabled:opacity-70"
              >
                {status === "sending" ? "Sending…" : "Send application"}
                <ArrowRight size={20} strokeWidth={1.5} aria-hidden />
              </Blueprint>

              <p className="text-[13px] leading-relaxed text-ink/65">
                By sending this form you agree to be contacted by an MWT Transport recruiter by phone, text or
                email about this application, and to our{" "}
                <a href="/terms" className="text-accent-700 underline underline-offset-2 hover:text-accent">
                  Terms &amp; Conditions
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-accent-700 underline underline-offset-2 hover:text-accent">
                  Privacy Policy
                </a>
                . Message and data rates may apply. Reply STOP to opt out.
              </p>
            </form>
          )}
        </Blueprint>
      </div>
    </section>
  );
}

