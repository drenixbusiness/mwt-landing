import { Banknote, Clock, Fuel, Headphones, House, Wrench, type LucideIcon } from "lucide-react";
import { Blueprint } from "./Blueprint";
import { SectionHeading } from "./ui";

const BENEFITS: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Banknote, title: "Weekly pay", text: "Direct deposit every week with a clear settlement statement." },
  { icon: House, title: "Planned home time", text: "Tell us your schedule. Dispatch plans loads around it." },
  { icon: Headphones, title: "Dispatch that answers", text: "One dispatcher who knows your truck, lanes and preferences." },
  { icon: Wrench, title: "Maintained equipment", text: "Repairs handled fast so you lose less time off the road." },
  { icon: Fuel, title: "Fuel card", text: "Discounts at partner stops, set up before your first load." },
  { icon: Clock, title: "Fast onboarding", text: "Apply today, hear from a recruiter the same day." },
];

export function Benefits() {
  return (
    <section id="benefits" aria-labelledby="benefits-title" className="wrap section-gap" data-reveal>
      <SectionHeading id="benefits-title" kicker="03 · Benefits" title="What you get on day one." />

      <ul className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-6">
        {BENEFITS.map(({ icon: Icon, title, text }, i) => (
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
  );
}
