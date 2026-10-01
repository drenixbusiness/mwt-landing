import type { ReactNode } from "react";
import { Blueprint } from "./Blueprint";
import { Footer } from "./Footer";
import { MobileBar } from "./MobileBar";
import { Nav } from "./Nav";
import { Kicker } from "./ui";

export function LegalPage({
  title,
  sheet,
  updated,
  intro,
  children,
}: {
  title: string;
  sheet: string;
  updated: string;
  intro: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <Nav />
      <main id="main" className="wrap pb-[var(--section-gap)] pt-[clamp(40px,6vw,80px)]">
        <Kicker>Legal · {sheet}</Kicker>
        <h1 className="display mt-4 text-[clamp(48px,7vw,104px)]">{title}</h1>
        <p className="kicker mt-6 !text-ink/70">Last updated: {updated}</p>

        <Blueprint className="mt-12 border border-divider bg-bg">
          <div className="kicker flex flex-wrap justify-between gap-4 border-b border-divider px-[clamp(20px,3.4vw,48px)] py-4 !text-ink">
            <span>MWT Transport LLC · USDOT 4041419</span>
            <span className="text-accent-700">{sheet}</span>
          </div>
          <div className="max-w-[52rem] px-[clamp(20px,3.4vw,48px)] py-[clamp(28px,4vw,56px)]">
            <div className="text-[18px] text-ink/85">{intro}</div>
            <ol className="mt-4">{children}</ol>
          </div>
        </Blueprint>
      </main>
      <Footer />
      <MobileBar />
    </>
  );
}

export function LegalSection({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <li className="border-t border-divider pt-8 mt-8 first:mt-6">
      <h2 className="flex items-baseline gap-4">
        <span className="kicker w-8 shrink-0">{String(n).padStart(2, "0")}</span>
        <span className="display text-[clamp(26px,2.6vw,34px)]">{title}</span>
      </h2>
      <div className="mt-4 space-y-4 pl-12 text-ink/80 max-sm:pl-0 [&_a]:text-accent-700 [&_a]:underline [&_a]:underline-offset-2 [&_li]:pl-1 [&_strong]:text-ink [&_ul]:list-[square] [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul_li]:marker:text-accent">
        {children}
      </div>
    </li>
  );
}
