import { MQRoutingInfo, QueueCreationArguments, TopicCreationArguments } from '../../models/mq';

export interface MessageQueueAdapter {
  protocolIdentifier: RegExp;

  isConnected: boolean;
  
  initializeConnection(connectionString: string): Promise<boolean>;

  createTopic(topic: string, options?: TopicCreationArguments): Promise<boolean>;

  addSubscription(name: string, info: MQRoutingInfo, options?: QueueCreationArguments): Promise<boolean>;

  publish(message: string, info: MQRoutingInfo): Promise<boolean>;
}