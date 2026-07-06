import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  private formatMessage(
    level: string,
    message: unknown,
    ...optionalParams: unknown[]
  ): string {
    const fields: Record<string, string> = {
      level: this.toFieldValue(level),
      message: this.toFieldValue(message),
    };

    if (optionalParams.length > 0) {
      fields.optionalParams = this.toFieldValue(optionalParams);
    }

    return (
      Object.entries(fields)
        .map(([key, value]) => `${key}=${value}`)
        .join('\t') + '\n'
    );
  }

  private toFieldValue(value: unknown): string {
    const serialized =
      typeof value === 'string' ? value : JSON.stringify(value);

    return serialized.replace(/\t/g, ' ').replace(/\n/g, ' ');
  }

  log(message: unknown, ...optionalParams: unknown[]): void {
    process.stdout.write(this.formatMessage('log', message, ...optionalParams));
  }

  error(message: unknown, ...optionalParams: unknown[]): void {
    process.stderr.write(
      this.formatMessage('error', message, ...optionalParams),
    );
  }

  warn(message: unknown, ...optionalParams: unknown[]): void {
    process.stdout.write(
      this.formatMessage('warn', message, ...optionalParams),
    );
  }

  debug(message: unknown, ...optionalParams: unknown[]): void {
    process.stdout.write(
      this.formatMessage('debug', message, ...optionalParams),
    );
  }

  verbose(message: unknown, ...optionalParams: unknown[]): void {
    process.stdout.write(
      this.formatMessage('verbose', message, ...optionalParams),
    );
  }

  fatal(message: unknown, ...optionalParams: unknown[]): void {
    process.stderr.write(
      this.formatMessage('fatal', message, ...optionalParams),
    );
  }
}
