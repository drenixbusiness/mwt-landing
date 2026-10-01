import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { SITE } from "@/lib/site";
import { Blueprint } from "./Blueprint";

function Cell({ n, label, children }: { n: string; label: string; children: ReactNode }) {
  return (
    <div className="flex min-h-[148px] flex-col gap-5 bg-bg p-[clamp(20px,2.4vw,32px)]">
      <dt className="kicker">
        {n} · {label}
      </dt>
      <dd className="mt-auto">{children}</dd>
    </div>
  );
}

const big = "display text-[clamp(32px,3.4vw,46px)] leading-[0.95]";
const plain = "text-[19px] leading-snug";

export function CompanyRecord() {
  return (
    <section id="company" aria-labelledby="company-title" className="wrap section-gap" data-reveal>
      <Blueprint className="border border-divider bg-bg">
        <div className="kicker flex flex-wrap border-b border-divider text-ink">
          <h2 id="company-title" className="flex-[1_1_320px] px-[clamp(20px,2.4vw,32px)] py-4">
            Company record — Public FMCSA data
          </h2>
          <span className="flex-[0_0_auto] border-l border-divider px-6 py-4 max-sm:border-l-0 max-sm:border-t max-sm:basis-1/2">
            Sheet 01
          </span>
          <span className="flex flex-[0_0_auto] items-center gap-2 border-l border-divider px-6 py-4 text-accent-700 max-sm:basis-1/2 max-sm:border-t">
            <span aria-hidden className="h-2.5 w-2.5 bg-accent" />
            Status: Active
          </span>
        </div>

        <dl className="grid gap-px bg-divider sm:grid-cols-2 lg:grid-cols-3">
          <Cell n="01" label="Legal name">
            <span className={big}>MWT Transport LLC</span>
          </Cell>
          <Cell n="02" label="USDOT number">
            <span className={big}>#{SITE.usdot}</span>
          </Cell>
          <Cell n="03" label="Business phone">
            <a href={SITE.phoneHref} className={`${big} hover:text-accent`}>
              {SITE.phoneDisplay}
            </a>
          </Cell>
          <Cell n="04" label="Principal place of business">
            <address className={`${plain} not-italic`}>{SITE.address}</address>
          </Cell>
          <Cell n="05" label="Mailing address">
            <address className={`${plain} not-italic`}>{SITE.mailingAddress}</address>
          </Cell>
          <Cell n="06" label="Verify">
            <a
              href={SITE.saferUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${plain} font-semibold text-accent-700 underline decoration-accent/40 underline-offset-4 hover:decoration-accent`}
            >
              Look up USDOT {SITE.usdot} on FMCSA SAFER
              <ArrowUpRight size={20} strokeWidth={1.5} aria-hidden className="ml-1 inline align-[-3px]" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </Cell>
        </dl>

        <p className="border-t border-divider px-[clamp(20px,2.4vw,32px)] py-4 text-[14px] text-ink/70">
          Every value on this sheet matches the carrier&apos;s public USDOT record.
        </p>
      </Blueprint>
    </section>
  );
}
