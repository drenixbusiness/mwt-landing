import type { Metadata } from "next";
import { CalendarClock, Fuel, Headphones, Hand, ReceiptText, ShieldCheck, Phone, type LucideIcon } from "lucide-react";
import { ApplyForm } from "@/components/ApplyForm";
import { Blueprint } from "@/components/Blueprint";
import { Footer } from "@/components/Footer";
import { MobileBar } from "@/components/MobileBar";
import { Nav } from "@/components/Nav";
import { LeaseChecklist } from "@/components/offer/LeaseChecklist";
import { OfferCalculator } from "@/components/offer/OfferCalculator";
import { PositionProvider } from "@/components/PositionContext";
import { Reveal } from "@/components/Reveal";
import { PrimaryLink, SectionHeading } from "@/components/ui";
import { FIXED_TOTAL, OFFER, usd } from "@/lib/offer";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Owner-Operator Offer — MWT Transport LLC",
  description: `Lease on with MWT Transport LLC: ${OFFER.dispatchPct}% dispatch, ${usd(FIXED_TOTAL)} flat weekly costs, no forced dispatch. Run the numbers with our settlement calculator.`,
  alternates: { canonical: "/offer" },
  openGraph: {
    title: "Owner-operator offer — MWT Transport",
    description: "Every deduction on one sheet. Run your weekly net and compare it with your current carrier.",
    url: "/offer",
  },
};

const WHY: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Hand, title: "No forced dispatch", text: "You pick the loads. Turning one down never costs you the next." },
  { icon: Headphones, title: "One dispatcher, by name", text: "Same person every week, who knows your truck, lanes and home days." },
  { icon: CalendarClock, title: "Next load booked early", text: "Your reload is lined up before you deliver, so the wheels keep turning." },
  { icon: Fuel, title: "Fuel card on day one", text: "Partner discounts set up before your first dispatch." },
  { icon: ReceiptText, title: "Itemized settlements", text: "Every line on your settlement matches a line on this page." },
  { icon: ShieldCheck, title: "Permits + IFTA handled", text: "We file the paperwork that keeps you legal and rolling." },
];

