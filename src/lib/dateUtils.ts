import { differenceInYears, differenceInMonths, parseISO } from 'date-fns';

export const calculateDuration = (startDate: string, endDate: string): string => {
  const start = parseISO(startDate);
  const end = endDate === 'present' ? new Date() : parseISO(endDate);
  
  // Calculate total months
  const totalMonths = differenceInMonths(end, start);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  
  // If end date is in the same month as start, we need to add 1 month minimum
  const adjustedMonths = totalMonths === 0 ? 1 : months;
  const adjustedYears = totalMonths === 0 ? 0 : years;
  
  if (adjustedYears === 0) {
    return adjustedMonths === 1 ? '1 month' : `${adjustedMonths} months`;
  } else if (adjustedMonths === 0) {
    return adjustedYears === 1 ? '1 year' : `${adjustedYears} years`;
  } else {
    const yearText = adjustedYears === 1 ? '1 year' : `${adjustedYears} years`;
    const monthText = adjustedMonths === 1 ? '1 month' : `${adjustedMonths} months`;
    return `${yearText}, ${monthText}`;
  }
};

export const calculateDurationGerman = (startDate: string, endDate: string): string => {
  const start = parseISO(startDate);
  const end = endDate === 'present' ? new Date() : parseISO(endDate);
  
  // Calculate total months
  const totalMonths = differenceInMonths(end, start);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  
  // If end date is in the same month as start, we need to add 1 month minimum
  const adjustedMonths = totalMonths === 0 ? 1 : months;
  const adjustedYears = totalMonths === 0 ? 0 : years;
  
  if (adjustedYears === 0) {
    return adjustedMonths === 1 ? '1 Monat' : `${adjustedMonths} Monate`;
  } else if (adjustedMonths === 0) {
    return adjustedYears === 1 ? '1 Jahr' : `${adjustedYears} Jahre`;
  } else {
    const yearText = adjustedYears === 1 ? '1 Jahr' : `${adjustedYears} Jahre`;
    const monthText = adjustedMonths === 1 ? '1 Monat' : `${adjustedMonths} Monate`;
    return `${yearText}, ${monthText}`;
  }
};