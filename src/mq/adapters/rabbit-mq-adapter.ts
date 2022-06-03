import { inject, injectable } from 'inversify';
import { AMQPClient, AMQPChannel } from '@cloudamqp/amqp-client';
import { QueueCreationArguments } from '../../models/mq';
import { MessageQueueAdapter } from '../interfaces/message-queue-adapter';
import { Logger } from '../../config/logger';

@injectable()
export class RabbitMqAdapter implements MessageQueueAdapter {
  private client!: AMQPClient;
  private channel!: AMQPChannel;

  @inject(Logger)
  private readonly logger!: Logger;

  readonly protocolIdentifier: RegExp = /^amqp(s)?:\/\//;

  async addSubscription(_name: string, topic: string, _routingKeys: Map<string, string>, _options?: QueueCreationArguments | undefined): Promise<boolean> {
    if (!this.isConnected()) {
      return false;
    }

    const queue = await this.channel.queue(topic);
    queue.subscribe({}, (msg) => this.logger.info(msg.bodyString() ?? 'no body supplied'));
    return true;
  }

  async initializeConnection(connectionString: string): Promise<boolean> {
    if (this.isConnected()) {
      return true;
    }

    if (!this.protocolIdentifier.test(connectionString)) {
      return false;
    }

    this.client = new AMQPClient(connectionString);
    const connection = await this.client.connect();
    this.channel = await connection.channel();

    return true;
  }

  createTopic(_topic: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  private isConnected(): boolean {
    return this.client && !this.client.closed;
  }
}