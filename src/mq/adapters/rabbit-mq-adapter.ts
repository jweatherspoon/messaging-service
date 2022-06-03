import { inject, injectable } from 'inversify';
import { AMQPClient, AMQPChannel } from '@cloudamqp/amqp-client';
import { MQRoutingInfo, QueueCreationArguments } from '../../models/mq';
import { MessageQueueAdapter } from '../interfaces/message-queue-adapter';
import { Logger } from '../../config/logger';

@injectable()
export class RabbitMqAdapter implements MessageQueueAdapter {
  private client!: AMQPClient;
  private channel!: AMQPChannel;

  @inject(Logger)
  private readonly logger!: Logger;

  readonly protocolIdentifier: RegExp = /^amqp(s)?:\/\//;
  
  get isConnected(): boolean {
    return this.client && !this.client.closed;
  }

  async addSubscription(name: string, info: MQRoutingInfo, _options?: QueueCreationArguments | undefined): Promise<boolean> {
    if (!this.isConnected) {
      return false;
    }

    const queue = await this.channel.queue(name);
    await this.createTopic(info.topic);
    await this.channel.queueBind(name, info.topic, '', info.routingKeys);
    
    await queue.subscribe({}, (msg) => this.logger.info(msg.bodyString() ?? 'no body supplied'));
    return true;
  }

  async initializeConnection(connectionString: string): Promise<boolean> {
    if (this.isConnected) {
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

  async createTopic(topic: string): Promise<boolean> {
    if (!this.isConnected) {
      return false;
    }

    try {
      await this.channel.exchangeDeclare(topic, 'headers');
      return true;
    } catch (err) {
      this.logger.error(`Failed to create topic!\n\n${err}`);
      return false;
    }
  }

  async publish(message: string, info: MQRoutingInfo): Promise<boolean> {
    if (!this.isConnected) {
      return false;
    }

    try {
      await this.channel.basicPublish(info.topic, '', message, { 
        headers: info.routingKeys ?? {}
      });

      return true;
    } catch (err) {
      this.logger.error(`Failed to publish message to topic ${info.topic}\n\n${err}`);
      return false;
    }
  }
}