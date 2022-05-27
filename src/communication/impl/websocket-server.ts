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

  async subscribe(channel: string, callback: Callback): Promise<void> {
    if (this.subscriptions.has(channel)) {
      return;
    }

    this.io?.on(channel, callback);
    this.subscriptions.set(channel, callback);
  }

  async unsubscribe(channel: string): Promise<void> {
    const handler = this.subscriptions.get(channel);

    if (!handler) {
      return;
    }

    this.io?.removeListener(channel, handler);
    this.subscriptions.delete(channel);
  }

  async unsubscribeAll(): Promise<void> {
    for (const [channel, handler] of this.subscriptions) {
      this.io?.removeListener(channel, handler);
    }

    this.subscriptions.clear();
  }

  publish(_channel: string, _data: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}