import { describe } from 'mocha';
import Sinon, { assert, SinonStub, stub } from 'sinon';
import { Server } from 'socket.io';
import { expect } from 'chai';
import { WebsocketServer } from '../../src/communication/impl/websocket-server';
import { Callback } from '../../src/communication/interfaces/subscriber';

describe('Websocket Server tests', () => {
  let io: Server;
  let ws: WebsocketServer;

  beforeEach(() => {
    io = new Server();
    ws = new WebsocketServer();
    ws.initialize(io);
  });

  afterEach(() => {
    Sinon.restore();
  }); 

  describe('subscribe', () => {
    let onStub: SinonStub;

    beforeEach(() => {
      onStub = stub(io, 'on');
    });

    it('should add a subscription', () => {
      // setup
      const channel = 'channel';
      const callback: Callback = (_data, _error) => {};

      // act
      ws.subscribe(channel, callback);

      // assert
      assert.callCount(onStub, 1);
      assert.calledWith(onStub, channel, callback);
    });

    it('should not add two handlers to a subscription', () => {
      // setup
      const channel = 'channel';
      const callback: Callback = (_data, _error) => { };

      // act
      ws.subscribe(channel, callback);
      ws.subscribe(channel, callback);

      // assert
      assert.callCount(onStub, 1);
      assert.calledWith(onStub, channel, callback);
    });

    describe('unsubscribe', () => {
      it('should remove a subscription');
      it('should do nothing if the subscription does not exist');
    });

    describe('unsubscribeAll', () => {
      it('should remove all subscriptions');
    });

    describe('publish', () => {
      it('should publish the message');
    });
  });
});