import { injectable } from 'inversify';
import { QueueCreationArguments } from '../../models/mq';
import { MessageQueueAdapter } from '../interfaces/message-queue-adapter';

@injectable()
export class RabbitMqAdapter implements MessageQueueAdapter {
  readonly protocolIdentifier: RegExp = /amqp(s):\/\/?/;

  addSubscription(_name: string, _topic: string, _routingKeys: Map<string, string>, _options?: QueueCreationArguments | undefined): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  initializeConnection(_connectionString: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  createTopic(_topic: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}