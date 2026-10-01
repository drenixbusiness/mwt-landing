import Image from "next/image";
import { Phone } from "lucide-react";
import { SITE } from "@/lib/site";
import { Blueprint } from "./Blueprint";
import { PrimaryLink } from "./ui";

const PHOTO =
  "https://images.unsplash.com/photo-1631744591853-998c4308bbb0?fm=jpg&q=80&w=2000&auto=format&fit=crop";

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="wrap pt-[clamp(32px,5vw,64px)]">
      <div className="grid items-stretch gap-x-[clamp(32px,4vw,64px)] gap-y-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="flex flex-col [container-type:inline-size]">
          <div className="kicker flex items-center gap-3">
            <span aria-hidden className="h-2.5 w-2.5 shrink-0 bg-accent" />
            <span className="shrink-0">Now hiring · CDL-A</span>
            <span aria-hidden className="h-px min-w-6 flex-1 bg-divider" />
            <span className="shrink-0">USDOT {SITE.usdot}</span>
          </div>

          <h1
            id="hero-title"
            className="display mt-[clamp(24px,3vw,40px)] text-[clamp(48px,16cqi,148px)] leading-[0.88]"
          >
            <span className="block">Your miles.</span>
            <span className="block">Your home time.</span>
            <span className="block text-accent">Our word.</span>
          </h1>

          <p className="mt-8 max-w-[34rem] text-[clamp(17px,1.4vw,20px)] text-ink/80">
            MWT Transport LLC is an FMCSA-registered carrier out of Atoka, Tennessee. We hire company
            drivers and owner-operators, and we put everything you need to decide on one page.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3 lg:mt-auto lg:pt-10">
            <PrimaryLink href="#apply">Start application</PrimaryLink>
            <a href={SITE.phoneHref} className="btn btn-ghost">
              <Phone size={20} strokeWidth={1.5} aria-hidden className="text-accent" />
              {SITE.phoneDisplay}
            </a>
          </div>
        </div>

        <figure className="flex flex-col">
          <Blueprint className="duotone relative min-h-[440px] flex-1 border border-divider bg-accent-200">
            <Image
              src={PHOTO}
              alt="A semi truck on the highway"
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover grayscale"
            />
          </Blueprint>
          <figcaption className="kicker mt-4 flex flex-wrap justify-between gap-x-6 gap-y-1">
            <span>Fig. 01 — The fleet</span>
            <span>35.44° N, 89.78° W · Atoka, TN</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
