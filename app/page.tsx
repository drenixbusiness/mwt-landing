import { ApplyForm } from "@/components/ApplyForm";
import { Benefits } from "@/components/Benefits";
import { CompanyRecord } from "@/components/CompanyRecord";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HiringRoute } from "@/components/HiringRoute";
import { Location } from "@/components/Location";
import { MobileBar } from "@/components/MobileBar";
import { Nav } from "@/components/Nav";
import { Positions } from "@/components/Positions";
import { PositionProvider } from "@/components/PositionContext";
import { Reveal } from "@/components/Reveal";
import { SITE } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/logo.png`,
  telephone: "+1-704-661-5180",
  address: {
    "@type": "PostalAddress",
    streetAddress: "69 Buck Trail Ln",
    addressLocality: "Atoka",
    addressRegion: "TN",
    postalCode: "38004",
    addressCountry: "US",
  },
};

export default function Home() {
  return (
    <PositionProvider>
      <Nav />
      <main id="main">
        <Hero />
        <CompanyRecord />
        <Positions />
        <Benefits />
        <HiringRoute />
        <FAQ />
        <ApplyForm />
        <Location />
      </main>
      <Footer />
      <MobileBar />
      <Reveal />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </PositionProvider>
  );
}
