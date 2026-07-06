import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;
  let stdoutWriteSpy: jest.SpyInstance;
  let stderrWriteSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new TskvLogger();
    stdoutWriteSpy = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => true);
    stderrWriteSpy = jest
      .spyOn(process.stderr, 'write')
      .mockImplementation(() => true);
  });

  afterEach(() => {
    stdoutWriteSpy.mockRestore();
    stderrWriteSpy.mockRestore();
  });

  describe('log', () => {
    it('форматирует запись как пары key=value через табуляцию', () => {
      logger.log('Hello', 'NestFactory');

      expect(stdoutWriteSpy).toHaveBeenCalledWith(
        'level=log\tmessage=Hello\toptionalParams=["NestFactory"]\n',
      );
    });

    it('экранирует табуляции и переносы строк в значениях', () => {
      logger.log('line1\nline2\ttab');

      expect(stdoutWriteSpy).toHaveBeenCalledWith(
        'level=log\tmessage=line1 line2 tab\n',
      );
    });
  });

  describe('error', () => {
    it('пишет ошибку в stderr в формате TSKV', () => {
      logger.error('Database error');

      expect(stderrWriteSpy).toHaveBeenCalledWith(
        'level=error\tmessage=Database error\n',
      );
    });
  });
});
