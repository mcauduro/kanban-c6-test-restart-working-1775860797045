/**
 * Utility class for common string manipulation operations.
 * All methods are pure functions with no side effects.
 *
 * @example
 * const utils = new StringUtils();
 * console.log(utils.isPalindrome('racecar')); // true
 */
export class StringUtils {
  /**
   * Checks whether a string is a palindrome (reads the same forwards and backwards).
   * Ignores case and non-alphanumeric characters.
   *
   * @param {string} str - The string to check.
   * @returns {boolean} True if the string is a palindrome.
   *
   * @example
   * const utils = new StringUtils();
   * console.log(utils.isPalindrome('A man a plan a canal Panama')); // true
   * console.log(utils.isPalindrome('hello')); // false
   */
  isPalindrome(str: string): boolean {
    const clean = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    return clean === clean.split('').reverse().join('');
  }

  /**
   * Converts a string to camelCase.
   *
   * @param {string} str - The input string (supports space, dash, or underscore separators).
   * @returns {string} The camelCase version.
   *
   * @example
   * const utils = new StringUtils();
   * console.log(utils.toCamelCase('hello world'));  // 'helloWorld'
   * console.log(utils.toCamelCase('foo-bar-baz'));  // 'fooBarBaz'
   */
  toCamelCase(str: string): string {
    return str
      .toLowerCase()
      .replace(/[-_ ]+(.)/g, (_, char) => char.toUpperCase());
  }

  /**
   * Converts a string to snake_case.
   *
   * @param {string} str - The input string.
   * @returns {string} The snake_case version.
   *
   * @example
   * const utils = new StringUtils();
   * console.log(utils.toSnakeCase('helloWorld'));  // 'hello_world'
   * console.log(utils.toSnakeCase('FooBarBaz'));   // 'foo_bar_baz'
   */
  toSnakeCase(str: string): string {
    return str
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase()
      .replace(/^_/, '');
  }

  /**
   * Counts the frequency of each character in a string.
   *
   * @param {string} str - The input string.
   * @returns {Record<string, number>} A map from character to its count.
   *
   * @example
   * const utils = new StringUtils();
   * console.log(utils.charFrequency('hello'));
   * // { h: 1, e: 1, l: 2, o: 1 }
   */
  charFrequency(str: string): Record<string, number> {
    return str.split('').reduce((acc, ch) => {
      acc[ch] = (acc[ch] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  /**
   * Truncates a string to a maximum length, appending an ellipsis if needed.
   *
   * @param {string} str - The string to truncate.
   * @param {number} maxLength - The maximum allowed length (including ellipsis).
   * @param {string} [ellipsis='...'] - The suffix to append when truncated.
   * @returns {string} The (possibly truncated) string.
   *
   * @example
   * const utils = new StringUtils();
   * console.log(utils.truncate('Hello, world!', 8)); // 'Hello...'
   */
  truncate(str: string, maxLength: number, ellipsis: string = '...'): string {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength - ellipsis.length) + ellipsis;
  }

  /**
   * Extracts all URLs from a string.
   *
   * @param {string} text - The text to search for URLs.
   * @returns {string[]} Array of found URLs.
   *
   * @example
   * const utils = new StringUtils();
   * const text = 'Visit https://example.com or http://test.org';
   * console.log(utils.extractUrls(text)); // ['https://example.com', 'http://test.org']
   */
  extractUrls(text: string): string[] {
    const pattern = /https?:\/\/[^\s]+/g;
    return text.match(pattern) ?? [];
  }

  /**
   * Generates a random alphanumeric string of the specified length.
   *
   * @param {number} length - The desired length of the string.
   * @returns {string} A random alphanumeric string.
   *
   * @example
   * const utils = new StringUtils();
   * console.log(utils.randomString(8)); // e.g. 'aB3xK9pZ'
   */
  randomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }
}
