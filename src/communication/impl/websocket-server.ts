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

  unsubscribe(channel: string): void {
    const handler = this.subscriptions.get(channel);

    if (!handler) {
      return;
    }

    this.io?.removeListener(channel, handler);
    this.subscriptions.delete(channel);
  }

  unsubscribeAll(): void {
    for (const [channel, handler] of this.subscriptions) {
      this.io?.removeListener(channel, handler);
    }

    this.subscriptions.clear();
  }

  publish(_data: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}