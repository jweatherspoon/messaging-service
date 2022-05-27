import { QueueCreationArguments, TopicCreationArguments } from '../../models/mq';

export interface MessageQueueAdapter {
  protocolIdentifier: RegExp;
  
  initializeConnection(connectionString: string): Promise<boolean>;

  createTopic(topic: string, options?: TopicCreationArguments): Promise<boolean>;

  addSubscription(name: string, topic: string, routingKeys: Map<string, string>, options?: QueueCreationArguments): Promise<boolean>;
}