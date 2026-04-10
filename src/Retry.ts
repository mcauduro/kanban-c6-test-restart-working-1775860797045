/**
 * Options for configuring retry behaviour.
 */
export interface RetryOptions {
  /** Maximum number of attempts (including the first). */
  maxAttempts: number;
  /** Base delay in milliseconds between retries. */
  delayMs: number;
  /** Whether to use exponential backoff (delay doubles each attempt). */
  exponential?: boolean;
  /** Optional predicate: return true to retry, false to stop immediately. */
  retryIf?: (error: unknown) => boolean;
}

/**
 * Encapsulates retry logic for async operations.
 * Supports fixed delay, exponential backoff, and conditional retry.
 *
 * @example
 * const retry = new Retry({ maxAttempts: 3, delayMs: 100 });
 * const result = await retry.execute(() => fetch('/api/data'));
 */
export class Retry {
  private readonly options: Required<RetryOptions>;

  /**
   * Creates a new Retry instance with the given configuration.
   *
   * @param {RetryOptions} options - Retry configuration options.
   *
   * @example
   * const retry = new Retry({ maxAttempts: 5, delayMs: 200, exponential: true });
   */
  constructor(options: RetryOptions) {
    this.options = {
      exponential: false,
      retryIf: () => true,
      ...options,
    };
  }

  /**
   * Executes the given async operation with automatic retry on failure.
   *
   * @template T The return type of the operation.
   * @param {() => Promise<T>} operation - The async function to execute.
   * @returns {Promise<T>} Resolves with the first successful result.
   * @throws {Error} Re-throws the last error after all attempts are exhausted.
   *
   * @example
   * const retry = new Retry({ maxAttempts: 3, delayMs: 50 });
   * let calls = 0;
   * const result = await retry.execute(async () => {
   *   if (++calls < 3) throw new Error('not yet');
   *   return 'success';
   * });
   * console.log(result); // 'success'
   */
  async execute<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: unknown;
    for (let attempt = 1; attempt <= this.options.maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (err) {
        lastError = err;
        if (attempt === this.options.maxAttempts) break;
        if (!this.options.retryIf(err)) break;
        await this.delay(attempt);
      }
    }
    throw lastError;
  }

  /**
   * Returns the computed delay for a given attempt number.
   * Applies exponential backoff if configured.
   *
   * @param {number} attempt - The current attempt number (1-based).
   * @returns {number} Delay in milliseconds.
   *
   * @example
   * const retry = new Retry({ maxAttempts: 3, delayMs: 100, exponential: true });
   * console.log(retry.computeDelay(1)); // 100
   * console.log(retry.computeDelay(2)); // 200
   */
  computeDelay(attempt: number): number {
    return this.options.exponential
      ? this.options.delayMs * Math.pow(2, attempt - 1)
      : this.options.delayMs;
  }

  /**
   * Updates the retry options (e.g., to change max attempts at runtime).
   *
   * @param {Partial<RetryOptions>} updates - Partial options to merge.
   * @returns {void}
   *
   * @example
   * const retry = new Retry({ maxAttempts: 3, delayMs: 100 });
   * retry.configure({ maxAttempts: 5 });
   */
  configure(updates: Partial<RetryOptions>): void {
    Object.assign(this.options, updates);
  }

  /**
   * Creates a wrapped version of an async function that retries automatically.
   *
   * @template T The return type.
   * @param {() => Promise<T>} fn - The async function to wrap.
   * @returns {() => Promise<T>} A new function that applies retry logic.
   *
   * @example
   * const retry = new Retry({ maxAttempts: 3, delayMs: 50 });
   * const robustFetch = retry.wrap(() => fetch('/api'));
   * await robustFetch();
   */
  wrap<T>(fn: () => Promise<T>): () => Promise<T> {
    return () => this.execute(fn);
  }

  /**
   * Returns the current retry configuration.
   *
   * @returns {Required<RetryOptions>} The current options.
   *
   * @example
   * const retry = new Retry({ maxAttempts: 3, delayMs: 100 });
   * console.log(retry.getOptions().maxAttempts); // 3
   */
  getOptions(): Required<RetryOptions> {
    return { ...this.options };
  }

  private delay(attempt: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, this.computeDelay(attempt)));
  }
}
