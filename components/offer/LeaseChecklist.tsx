"use client";

import { useEffect, useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { Blueprint } from "../Blueprint";
import { SectionHeading } from "../ui";

const ITEMS = [
  { title: "Class A CDL", text: "Valid, with the endorsements for the freight you plan to haul." },
  { title: "DOT medical card", text: "Current, not expiring in the next 30 days." },
  { title: "Truck title or lease", text: "Proof you own the truck or have the right to operate it." },
  { title: "Annual DOT inspection", text: "Report dated within the last 12 months." },
  { title: "Form 2290 receipt", text: "Stamped Schedule 1 for heavy vehicle use tax." },
  { title: "Truck registration", text: "Current cab card for the power unit." },
  { title: "W-9", text: "For your business or as an individual — tells us how to pay you." },
  { title: "Bank details", text: "Account for weekly direct deposit of your settlement." },
];

const KEY = "mwt-lease-checklist";

export function LeaseChecklist() {
  const [done, setDone] = useState<boolean[]>(() => ITEMS.map(() => false));

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? "null");
      if (Array.isArray(saved) && saved.length === ITEMS.length) setDone(saved.map(Boolean));
    } catch {}
  }, []);

  function update(next: boolean[]) {
    setDone(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
  }

  const count = done.filter(Boolean).length;
  const ready = count === ITEMS.length;

  return (
    <section id="checklist" aria-labelledby="checklist-title" className="wrap section-gap" data-reveal data-print="hide">
      <div className="flex flex-wrap items-end justify-between gap-8">
        <div>
          <SectionHeading id="checklist-title" kicker="06 · Lease-on kit" title="Pack your paperwork." />
          <p className="mt-6 max-w-[36rem] text-[18px] text-ink/80">
            Tick off what you already have. Your progress stays saved on this device, so you can come back to it.
          </p>
        </div>

        <div className="w-full max-w-[360px]">
          <div className="flex items-baseline justify-between">
            <span className="kicker">{ready ? "Ready to lease on" : "Documents ready"}</span>
            <span className="display text-[32px] leading-none tabular-nums" aria-live="polite">
              {count}/{ITEMS.length}
            </span>
          </div>
          <div className="mt-3 grid grid-cols-8 gap-1" aria-hidden>
            {done.map((d, i) => (
              <span key={i} className={`h-3 border ${d ? "border-accent bg-accent" : "border-divider bg-bg"}`} />
            ))}
          </div>
          {count > 0 && (
            <button
              type="button"
              onClick={() => update(ITEMS.map(() => false))}
              className="mt-3 inline-flex items-center gap-1.5 text-[13px] text-ink/60 hover:text-accent-700"
            >
              <RotateCcw size={14} strokeWidth={1.5} aria-hidden />
              Reset
            </button>
          )}
        </div>
      </div>

      <Blueprint as="ul" className="mt-12 grid border border-divider bg-divider gap-px sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((item, i) => (
          <li key={item.title} className="bg-bg">
            <label
              className={`flex h-full cursor-pointer flex-col gap-3 p-6 transition-colors hover:bg-accent-100 ${
                done[i] ? "bg-accent-100" : ""
              }`}
            >
              <span className="flex items-center justify-between">
                <span className="kicker">{String(i + 1).padStart(2, "0")}</span>
                <input
                  type="checkbox"
                  checked={done[i]}
                  onChange={(e) => update(done.map((d, j) => (j === i ? e.target.checked : d)))}
                  className="peer sr-only"
                />
                <span
                  aria-hidden
                  className={`flex h-6 w-6 items-center justify-center border peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent ${
                    done[i] ? "border-accent bg-accent text-bg" : "border-ink/40 bg-white"
                  }`}
                >
                  {done[i] && <Check size={16} strokeWidth={2} />}
                </span>
              </span>
              <span className={`display text-[24px] ${done[i] ? "text-accent-700" : ""}`}>{item.title}</span>
              <span className="text-[15px] text-ink/70">{item.text}</span>
            </label>
          </li>
        ))}
      </Blueprint>
    </section>
  );
}
