/**
 * A sliding-window rate limiter for controlling request throughput per key.
 *
 * @example
 * const limiter = new RateLimiter(5, 60000); // 5 requests per minute
 * limiter.isAllowed('user-123'); // true
 */
export class RateLimiter {
  private windows: Map<string, number[]> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  /**
   * Creates a new RateLimiter.
   *
   * @param {number} maxRequests - Maximum number of requests allowed per window.
   * @param {number} windowMs - Duration of the sliding window in milliseconds.
   * @throws {Error} If maxRequests or windowMs are not positive integers.
   *
   * @example
   * const limiter = new RateLimiter(100, 60000); // 100 req/min
   */
  constructor(maxRequests: number, windowMs: number) {
    if (maxRequests <= 0) throw new Error('maxRequests must be positive');
    if (windowMs <= 0) throw new Error('windowMs must be positive');
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  /**
   * Checks whether a new request from the given key is within the rate limit.
   * If allowed, the request timestamp is recorded.
   *
   * @param {string} key - A unique identifier for the rate-limited entity (e.g., user ID, IP).
   * @returns {boolean} True if the request is within the allowed rate.
   *
   * @example
   * const limiter = new RateLimiter(2, 1000);
   * console.log(limiter.isAllowed('ip-1')); // true
   * console.log(limiter.isAllowed('ip-1')); // true
   * console.log(limiter.isAllowed('ip-1')); // false (exceeded)
   */
  isAllowed(key: string): boolean {
    const now = Date.now();
    const timestamps = this.getValidTimestamps(key, now);
    if (timestamps.length >= this.maxRequests) return false;
    timestamps.push(now);
    this.windows.set(key, timestamps);
    return true;
  }

  /**
   * Returns the number of remaining allowed requests for the given key in the current window.
   *
   * @param {string} key - The rate-limited entity key.
   * @returns {number} Remaining request count.
   *
   * @example
   * const limiter = new RateLimiter(5, 60000);
   * limiter.isAllowed('u1');
   * console.log(limiter.remaining('u1')); // 4
   */
  remaining(key: string): number {
    const count = this.getValidTimestamps(key, Date.now()).length;
    return Math.max(0, this.maxRequests - count);
  }

  /**
   * Returns the number of milliseconds until the oldest request expires,
   * effectively when the next slot opens for the given key.
   *
   * @param {string} key - The rate-limited entity key.
   * @returns {number} Milliseconds until rate limit resets. 0 if under limit.
   *
   * @example
   * const limiter = new RateLimiter(1, 1000);
   * limiter.isAllowed('k');
   * console.log(limiter.resetIn('k')); // ~1000
   */
  resetIn(key: string): number {
    const now = Date.now();
    const timestamps = this.getValidTimestamps(key, now);
    if (timestamps.length < this.maxRequests) return 0;
    return Math.max(0, timestamps[0] + this.windowMs - now);
  }

  /**
   * Clears the recorded requests for a specific key.
   *
   * @param {string} key - The key to reset.
   * @returns {void}
   *
   * @example
   * const limiter = new RateLimiter(2, 1000);
   * limiter.isAllowed('u');
   * limiter.reset('u');
   * console.log(limiter.remaining('u')); // 2
   */
  reset(key: string): void {
    this.windows.delete(key);
  }

  /**
   * Clears all tracked rate-limit windows.
   *
   * @returns {void}
   *
   * @example
   * const limiter = new RateLimiter(10, 60000);
   * limiter.isAllowed('a');
   * limiter.resetAll();
   * console.log(limiter.remaining('a')); // 10
   */
  resetAll(): void {
    this.windows.clear();
  }

  private getValidTimestamps(key: string, now: number): number[] {
    const all = this.windows.get(key) ?? [];
    const valid = all.filter(ts => now - ts < this.windowMs);
    this.windows.set(key, valid);
    return valid;
  }
}
