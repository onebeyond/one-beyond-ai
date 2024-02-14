export enum LogLevel {
  NONE = 0,
  ERROR = 1,
  WARN = 2,
  INFO = 3,
  DEBUG = 4,
}

export interface LoggerClient {
  info(...messages: any[]): void;
  error(...messages: any[]): void;
  warn(...messages: any[]): void;
  debug(...messages: any[]): void;
}
