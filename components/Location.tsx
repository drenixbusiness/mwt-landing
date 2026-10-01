import { ArrowUpRight, Phone } from "lucide-react";
import { SITE } from "@/lib/site";
import { Blueprint } from "./Blueprint";
import { MapFigure } from "./MapFigure";
import { SectionHeading } from "./ui";

const DIRECTIONS = "https://www.google.com/maps/search/?api=1&query=69+Buck+Trail+Ln+Atoka+TN+38004";

export function Location() {
  return (
    <section id="location" aria-labelledby="location-title" className="wrap section-gap pb-[var(--section-gap)]" data-reveal>
      <div className="flex flex-wrap items-end justify-between gap-8">
        <SectionHeading id="location-title" kicker="07 · Location" title="Where we're based." />

        <div className="flex flex-col gap-4 sm:items-end sm:text-right">
          <address className="display text-[clamp(24px,2.4vw,32px)] leading-none not-italic">{SITE.address}</address>
          <div className="flex flex-wrap gap-3">
            <a href={SITE.phoneHref} className="btn btn-ghost !min-h-11 !text-[16px]">
              <Phone size={18} strokeWidth={1.5} aria-hidden className="text-accent" />
              {SITE.phoneDisplay}
            </a>
            <a
              href={DIRECTIONS}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary !min-h-11 !text-[16px]"
            >
              Get directions
              <ArrowUpRight size={18} strokeWidth={1.5} aria-hidden className="text-accent" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </div>
      </div>

      <figure className="mt-12">
        <Blueprint className="border border-divider">
          <MapFigure />
        </Blueprint>
        <figcaption className="kicker mt-4 flex flex-wrap justify-between gap-x-6 gap-y-1">
          <span>Fig. 02 — Principal place of business</span>
          <span>35.4140° N, 89.7614° W · Tipton County, TN</span>
        </figcaption>
      </figure>
    </section>
  );
}
