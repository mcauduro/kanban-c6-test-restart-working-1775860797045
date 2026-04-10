/**
 * Helper class for common date and time operations.
 * All methods treat dates as immutable and return new Date objects.
 *
 * @example
 * const helper = new DateTimeHelper();
 * console.log(helper.formatDate(new Date(), 'YYYY-MM-DD'));
 */
export class DateTimeHelper {
  /**
   * Formats a Date object according to a format string.
   * Supported tokens: YYYY, MM, DD, HH, mm, ss.
   *
   * @param {Date} date - The date to format.
   * @param {string} format - The format string (e.g., 'YYYY-MM-DD').
   * @returns {string} The formatted date string.
   *
   * @example
   * const helper = new DateTimeHelper();
   * const d = new Date('2024-03-15T10:30:00');
   * console.log(helper.formatDate(d, 'DD/MM/YYYY')); // '15/03/2024'
   */
  formatDate(date: Date, format: string): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return format
      .replace('YYYY', String(date.getFullYear()))
      .replace('MM', pad(date.getMonth() + 1))
      .replace('DD', pad(date.getDate()))
      .replace('HH', pad(date.getHours()))
      .replace('mm', pad(date.getMinutes()))
      .replace('ss', pad(date.getSeconds()));
  }

  /**
   * Returns the number of calendar days between two dates (absolute value).
   *
   * @param {Date} a - The first date.
   * @param {Date} b - The second date.
   * @returns {number} Number of days between the two dates.
   *
   * @example
   * const helper = new DateTimeHelper();
   * const a = new Date('2024-01-01');
   * const b = new Date('2024-01-10');
   * console.log(helper.daysBetween(a, b)); // 9
   */
  daysBetween(a: Date, b: Date): number {
    const ms = Math.abs(b.getTime() - a.getTime());
    return Math.floor(ms / (1000 * 60 * 60 * 24));
  }

  /**
   * Adds a specified number of days to a date and returns the new date.
   *
   * @param {Date} date - The base date.
   * @param {number} days - Number of days to add (can be negative).
   * @returns {Date} The resulting date.
   *
   * @example
   * const helper = new DateTimeHelper();
   * const d = new Date('2024-01-01');
   * console.log(helper.addDays(d, 7).toISOString().slice(0, 10)); // '2024-01-08'
   */
  addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
   * Checks if a given date falls on a weekend (Saturday or Sunday).
   *
   * @param {Date} date - The date to check.
   * @returns {boolean} True if the date is Saturday or Sunday.
   *
   * @example
   * const helper = new DateTimeHelper();
   * console.log(helper.isWeekend(new Date('2024-01-06'))); // true (Saturday)
   * console.log(helper.isWeekend(new Date('2024-01-08'))); // false (Monday)
   */
  isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6;
  }

  /**
   * Returns the start of the day (midnight 00:00:00.000) for a given date.
   *
   * @param {Date} date - The reference date.
   * @returns {Date} A new Date at midnight of the same day.
   *
   * @example
   * const helper = new DateTimeHelper();
   * const d = new Date('2024-06-15T14:30:00');
   * console.log(helper.startOfDay(d).toISOString()); // '2024-06-15T00:00:00.000Z' (UTC offset dependent)
   */
  startOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  /**
   * Checks whether a given year is a leap year.
   *
   * @param {number} year - The year to check (e.g., 2024).
   * @returns {boolean} True if the year is a leap year.
   *
   * @example
   * const helper = new DateTimeHelper();
   * console.log(helper.isLeapYear(2024)); // true
   * console.log(helper.isLeapYear(2023)); // false
   */
  isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  /**
   * Returns the human-readable relative time string (e.g., '2 hours ago').
   *
   * @param {Date} date - The reference date (usually in the past).
   * @returns {string} A relative time description.
   *
   * @example
   * const helper = new DateTimeHelper();
   * const past = new Date(Date.now() - 3600 * 1000);
   * console.log(helper.timeAgo(past)); // '1 hour ago'
   */
  timeAgo(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    const intervals: [number, string][] = [
      [31536000, 'year'], [2592000, 'month'], [604800, 'week'],
      [86400, 'day'], [3600, 'hour'], [60, 'minute'], [1, 'second'],
    ];
    for (const [secs, label] of intervals) {
      const count = Math.floor(seconds / secs);
      if (count >= 1) return `${count} ${label}${count > 1 ? 's' : ''} ago`;
    }
    return 'just now';
  }
}
