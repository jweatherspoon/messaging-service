import { inject, injectable } from 'inversify';
import { Server } from 'socket.io';
import { Logger } from '../../config/logger';
import { Publisher } from '../interfaces/publisher';
import { Callback, Subscriber } from '../interfaces/subscriber';

/**
 * Websocket server 
 */
@injectable()
export class WebsocketServer implements Publisher, Subscriber {
  private io?: Server;
  private readonly subscriptions: Map<string, Callback> = new Map();

  constructor (@inject(Logger) private readonly logger: Logger) {}

  /**
   * Initialize the websocket server
   * @param io The websocket 
   */
  initialize(io: Server) {
    this.io = io;
  }

  /**
   * Subscribe to a channel on the websocket
   * @param channel The channel to subscribe to
   * @param callback The callback that will run 
   */
  async subscribe(channel: string, callback: Callback): Promise<void> {
    if (!this.io) {
      await this.logger.error('Cannot subscribe before initialize is called');
      return;
    }

    if (this.subscriptions.has(channel)) {
      return;
    }

    this.io?.on(channel, callback);
    this.subscriptions.set(channel, callback);
  }

  /**
   * Unsubscribe from a channel
   * @param channel The channel to unsubscribe from
   */
  async unsubscribe(channel: string): Promise<void> {
    if (!this.io) {
      await this.logger.error('Cannot unsubscribe before initialize is called');
      return;
    }

    const handler = this.subscriptions.get(channel);

    if (!handler) {
      return;
    }

    this.io.removeListener(channel, handler);
    this.subscriptions.delete(channel);
  }

  /**
   * Unsubscribe from all channels on the websocket
   */
  async unsubscribeAll(): Promise<void> {
    if (!this.io) {
      await this.logger.error('Cannot unsubscribe before initialize is called');
      return;
    }

    for (const [channel, handler] of this.subscriptions) {
      this.io.removeListener(channel, handler);
    }

    this.subscriptions.clear();
  }

  /**
   * Publish data to a channel
   * @param channel The channel to publish to
   * @param data The data to publish
   */
  async publish(channel: string, data: any): Promise<void> {
    if (!this.io) {
      await this.logger.error('Cannot publish a message before initialize is called');
      return;
    }

    this.io.emit(channel, JSON.stringify(data));
  }
}