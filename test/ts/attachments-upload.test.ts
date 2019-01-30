import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { BotAgentManager } from '../../dist/agent';
import * as request from 'request';
import { BotResponse } from '@vivocha/public-entities/dist/bot';
import { startHTTPServer } from './simple-http-server';
import { TextMessage } from '../../dist';
import * as fs from 'fs';
import { Stream } from 'stream';

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

describe('Vivocha Attachment file upload tests', function() {
  describe('Invoking BotManager # uploadAttachment from a local file', function() {
    let env = process.env;
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    let server;
    before('starting test HTTP server', async function() {
      server = await startHTTPServer(8443);
      return;
    });
    it('calling upload should call and upload the file', async function() {
      const env = {
        host: 'localhost:8443',
        acct: 'vvc_test',
        contactId: 'abc-123456',
        token: 'abc.123.xyzz'
      };
      const filename = __dirname + '/attachment.jpg';
      const result = await BotAgentManager.uploadAttachment(fs.createReadStream(filename), { mimetype: 'image/jpg', desc: 'Actarus jpeg image' }, env);
      result.should.have.property('url');
      result.should.have.property('meta');
      return;
    });
    it('calling upload with WRONG environment param should be rejected with a custom error', async function() {
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
      const filename = __dirname + '/attachment.jpg';
      return BotAgentManager.uploadAttachment(fs.createReadStream(filename), { mimetype: 'image/jpg', desc: 'Actarus jpeg image' }, env).should.be.rejectedWith(
        Error
      );
    });
    after('shutdown test HTTP server', function() {
      server.close();
      process.env = env;
    });
  });
  describe('Invoking BotManager # uploadAttachment from a remote URL', function() {
    let env = process.env;
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    let server;
    before('starting test HTTP server', async function() {
      server = await startHTTPServer(8443);
      return;
    });

    it('calling upload should call and upload the stream by URL', async function() {
      const env = {
        host: 'localhost:8443',
        acct: 'vvc_test',
        contactId: 'abc-123456',
        token: 'abc.123.xyzz'
      };
      const fileURL = 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Moon.jpg';
      const result = await BotAgentManager.uploadAttachment(request(fileURL) as Stream, { mimetype: 'image/jpg', desc: 'Moon jpeg image' }, env);
      result.should.have.property('url');
      result.should.have.property('meta');
      return;
    });

    after('shutdown test HTTP server', function() {
      server.close();
      process.env = env;
    });
  });
});
