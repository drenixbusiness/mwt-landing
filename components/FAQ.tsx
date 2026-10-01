"use client";

import { useId, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { SITE } from "@/lib/site";
import { Blueprint } from "./Blueprint";
import { SectionHeading } from "./ui";

const FAQS = [
  {
    q: "What do I need to apply?",
    a: "A valid Class A CDL, a current medical card and a driving record that passes our MVR and drug test.",
  },
  {
    q: "How long does hiring take?",
    a: "A recruiter calls back after you apply. Once background, MVR and drug test clear, you go through orientation and get dispatched.",
  },
  {
    q: "Do you hire owner-operators?",
    a: "Yes. Owner-operators lease on under MWT Transport authority. Your recruiter walks you through the terms.",
  },
  { q: "Where is MWT based?", a: "69 Buck Trail Ln, Atoka, Tennessee 38004." },
  {
    q: "How do I verify MWT?",
    a: `Search USDOT #${SITE.usdot} on the FMCSA SAFER website. Our status is Active.`,
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const uid = useId();

  return (
    <section id="faq" aria-labelledby="faq-title" className="wrap section-gap" data-reveal>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-16">
        <SectionHeading id="faq-title" kicker="05 · FAQ" title="Before you call." />

        <Blueprint className="self-start border border-divider bg-bg">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            const btnId = `${uid}-q${i}`;
            const panelId = `${uid}-a${i}`;
            return (
              <div key={f.q} className="border-b border-divider last:border-b-0">
                <h3>
                  <button
                    id={btnId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="grid w-full grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-4 px-[clamp(20px,2.4vw,32px)] py-6 text-left transition-colors hover:bg-accent-100"
                  >
                    <span className="kicker">{String(i + 1).padStart(2, "0")}</span>
                    <span className="display text-[clamp(22px,2vw,28px)] leading-none">{f.q}</span>
                    {isOpen ? (
                      <Minus size={22} strokeWidth={1.5} className="text-accent" aria-hidden />
                    ) : (
                      <Plus size={22} strokeWidth={1.5} className="text-accent" aria-hidden />
                    )}
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  inert={!isOpen}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-[clamp(20px,2.4vw,32px)] pb-6 pl-[calc(clamp(20px,2.4vw,32px)+2.5rem+1rem)] text-ink/80">
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </Blueprint>
      </div>
    </section>
  );
}
