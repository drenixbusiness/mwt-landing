"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { Check, Link2, Printer } from "lucide-react";
import { FIXED_TOTAL, OFFER, usd } from "@/lib/offer";
import { Blueprint } from "../Blueprint";
import { SectionHeading } from "../ui";

type Inputs = {
  miles: number;
  rpm: number;
  truck: number;
  weeks: number;
  fuel: boolean;
  mpg: number;
  diesel: number;
  theirFee: number;
  theirFixed: number;
};

const LIMITS = {
  miles: { min: 2000, max: 5000, step: 100 },
  rpm: { min: OFFER.rpm.min, max: OFFER.rpm.max, step: 0.05 },
  truck: { min: 0, max: 1500, step: 25 },
  weeks: { min: 36, max: 50, step: 1 },
  mpg: { min: 5, max: 9, step: 0.1 },
  diesel: { min: 3, max: 7, step: 0.05 },
  theirFee: { min: 5, max: 35, step: 1 },
  theirFixed: { min: 0, max: 1500, step: 25 },
} as const;

const DEFAULTS: Inputs = {
  miles: 3500,
  rpm: 2.75,
  truck: 0,
  weeks: 46,
  fuel: false,
  mpg: 6.5,
  diesel: 3.8,
  theirFee: 25,
  theirFixed: 750,
};

// Short query keys for shareable estimate links
const PARAMS: Record<Exclude<keyof Inputs, "fuel">, string> = {
  miles: "mi",
  rpm: "rpm",
  truck: "pay",
  weeks: "wk",
  mpg: "mpg",
  diesel: "dsl",
  theirFee: "fee",
  theirFixed: "fix",
};

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

function readParams(): Partial<Inputs> {
  const q = new URLSearchParams(location.search);
  const out: Partial<Inputs> = {};
  for (const [key, p] of Object.entries(PARAMS) as [keyof typeof PARAMS, string][]) {
    const v = Number(q.get(p));
    if (q.has(p) && Number.isFinite(v)) out[key] = clamp(v, LIMITS[key].min, LIMITS[key].max);
  }
  if (q.get("fuel") === "1") out.fuel = true;
  return out;
}

