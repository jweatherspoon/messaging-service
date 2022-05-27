import { describe } from 'mocha';
import Sinon, { assert, SinonSpy, SinonStub, spy, stub } from 'sinon';
import { Server } from 'socket.io';
import { WebsocketServer } from '../../src/communication/impl/websocket-server';
import { Callback } from '../../src/communication/interfaces/subscriber';
import { Logger } from '../../src/config/logger';

describe('Websocket Server tests', () => {
  let io: Server;
  let ws: WebsocketServer;
  let logger: Logger;
  let errorStub: SinonStub;

  beforeEach(() => {
    io = new Server();
    logger = new Logger();

    errorStub = stub(logger, 'error');
    
    ws = new WebsocketServer(logger);
    ws.initialize(io);
  });

  afterEach(() => {
    Sinon.restore();
  }); 

  describe('subscribe', () => {
    let onSpy: SinonSpy;

    beforeEach(() => {
      onSpy = spy(io, 'on');
    });

    it('should add a subscription', async () => {
      // setup
      const channel = 'channel';
      const callback: Callback = (_data, _error) => {};

      // act
      await ws.subscribe(channel, callback);

      // assert
      assert.callCount(onSpy, 1);
      assert.calledWith(onSpy, channel, callback);
    });

    it('should not add two handlers to a subscription', async () => {
      // setup
      const channel = 'channel';
      const callback: Callback = (_data, _error) => { };

      // act
      await ws.subscribe(channel, callback);
      await ws.subscribe(channel, callback);

      // assert
      assert.callCount(onSpy, 1);
      assert.calledWith(onSpy, channel, callback);
    });

    it('should log an error if not initialized', async () => {
      // setup
      ws = new WebsocketServer(logger);

      // act
      await ws.subscribe('test', () => {});

      // assert
      assert.callCount(errorStub, 1);
    });
  });

  describe('unsubscribe', () => {
    const channel = 'test';
    let removeListenerSpy: SinonSpy;

    beforeEach(() => {
      removeListenerSpy = spy(io, 'removeListener');
      ws.subscribe(channel, () => { });
    });

    it('should unsubscribe', async () => {
      // act
      await ws.unsubscribe(channel);

      // assert
      assert.callCount(removeListenerSpy, 1);
      assert.calledWith(removeListenerSpy, channel);
    });

    it('should do nothing if the subscription does not exist', async () => {
      // act
      await ws.unsubscribe('bingbong');

      // assert
      assert.callCount(removeListenerSpy, 0);
    });

    it('should remove the subscription internally', async () => {
      // setup
      await ws.unsubscribe(channel);
      removeListenerSpy.resetHistory();

      // act
      await ws.unsubscribe(channel);

      // assert
      assert.callCount(removeListenerSpy, 0);
    });

    it('should log an error if not initialized', async () => {
      // setup
      ws = new WebsocketServer(logger);

      // act
      await ws.unsubscribe('test');

      // assert
      assert.callCount(errorStub, 1);
    });
  });

  describe('unsubscribeAll', () => {
    const channels: string[] = [];
    let removeListenerSpy: SinonSpy;

    beforeEach(() => {
      removeListenerSpy = spy(io, 'removeListener');

      channels.push('sub1', 'sub2', 'sub3');

      for (const channel of channels) {
        ws.subscribe(channel, () => { });
      }
    });

    it('should unsubscribe from all subscriptions', async () => {
      // act
      await ws.unsubscribeAll();

      // assert
      assert.callCount(removeListenerSpy, channels.length);
      for (const channel of channels) {
        assert.calledWith(removeListenerSpy, channel);
      }
    });

    it('should remove all subscriptions internally', async () => {
      // setup
      await ws.unsubscribeAll();
      removeListenerSpy.resetHistory();

      // act
      await ws.unsubscribeAll();

      // assert
      assert.callCount(removeListenerSpy, 0);
    });

    it('should log an error if not initialized', async () => {
      // setup
      ws = new WebsocketServer(logger);

      // act
      await ws.unsubscribeAll();

      // assert
      assert.callCount(errorStub, 1);
    });
  });

  describe('publish', () => {
    let emitSpy: SinonSpy;
    const channel = 'channel';
    const data = { key: 'value' };

    beforeEach(() => {
      emitSpy = spy(io, 'emit');
    });

    it('should publish the message', async () => {
      // setup
      const expected = JSON.stringify(data);

      // act
      await ws.publish(channel, data);

      // assert
      assert.callCount(emitSpy, 1);
      assert.calledWith(emitSpy, channel, expected);
    });

    it('should log an error if not initialized', async () => {
      // setup
      ws = new WebsocketServer(logger);

      // act
      await ws.publish(channel, data);

      // assert
      assert.callCount(errorStub, 1);
    });
  });
});