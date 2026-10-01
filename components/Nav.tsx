"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { Blueprint } from "./Blueprint";

const LINKS = [
  { href: "/#company", label: "Company" },
  { href: "/#positions", label: "Positions" },
  { href: "/#benefits", label: "Benefits" },
  { href: "/#route", label: "Hiring route" },
  { href: "/#faq", label: "FAQ" },
  { href: "/offer", label: "Owner-op offer" },
];

export function Nav({ applyHref = "/#apply" }: { applyHref?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth >= 1080 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-divider bg-bg">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:bg-accent focus:px-4 focus:py-2 focus:text-bg"
      >
        Skip to content
      </a>
      <nav aria-label="Primary" className="wrap flex h-[var(--nav-h)] items-center gap-6">
        <a href="/#top" className="flex items-center" aria-label="MWT Transport LLC — back to top">
          <span className="display whitespace-nowrap text-[22px] leading-none tracking-[0.02em] sm:text-[24px]">MWT Transport LLC</span>
        </a>

        <ul className="ml-auto hidden items-center gap-1 min-[1080px]:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="display block px-3 py-2 text-[17px] tracking-[0.06em] text-ink/80 transition-colors hover:bg-accent-100 hover:text-ink"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <Blueprint
          as="a"
          href={applyHref}
          className="btn btn-primary ml-auto !min-h-11 !px-4 !text-[16px] max-sm:!hidden min-[1080px]:ml-3"
        >
          Apply
          <ArrowRight size={18} strokeWidth={1.5} aria-hidden />
        </Blueprint>

        <button
          type="button"
          className="-mr-2 ml-auto inline-flex h-11 w-11 sm:ml-0 items-center justify-center hover:bg-accent-100 min-[1080px]:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
        </button>
      </nav>

      <div
        id="mobile-menu"
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-divider bg-bg min-[1080px]:hidden"
      >
        <ul className="wrap py-2">
          {LINKS.map((l, i) => (
            <li key={l.href} className="border-b border-divider last:border-b-0">
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-4 py-4 hover:bg-accent-100"
              >
                <span className="kicker w-6">{String(i + 1).padStart(2, "0")}</span>
                <span className="display text-[24px] tracking-[0.04em]">{l.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
