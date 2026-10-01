import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import { HashLinks } from "@/components/HashLinks";
import { SITE } from "@/lib/site";
import "./globals.css";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-barlow",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

const title = "MWT Transport";
const description =
  "MWT Transport LLC (USDOT 4041419) is hiring CDL-A company drivers and owner-operators. Weekly pay, planned home time, dispatch that answers. Apply in two minutes.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title,
  description,
  applicationName: "MWT Transport",
  keywords: ["CDL-A jobs", "truck driver jobs", "owner-operator", "OTR", "Tennessee trucking", "MWT Transport"],
  alternates: { canonical: "/" },
  icons: { icon: "/logo.png", apple: "/logo.png" },
  openGraph: {
    type: "website",
    siteName: "MWT Transport",
    title: "Your miles. Your home time. Our word. — MWT Transport",
    description,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "MWT Transport is hiring CDL-A drivers",
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#f2f2f3",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${barlow.variable} ${barlowCondensed.variable}`} suppressHydrationWarning>
      <head>
        {/* Enables scroll-reveal styles only when JS runs, so content never stays hidden */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        {children}
        <HashLinks />
      </body>
    </html>
  );
}
