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

/** Renders a start/end pair as "Feb 2026 — Present". */
export const formatDateRange = (startDate: string, endDate?: string, language = "en"): string =>
  `${formatMonthYear(startDate, language)} — ${formatMonthYear(endDate, language)}`;
