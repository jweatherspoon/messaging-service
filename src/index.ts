import 'reflect-metadata';
import { ioc } from './config/ioc';
import { App } from './app';
import { MessageQueue } from './mq/message-queue';

const main = async () => {
  const app = ioc.get(App);

  try {
    const mq = ioc.get(MessageQueue);
    await mq.subscribe('beans');

    await app.initialize();
  } catch (err) {
    console.error(err);
  }
}

main();