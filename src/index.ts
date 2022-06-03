import 'reflect-metadata';
import { ioc } from './config/ioc';
import { App } from './app';
import { MessageQueue } from './mq/message-queue';

const main = async () => {
  const app = ioc.get(App);

  try {
    const mq = ioc.get(MessageQueue);

    await mq.initializeConnection();
    await mq.subscribe('beans', { topic: 'big-beans', routingKeys: {
      candy: 'man'
    } });

    await app.initialize();
  } catch (err) {
    console.error(err);
  }
}

main();