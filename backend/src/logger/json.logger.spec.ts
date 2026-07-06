import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;

  beforeEach(() => {
    logger = new JsonLogger();
  });

  describe('formatMessage', () => {
    it('возвращает JSON с уровнем, сообщением и дополнительными параметрами', () => {
      const formatted = logger.formatMessage('log', 'Hello', 'Context');

      expect(JSON.parse(formatted)).toEqual({
        level: 'log',
        message: 'Hello',
        optionalParams: ['Context'],
      });
    });

    it('сериализует объект в поле message', () => {
      const formatted = logger.formatMessage('error', { code: 500 });

      expect(JSON.parse(formatted)).toEqual({
        level: 'error',
        message: { code: 500 },
        optionalParams: [],
      });
    });
  });

  describe('log', () => {
    it('отправляет отформатированное сообщение в console.log', () => {
      const consoleSpy = jest
        .spyOn(console, 'log')
        .mockImplementation(() => undefined);

      logger.log('Started', 'AppModule');

      expect(consoleSpy).toHaveBeenCalledWith(
        JSON.stringify({
          level: 'log',
          message: 'Started',
          optionalParams: ['AppModule'],
        }),
      );

      consoleSpy.mockRestore();
    });
  });

  describe('error', () => {
    it('отправляет отформатированное сообщение в console.error', () => {
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);

      logger.error('Failed');

      expect(consoleSpy).toHaveBeenCalledWith(
        JSON.stringify({
          level: 'error',
          message: 'Failed',
          optionalParams: [],
        }),
      );

      consoleSpy.mockRestore();
    });
  });
});
