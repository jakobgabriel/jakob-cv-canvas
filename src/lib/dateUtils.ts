import { differenceInYears, differenceInMonths, parseISO } from 'date-fns';

export const calculateDuration = (startDate: string, endDate: string): string => {
  const start = parseISO(startDate);
  const end = endDate === 'present' ? new Date() : parseISO(endDate);
  
  const years = differenceInYears(end, start);
  const months = differenceInMonths(end, start) % 12;
  
  if (years === 0) {
    return months === 1 ? '1 month' : `${months} months`;
  } else if (months === 0) {
    return years === 1 ? '1 year' : `${years} years`;
  } else {
    const yearText = years === 1 ? '1 year' : `${years} years`;
    const monthText = months === 1 ? '1 month' : `${months} months`;
    return `${yearText}, ${monthText}`;
  }
};

export const calculateDurationGerman = (startDate: string, endDate: string): string => {
  const start = parseISO(startDate);
  const end = endDate === 'present' ? new Date() : parseISO(endDate);
  
  const years = differenceInYears(end, start);
  const months = differenceInMonths(end, start) % 12;
  
  if (years === 0) {
    return months === 1 ? '1 Monat' : `${months} Monate`;
  } else if (months === 0) {
    return years === 1 ? '1 Jahr' : `${years} Jahre`;
  } else {
    const yearText = years === 1 ? '1 Jahr' : `${years} Jahre`;
    const monthText = months === 1 ? '1 Monat' : `${months} Monate`;
    return `${yearText}, ${monthText}`;
  }
};