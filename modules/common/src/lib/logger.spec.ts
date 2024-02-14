import { logger } from './logger';
import { LoggerClient, LogLevel } from '../types';

describe('logger', () => {
  const loggerMethod = jest.fn();
  let clientMock: LoggerClient;

  beforeEach(() => {
    jest.resetAllMocks();
    loggerMethod.mockImplementation((...messages) => messages);
    clientMock = {
      error: loggerMethod,
      warn: loggerMethod,
      info: loggerMethod,
      debug: loggerMethod,
    };
  });
  it('should call the logger client', () => {
    logger.setClient(clientMock);
    logger.setLogLevel(LogLevel.DEBUG);
    logger.error('error');
    logger.warn('warn');
    logger.info('info');
    logger.debug('debug');
    expect(loggerMethod).toHaveBeenCalledTimes(4);
    expect(loggerMethod).toHaveBeenNthCalledWith(1, 'error');
    expect(loggerMethod).toHaveBeenNthCalledWith(2, 'warn');
    expect(loggerMethod).toHaveBeenNthCalledWith(3, 'info');
    expect(loggerMethod).toHaveBeenNthCalledWith(4, 'debug');
  });
  it('should not call the logger client', () => {
    logger.setClient(clientMock);
    logger.setLogLevel(LogLevel.NONE);
    logger.error('error');
    logger.warn('warn');
    logger.info('info');
    logger.debug('debug');
    expect(loggerMethod).toHaveBeenCalledTimes(0);
  });
});
