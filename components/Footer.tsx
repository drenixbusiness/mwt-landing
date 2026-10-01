import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-divider bg-bg pb-[calc(76px+env(safe-area-inset-bottom))] min-[900px]:pb-0">
      <div className="wrap kicker flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-8 !text-ink/70">
        <span>© 2026 {SITE.name}</span>
        <span>USDOT #{SITE.usdot}</span>
        <span>{SITE.address}</span>
        <nav aria-label="Legal" className="flex gap-6">
          <a href="/privacy" className="underline-offset-4 hover:text-accent-700 hover:underline">
            Privacy policy
          </a>
          <a href="/terms" className="underline-offset-4 hover:text-accent-700 hover:underline">
            Terms &amp; conditions
          </a>
        </nav>
      </div>
    </footer>
  );
}