export function OfferCalculator() {
  const [v, setV] = useState<Inputs>(DEFAULTS);
  const [copied, setCopied] = useState<"idle" | "ok" | "fail">("idle");
  const set = <K extends keyof Inputs>(k: K, val: Inputs[K]) => setV((s) => ({ ...s, [k]: val }));

  // Prefill from a shared link, then tidy the address bar
  useEffect(() => {
    const fromUrl = readParams();
    if (Object.keys(fromUrl).length) {
      setV((s) => ({ ...s, ...fromUrl }));
      history.replaceState(history.state, "", location.pathname);
      setTimeout(() => document.getElementById("calculator")?.scrollIntoView({ behavior: "instant" }), 0);
    }
  }, []);

  const gross = v.miles * v.rpm;
  const dispatch = (gross * OFFER.dispatchPct) / 100;
  const fuel = v.fuel ? (v.miles / v.mpg) * v.diesel : 0;
  const net = gross - dispatch - FIXED_TOTAL - fuel - v.truck;
  const perMile = net / v.miles;
  const homeWeeks = 52 - v.weeks;

  // Carrier comparison: before fuel and truck payment, which are the same either way
  const mwtBase = gross - dispatch - FIXED_TOTAL;
  const theirBase = gross - (gross * v.theirFee) / 100 - v.theirFixed;
  const diff = mwtBase - theirBase;

  async function copyLink() {
    const q = new URLSearchParams();
    for (const [key, p] of Object.entries(PARAMS) as [keyof typeof PARAMS, string][]) q.set(p, String(v[key]));
    if (v.fuel) q.set("fuel", "1");
    const url = `${location.origin}/offer?${q}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied("ok");
    } catch {
      setCopied("fail");
      window.prompt("Copy this link:", url);
    }
    setTimeout(() => setCopied("idle"), 2500);
  }

  const segments = [
    { label: "Your net", value: Math.max(0, net), cls: "bg-accent" },
    { label: `Dispatch ${OFFER.dispatchPct}%`, value: dispatch, cls: "bg-accent-700" },
    { label: "Fixed weekly", value: FIXED_TOTAL, cls: "bg-accent-200" },
    ...(v.fuel ? [{ label: "Fuel", value: fuel, cls: "hatch-accent" }] : []),
    ...(v.truck ? [{ label: "Truck payment", value: v.truck, cls: "hatch-ink" }] : []),
  ];
  const segTotal = segments.reduce((s, x) => s + x.value, 0) || 1;

  return (
    <>
      <section id="calculator" aria-labelledby="calc-title" className="wrap section-gap" data-reveal>
        <div data-print="hide">
          <SectionHeading id="calc-title" kicker="04 · Earnings calculator" title="Run your numbers." />
          <p className="mt-6 max-w-[38rem] text-[18px] text-ink/80">
            Set your miles and rate. Add fuel and your truck note if you want the real take-home. The sheet on the
            right is laid out the way your weekly settlement will be.
          </p>
        </div>

        <div className="mt-12 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <Blueprint data-print="hide" className="border border-divider bg-bg">
            <div className="kicker border-b border-divider px-[clamp(20px,3vw,36px)] py-4 !text-ink">Inputs</div>
            <div className="grid gap-7 p-[clamp(20px,3vw,36px)]">
              <Slider label="Miles per week" k="miles" v={v} set={set} fmt={(n) => `${n.toLocaleString()} mi`} />
              <Slider label="Rate per mile" k="rpm" v={v} set={set} fmt={(n) => usd(n, 2)} />
              <Slider
                label="Truck payment / week"
                k="truck"
                v={v}
                set={set}
                fmt={(n) => usd(n)}
                hint="Leave at $0 if your truck is paid off."
              />
              <Slider
                label="Weeks on the road / year"
                k="weeks"
                v={v}
                set={set}
                fmt={(n) => `${n} wk`}
                hint={`Leaves ${homeWeeks} week${homeWeeks === 1 ? "" : "s"} of home time.`}
              />

              <div className="border-t border-divider pt-6">
                <Switch checked={v.fuel} onChange={(c) => set("fuel", c)} label="Include fuel">
                  See your net after fuel, based on your truck&apos;s MPG.
                </Switch>
                {v.fuel && (
                  <div className="mt-6 grid gap-7">
                    <Slider label="Fuel economy" k="mpg" v={v} set={set} fmt={(n) => `${n.toFixed(1)} mpg`} />
                    <Slider label="Fuel price" k="diesel" v={v} set={set} fmt={(n) => `${usd(n, 2)}/gal`} />
                  </div>
                )}
              </div>
            </div>
          </Blueprint>

          <Blueprint className="border border-divider bg-bg lg:sticky lg:top-[calc(var(--nav-h)+24px)]">
            <div className="kicker flex justify-between gap-4 border-b border-divider px-[clamp(20px,3vw,36px)] py-4 !text-ink">
              <span>Sample settlement · MWT Transport LLC</span>
              <span className="text-accent-700">Form S-01</span>
            </div>

            <div className="p-[clamp(20px,3vw,36px)]">
              <p className="kicker">Estimated weekly net{v.fuel ? "" : ", before fuel"}</p>
              <p
                className={`display mt-2 text-[clamp(56px,7vw,96px)] leading-none ${net < 0 ? "text-[#b42318]" : ""}`}
                aria-live="polite"
              >
                {usd(net)}
              </p>
              <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-[15px] text-ink/75">
                <div>
                  <dt className="inline">Per year ({v.weeks} wk): </dt>
                  <dd className="inline font-semibold text-ink">{usd(net * v.weeks)}</dd>
                </div>
                <div>
                  <dt className="inline">Net per mile: </dt>
                  <dd className="inline font-semibold text-ink">{usd(perMile, 2)}</dd>
                </div>
              </dl>

              {/* Where each dollar of gross goes */}
              <div className="mt-8">
                <p className="kicker !text-ink/70">Where every dollar of gross goes</p>
                <div className="mt-3 flex h-6 border border-divider" role="img" aria-label={segments.map((s) => `${s.label} ${usd(s.value)}`).join(", ")}>
                  {segments.map((s) => (
                    <div
                      key={s.label}
                      className={`${s.cls} h-full transition-[width] duration-300 [&:not(:last-child)]:border-r [&:not(:last-child)]:border-bg`}
                      style={{ width: `${(s.value / segTotal) * 100}%` }}
                    />
                  ))}
                </div>
                <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] text-ink/75">
                  {segments.map((s) => (
                    <li key={s.label} className="flex items-center gap-2">
                      <span aria-hidden className={`h-3 w-3 border border-divider ${s.cls}`} />
                      {s.label} · {Math.round((s.value / segTotal) * 100)}%
                    </li>
                  ))}
                </ul>
              </div>

              <dl className="mt-8 border-t border-divider">
                <Line label={`Gross (${v.miles.toLocaleString()} mi × ${usd(v.rpm, 2)})`} value={usd(gross)} strong />
                <Line label={`Dispatch fee (${OFFER.dispatchPct}%)`} value={`−${usd(dispatch)}`} />
                {OFFER.fixedWeekly.map((f) => (
                  <Line key={f.label} label={f.label} value={`−${usd(f.amount)}`} />
                ))}
                {v.fuel && (
                  <Line
                    label={`Fuel (${Math.round(v.miles / v.mpg).toLocaleString()} gal × ${usd(v.diesel, 2)})`}
                    value={`−${usd(fuel)}`}
                  />
                )}
                {v.truck > 0 && <Line label="Truck payment" value={`−${usd(v.truck)}`} />}
                <Line label={v.fuel ? "Net" : "Net before fuel"} value={usd(net)} strong accent />
              </dl>

              <div data-print="hide" className="mt-8 flex flex-wrap gap-3">
                <button type="button" onClick={copyLink} className="btn btn-secondary !min-h-11 !text-[16px]">
                  {copied === "ok" ? (
                    <Check size={18} strokeWidth={1.5} aria-hidden className="text-accent" />
                  ) : (
                    <Link2 size={18} strokeWidth={1.5} aria-hidden className="text-accent" />
                  )}
                  {copied === "ok" ? "Link copied" : "Copy link to this estimate"}
                </button>
                <button type="button" onClick={() => window.print()} className="btn btn-ghost !min-h-11 !text-[16px]">
                  <Printer size={18} strokeWidth={1.5} aria-hidden className="text-accent" />
                  Print / save PDF
                </button>
              </div>
              <span className="sr-only" role="status">
                {copied === "ok" ? "Link copied to clipboard" : ""}
              </span>

              <p className="mt-6 text-[13px] text-ink/60">
                Estimate only. Actual pay depends on lanes, loads and your truck. Fixed deductions are{" "}
                {usd(FIXED_TOTAL)} a week plus {OFFER.dispatchPct}% dispatch.
              </p>
            </div>
          </Blueprint>
        </div>
      </section>

      <section id="compare" aria-labelledby="compare-title" className="wrap section-gap" data-reveal data-print="hide">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-16">
          <div>
            <SectionHeading id="compare-title" kicker="05 · Switch check" title="Stack us against your carrier." />
            <p className="mt-6 max-w-[30rem] text-[18px] text-ink/80">
              Same miles and rate as the calculator. Enter what your current carrier takes each week and see the
              difference in plain dollars.
            </p>
            <div className="mt-10 grid gap-7">
              <Slider label="Their % of gross" k="theirFee" v={v} set={set} fmt={(n) => `${n}%`} />
              <Slider
                label="Their fixed charges / week"
                k="theirFixed"
                v={v}
                set={set}
                fmt={(n) => usd(n)}
                hint="Insurance, ELD, trailer rental, escrow and any other weekly charges."
              />
            </div>
          </div>

          <Blueprint className="self-start border border-divider bg-bg">
            <div className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)] border-b border-divider">
              <span className="kicker px-[clamp(16px,2.4vw,32px)] py-4 !text-ink">Per week</span>
              <span className="kicker border-l border-divider px-4 py-4 text-right !text-ink/70">Your carrier</span>
              <span className="kicker flex items-center justify-end gap-2 border-l border-divider bg-accent-100 px-4 py-4 text-right">
                <span aria-hidden className="h-2.5 w-2.5 bg-accent" />
                MWT
              </span>
            </div>
            {[
              ["Gross", usd(gross), usd(gross)],
              ["Percentage fee", `−${usd((gross * v.theirFee) / 100)}`, `−${usd(dispatch)}`],
              ["Fixed charges", `−${usd(v.theirFixed)}`, `−${usd(FIXED_TOTAL)}`],
              ["Net before fuel & truck", usd(theirBase), usd(mwtBase)],
            ].map(([label, theirs, ours], i, arr) => {
              const last = i === arr.length - 1;
              return (
                <div
                  key={label}
                  className={`grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)] border-b border-divider ${
                    last ? "display text-[clamp(20px,2vw,26px)]" : "text-[16px]"
                  }`}
                >
                  <span className={`px-[clamp(16px,2.4vw,32px)] py-4 ${last ? "" : "text-ink/75"}`}>{label}</span>
                  <span className="border-l border-divider px-4 py-4 text-right tabular-nums">{theirs}</span>
                  <span className="border-l border-divider bg-accent-100 px-4 py-4 text-right font-semibold tabular-nums">
                    {ours}
                  </span>
                </div>
              );
            })}
            <div className={`p-[clamp(20px,3vw,36px)] ${diff >= 0 ? "bg-accent-900 text-bg" : ""}`} aria-live="polite">
              {diff >= 0 ? (
                <>
                  <p className="kicker !text-accent-200">With MWT you keep</p>
                  <p className="display mt-2 text-[clamp(40px,5vw,64px)] leading-none">+{usd(diff)} / week</p>
                  <p className="mt-2 text-accent-100">
                    That&apos;s {usd(diff * v.weeks)} more over {v.weeks} weeks on the road.
                  </p>
                </>
              ) : (
                <>
                  <p className="kicker">Honest answer</p>
                  <p className="display mt-2 text-[clamp(28px,3vw,40px)] leading-tight">
                    Your current deal nets {usd(-diff)} more a week.
                  </p>
                  <p className="mt-2 text-ink/75">
                    Call us anyway. We&apos;ll walk through lanes, rates and home time — not just fees.
                  </p>
                </>
              )}
            </div>
          </Blueprint>
        </div>
      </section>
    </>
  );
}

function Slider<K extends keyof typeof LIMITS>({
  label,
  k,
  v,
  set,
  fmt,
  hint,
}: {
  label: string;
  k: K;
  v: Inputs;
  set: (k: K, val: number) => void;
  fmt: (n: number) => string;
  hint?: string;
}) {
  const id = useId();
  const { min, max, step } = LIMITS[k];
  const value = v[k] as number;
  const fill = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="kicker !text-ink/80">
          {label}
        </label>
        <output htmlFor={id} className="display text-[26px] leading-none tabular-nums">
          {fmt(value)}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => set(k, Number(e.target.value))}
        aria-valuetext={fmt(value)}
        aria-describedby={hint ? `${id}-hint` : undefined}
        className="range mt-2"
        style={{ "--fill": `${fill}%` } as React.CSSProperties}
      />
      <div className="flex justify-between text-[12px] text-ink/55" aria-hidden>
        <span>{fmt(min)}</span>
        <span>{fmt(max)}</span>
      </div>
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-[14px] text-ink/65">
          {hint}
        </p>
      )}
    </div>
  );
}

function Switch({
  checked,
  onChange,
  label,
  children,
}: {
  checked: boolean;
  onChange: (c: boolean) => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-start gap-4 text-left"
    >
      <span
        aria-hidden
        className={`relative mt-0.5 h-6 w-11 shrink-0 border transition-colors ${
          checked ? "border-accent bg-accent" : "border-divider bg-white"
        }`}
      >
        <span
          className={`absolute top-[3px] h-4 w-4 transition-[left] ${checked ? "left-[22px] bg-bg" : "left-[3px] bg-accent"}`}
        />
      </span>
      <span>
        <span className="kicker block !text-ink">{label}</span>
        <span className="mt-1 block text-[14px] text-ink/65">{children}</span>
      </span>
    </button>
  );
}

function Line({ label, value, strong, accent }: { label: string; value: string; strong?: boolean; accent?: boolean }) {
  return (
    <div
      className={`flex items-baseline justify-between gap-4 border-b border-divider py-3 last:border-b-0 ${
        accent ? "bg-accent-100 px-3 -mx-3" : ""
      }`}
    >
      <dt className={strong ? "font-semibold" : "text-ink/75"}>{label}</dt>
      <dd className={`tabular-nums ${strong ? "display text-[24px] leading-none" : ""} ${accent ? "text-accent-700" : ""}`}>
        {value}
      </dd>
    </div>
  );
}
