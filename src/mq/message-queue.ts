import { inject, injectable } from 'inversify';
import config from '../config';
import { Types } from '../config/ioc';
import { Logger } from '../config/logger';
import { MessageQueueAdapter } from './interfaces/message-queue-adapter';


@injectable()
export class MessageQueue {
  private readonly adapter?: MessageQueueAdapter;

  constructor(@inject(Logger) private readonly logger: Logger, @inject(Types.MessageQueueAdapter) adapters: MessageQueueAdapter[]) {
    this.adapter = adapters.find(x => x.protocolIdentifier.test(config.messageBus.connectionString));
    if (!this.adapter) {
      const error = 'No adapter found to match connection string';

      this.logger.error(error);
      throw new Error(error);
    }
  }
}