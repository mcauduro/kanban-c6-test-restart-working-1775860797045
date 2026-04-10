/**
 * A transition function type invoked during a state change.
 * @template S The state type.
 * @template E The event type.
 */
export type TransitionAction<S, E> = (from: S, to: S, event: E) => void;

/**
 * Describes a single transition rule.
 * @template S The state type.
 * @template E The event type.
 */
export interface TransitionRule<S, E> {
  from: S;
  event: E;
  to: S;
  action?: TransitionAction<S, E>;
}

/**
 * A generic finite state machine (FSM) implementation.
 * Define states, events, and transition rules to model complex workflows.
 *
 * @template S The type representing states (e.g., string enum).
 * @template E The type representing events (e.g., string enum).
 *
 * @example
 * type TrafficState = 'red' | 'green' | 'yellow';
 * type TrafficEvent = 'timer';
 * const fsm = new StateMachine<TrafficState, TrafficEvent>('red');
 * fsm.addTransition({ from: 'red', event: 'timer', to: 'green' });
 */
export class StateMachine<S, E> {
  private current: S;
  private transitions: TransitionRule<S, E>[] = [];
  private history: S[] = [];

  /**
   * Creates a new StateMachine starting in the given initial state.
   *
   * @param {S} initialState - The state the machine starts in.
   *
   * @example
   * const fsm = new StateMachine<string, string>('idle');
   */
  constructor(initialState: S) {
    this.current = initialState;
    this.history.push(initialState);
  }

  /**
   * Registers a transition rule.
   *
   * @param {TransitionRule<S, E>} rule - The transition to add.
   * @returns {this} The FSM instance for chaining.
   *
   * @example
   * const fsm = new StateMachine<string, string>('idle');
   * fsm.addTransition({ from: 'idle', event: 'start', to: 'running' });
   */
  addTransition(rule: TransitionRule<S, E>): this {
    this.transitions.push(rule);
    return this;
  }

  /**
   * Dispatches an event, triggering a state transition if a matching rule exists.
   *
   * @param {E} event - The event to dispatch.
   * @returns {boolean} True if a transition occurred.
   * @throws {Error} If no transition is found for the current state and event.
   *
   * @example
   * const fsm = new StateMachine<string, string>('idle');
   * fsm.addTransition({ from: 'idle', event: 'start', to: 'running' });
   * fsm.dispatch('start'); // true
   */
  dispatch(event: E): boolean {
    const rule = this.transitions.find(t => t.from === this.current && t.event === event);
    if (!rule) throw new Error(`No transition from '${this.current}' on event '${event}'`);
    const prev = this.current;
    this.current = rule.to;
    this.history.push(rule.to);
    rule.action?.(prev, rule.to, event);
    return true;
  }

  /**
   * Returns the current state.
   *
   * @returns {S} The current state value.
   *
   * @example
   * const fsm = new StateMachine<string, string>('idle');
   * console.log(fsm.getState()); // 'idle'
   */
  getState(): S {
    return this.current;
  }

  /**
   * Returns the full history of states visited (including initial state).
   *
   * @returns {S[]} Array of states in chronological order.
   *
   * @example
   * const fsm = new StateMachine<string, string>('idle');
   * fsm.addTransition({ from: 'idle', event: 'go', to: 'running' });
   * fsm.dispatch('go');
   * console.log(fsm.getHistory()); // ['idle', 'running']
   */
  getHistory(): S[] {
    return [...this.history];
  }

  /**
   * Checks whether the given event can be dispatched from the current state.
   *
   * @param {E} event - The event to test.
   * @returns {boolean} True if a transition exists.
   *
   * @example
   * const fsm = new StateMachine<string, string>('idle');
   * fsm.addTransition({ from: 'idle', event: 'go', to: 'running' });
   * console.log(fsm.can('go'));   // true
   * console.log(fsm.can('stop')); // false
   */
  can(event: E): boolean {
    return this.transitions.some(t => t.from === this.current && t.event === event);
  }

  /**
   * Returns all events that can be dispatched from the current state.
   *
   * @returns {E[]} Array of valid events.
   *
   * @example
   * const fsm = new StateMachine<string, string>('idle');
   * fsm.addTransition({ from: 'idle', event: 'start', to: 'running' });
   * fsm.addTransition({ from: 'idle', event: 'reset', to: 'idle' });
   * console.log(fsm.availableEvents()); // ['start', 'reset']
   */
  availableEvents(): E[] {
    return this.transitions
      .filter(t => t.from === this.current)
      .map(t => t.event);
  }
}
