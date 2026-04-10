/**
 * Interface that all observers must implement.
 * @template T The payload type received on update.
 */
export interface IObserver<T> {
  update(payload: T): void;
}

/**
 * Generic Subject (Observable) implementation of the Observer design pattern.
 * Maintains a list of observers and notifies them on state changes.
 *
 * @template T The type of state/payload managed by the subject.
 *
 * @example
 * class Logger implements IObserver<string> {
 *   update(msg: string) { console.log('LOG:', msg); }
 * }
 * const subject = new Subject<string>();
 * subject.attach(new Logger());
 * subject.notify('event fired');
 */
export class Subject<T> {
  private observers: IObserver<T>[] = [];
  private state: T | undefined;

  /**
   * Attaches a new observer to the subject.
   *
   * @param {IObserver<T>} observer - The observer to attach.
   * @returns {void}
   *
   * @example
   * const subject = new Subject<number>();
   * subject.attach({ update: n => console.log(n) });
   */
  attach(observer: IObserver<T>): void {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  /**
   * Detaches an observer from the subject.
   *
   * @param {IObserver<T>} observer - The observer to remove.
   * @returns {void}
   *
   * @example
   * const obs = { update: (n: number) => console.log(n) };
   * const subject = new Subject<number>();
   * subject.attach(obs);
   * subject.detach(obs);
   */
  detach(observer: IObserver<T>): void {
    const idx = this.observers.indexOf(observer);
    if (idx !== -1) this.observers.splice(idx, 1);
  }

  /**
   * Notifies all attached observers with the given payload.
   *
   * @param {T} payload - The data to deliver to each observer.
   * @returns {void}
   *
   * @example
   * const subject = new Subject<string>();
   * subject.attach({ update: s => console.log(s) });
   * subject.notify('hello observers');
   */
  notify(payload: T): void {
    this.state = payload;
    for (const observer of this.observers) {
      observer.update(payload);
    }
  }

  /**
   * Sets the internal state and triggers a notification to all observers.
   *
   * @param {T} state - The new state value.
   * @returns {void}
   *
   * @example
   * const subject = new Subject<number>();
   * subject.setState(42); // notifies all observers with 42
   */
  setState(state: T): void {
    this.notify(state);
  }

  /**
   * Returns the current internal state of the subject.
   *
   * @returns {T | undefined} The current state, or undefined if not yet set.
   *
   * @example
   * const subject = new Subject<string>();
   * subject.setState('active');
   * console.log(subject.getState()); // 'active'
   */
  getState(): T | undefined {
    return this.state;
  }

  /**
   * Returns the number of currently attached observers.
   *
   * @returns {number} Observer count.
   *
   * @example
   * const subject = new Subject<void>();
   * subject.attach({ update: () => {} });
   * console.log(subject.observerCount()); // 1
   */
  observerCount(): number {
    return this.observers.length;
  }
}
