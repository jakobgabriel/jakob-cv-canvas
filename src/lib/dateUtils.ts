import { differenceInYears, differenceInMonths, parseISO } from 'date-fns';

export const calculateDuration = (startDate: string, endDate: string): string => {
  const start = parseISO(startDate);
  const end = endDate === 'present' ? new Date() : parseISO(endDate);
  
  // Calculate total months more accurately
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  
  // If the end day is before the start day, subtract a month
  if (end.getDate() < start.getDate()) {
    months--;
  }
  
  // Adjust for negative months
  if (months < 0) {
    years--;
    months += 12;
  }
  
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
  
  // Calculate total months more accurately
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  
  // If the end day is before the start day, subtract a month
  if (end.getDate() < start.getDate()) {
    months--;
  }
  
  // Adjust for negative months
  if (months < 0) {
    years--;
    months += 12;
  }
  
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