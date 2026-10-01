import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Blueprint } from "./Blueprint";

export function Kicker({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`kicker ${className}`}>{children}</p>;
}

export function SectionHeading({
  kicker,
  title,
  id,
}: {
  kicker: string;
  title: string;
  id?: string;
}) {
  return (
    <div>
      <Kicker>{kicker}</Kicker>
      <h2 id={id} className="display mt-4 text-[clamp(44px,6.4vw,88px)]">
        {title}
      </h2>
    </div>
  );
}

export function PrimaryLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Blueprint as="a" href={href} className={`btn btn-primary ${className}`}>
      {children}
      <ArrowRight size={20} strokeWidth={1.5} aria-hidden />
    </Blueprint>
  );
}
