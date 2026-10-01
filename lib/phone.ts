/** 10-digit NANP number, optional leading 1; area code and exchange can't start with 0/1. */
export function isValidUSPhone(raw: string) {
  let d = raw.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("1")) d = d.slice(1);
  return /^[2-9]\d{2}[2-9]\d{6}$/.test(d);
}
