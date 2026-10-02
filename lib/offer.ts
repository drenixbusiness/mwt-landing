/**
 * Owner-operator offer terms. Every number on /offer comes from here.
 * TODO: replace these sample figures with MWT's real lease-on terms before publishing.
 */
export const OFFER = {
  weeklyGross: { min: 9000, max: 13000 },
  rpm: { min: 2.8, max: 4.0 },
  dispatchPct: 12,
  fixedWeekly: [
    { label: "Insurance", note: "Liability + cargo", amount: 400 },
    { label: "ELD", note: "Device + service", amount: 65 },
    { label: "IFTA + permits", note: "Filed for you", amount: 35 },
  ],
  notCharged: ["Trailer rental", "Escrow hold", "Forced dispatch", "Hidden settlement fees"],
};

export const FIXED_TOTAL = OFFER.fixedWeekly.reduce((s, f) => s + f.amount, 0);

export const usd = (n: number, digits = 0) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