export default function OfferPage() {
  const glance = [
    ["Weekly gross", `$${OFFER.weeklyGross.min / 1000}K–$${OFFER.weeklyGross.max / 1000}K`],
    ["Rate per mile", `${usd(OFFER.rpm.min, 2)}–${usd(OFFER.rpm.max, 2)}`],
    ["Dispatch fee", `${OFFER.dispatchPct}%`],
    ["Fixed weekly costs", usd(FIXED_TOTAL)],
  ];

  return (
    <PositionProvider initial="owner">
      <Nav applyHref="#apply" />
      <main id="main">
        {/* 01 · Hero */}
        <section aria-labelledby="offer-title" className="wrap pt-[clamp(32px,5vw,64px)]" data-print="hide">
          <div className="grid items-stretch gap-x-[clamp(32px,4vw,64px)] gap-y-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            <div className="flex flex-col [container-type:inline-size]">
              <div className="kicker flex items-center gap-3">
                <span aria-hidden className="h-2.5 w-2.5 shrink-0 bg-accent" />
                <span className="shrink-0">Owner-operator offer · Lease-on</span>
                <span aria-hidden className="h-px min-w-6 flex-1 bg-divider" />
                <span className="shrink-0 max-sm:hidden">USDOT {SITE.usdot}</span>
              </div>
              <h1
                id="offer-title"
                className="display mt-[clamp(24px,3vw,40px)] text-[clamp(48px,16cqi,148px)] leading-[0.88]"
              >
                <span className="block">Your truck.</span>
                <span className="block">Our authority.</span>
                <span className="block text-accent">No surprises.</span>
              </h1>
              <p className="mt-8 max-w-[34rem] text-[clamp(17px,1.4vw,20px)] text-ink/80">
                Lease on with MWT Transport LLC and see every deduction before you sign: one percentage, three flat
                weekly costs, nothing hidden in the settlement.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-3 lg:mt-auto lg:pt-10">
                <PrimaryLink href="#calculator">Calculate your net</PrimaryLink>
                <a href={SITE.phoneHref} className="btn btn-ghost">
                  <Phone size={20} strokeWidth={1.5} aria-hidden className="text-accent" />
                  {SITE.phoneDisplay}
                </a>
              </div>
            </div>

            <Blueprint className="flex flex-col border border-divider bg-bg">
              <div className="kicker flex justify-between gap-4 border-b border-divider px-6 py-4 !text-ink">
                <span>The offer at a glance</span>
                <span className="text-accent-700">Sheet O-01</span>
              </div>
              <dl className="grid flex-1 grid-cols-2 gap-px bg-divider">
                {glance.map(([label, value], i) => (
                  <div key={label} className="flex min-h-[150px] flex-col justify-between gap-6 bg-bg p-6">
                    <dt className="kicker">
                      {String(i + 1).padStart(2, "0")} · {label}
                    </dt>
                    <dd className="display text-[clamp(28px,3vw,44px)] leading-[0.95]">{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="border-t border-divider px-6 py-4 text-[14px] text-ink/70">
                Gross and rate ranges are typical weeks, not a guarantee. Deductions are exact.
              </p>
            </Blueprint>
          </div>
        </section>

        {/* 02 · Costs */}
        <section id="costs" aria-labelledby="costs-title" className="wrap section-gap" data-reveal data-print="hide">
          <SectionHeading id="costs-title" kicker="02 · What it costs" title="What leaves your settlement." />
          <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <Blueprint className="border border-divider bg-bg">
              <div className="kicker flex justify-between gap-4 border-b border-divider px-[clamp(20px,3vw,36px)] py-4 !text-ink">
                <span>Weekly deductions</span>
                <span className="text-accent-700">Itemized</span>
              </div>
              <dl className="px-[clamp(20px,3vw,36px)]">
                <CostRow n={1} label="Dispatch fee" note="Of gross revenue" value={`${OFFER.dispatchPct}%`} />
                {OFFER.fixedWeekly.map((f, i) => (
                  <CostRow key={f.label} n={i + 2} label={f.label} note={f.note} value={`${usd(f.amount)}/wk`} />
                ))}
              </dl>
              <div className="flex items-baseline justify-between gap-4 border-t border-divider bg-accent-100 px-[clamp(20px,3vw,36px)] py-5">
                <span className="kicker !text-ink">Total every week</span>
                <span className="display text-[clamp(30px,3.4vw,44px)] leading-none text-accent-700">
                  {usd(FIXED_TOTAL)} + {OFFER.dispatchPct}%
                </span>
              </div>
            </Blueprint>

            <Blueprint className="border border-divider bg-bg">
              <div className="kicker border-b border-divider px-[clamp(20px,3vw,36px)] py-4 !text-ink">
                What we don&apos;t charge
              </div>
              <ul className="px-[clamp(20px,3vw,36px)]">
                {OFFER.notCharged.map((item) => (
                  <li key={item} className="flex items-baseline justify-between gap-4 border-b border-divider py-5 last:border-b-0">
                    <span className="text-[17px] text-ink/80">{item}</span>
                    <span className="display text-[30px] leading-none text-accent">$0</span>
                  </li>
                ))}
              </ul>
            </Blueprint>
          </div>
        </section>

        {/* 03 · Why */}
        <section id="why" aria-labelledby="why-title" className="wrap section-gap" data-reveal data-print="hide">
          <SectionHeading id="why-title" kicker="03 · Why lease on" title="Run your business, not paperwork." />
          <ul className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-6">
            {WHY.map(({ icon: Icon, title, text }, i) => (
              <Blueprint
                as="li"
                key={title}
                className="flex flex-col gap-4 border border-divider bg-bg p-[clamp(24px,2.6vw,36px)] transition-colors hover:bg-accent-100"
              >
                <div className="flex items-start justify-between">
                  <Icon size={32} strokeWidth={1.5} className="text-accent" aria-hidden />
                  <span className="kicker" aria-hidden>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="display mt-6 text-[clamp(28px,2.4vw,34px)]">{title}</h3>
                <p className="text-ink/75">{text}</p>
              </Blueprint>
            ))}
          </ul>
        </section>

        {/* 04–05 · Calculator + carrier comparison */}
        <OfferCalculator />

        {/* 06 · Checklist */}
        <LeaseChecklist />

        {/* 07 · Apply */}
        <div data-print="hide">
          <ApplyForm kicker="07 · Lease on" />
        </div>
      </main>
      <Footer />
      <MobileBar applyHref="#apply" />
      <Reveal />
    </PositionProvider>
  );
}

function CostRow({ n, label, note, value }: { n: number; label: string; note: string; value: string }) {
  return (
    <div className="grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-baseline gap-4 border-b border-divider py-5 last:border-b-0">
      <span className="kicker" aria-hidden>
        {String(n).padStart(2, "0")}
      </span>
      <div>
        <dt className="text-[17px] font-semibold">{label}</dt>
        <p className="text-[14px] text-ink/65">{note}</p>
      </div>
      <dd className="display text-right text-[clamp(24px,2.4vw,32px)] leading-none">{value}</dd>
    </div>
  );
}
