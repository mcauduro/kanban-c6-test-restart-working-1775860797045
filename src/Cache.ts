/**
 * A generic in-memory LRU (Least Recently Used) cache with optional TTL (time-to-live) support.
 *
 * @template K The key type.
 * @template V The value type.
 *
 * @example
 * const cache = new Cache<string, number>(3);
 * cache.set('a', 1);
 * cache.set('b', 2);
 * console.log(cache.get('a')); // 1
 */
export class Cache<K, V> {
  private store: Map<K, { value: V; expiresAt: number | null }> = new Map();
  private readonly maxSize: number;

  /**
   * Creates a new Cache instance.
   *
   * @param {number} maxSize - Maximum number of entries to hold.
   * @throws {Error} If maxSize is not a positive integer.
   *
   * @example
   * const cache = new Cache<string, object>(100);
   */
  constructor(maxSize: number) {
    if (maxSize <= 0 || !Number.isInteger(maxSize)) throw new Error('maxSize must be a positive integer');
    this.maxSize = maxSize;
  }

  /**
   * Stores a key-value pair in the cache, with an optional TTL in milliseconds.
   * If the cache is full, the least recently used entry is evicted.
   *
   * @param {K} key - The cache key.
   * @param {V} value - The value to cache.
   * @param {number} [ttlMs] - Optional time-to-live in milliseconds.
   * @returns {void}
   *
   * @example
   * const cache = new Cache<string, string>(10);
   * cache.set('token', 'abc123', 5000); // expires in 5 seconds
   */
  set(key: K, value: V, ttlMs?: number): void {
    if (this.store.has(key)) this.store.delete(key);
    else if (this.store.size >= this.maxSize) {
      this.store.delete(this.store.keys().next().value);
    }
    this.store.set(key, {
      value,
      expiresAt: ttlMs !== undefined ? Date.now() + ttlMs : null,
    });
  }

  /**
   * Retrieves the value for a key, returning undefined if absent or expired.
   * Accessing a key promotes it to most-recently-used.
   *
   * @param {K} key - The key to look up.
   * @returns {V | undefined} The cached value or undefined.
   *
   * @example
   * const cache = new Cache<string, number>(5);
   * cache.set('x', 42);
   * console.log(cache.get('x')); // 42
   */
  get(key: K): V | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt !== null && Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    // LRU: re-insert to make it most recently used
    this.store.delete(key);
    this.store.set(key, entry);
    return entry.value;
  }

  /**
   * Checks whether a key is present and not expired.
   *
   * @param {K} key - The key to check.
   * @returns {boolean} True if the key exists and is valid.
   *
   * @example
   * const cache = new Cache<string, number>(5);
   * cache.set('a', 1);
   * console.log(cache.has('a')); // true
   */
  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  /**
   * Removes a key from the cache.
   *
   * @param {K} key - The key to remove.
   * @returns {boolean} True if the key was present and removed.
   *
   * @example
   * const cache = new Cache<string, number>(5);
   * cache.set('x', 1);
   * console.log(cache.delete('x')); // true
   */
  delete(key: K): boolean {
    return this.store.delete(key);
  }

  /**
   * Clears all entries from the cache.
   *
   * @returns {void}
   *
   * @example
   * const cache = new Cache<string, number>(5);
   * cache.set('a', 1);
   * cache.clear();
   * console.log(cache.size()); // 0
   */
  clear(): void {
    this.store.clear();
  }

  /**
   * Returns the current number of entries in the cache.
   *
   * @returns {number} The number of entries.
   *
   * @example
   * const cache = new Cache<string, number>(5);
   * cache.set('a', 1);
   * console.log(cache.size()); // 1
   */
  size(): number {
    return this.store.size;
  }
}
