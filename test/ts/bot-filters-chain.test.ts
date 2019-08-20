import * as chai from 'chai';
import * as http from 'request-promise-native';
import { AttachmentMessage, BotFilter, BotRequest, BotResponse, IsWritingMessage, TextMessage } from '../../dist';
import { dummyBot } from './dummy-bot';

chai.should();

const engineType = 'custom';

const filterOne: BotFilter = new BotFilter(async (req: BotRequest): Promise<BotRequest> => {
  req.data = Object.assign({}, req.data || {}, { random: Math.round(Math.random() * 1000) });
  return req;
}, undefined);
const filterTwo: BotFilter = new BotFilter(async (req: BotRequest): Promise<BotRequest> => {
  req.context = Object.assign({}, req.context || {}, { f2Check: 'checked' });
  return req;
}, undefined);
const filterThree: BotFilter = new BotFilter(
  undefined,
  async (res: BotResponse): Promise<BotResponse> => {
    res.context = Object.assign({}, res.context || {}, { f3Check: 'checked' });
    const text = (res.messages[0] as TextMessage).body;
    (res.messages[0] as TextMessage).body = `${text} Edited by f3.`;
    return res;
  }
);
const filterFour: BotFilter = new BotFilter(
  undefined,
  async (res: BotResponse): Promise<BotResponse> => {
    res.context = Object.assign({}, res.context || {}, { f4Check: 'checked' });
    const text = (res.messages[0] as TextMessage).body;
    (res.messages[0] as TextMessage).body = `${text} Edited by f4.`;
    res.messages.push({
      code: 'message',
      type: 'iswriting'
    } as IsWritingMessage);
    res.messages.push({
      code: 'message',
      type: 'text',
      body: 'Done.'
    } as TextMessage);
    return res;
  }
);
const filterFive: BotFilter = new BotFilter(
  undefined,
  async (res: BotResponse): Promise<BotResponse> => {
    res.context = Object.assign({}, res.context || {}, { f5Check: 'checked' });
    const text = (res.messages[0] as TextMessage).body;
    (res.messages[0] as TextMessage).body = `${text} Edited by f5.`;
    res.messages.push({
      code: 'message',
      type: 'attachment',
      url: 'https://media.giphy.com/media/l1KsqYM8Zt3yG3tVS/giphy.gif',
      meta: {
        originalUrl: '',
        originalName: 'Scream.gif',
        mimetype: 'image/gif'
      }
    } as AttachmentMessage);
    return res;
  }
);

const getTextMessage = function(body: string, payload?: string): any {
  let msg = {
    code: 'message',
    type: 'text',
    body
  };
  if (payload) {
    msg['payload'] = payload;
  }
  return msg;
};
const getBotHTTPOpts = function getOptions(port: number, body: any) {
  return {
    method: 'POST',
    uri: `http://localhost:${port}/bot/message`,
    body: body,
    headers: {
      'x-vvc-host': `localhost:${port}`,
      'x-vvc-acct': 'vvc_test1'
    },
    json: true
  };
};
const getFilterHTTPOpts = function getOptions(port: number, body: any, type: 'request' | 'response') {
  return {
    method: 'POST',
    uri: `http://localhost:${port}/filter/${type}`,
    body: body,
    headers: {
      'x-vvc-host': `localhost:${port}`,
      'x-vvc-acct': 'vvc_test1'
    },
    json: true
  };
};

