import { clsx, type ClassValue } from 'clsx';
import { eachDayOfInterval, format, subDays } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertAmountFromMilliunit(amount: number) {
  return amount / 1000;
}

export function convertAmountIntoMilliunit(amount: number) {
  return Math.round(amount * 1000);
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function calculatePercentage(
  current: number,
  previous: number,
  precision: number = 2,
): number {
  // Check if inputs are valid numbers
  if (isNaN(current) || isNaN(previous)) {
    throw new Error('Both current and previous values must be valid numbers.');
  }

  // Handle edge case where previous is 0
  if (previous === 0) {
    return current === 0 ? 0 : current > 0 ? 100 : -100;
  }

  // Calculate percentage change
  const percentageChange = ((current - previous) / previous) * 100;

  // Return the percentage with specified precision
  return parseFloat(percentageChange.toFixed(precision));
}

const normalizeDate = (date: any) => new Date(date.setHours(0, 0, 0, 0));

export function fillMisingDays(
  activeDays: { date: Date; income: number; expense: number }[],
  startDate: Date,
  endDate: Date,
) {
  if (activeDays.length === 0) {
    return [];
  }

  const allDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  // Generate days array, filling in zeros for missing days
  const transactionByDay = allDays.map((day) => {
    const normalizedDay = normalizeDate(day);
    const found = activeDays.find(
      (item) => normalizeDate(item.date).getTime() === normalizedDay.getTime(),
    );
    if (found) {
      return found; // Return the found entry if the day exists
    }
    // If no entry for the day, return with zeros for income and expense
    return {
      date: normalizedDay,
      income: 0,
      expense: 0,
    };
  });

  return transactionByDay;
}

type Period = {
  from: Date | string | undefined;
  to: Date | string | undefined;
};

export function formatDateRange(period?: Period) {
  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  if (!period?.from) {
    return `${format(defaultFrom, 'LLL dd')} - ${format(defaultTo, 'LLL dd, y')}`;
  }

  if (!period?.to) {
    return `${format(period.from, 'LLL dd')} - ${period.to && format(period.to, 'LLL dd, y')}`;
  }

  return `${format(period.from, 'LLL dd, y')} - ${format(period.to, 'LLL dd, y')}`;
}

export function formatPercentage(
  value: number,
  options: { addPrefix?: boolean } = {
    addPrefix: false,
  },
) {
  const result = new Intl.NumberFormat('en-US', {
    style: 'percent',
  }).format(value / 100);

  if (options.addPrefix && value > 0) {
    return `+${result}`;
  }

  return result;
}

export function setTimeToMidnight(dateString: Date) {
  const date = new Date(dateString); // Convert the string to a Date object
  date.setUTCHours(0, 0, 0, 0); // Set the time to midnight UTC
  return date; // Return the updated date in ISO string format
}
