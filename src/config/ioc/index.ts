import { Container } from 'inversify';
import { WebsocketServer } from '../../communication/impl/websocket-server';
import { App } from '../../app';
import { Logger } from '../logger';
import { Types } from './types';
import { MessageQueueAdapter } from '../../mq/interfaces/message-queue-adapter';
import { RabbitMqAdapter } from '../../mq/adapters/rabbit-mq-adapter';
import { MessageQueue } from '../../mq/message-queue';

const ioc = new Container();

ioc.bind(Logger).toSelf().inSingletonScope();
ioc.bind(App).toSelf().inSingletonScope();
ioc.bind(WebsocketServer).toSelf().inSingletonScope();

ioc.bind<MessageQueueAdapter>(Types.MessageQueueAdapter).to(RabbitMqAdapter).inSingletonScope();

ioc.bind(MessageQueue).toSelf().inSingletonScope();

export { ioc }
export { Types };

