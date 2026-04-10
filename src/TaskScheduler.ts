/**
 * Represents a scheduled task.
 */
export interface ScheduledTask {
  id: string;
  name: string;
  intervalMs: number;
  callback: () => void | Promise<void>;
  lastRunAt?: Date;
  runCount: number;
}

/**
 * An in-process task scheduler that manages recurring and one-shot tasks.
 * Useful for background jobs, polling, and periodic cleanup routines.
 *
 * @example
 * const scheduler = new TaskScheduler();
 * scheduler.schedule('heartbeat', 5000, () => console.log('ping'));
 * scheduler.start();
 * setTimeout(() => scheduler.stop(), 30000);
 */
export class TaskScheduler {
  private tasks: Map<string, ScheduledTask> = new Map();
  private timers: Map<string, ReturnType<typeof setInterval>> = new Map();
  private running: boolean = false;

  /**
   * Registers a recurring task with the given interval.
   * If a task with the same id already exists, it is replaced.
   *
   * @param {string} id - Unique task identifier.
   * @param {number} intervalMs - Interval in milliseconds between executions.
   * @param {() => void | Promise<void>} callback - The function to execute.
   * @param {string} [name] - Optional human-readable task name.
   * @returns {void}
   *
   * @example
   * const scheduler = new TaskScheduler();
   * scheduler.schedule('cleanup', 60000, async () => {
   *   console.log('Running cleanup...');
   * });
   */
  schedule(id: string, intervalMs: number, callback: () => void | Promise<void>, name?: string): void {
    this.cancel(id);
    const task: ScheduledTask = { id, name: name ?? id, intervalMs, callback, runCount: 0 };
    this.tasks.set(id, task);
    if (this.running) this.startTask(id);
  }

  /**
   * Starts the scheduler and all registered tasks.
   *
   * @returns {void}
   * @throws {Error} If the scheduler is already running.
   *
   * @example
   * const scheduler = new TaskScheduler();
   * scheduler.schedule('ping', 1000, () => console.log('ping'));
   * scheduler.start();
   */
  start(): void {
    if (this.running) throw new Error('Scheduler is already running');
    this.running = true;
    for (const id of this.tasks.keys()) this.startTask(id);
  }

  /**
   * Stops all running tasks and halts the scheduler.
   *
   * @returns {void}
   *
   * @example
   * const scheduler = new TaskScheduler();
   * scheduler.start();
   * scheduler.stop();
   */
  stop(): void {
    this.running = false;
    for (const id of this.timers.keys()) {
      clearInterval(this.timers.get(id)!);
    }
    this.timers.clear();
  }

  /**
   * Cancels and removes a specific task by ID.
   *
   * @param {string} id - The task ID to cancel.
   * @returns {boolean} True if the task was found and cancelled.
   *
   * @example
   * const scheduler = new TaskScheduler();
   * scheduler.schedule('job1', 1000, () => {});
   * scheduler.cancel('job1'); // true
   */
  cancel(id: string): boolean {
    if (this.timers.has(id)) {
      clearInterval(this.timers.get(id)!);
      this.timers.delete(id);
    }
    return this.tasks.delete(id);
  }

  /**
   * Returns the task descriptor for a given ID.
   *
   * @param {string} id - The task ID.
   * @returns {ScheduledTask | undefined} The task, or undefined if not found.
   *
   * @example
   * const scheduler = new TaskScheduler();
   * scheduler.schedule('job', 5000, () => {});
   * console.log(scheduler.getTask('job')?.runCount); // 0
   */
  getTask(id: string): ScheduledTask | undefined {
    return this.tasks.get(id);
  }

  /**
   * Returns all registered tasks.
   *
   * @returns {ScheduledTask[]} Array of all task descriptors.
   *
   * @example
   * const scheduler = new TaskScheduler();
   * scheduler.schedule('a', 1000, () => {});
   * scheduler.schedule('b', 2000, () => {});
   * console.log(scheduler.listTasks().length); // 2
   */
  listTasks(): ScheduledTask[] {
    return Array.from(this.tasks.values());
  }

  private startTask(id: string): void {
    const task = this.tasks.get(id);
    if (!task) return;
    const timer = setInterval(async () => {
      task.lastRunAt = new Date();
      task.runCount++;
      await task.callback();
    }, task.intervalMs);
    this.timers.set(id, timer);
  }
}
