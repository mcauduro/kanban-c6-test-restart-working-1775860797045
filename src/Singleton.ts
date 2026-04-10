/**
 * Application-wide logger implemented as a Singleton.
 * Ensures a single shared instance is used throughout the application.
 *
 * @example
 * const logger = AppLogger.getInstance();
 * logger.info('Application started');
 */
export class AppLogger {
  private static instance: AppLogger | null = null;
  private logs: Array<{ level: string; message: string; timestamp: Date }> = [];
  private level: 'debug' | 'info' | 'warn' | 'error' = 'info';

  private constructor() {}

  /**
   * Returns the singleton instance of AppLogger.
   * Creates the instance on first call.
   *
   * @returns {AppLogger} The shared logger instance.
   *
   * @example
   * const logger = AppLogger.getInstance();
   * console.log(AppLogger.getInstance() === AppLogger.getInstance()); // true
   */
  static getInstance(): AppLogger {
    if (!AppLogger.instance) AppLogger.instance = new AppLogger();
    return AppLogger.instance;
  }

  /**
   * Sets the minimum log level. Messages below this level are ignored.
   *
   * @param {'debug' | 'info' | 'warn' | 'error'} level - The minimum level to log.
   * @returns {void}
   *
   * @example
   * AppLogger.getInstance().setLevel('warn');
   */
  setLevel(level: 'debug' | 'info' | 'warn' | 'error'): void {
    this.level = level;
  }

  /**
   * Logs a message at the INFO level.
   *
   * @param {string} message - The message to log.
   * @returns {void}
   *
   * @example
   * AppLogger.getInstance().info('Server started on port 3000');
   */
  info(message: string): void {
    this.log('info', message);
  }

  /**
   * Logs a message at the WARN level.
   *
   * @param {string} message - The warning message.
   * @returns {void}
   *
   * @example
   * AppLogger.getInstance().warn('Deprecated API used');
   */
  warn(message: string): void {
    this.log('warn', message);
  }

  /**
   * Logs a message at the ERROR level.
   *
   * @param {string} message - The error message.
   * @returns {void}
   *
   * @example
   * AppLogger.getInstance().error('Unhandled exception occurred');
   */
  error(message: string): void {
    this.log('error', message);
  }

  /**
   * Returns all stored log entries.
   *
   * @returns {Array<{ level: string; message: string; timestamp: Date }>} Stored log entries.
   *
   * @example
   * const logger = AppLogger.getInstance();
   * logger.info('test');
   * console.log(logger.getLogs().length); // >= 1
   */
  getLogs(): Array<{ level: string; message: string; timestamp: Date }> {
    return [...this.logs];
  }

  /**
   * Clears all stored log entries.
   *
   * @returns {void}
   *
   * @example
   * AppLogger.getInstance().clearLogs();
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Resets the singleton (useful for testing).
   * @internal
   */
  static reset(): void {
    AppLogger.instance = null;
  }

  private log(level: string, message: string): void {
    const levels = ['debug', 'info', 'warn', 'error'];
    if (levels.indexOf(level) >= levels.indexOf(this.level)) {
      this.logs.push({ level, message, timestamp: new Date() });
      console.log(`[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}`);
    }
  }
}
