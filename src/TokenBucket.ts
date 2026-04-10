/**
 * A Token Bucket implementation for smooth rate-limiting of actions.
 * Tokens are refilled at a fixed rate; each action consumes a token.
 *
 * @example
 * const bucket = new TokenBucket(10, 1); // 10 capacity, 1 token/second
 * console.log(bucket.consume()); // true (success)
 */
export class TokenBucket {
  private tokens: number;
  private lastRefillAt: number;
  private readonly capacity: number;
  private readonly refillRatePerMs: number;

  /**
   * Creates a new TokenBucket.
   *
   * @param {number} capacity - Maximum number of tokens the bucket can hold.
   * @param {number} refillRatePerSecond - Number of tokens added per second.
   * @throws {Error} If capacity or refillRatePerSecond are not positive.
   *
   * @example
   * const bucket = new TokenBucket(100, 10); // up to 100 tokens, 10/sec
   */
  constructor(capacity: number, refillRatePerSecond: number) {
    if (capacity <= 0) throw new Error('capacity must be positive');
    if (refillRatePerSecond <= 0) throw new Error('refillRatePerSecond must be positive');
    this.capacity = capacity;
    this.refillRatePerMs = refillRatePerSecond / 1000;
    this.tokens = capacity;
    this.lastRefillAt = Date.now();
  }

  /**
   * Refills the bucket based on time elapsed since the last refill.
   * Called automatically before any consume/peek.
   *
   * @returns {void}
   *
   * @example
   * const bucket = new TokenBucket(10, 100);
   * // Manually trigger a refill after time passes
   * bucket.refill();
   */
  refill(): void {
    const now = Date.now();
    const elapsed = now - this.lastRefillAt;
    const newTokens = elapsed * this.refillRatePerMs;
    this.tokens = Math.min(this.capacity, this.tokens + newTokens);
    this.lastRefillAt = now;
  }

  /**
   * Attempts to consume the given number of tokens.
   * Returns false if there are insufficient tokens.
   *
   * @param {number} [count=1] - Number of tokens to consume.
   * @returns {boolean} True if the tokens were available and consumed.
   *
   * @example
   * const bucket = new TokenBucket(5, 1);
   * console.log(bucket.consume(3)); // true
   * console.log(bucket.consume(3)); // false (only 2 left)
   */
  consume(count: number = 1): boolean {
    this.refill();
    if (this.tokens < count) return false;
    this.tokens -= count;
    return true;
  }

  /**
   * Returns the current number of available tokens (after refill).
   *
   * @returns {number} Current token count.
   *
   * @example
   * const bucket = new TokenBucket(10, 1);
   * bucket.consume(4);
   * console.log(bucket.available()); // 6
   */
  available(): number {
    this.refill();
    return Math.floor(this.tokens);
  }

  /**
   * Returns the maximum capacity of the bucket.
   *
   * @returns {number} The bucket capacity.
   *
   * @example
   * const bucket = new TokenBucket(50, 5);
   * console.log(bucket.getCapacity()); // 50
   */
  getCapacity(): number {
    return this.capacity;
  }

  /**
   * Drains all tokens from the bucket immediately.
   *
   * @returns {void}
   *
   * @example
   * const bucket = new TokenBucket(10, 1);
   * bucket.drain();
   * console.log(bucket.available()); // 0
   */
  drain(): void {
    this.refill();
    this.tokens = 0;
  }

  /**
   * Resets the bucket to full capacity.
   *
   * @returns {void}
   *
   * @example
   * const bucket = new TokenBucket(10, 1);
   * bucket.consume(5);
   * bucket.reset();
   * console.log(bucket.available()); // 10
   */
  reset(): void {
    this.tokens = this.capacity;
    this.lastRefillAt = Date.now();
  }
}
