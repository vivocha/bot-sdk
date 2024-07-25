import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { BotAgentManager } from '../../dist/agent';
import { BotResponse } from '@vivocha/public-types/dist/bot';
import { startHTTPServer } from './simple-http-server';
import { TextMessage } from '../../dist';

chai.should();
chai.use(chaiAsPromised);

const engineType = 'test';

const getTextMessage = function(body?: string, payload?: string): any {
  let msg = {
    code: 'message',
    type: 'text'
  };
  if (body) {
    msg['body'] = body;
  }
  if (payload) {
    msg['payload'] = payload;
  }
  return msg;
};

const getSettings = function(): any {
  return {
    engine: {
      type: engineType,
      settings: {}
    }
  };
};

describe('Vivocha sending Async Responses tests', function() {
  describe('Invoking BotManager # sendAsyncResponse', function() {
    let env = process.env;
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    let server;
    before('starting test HTTP server', async function() {
      server = await startHTTPServer(8443);
      return;
    });
    it('sending an async response with CORRECT environment param should return a 200 OK response', async function() {
      const response: BotResponse = {
        language: 'en',
        event: 'continue',
        messages: [
          {
            code: 'message',
            type: 'text',
            body: 'Miao'
          } as TextMessage
        ]
      };
      const env = {
        host: 'localhost:8443',
        acct: 'vvc_test',
        contactId: 'abc-123456',
        token: 'abc.123.xyzz'
      };
      const result = await BotAgentManager.sendAsyncMessage(response, env);
      result.statusCode.should.be.equal(200);
      const body = result.body;
      body.event.should.be.equal('continue');
      body.messages[0].should.have.property('body');
      return;
    });
    it('sending an async response with WRONG environment param should be rejected with a custom error', async function() {
      const response: BotResponse = {
        language: 'en',
        event: 'continue',
        messages: [
          {
            code: 'message',
            type: 'text',
            body: 'Miao'
          } as TextMessage
        ]
      };
      const env = {
        host: 'localhost',
        acct: 'vvc_test',
        contactId: 'abc-123456'
        // missing token
      };
      return BotAgentManager.sendAsyncMessage(response, env).should.be.rejectedWith(Error);
    });
    after('shutdown test HTTP server', function() {
      server.close();
      process.env = env;
    });
  });
});
