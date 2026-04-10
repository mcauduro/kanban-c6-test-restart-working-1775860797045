/**
 * A generic hash map implementation using separate chaining for collision resolution.
 * Provides O(1) average-case operations for get, set, and delete.
 *
 * @template K The key type (must be string or number).
 * @template V The value type.
 *
 * @example
 * const map = new HashMap<string, number>();
 * map.set('age', 30);
 * console.log(map.get('age')); // 30
 */
export class HashMap<K extends string | number, V> {
  private buckets: Array<Array<[K, V]>>;
  private capacity: number;
  private count: number = 0;

  /**
   * Creates a new HashMap with an optional initial capacity.
   *
   * @param {number} [capacity=16] - Initial number of buckets.
   *
   * @example
   * const map = new HashMap<string, string>(32);
   */
  constructor(capacity: number = 16) {
    this.capacity = capacity;
    this.buckets = Array.from({ length: capacity }, () => []);
  }

  /**
   * Computes the bucket index for a given key.
   *
   * @param {K} key - The key to hash.
   * @returns {number} The bucket index.
   *
   * @example
   * // Internal use only; exposed for testing
   * const map = new HashMap<string, number>();
   * const idx = map.hash('hello'); // some number 0..15
   */
  hash(key: K): number {
    const str = String(key);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 31 + str.charCodeAt(i)) % this.capacity;
    }
    return hash;
  }

  /**
   * Associates the given key with the given value.
   * If the key already exists, the value is updated.
   *
   * @param {K} key - The key.
   * @param {V} value - The value to associate.
   * @returns {void}
   *
   * @example
   * const map = new HashMap<string, number>();
   * map.set('score', 100);
   * map.set('score', 200); // updates existing entry
   */
  set(key: K, value: V): void {
    const idx = this.hash(key);
    const bucket = this.buckets[idx];
    const entry = bucket.find(([k]) => k === key);
    if (entry) {
      entry[1] = value;
    } else {
      bucket.push([key, value]);
      this.count++;
    }
  }

  /**
   * Retrieves the value associated with the given key.
   *
   * @param {K} key - The key to look up.
   * @returns {V | undefined} The value, or undefined if not found.
   *
   * @example
   * const map = new HashMap<string, string>();
   * map.set('name', 'Alice');
   * console.log(map.get('name')); // 'Alice'
   * console.log(map.get('age'));  // undefined
   */
  get(key: K): V | undefined {
    const idx = this.hash(key);
    const entry = this.buckets[idx].find(([k]) => k === key);
    return entry ? entry[1] : undefined;
  }

  /**
   * Checks whether the map contains the given key.
   *
   * @param {K} key - The key to check.
   * @returns {boolean} True if the key exists.
   *
   * @example
   * const map = new HashMap<string, number>();
   * map.set('x', 1);
   * console.log(map.has('x')); // true
   * console.log(map.has('y')); // false
   */
  has(key: K): boolean {
    const idx = this.hash(key);
    return this.buckets[idx].some(([k]) => k === key);
  }

  /**
   * Removes the entry with the given key from the map.
   *
   * @param {K} key - The key to delete.
   * @returns {boolean} True if the key was found and removed.
   *
   * @example
   * const map = new HashMap<string, number>();
   * map.set('a', 1);
   * console.log(map.delete('a')); // true
   * console.log(map.delete('b')); // false
   */
  delete(key: K): boolean {
    const idx = this.hash(key);
    const bucket = this.buckets[idx];
    const entryIdx = bucket.findIndex(([k]) => k === key);
    if (entryIdx === -1) return false;
    bucket.splice(entryIdx, 1);
    this.count--;
    return true;
  }

  /**
   * Returns all keys in the map.
   *
   * @returns {K[]} Array of all keys.
   *
   * @example
   * const map = new HashMap<string, number>();
   * map.set('a', 1);
   * map.set('b', 2);
   * console.log(map.keys()); // ['a', 'b'] (order may vary)
   */
  keys(): K[] {
    return this.buckets.flatMap(bucket => bucket.map(([k]) => k));
  }

  /**
   * Returns the number of key-value pairs in the map.
   *
   * @returns {number} The map size.
   *
   * @example
   * const map = new HashMap<string, number>();
   * map.set('x', 1);
   * console.log(map.size()); // 1
   */
  size(): number {
    return this.count;
  }
}
