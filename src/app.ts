import { injectable } from 'inversify';
import express, { Express } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { WebsocketServer } from './communication/impl/websocket-server';

@injectable()
export class App {
  private app: Express;
  
  constructor(private ws: WebsocketServer) {
    this.app = express();
  }

  async initialize() {
    const http = createServer(this.app);
    const io = new Server(http);

    this.ws.initialize(io);
  }
}