import { differenceInMonths, differenceInDays, parseISO } from "date-fns";

export const calculateDuration = (startDate: string, endDate: string): string => {
  const start = parseISO(startDate);
  const end = endDate === "present" ? new Date() : parseISO(endDate);

  let totalMonths = differenceInMonths(end, start);

  // Calculate remaining days after the complete months
  const monthsDate = new Date(start);
  monthsDate.setMonth(monthsDate.getMonth() + totalMonths);
  const remainingDays = differenceInDays(end, monthsDate);

  // Round up if more than 15 days (half month)
  if (remainingDays > 15) {
    totalMonths++;
  }

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (years === 0) {
    return months === 1 ? "1 month" : `${months} months`;
  } else if (months === 0) {
    return years === 1 ? "1 year" : `${years} years`;
  } else {
    const yearText = years === 1 ? "1 year" : `${years} years`;
    const monthText = months === 1 ? "1 month" : `${months} months`;
    return `${yearText}, ${monthText}`;
  }
};

export const calculateDurationGerman = (startDate: string, endDate: string): string => {
  const start = parseISO(startDate);
  const end = endDate === "present" ? new Date() : parseISO(endDate);

  let totalMonths = differenceInMonths(end, start);

  // Calculate remaining days after the complete months
  const monthsDate = new Date(start);
  monthsDate.setMonth(monthsDate.getMonth() + totalMonths);
  const remainingDays = differenceInDays(end, monthsDate);

  // Round up if more than 15 days (half month)
  if (remainingDays > 15) {
    totalMonths++;
  }

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (years === 0) {
    return months === 1 ? "1 Monat" : `${months} Monate`;
  } else if (months === 0) {
    return years === 1 ? "1 Jahr" : `${years} Jahre`;
  } else {
    const yearText = years === 1 ? "1 Jahr" : `${years} Jahre`;
    const monthText = months === 1 ? "1 Monat" : `${months} Monate`;
    return `${yearText}, ${monthText}`;
  }
};

const MONTHS: Record<string, string[]> = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  de: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
};

const PRESENT: Record<string, string> = { en: "Present", de: "Heute" };

const STARTING: Record<string, string> = { en: "Starting", de: "Ab" };

/**
 * Whether a role has actually begun. A position added before its start date
 * would otherwise render as "Dec 2026 — Present" and, in the detail panel, as
 * a negative duration ("-1 years, -2 months") — calculateDuration simply
 * subtracts, with no guard for a start in the future.
 *
 * An unparseable date counts as started: better to show a role than to hide
 * one behind a date typo.
 */
export const hasStarted = (startDate?: string, now: Date = new Date()): boolean => {
  if (!startDate) return true;
  const parsed = parseISO(startDate);
  if (Number.isNaN(parsed.getTime())) return true;
  return parsed.getTime() <= now.getTime();
};

/**
 * Renders an ISO date as "Feb 2026". Falls back to the raw string for anything
 * unparseable so a malformed entry degrades to text rather than "Invalid Date".
 */
export const formatMonthYear = (date?: string, language = "en"): string => {
  if (!date) return PRESENT[language] ?? PRESENT.en;
  if (date === "present") return PRESENT[language] ?? PRESENT.en;

  const parsed = parseISO(date);
  if (Number.isNaN(parsed.getTime())) return date;

  const months = MONTHS[language] ?? MONTHS.en;
  return `${months[parsed.getMonth()]} ${parsed.getFullYear()}`;
};

/**
 * Renders a start/end pair as "Feb 2026 — Present", or "Starting Dec 2026"
 * for an open-ended role whose start date has not arrived yet.
 */
export const formatDateRange = (
  startDate: string,
  endDate?: string,
  language = "en",
  now: Date = new Date(),
): string => {
  if (!endDate && !hasStarted(startDate, now)) {
    const prefix = STARTING[language] ?? STARTING.en;
    return `${prefix} ${formatMonthYear(startDate, language)}`;
  }
  return `${formatMonthYear(startDate, language)} — ${formatMonthYear(endDate, language)}`;
};
