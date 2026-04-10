/**
 * A type-safe EventEmitter implementation following the Observer pattern.
 * Supports multiple listeners per event, one-time listeners, and listener removal.
 *
 * @template Events A record type mapping event names to their payload types.
 *
 * @example
 * type MyEvents = { data: string; error: Error };
 * const emitter = new EventEmitter<MyEvents>();
 * emitter.on('data', (msg) => console.log(msg));
 * emitter.emit('data', 'hello');
 */
export class EventEmitter<Events extends Record<string, unknown>> {
  private listeners: Map<keyof Events, Array<(payload: unknown) => void>> = new Map();

  /**
   * Registers a listener for the given event.
   *
   * @template K The event name key.
   * @param {K} event - The event name.
   * @param {(payload: Events[K]) => void} listener - The callback to invoke.
   * @returns {this} The emitter instance (for chaining).
   *
   * @example
   * type E = { greet: string };
   * const emitter = new EventEmitter<E>();
   * emitter.on('greet', msg => console.log(msg));
   */
  on<K extends keyof Events>(event: K, listener: (payload: Events[K]) => void): this {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event)!.push(listener as (payload: unknown) => void);
    return this;
  }

  /**
   * Registers a one-time listener that automatically removes itself after firing once.
   *
   * @template K The event name key.
   * @param {K} event - The event name.
   * @param {(payload: Events[K]) => void} listener - The callback to invoke once.
   * @returns {this} The emitter instance (for chaining).
   *
   * @example
   * type E = { init: void };
   * const emitter = new EventEmitter<E>();
   * emitter.once('init', () => console.log('initialized'));
   */
  once<K extends keyof Events>(event: K, listener: (payload: Events[K]) => void): this {
    const wrapper = (payload: Events[K]) => {
      listener(payload);
      this.off(event, wrapper);
    };
    return this.on(event, wrapper);
  }

  /**
   * Removes a specific listener from the given event.
   *
   * @template K The event name key.
   * @param {K} event - The event name.
   * @param {(payload: Events[K]) => void} listener - The listener to remove.
   * @returns {this} The emitter instance (for chaining).
   *
   * @example
   * type E = { click: number };
   * const emitter = new EventEmitter<E>();
   * const handler = (n: number) => console.log(n);
   * emitter.on('click', handler);
   * emitter.off('click', handler);
   */
  off<K extends keyof Events>(event: K, listener: (payload: Events[K]) => void): this {
    const current = this.listeners.get(event);
    if (current) {
      this.listeners.set(
        event,
        current.filter(l => l !== (listener as (payload: unknown) => void))
      );
    }
    return this;
  }

  /**
   * Emits an event, invoking all registered listeners with the given payload.
   *
   * @template K The event name key.
   * @param {K} event - The event name.
   * @param {Events[K]} payload - The data to pass to listeners.
   * @returns {boolean} True if any listeners were called.
   *
   * @example
   * type E = { message: string };
   * const emitter = new EventEmitter<E>();
   * emitter.on('message', msg => console.log(msg));
   * emitter.emit('message', 'hello'); // true
   */
  emit<K extends keyof Events>(event: K, payload: Events[K]): boolean {
    const current = this.listeners.get(event);
    if (!current || current.length === 0) return false;
    current.forEach(l => l(payload));
    return true;
  }

  /**
   * Removes all listeners for a specific event, or all events if no argument is given.
   *
   * @param {keyof Events} [event] - The event name to clear, or undefined to clear all.
   * @returns {void}
   *
   * @example
   * const emitter = new EventEmitter<{ a: void; b: void }>();
   * emitter.removeAllListeners('a'); // clears only 'a' listeners
   * emitter.removeAllListeners();    // clears everything
   */
  removeAllListeners(event?: keyof Events): void {
    if (event !== undefined) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }

  /**
   * Returns the number of listeners registered for an event.
   *
   * @param {keyof Events} event - The event name.
   * @returns {number} The count of listeners.
   *
   * @example
   * const emitter = new EventEmitter<{ tick: void }>();
   * emitter.on('tick', () => {});
   * console.log(emitter.listenerCount('tick')); // 1
   */
  listenerCount(event: keyof Events): number {
    return this.listeners.get(event)?.length ?? 0;
  }
}