//root describe
describe('Testing a bot + filters chain', function() {
  describe('Sending a start message to chain f1 -> f2 -> bot -> f3', function() {
    const getSettings = function(): any {
      return {
        engine: {
          type: engineType
        }
      };
    };
    let bot;
    let f1, f2, f3;

    before('starting bot and filters', async function() {
      // Run the BotManager
      const port = (process.env.PORT as any) || 8080;
      bot = await dummyBot.listen(port);
      // run filter f1
      f1 = await filterOne.listen(8081);
      // run filter f2
      f2 = await filterTwo.listen(8082);
      // run filter f3
      f3 = await filterThree.listen(8083);
      return;
    });
    it('should return a continue message data and context properly set', async function() {
      const request: BotRequest = {
        language: 'en',
        event: 'start',
        settings: getSettings()
      };
      // call f1
      let result = await http(getFilterHTTPOpts(8081, request, 'request'));
      // call f2
      result = await http(getFilterHTTPOpts(8082, result, 'request'));
      // call bot
      const response = await http(getBotHTTPOpts(8080, result));
      // call f3
      const finalResponse: BotResponse = await http(getFilterHTTPOpts(8083, response, 'response'));

      finalResponse.data.should.have.property('random');
      finalResponse.context.should.have.property('f2Check');
      finalResponse.context.should.have.property('f3Check');
      (finalResponse.messages[0] as TextMessage).body.should.include('Edited by f3');
      return;
    });
    after('shutdown bot and filters', function() {
      bot.close();
      f1.close();
      f2.close();
      f3.close();
    });
  });
  describe('Sending a continue test-chain message to chain f1 -> f2 -> bot -> f3', function() {
    const getSettings = function(): any {
      return {
        engine: {
          type: engineType
        }
      };
    };
    let bot;
    let f1, f2, f3;

    before('starting bot and filters', async function() {
      // Run the BotManager
      const port = (process.env.PORT as any) || 8080;
      bot = await dummyBot.listen(port);
      // run filter f1
      f1 = await filterOne.listen(8081);
      // run filter f2
      f2 = await filterTwo.listen(8082);
      // run filter f3
      f3 = await filterThree.listen(8083);
      return;
    });
    it('should return a continue message data and context properly set', async function() {
      const request: BotRequest = {
        language: 'en',
        event: 'continue',
        message: getTextMessage('test-chain'),
        settings: getSettings()
      };
      // call f1
      let result = await http(getFilterHTTPOpts(8081, request, 'request'));
      // call f2
      result = await http(getFilterHTTPOpts(8082, result, 'request'));
      // call bot
      const response = await http(getBotHTTPOpts(8080, result));
      // call f3
      const finalResponse: BotResponse = await http(getFilterHTTPOpts(8083, response, 'response'));

      finalResponse.data.should.have.property('random');
      finalResponse.context.should.have.property('f2Check');
      finalResponse.context.should.have.property('f3Check');
      (finalResponse.messages[0] as TextMessage).body.should.include('Edited by f3');
      return;
    });
    after('shutdown bot and filters', function() {
      bot.close();
      f1.close();
      f2.close();
      f3.close();
    });
  });
  describe('Sending a continue test-chain message to chain f1 -> f2 -> bot -> f4', function() {
    const getSettings = function(): any {
      return {
        engine: {
          type: engineType
        }
      };
    };
    let bot;
    let f1, f2, f4;

    before('starting bot and filters', async function() {
      // Run the BotManager
      const port = (process.env.PORT as any) || 8080;
      bot = await dummyBot.listen(port);
      // run filter f1
      f1 = await filterOne.listen(8081);
      // run filter f2
      f2 = await filterTwo.listen(8082);
      // run filter f3
      f4 = await filterFour.listen(8084);
      return;
    });
    it('should return a continue message data and context properly set', async function() {
      const request: BotRequest = {
        language: 'en',
        event: 'continue',
        message: getTextMessage('test-chain'),
        settings: getSettings()
      };
      // call f1
      let result = await http(getFilterHTTPOpts(8081, request, 'request'));
      // call f2
      result = await http(getFilterHTTPOpts(8082, result, 'request'));
      // call bot
      const response = await http(getBotHTTPOpts(8080, result));
      // call f4
      const finalResponse: BotResponse = await http(getFilterHTTPOpts(8084, response, 'response'));

      finalResponse.data.should.have.property('random');
      finalResponse.context.should.have.property('f2Check');
      finalResponse.context.should.have.property('f4Check');
      finalResponse.messages.should.length(3);
      (finalResponse.messages[0] as TextMessage).body.should.include('Edited by f4');
      finalResponse.messages[1].type.should.equal('iswriting');
      (finalResponse.messages[2] as TextMessage).body.should.equal('Done.');
      return;
    });
    after('shutdown bot and filters', function() {
      bot.close();
      f1.close();
      f2.close();
      f4.close();
    });
  });
  describe('Sending a continue test-chain message to chain f1 -> f2 -> bot -> f5', function() {
    const getSettings = function(): any {
      return {
        engine: {
          type: engineType
        }
      };
    };
    let bot;
    let f1, f2, f5;

    before('starting bot and filters', async function() {
      // Run the BotManager
      const port = (process.env.PORT as any) || 8080;
      bot = await dummyBot.listen(port);
      // run filter f1
      f1 = await filterOne.listen(8081);
      // run filter f2
      f2 = await filterTwo.listen(8082);
      // run filter f3
      f5 = await filterFive.listen(8085);
      return;
    });
    it('should return a continue message with an attachment and data and context properly set', async function() {
      const request: BotRequest = {
        language: 'en',
        event: 'continue',
        message: getTextMessage('test-chain'),
        settings: getSettings()
      };
      // call f1
      let result = await http(getFilterHTTPOpts(8081, request, 'request'));
      // call f2
      result = await http(getFilterHTTPOpts(8082, result, 'request'));
      // call bot
      const response = await http(getBotHTTPOpts(8080, result));
      // call f5
      const finalResponse: BotResponse = await http(getFilterHTTPOpts(8085, response, 'response'));

      finalResponse.data.should.have.property('random');
      finalResponse.context.should.have.property('f2Check');
      finalResponse.context.should.have.property('f5Check');
      finalResponse.messages.should.length(2);
      (finalResponse.messages[0] as TextMessage).body.should.include('Edited by f5');
      finalResponse.messages[1].type.should.equal('attachment');
      return;
    });
    after('shutdown bot and filters', function() {
      bot.close();
      f1.close();
      f2.close();
      f5.close();
    });
  });
});
