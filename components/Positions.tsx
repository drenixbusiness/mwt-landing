"use client";

import { POSITION_LABELS, type Position } from "@/lib/site";
import { Blueprint } from "./Blueprint";
import { usePosition } from "./PositionContext";
import { PrimaryLink, SectionHeading } from "./ui";

const CONTENT: Record<
  Position,
  { tag: string; title: string; text: string; rows: [string, string][] }
> = {
  company: {
    tag: "Full-time · OTR",
    title: "Company driver",
    text: "You drive our equipment. We cover the truck, fuel, insurance and maintenance, and pay you weekly.",
    rows: [
      ["Pay", "Per mile, weekly"],
      ["Equipment", "Assigned truck"],
      ["Extra pay", "Detention + layover"],
      ["Required", "CDL-A + medical card"],
    ],
  },
  owner: {
    tag: "Lease-on",
    title: "Owner-operator",
    text: "Run your own truck under our authority. Keep your independence with steady freight and back-office support.",
    rows: [
      ["Pay", "% of gross"],
      ["Dispatch", "No forced dispatch"],
      ["Support", "Fuel card + permits"],
      ["Required", "Own truck, CDL-A"],
    ],
  },
};

const ORDER: Position[] = ["company", "owner"];

export function Positions() {
  const { position, setPosition } = usePosition();
  const c = CONTENT[position];

  return (
    <section id="positions" aria-labelledby="positions-title" className="wrap section-gap" data-reveal>
      <div className="flex flex-wrap items-end justify-between gap-8">
        <SectionHeading id="positions-title" kicker="02 · Open positions" title="Pick your seat." />

        <div role="group" aria-label="Position type" className="flex border border-divider bg-bg max-sm:w-full">
          {ORDER.map((p) => {
            const active = p === position;
            return (
              <button
                key={p}
                type="button"
                aria-pressed={active}
                aria-controls="position-card"
                onClick={() => setPosition(p)}
                className={`display min-h-12 flex-1 whitespace-nowrap px-5 text-[17px] tracking-[0.06em] transition-colors ${
                  active ? "bg-accent text-bg" : "text-ink/75 hover:bg-accent-100 hover:text-ink"
                }`}
              >
                {POSITION_LABELS[p]}
              </button>
            );
          })}
        </div>
      </div>

      <Blueprint
        id="position-card"
        aria-live="polite"
        className="mt-10 grid border border-divider bg-bg md:grid-cols-2"
      >
        <div className="flex flex-col gap-5 border-divider p-[clamp(24px,3.4vw,48px)] max-md:border-b md:border-r">
          <p className="kicker">{c.tag}</p>
          <h3 className="display text-[clamp(44px,5.6vw,80px)]">{c.title}</h3>
          <p className="max-w-[30rem] text-[18px] text-ink/80">{c.text}</p>
          <div className="mt-auto pt-6">
            <div className="flex flex-wrap items-center gap-3">
              <PrimaryLink href="#apply">Apply as {c.title.toLowerCase()}</PrimaryLink>
              {position === "owner" && (
                <a href="/offer" className="btn btn-secondary">
                  See the full offer
                </a>
              )}
            </div>
          </div>
        </div>

        <dl className="flex flex-col justify-center px-[clamp(24px,3.4vw,48px)] py-4">
          {c.rows.map(([label, value], i) => (
            <div
              key={label}
              className="grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-baseline gap-4 border-b border-divider py-6 last:border-b-0"
            >
              <span className="kicker" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
              <dt className="text-[16px] text-ink/70">{label}</dt>
              <dd className="display text-right text-[clamp(22px,2.2vw,30px)] leading-none">{value}</dd>
            </div>
          ))}
        </dl>
      </Blueprint>
    </section>
  );
}
