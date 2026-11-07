const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** "2026-09-11" → "11 Sep 2026", "2026-09" → "Sep 2026", "2018" → "2018". */
export function formatDate(date: string): string {
  const [y, m, d] = date.split("-");
  if (!m) return y;
  const month = MONTHS[Number(m) - 1] ?? m;
  if (!d) return `${month} ${y}`;
  return `${Number(d)} ${month} ${y}`;
}

/** "2026-09-11" → "Sep 2026", "2018" → "2018". Used for log grouping. */
export function formatMonth(date: string): string {
  const [y, m] = date.split("-");
  if (!m) return y;
  return `${MONTHS[Number(m) - 1] ?? m} ${y}`;
}

/** Grouping key: "2026-09-11" → "2026-09", "2018" → "2018". */
export function monthKey(date: string): string {
  return date.slice(0, 7);
}

/** A machine-readable value for <time dateTime>. */
export function isoDate(date: string): string {
  return date;
}
