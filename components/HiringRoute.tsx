import { SectionHeading } from "./ui";

const STOPS = [
  { title: "Apply", text: "Two-minute form below, or call the recruiting line." },
  { title: "Recruiter call", text: "We go over pay, lanes and home time with you." },
  { title: "Checks + orientation", text: "Background, MVR and drug test, then orientation." },
  { title: "Dispatched", text: "Meet your dispatcher, get your truck, take your first load." },
];

const MARKERS = [
  "bg-accent border border-accent shadow-[inset_0_0_0_4px_var(--bg)]",
  "border-2 border-accent bg-bg",
  "border-2 border-accent bg-bg",
  "bg-accent-900",
];

export function HiringRoute() {
  return (
    <section id="route" aria-labelledby="route-title" className="wrap section-gap" data-reveal>
      <SectionHeading id="route-title" kicker="04 · Hiring route" title="Four stops to your first load." />

      <ol className="mt-14 grid grid-cols-[repeat(auto-fit,minmax(min(100%,250px),1fr))] gap-y-12">
        {STOPS.map((s, i) => (
          <li key={s.title} className="flex flex-col">
            <div className="flex items-center" aria-hidden>
              <span className={`h-6 w-6 shrink-0 ${MARKERS[i]}`} />
              {i < STOPS.length - 1 && <span className="mx-3 h-0 flex-1 border-t-2 border-dashed border-accent" />}
            </div>
            <div className="pr-8 pt-6">
              <p className="kicker">Stop {String(i + 1).padStart(2, "0")}</p>
              <h3 className="display mt-3 text-[clamp(28px,2.4vw,36px)]">{s.title}</h3>
              <p className="mt-3 max-w-[18rem] text-ink/75">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
