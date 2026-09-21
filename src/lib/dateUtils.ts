import { differenceInMonths, differenceInDays, endOfDay, parseISO } from "date-fns";

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
    if (months === 0) return "Less than a month";
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
    if (months === 0) return "Weniger als 1 Monat";
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

/**
 * Whether a role has actually begun. Used to keep a position out of the
 * timeline until its start date arrives, so a job can be recorded in the data
 * ahead of time and appear on its own on the day it starts.
 *
 * An unparseable or missing date counts as started: a date typo should show a
 * role, never silently hide one.
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
 * The end date to render and to measure a duration against.
 *
 * An end date that has not arrived yet belongs to a role the person is still
 * in, so it reads as ongoing until the day it passes. That is what lets a
 * handover be recorded in the data ahead of time — the outgoing role keeps
 * saying "Present" today and closes itself on the right day, with nothing to
 * edit or redeploy in between.
 *
 * An unparseable value is passed through for formatMonthYear to fall back on.
 */
export const effectiveEndDate = (endDate?: string, now: Date = new Date()): string | undefined => {
  if (!endDate || endDate === "present") return undefined;
  const parsed = parseISO(endDate);
  if (Number.isNaN(parsed.getTime())) return endDate;
  return endOfDay(parsed).getTime() <= now.getTime() ? endDate : undefined;
};

/** Renders a start/end pair as "Feb 2026 — Present". */
export const formatDateRange = (
  startDate: string,
  endDate?: string,
  language = "en",
  now: Date = new Date(),
): string =>
  `${formatMonthYear(startDate, language)} — ${formatMonthYear(effectiveEndDate(endDate, now), language)}`;
