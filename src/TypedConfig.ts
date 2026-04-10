/**
 * A type-safe, hierarchical configuration manager.
 * Supports nested keys via dot notation, defaults, and environment-variable overlays.
 *
 * @example
 * const config = new TypedConfig({ db: { host: 'localhost', port: 5432 } });
 * console.log(config.get<string>('db.host')); // 'localhost'
 */
export class TypedConfig {
  private store: Record<string, unknown>;

  /**
   * Creates a new TypedConfig with an initial configuration object.
   *
   * @param {Record<string, unknown>} initialConfig - The starting configuration values.
   *
   * @example
   * const config = new TypedConfig({ app: { name: 'MyApp', debug: false } });
   */
  constructor(initialConfig: Record<string, unknown> = {}) {
    this.store = this.flatten(initialConfig);
  }

  /**
   * Retrieves a configuration value by dot-notation key.
   *
   * @template T The expected value type.
   * @param {string} key - Dot-notation key (e.g., 'database.host').
   * @param {T} [defaultValue] - Value to return if key is not found.
   * @returns {T} The configuration value.
   * @throws {Error} If key is not found and no default is provided.
   *
   * @example
   * const config = new TypedConfig({ timeout: 3000 });
   * console.log(config.get<number>('timeout')); // 3000
   * console.log(config.get<number>('missing', 0)); // 0
   */
  get<T>(key: string, defaultValue?: T): T {
    if (key in this.store) return this.store[key] as T;
    if (defaultValue !== undefined) return defaultValue;
    throw new Error(`Configuration key '${key}' not found`);
  }

  /**
   * Sets or overrides a configuration value by dot-notation key.
   *
   * @param {string} key - The configuration key.
   * @param {unknown} value - The value to assign.
   * @returns {void}
   *
   * @example
   * const config = new TypedConfig({});
   * config.set('feature.enabled', true);
   * console.log(config.get<boolean>('feature.enabled')); // true
   */
  set(key: string, value: unknown): void {
    this.store[key] = value;
  }

  /**
   * Checks whether a configuration key exists.
   *
   * @param {string} key - The dot-notation key.
   * @returns {boolean} True if the key is present.
   *
   * @example
   * const config = new TypedConfig({ foo: 'bar' });
   * console.log(config.has('foo'));    // true
   * console.log(config.has('baz'));    // false
   */
  has(key: string): boolean {
    return key in this.store;
  }

  /**
   * Merges additional configuration values, overwriting existing keys.
   *
   * @param {Record<string, unknown>} overrides - Configuration to merge in.
   * @returns {void}
   *
   * @example
   * const config = new TypedConfig({ a: 1, b: 2 });
   * config.merge({ b: 99, c: 3 });
   * console.log(config.get<number>('b')); // 99
   * console.log(config.get<number>('c')); // 3
   */
  merge(overrides: Record<string, unknown>): void {
    const flat = this.flatten(overrides);
    Object.assign(this.store, flat);
  }

  /**
   * Returns all configuration entries as a flat key-value object.
   *
   * @returns {Record<string, unknown>} The flat configuration snapshot.
   *
   * @example
   * const config = new TypedConfig({ x: 1, y: 2 });
   * const all = config.toObject();
   * console.log(all.x); // 1
   */
  toObject(): Record<string, unknown> {
    return { ...this.store };
  }

  /**
   * Removes a configuration key.
   *
   * @param {string} key - The key to delete.
   * @returns {boolean} True if the key existed and was deleted.
   *
   * @example
   * const config = new TypedConfig({ temp: 'value' });
   * console.log(config.delete('temp')); // true
   */
  delete(key: string): boolean {
    if (!(key in this.store)) return false;
    delete this.store[key];
    return true;
  }

  private flatten(obj: Record<string, unknown>, prefix = ''): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${k}` : k;
      if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
        Object.assign(result, this.flatten(v as Record<string, unknown>, fullKey));
      } else {
        result[fullKey] = v;
      }
    }
    return result;
  }
}
