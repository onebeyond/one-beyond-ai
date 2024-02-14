import { LoggerClient, LogLevel } from '../types';

class Logger {
  public client: LoggerClient;
  private logLevel: LogLevel = LogLevel.WARN;

  constructor(client: LoggerClient) {
    this.client = client;
  }

  public setClient(client: LoggerClient) {
    this.client = client;
  }

  public setLogLevel(level: LogLevel) {
    this.logLevel = level;
  }

  public error(...messages: any[]) {
    if (this.logLevel >= LogLevel.ERROR) {
      this.client.error(...messages);
    }
  }

  public warn(...messages: any[]) {
    if (this.logLevel >= LogLevel.WARN) {
      this.client.warn(...messages);
    }
  }

  public info(...messages: any[]) {
    if (this.logLevel >= LogLevel.INFO) {
      this.client.info(...messages);
    }
  }

  public debug(...messages: any[]) {
    if (this.logLevel >= LogLevel.DEBUG) {
      this.client.debug(...messages);
    }
  }
}

export const logger = new Logger(console);
