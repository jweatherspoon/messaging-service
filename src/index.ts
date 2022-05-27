import 'reflect-metadata';
import { ioc } from './config/ioc';
import { App } from './app';

const main = async () => {
  const app = ioc.get(App);

  try {
    await app.initialize();
  } catch (err) {
    console.error(err);
  }
}

main();