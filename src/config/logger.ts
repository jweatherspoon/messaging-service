import { injectable } from 'inversify';

/**
 * Application level logging
 */
@injectable()
export class Logger {
  /**
   * Log a message
   * @param message the message to log
   */
  async log(message: string): Promise<void> {
    console.log(this.formatMessage(message));
  }

  /**
   * Log a message as info
   * @param message the message to log
   */
  async info(message: string): Promise<void> {
    console.info(this.formatMessage(message));
  }

  /**
   * log an error message
   * @param message the error message
   */
  async error(message: string): Promise<void> {
    console.error(this.formatMessage(message));
  }

  /**
   * Format a message for logging
   * @param message the message contents
   * @returns The message plus a timestamp
   */
  private formatMessage(message: string): string {
    return `[${new Date().toISOString()}]: ${message}`;
  }
}