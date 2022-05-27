import { inject, injectable } from 'inversify';
import express, { Express } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { WebsocketServer } from './communication/impl/websocket-server';
import config from './config';
import { Logger } from './config/logger';

/**
 * The main application instance
 */
@injectable()
export class App {
  private app: Express;

  @inject(Logger)
  private readonly logger!: Logger;
  
  constructor(private ws: WebsocketServer) {
    this.app = express();
  }

  /**
   * Initialize the server
   */
  async initialize() {
    const http = createServer(this.app);
    const io = new Server(http);

    this.ws.initialize(io);

    http.listen(config.port, () => {
      this.logger.info(`listening on port ${config}`);
    });
  }
}