export const SITE = {
  name: "MWT Transport LLC",
  usdot: "4041419",
  phoneDisplay: "(704) 661-5180",
  phoneHref: "tel:+17046615180",
  address: "69 Buck Trail Ln, Atoka, TN 38004",
  mailingAddress: "69 Buck Trail Ln, Atoka, TN 38004-2507",
  saferUrl: "https://safer.fmcsa.dot.gov/CompanySnapshot.aspx",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};

export type Position = "company" | "owner";

export const POSITION_LABELS: Record<Position, string> = {
  company: "Company driver",
  owner: "Owner-operator",
};

export const EXPERIENCE_OPTIONS = [
  "Less than 1 year",
  "1–2 years",
  "2–5 years",
  "5+ years",
] as const;

export const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "District of Columbia", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah",
  "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
] as const;
