import { Container } from 'inversify';
import { WebsocketServer } from '../communication/impl/websocket-server';
import { App } from '../app';

const ioc = new Container();

ioc.bind(App).toSelf().inSingletonScope();
ioc.bind(WebsocketServer).toSelf().inSingletonScope();

export { ioc }

