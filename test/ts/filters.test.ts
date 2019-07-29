import { BotRequest, BotResponse } from '@vivocha/public-entities/dist/bot';
import * as chai from 'chai';
import * as http from 'request-promise-native';
import { BotFilter } from '../../dist/filter';

chai.should();

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
const getAttachmentMessage = function(): any {
  let msg = {
    code: 'message',
    type: 'attachment',
    url: 'https://cdn.supertest.vvc.com/asset/12345',
    meta: {
      originalUrl: 'https://media.giphy.com/media/l1KsqYM8Zt3yG3tVS/giphy.gif',
      originalName: 'Scream',
      mimetype: 'image/gif'
    }
  };
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

const getHTTPOptions = function getOptions(body) {
  return {
    method: 'POST',
    uri: 'http://localhost:8080/filter/request',
    body: body,
    headers: {
      'x-vvc-host': 'localhost:8888',
      'x-vvc-acct': 'vvc_test1'
    },
    json: true
  };
};

const getFilterResponseHTTPOptions = function getOptions(body) {
  return {
    method: 'POST',
    uri: 'http://localhost:8080/filter/response',
    body: body,
    headers: {
      'x-vvc-host': 'localhost:8888',
      'x-vvc-acct': 'vvc_test1'
    },
    json: true
  };
};

describe('Vivocha BOT FILTERS Tests', function() {
  describe('Request/Response Bot Filter defaults test', function() {
    const filter = new BotFilter();
    let server;
    before('starting bot filter', async function() {
      // Run the BotManager:
      const port = (process.env.PORT as any) || 8080;
      server = await filter.listen(port);
      return;
    });
    it('sending a request to a request filter should return 400 ', async function() {
      const request1: BotRequest = {
        language: 'en',
        event: 'continue',
        settings: getSettings(),
        message: getTextMessage('test')
      };
      const fullOpts = getHTTPOptions(request1);
      fullOpts['resolveWithFullResponse'] = true;
      fullOpts['simple'] = false;
      const result1 = await http(fullOpts);
      result1.statusCode.should.equal(400);
      return;
    });
    it('sending a request to a response filter should return 400 ', async function() {
      const request1: BotResponse = {
        language: 'en',
        event: 'continue',
        settings: getSettings()
      };
      const fullOpts = getFilterResponseHTTPOptions(request1);
      fullOpts['resolveWithFullResponse'] = true;
      fullOpts['simple'] = false;
      const result1 = await http(fullOpts);
      result1.statusCode.should.equal(400);
      return;
    });
    after('shutdown bot manager', function() {
      server.close();
    });
  });
  describe('Request Bot Filter Environment tests', function() {
    const filter = new BotFilter(async (req: BotRequest): Promise<BotRequest> => {
      return req;
    }, undefined);
    let server;
    before('starting bot filter', async function() {
      // Run the BotManager:
      const port = (process.env.PORT as any) || 8080;
      server = await filter.listen(port);
      return;
    });
    it('sending an environment it should be correctly parsed and set in the request as response', async function() {
      const request1: BotRequest = {
        language: 'en',
        event: 'start',
        settings: getSettings(),
        environment: {
          campaignId: 'abcd123',
          contactId: 'aldo-dice-26-x-1'
        }
      };
      const result1 = await http(getHTTPOptions(request1));

      result1.should.have.property('environment');
      result1.environment.should.have.property('campaignId');
      result1.environment.should.have.property('contactId');
      result1.environment.should.have.property('host');
      result1.environment.should.have.property('acct');
      return;
    });
    it('sending an empty environment it should be correctly parsed and in the request as response environment should contain the headers', async function() {
      const request1: BotRequest = {
        language: 'en',
        event: 'start',
        settings: getSettings(),
        environment: {}
      };
      const result1 = await http(getHTTPOptions(request1));
      //console.dir(result1, {colors: true, depth: 20});
      result1.should.have.property('environment');
      result1.environment.should.have.property('host');
      result1.environment.should.have.property('acct');
      return;
    });
    it('sending a request without environment the request as response environment should contain the headers', async function() {
      const request1: BotRequest = {
        language: 'en',
        event: 'start',
        settings: getSettings()
      };
      const result1 = await http(getHTTPOptions(request1));
      //console.dir(result1, {colors: true, depth: 20});
      result1.should.have.property('environment');
      result1.environment.should.have.property('host');
      result1.environment.should.have.property('acct');
      return;
    });
    it('sending a request to a response filter should return 400 ', async function() {
      const request1: BotResponse = {
        language: 'en',
        event: 'continue',
        settings: getSettings()
      };
      const fullOpts = getFilterResponseHTTPOptions(request1);
      fullOpts['resolveWithFullResponse'] = true;
      fullOpts['simple'] = false;
      const result1 = await http(fullOpts);
      result1.statusCode.should.equal(400);
      return;
    });
    after('shutdown bot manager', function() {
      server.close();
    });
  });
  describe('Response Bot Filter Environment tests', function() {
    const filter = new BotFilter(
      undefined,
      async (req: BotResponse): Promise<BotResponse> => {
        return req;
      }
    );
    let server;
    before('starting bot filter', async function() {
      // Run the BotManager:
      const port = (process.env.PORT as any) || 8080;
      server = await filter.listen(port);
      return;
    });
    it('sending an environment it should be correctly parsed and set in the request as response', async function() {
      const request1: BotResponse = {
        language: 'en',
        event: 'continue',
        settings: getSettings(),
        environment: {
          campaignId: 'abcd123',
          contactId: 'aldo-dice-26-x-1'
        }
      };
      const result1 = await http(getFilterResponseHTTPOptions(request1));

      result1.should.have.property('environment');
      result1.environment.should.have.property('campaignId');
      result1.environment.should.have.property('contactId');
      result1.environment.should.have.property('host');
      result1.environment.should.have.property('acct');
      return;
    });
    it('sending an empty environment it should be correctly parsed and in the request as response environment should contain the headers', async function() {
      const request1: BotResponse = {
        language: 'en',
        event: 'continue',
        settings: getSettings(),
        environment: {}
      };
      const result1 = await http(getFilterResponseHTTPOptions(request1));
      //console.dir(result1, {colors: true, depth: 20});
      result1.should.have.property('environment');
      result1.environment.should.have.property('host');
      result1.environment.should.have.property('acct');
      return;
    });
    it('sending a request without environment the request as response environment should contain the headers', async function() {
      const request1: BotResponse = {
        language: 'en',
        event: 'continue',
        settings: getSettings()
      };
      const result1 = await http(getFilterResponseHTTPOptions(request1));
      //console.dir(result1, {colors: true, depth: 20});
      result1.should.have.property('environment');
      result1.environment.should.have.property('host');
      result1.environment.should.have.property('acct');
      return;
    });
    it('sending a request to a request filter should return 400 ', async function() {
      const request1: BotResponse = {
        language: 'en',
        event: 'continue',
        settings: getSettings()
      };
      const fullOpts = getHTTPOptions(request1);
      fullOpts['resolveWithFullResponse'] = true;
      fullOpts['simple'] = false;
      const result1 = await http(fullOpts);
      result1.statusCode.should.equal(400);
      return;
    });
    after('shutdown bot manager', function() {
      server.close();
    });
  });
  describe('Bot Filter With undefined request/response filters', function() {
    const filter = new BotFilter(undefined, undefined);
    let server;
    before('starting bot filter', async function() {
      // Run the BotManager:
      const port = (process.env.PORT as any) || 8080;
      server = await filter.listen(port);
      return;
    });
    it('sending a request to a request filter should return 400 ', async function() {
      const request1: BotRequest = {
        language: 'en',
        event: 'continue',
        settings: getSettings()
      };
      const fullOpts = getHTTPOptions(request1);
      fullOpts['resolveWithFullResponse'] = true;
      fullOpts['simple'] = false;
      const result1 = await http(fullOpts);
      result1.statusCode.should.equal(400);
      return;
    });
    it('sending a response to a response filter should return 400 ', async function() {
      const request1: BotResponse = {
        language: 'en',
        event: 'continue',
        settings: getSettings()
      };
      const fullOpts = getFilterResponseHTTPOptions(request1);
      fullOpts['resolveWithFullResponse'] = true;
      fullOpts['simple'] = false;
      const result1 = await http(fullOpts);
      result1.statusCode.should.equal(400);
      return;
    });
    after('shutdown bot manager', function() {
      server.close();
    });
  });
  describe('Request Bot Filter messaging', function() {
    const filter = new BotFilter(async (req: BotRequest): Promise<BotRequest> => {
      return req;
    }, undefined);
    let server;
    before('starting bot filter', async function() {
      // Run the BotManager:
      const port = (process.env.PORT as any) || 8080;
      server = await filter.listen(port);
      return;
    });
    it('sending a BotRequest with a start should echo the request ', async function() {
      const request1: BotRequest = {
        language: 'en',
        event: 'start',
        settings: getSettings(),
        environment: {
          campaignId: 'abcd123',
          contactId: 'aldo-dice-26-x-1'
        }
      };
      const result1 = await http(getHTTPOptions(request1));

      result1.should.have.property('environment');
      result1.event.should.be.equal('start');
      return;
    });
    it('sending a BotRequest with a text message should echo the request ', async function() {
      const request1: BotRequest = {
        language: 'en',
        event: 'continue',
        settings: getSettings(),
        environment: {
          campaignId: 'abcd123',
          contactId: 'aldo-dice-26-x-1'
        },
        message: getTextMessage('hello')
      };
      const result1 = await http(getHTTPOptions(request1));
      result1.should.have.property('environment');
      result1.event.should.be.equal('continue');
      result1.message.body.should.contain('hello');
    });
    it('sending a BotRequest with an attachment message, it should be correctly received and echoed', async function() {
      const request1: BotRequest = {
        language: 'en',
        event: 'continue',
        settings: getSettings(),
        message: getAttachmentMessage()
      };
      //console.dir(request1, { colors: true, depth: 20 });
      const result1 = await http(getHTTPOptions(request1));
      //console.dir(result1, { colors: true, depth: 20 });
      result1.event.should.equal('continue');
      result1.message.url.should.equal('https://cdn.supertest.vvc.com/asset/12345');
      result1.message.type.should.equal('attachment');
      result1.message.meta.originalUrl.should.equal('https://media.giphy.com/media/l1KsqYM8Zt3yG3tVS/giphy.gif');
      result1.message.meta.originalName.should.equal('Scream');
      result1.message.meta.mimetype.should.equal('image/gif');
      return;
    });
    after('shutdown bot manager', function() {
      server.close();
    });
  });
  describe('Response Bot Filter messaging', function() {
    const filter = new BotFilter(
      undefined,
      async (req: BotResponse): Promise<BotResponse> => {
        return req;
      }
    );
    let server;
    before('starting bot filter', async function() {
      // Run the BotManager:
      const port = (process.env.PORT as any) || 8080;
      server = await filter.listen(port);
      return;
    });

    it('sending a BotResponse with a text message should echo the request ', async function() {
      const res: BotResponse = {
        language: 'en',
        event: 'continue',
        settings: getSettings(),
        environment: {
          campaignId: 'abcd123',
          contactId: 'aldo-dice-26-x-1'
        },
        messages: [getTextMessage('hello')]
      };
      const res1 = await http(getFilterResponseHTTPOptions(res));
      res1.event.should.be.equal('continue');
      res1.messages[0].body.should.contain('hello');
    });
    it('sending a BotResponse with an attachment message, it should be correctly received and echoed', async function() {
      const res: BotResponse = {
        language: 'en',
        event: 'continue',
        settings: getSettings(),
        messages: [getAttachmentMessage()]
      };
      //console.dir(request1, { colors: true, depth: 20 });
      const res1 = await http(getFilterResponseHTTPOptions(res));
      //console.dir(result1, { colors: true, depth: 20 });
      res1.event.should.equal('continue');
      res1.messages[0].url.should.equal('https://cdn.supertest.vvc.com/asset/12345');
      res1.messages[0].type.should.equal('attachment');
      res1.messages[0].meta.originalUrl.should.equal('https://media.giphy.com/media/l1KsqYM8Zt3yG3tVS/giphy.gif');
      res1.messages[0].meta.originalName.should.equal('Scream');
      res1.messages[0].meta.mimetype.should.equal('image/gif');
      return;
    });
    after('shutdown bot manager', function() {
      server.close();
    });
  });
});
