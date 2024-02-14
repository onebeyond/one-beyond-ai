import { LoggerClient, LogLevel } from "../types";

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

  public error(message: string) {
    if (this.logLevel >= LogLevel.ERROR) {
      this.client.error(message);
    }
  }

  public warn(message: string) {
    if (this.logLevel >= LogLevel.WARN) {
      this.client.warn(message);
    }
  }

  public info(message: string) {
    if (this.logLevel >= LogLevel.INFO) {
      this.client.info(message);
    }
  }

  public debug(message: string) {
    if (this.logLevel >= LogLevel.DEBUG) {
      this.client.debug(message);
    }
  }
}

export const logger = new Logger(console);
