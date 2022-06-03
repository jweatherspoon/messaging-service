import { inject, injectable, multiInject } from 'inversify';
import config from '../config';
import { Types } from '../config/ioc';
import { Logger } from '../config/logger';
import { MQRoutingInfo } from '../models/mq';
import { MessageQueueAdapter } from './interfaces/message-queue-adapter';


@injectable()
export class MessageQueue {
  private readonly connectionString: string;
  private readonly adapter?: MessageQueueAdapter;

  private readonly subscriptions: Map<string, MQRoutingInfo> = new Map();

  constructor(@inject(Logger) private readonly logger: Logger, @multiInject(Types.MessageQueueAdapter) adapters: MessageQueueAdapter[]) {
    this.connectionString = config.messageBus.connectionString ?? '';
    this.adapter = adapters.find(x => x.protocolIdentifier.test(this.connectionString));
    if (!this.adapter) {
      const error = 'No adapter found to match connection string';

      this.logger.error(error);
      throw new Error(error);
    }
  }

  async initializeConnection(): Promise<boolean> {
    if (this.adapter?.isConnected) {
      return true;
    }

    return Boolean(await this.adapter?.initializeConnection(this.connectionString));
  }

  async subscribe(name: string, info: MQRoutingInfo): Promise<boolean> {
    if (this.subscriptions.has(name)) {
      this.logger.error(`Subscription ${name} is already active`);
      return false;
    }

    if (!this.adapter?.isConnected) {
      this.logger.error('MQ adapter is not connected');
      return false;
    }

    this.subscriptions.set(name, info);
    return this.adapter.addSubscription(name, info);
  }

  async unsubscribe(name: string): Promise<void> {
    const subscriptionInfo = this.subscriptions.get(name);
    if (!subscriptionInfo) {
      this.logger.info(`Subscription ${name} is not active`);
      return;
    }

    this.subscriptions.delete(name);
    if (this.adapter?.isConnected) {
      // this.adapter.removeSubscription(subscriptionInfo.topic, subscriptionInfo.routingKeys);
    }
  }

  async publish(message: string, routingInfo: MQRoutingInfo): Promise<boolean> {
    if (!this.adapter?.isConnected) {
      this.logger.error(`Cannot publish message because adapter is disconnected.`);
      return false;
    }

    return this.adapter.publish(message, routingInfo);
  }
}