// ==========================================
// src/utils/dateUtils.ts
// ==========================================
// Date manipulation utilities

export class DateRange {
  constructor(public readonly dates: string[]) {}

  get start(): string {
    return this.dates[0] || '';
  }

  get end(): string {
    return this.dates[this.dates.length - 1] || '';
  }

  get length(): number {
    return this.dates.length;
  }
}

export function getWeekDates(endDate: Date): DateRange {
  const dates: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(endDate);
    date.setDate(date.getDate() - i);
    dates.push(formatDate(date));
  }
  return new DateRange(dates);
}

export function getMonthDates(year: number, month: number): DateRange {
  const dates: string[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    dates.push(formatDate(new Date(year, month, day)));
  }
  return new DateRange(dates);
}

export function getWeekNumber(date: Date): number {
  const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNumber = (tmp.getUTCDay() + 6) % 7;
  tmp.setUTCDate(tmp.getUTCDate() - dayNumber + 3);
  const firstThursday = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 4));
  const diff = tmp.getTime() - firstThursday.getTime();
  return 1 + Math.round(diff / (7 * 24 * 60 * 60 * 1000));
}

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  if (!y || !m || !d) return new Date(NaN);
  return new Date(y, m - 1, d);
}
