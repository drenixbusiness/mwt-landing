import { ArrowRight, Phone } from "lucide-react";
import { SITE } from "@/lib/site";

/** Fixed Call / Apply bar for phones. */
export function MobileBar({ applyHref = "/#apply" }: { applyHref?: string }) {
  return (
    <div data-mobile-bar className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-divider bg-bg pb-[env(safe-area-inset-bottom)] min-[900px]:hidden">
      <a href={SITE.phoneHref} className="btn btn-ghost min-h-[60px] border-r border-divider">
        <Phone size={20} strokeWidth={1.5} aria-hidden className="text-accent" />
        Call
      </a>
      <a href={applyHref} className="btn btn-primary min-h-[60px]">
        Apply
        <ArrowRight size={20} strokeWidth={1.5} aria-hidden />
      </a>
    </div>
  );
}
