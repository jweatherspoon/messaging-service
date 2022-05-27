import { Container } from 'inversify';
import { WebsocketServer } from '../../communication/impl/websocket-server';
import { App } from '../../app';
import { Logger } from '../logger';

const ioc = new Container();

ioc.bind(Logger).toSelf().inSingletonScope();
ioc.bind(App).toSelf().inSingletonScope();
ioc.bind(WebsocketServer).toSelf().inSingletonScope();

export { ioc }
export { Types } from './types';

