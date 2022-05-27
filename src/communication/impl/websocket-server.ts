import { injectable } from 'inversify';
import { Server } from 'socket.io';
import { Publisher } from '../interfaces/publisher';
import { Callback, Subscriber } from '../interfaces/subscriber';

@injectable()
export class WebsocketServer implements Publisher, Subscriber {
  private io?: Server;
  private readonly subscriptions: Map<string, Callback> = new Map();

  initialize(io: Server) {
    this.io = io;
  }

  subscribe(channel: string, callback: Callback): void {
    if (this.subscriptions.has(channel)) {
      return;
    }

    this.io?.on(channel, callback);
    this.subscriptions.set(channel, callback);
  }

  unsubscribe(_channel: string): void {
    throw new Error('Method not implemented.');
  }

  unsubscribeAll(): void {
    throw new Error('Method not implemented.');
  }

  publish(_data: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}