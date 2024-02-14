export enum LogLevel {
  NONE = 0,
  ERROR = 1,
  WARN =  2,
  INFO = 3,
  DEBUG = 4,
}

export interface LoggerClient {
  info(message: string): void;
  error(message: string): void;
  warn(message: string): void;
  debug(message: string): void;
}
