import { LoggerClient, LogLevel } from '../types';

export class Logger {
  public client: LoggerClient;
  private logLevel: LogLevel = LogLevel.WARN;

  constructor(client: LoggerClient) {
    this.client = client;
  }

  /**
   * Set the client to use for logging
   * @param client
   */
  public setClient(client: LoggerClient) {
    this.client = client;
  }

  /**
   * Set the log level
   * @param level
   * @example
   * ```ts
   * logger.setLogLevel(LogLevel.DEBUG);
   * ```
   */
  public setLogLevel(level: LogLevel) {
    this.logLevel = level;
  }

  /**
   * Log an error message
   * @param messages
   * @example
   * ```ts
   * logger.error('message1', 'message2');
   * ```
   */
  public error(...messages: any[]) {
    if (this.logLevel >= LogLevel.ERROR) {
      this.client.error(...messages);
    }
  }

  /**
   * Log a warning message
   * @param messages
   * @example
   * ```ts
   * logger.warn('message1', 'message2');
   * ```
   */
  public warn(...messages: any[]) {
    if (this.logLevel >= LogLevel.WARN) {
      this.client.warn(...messages);
    }
  }

  /**
   * Log an info message
   * @param messages
   * @example
   * ```ts
   * logger.info('message1', 'message2');
   * ```
   */
  public info(...messages: any[]) {
    if (this.logLevel >= LogLevel.INFO) {
      this.client.info(...messages);
    }
  }

  /**
   * Log a debug message
   * @param messages
   * @example
   * ```ts
   * logger.debug('message1', 'message2');
   * ```
   */
  public debug(...messages: any[]) {
    if (this.logLevel >= LogLevel.DEBUG) {
      this.client.debug(...messages);
    }
  }
}

export const logger = new Logger(console);
