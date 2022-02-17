import * as chai from 'chai';
import http from 'request-promise-native';
import { BotAgentManager, BotRequest, BotResponse, PostbackMessage } from '../../dist';
import { DataCollectorTestWitBot } from './bot';
require('dotenv').config();

chai.should();

const engineType = 'WitAi';

const getTextMessage = function (body: string, payload?: string): any {
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
const getHTTPOptions = function getOptions(body) {
  return {
    method: 'POST',
    uri: 'http://localhost:8080/bot/message',
    body: body,
    headers: {
      'x-vvc-host': 'localhost:8080',
      'x-vvc-acct': 'vvc_test1'
    },
    json: true
  };
};

//root describe
describe('Testing Wit.ai based bot for a simple data collection ', function () {
  let env = process.env;

  describe('Sending plain text messages', function () {
    const getSettings = function (): any {
      return {
        engine: {
          type: engineType,
          settings: {
            token: env.WIT_TOKEN
          }
        }
      };
    };
    const manager = new BotAgentManager();
    let server;
    before('starting bot manager', async function () {
      manager.registerAgent(
        engineType,
        async (req: BotRequest): Promise<BotResponse> => {
          const bot = new DataCollectorTestWitBot(req.settings.engine.settings.token);
          return bot.sendMessage(req);
        }
      );
      // Run the BotManager:
      const port = (process.env.PORT as any) || 8080;
      server = await manager.listen(port);
      return;
    });
    it('should perform data collection and then end with data filled', async function () {
      const request1: BotRequest = {
        language: 'en',
        event: 'start',
        settings: getSettings()
      };
      // console.dir(request1, { colors: true, depth: 20 });
      const result1 = await http(getHTTPOptions(request1));
      // console.dir(result1, { colors: true, depth: 20 });
      result1.context.contexts.should.include('ask_for_name');

      const request2: BotRequest = {
        language: 'en',
        event: 'continue',
        message: getTextMessage('Antonio Obama'),
        settings: getSettings(),
        context: result1.context,
        data: result1.data
      };
      // console.log('Sending msg2');
      // console.dir(request2, { colors: true, depth: 20 });
      const result2 = await http(getHTTPOptions(request2));
      // console.dir(result2, { colors: true, depth: 20 });
      result2.context.contexts.should.include('ask_for_address');
      result2.event.should.equal('continue');
      result2.messages[0].body.should.contain('Send me your full address, please');

      const request3: BotRequest = {
        language: 'en',
        event: 'continue',
        message: getTextMessage('Palm Beach Street, 29 - Los Angeles'),
        settings: getSettings(),
        context: result2.context,
        data: result2.data
      };
      //console.log('Sending msg2');
      //console.dir(request2, { colors: true, depth: 20 });
      const result3 = await http(getHTTPOptions(request3));
      //console.dir(result2, { colors: true, depth: 20 });
      result3.context.contexts.should.include('ask_for_support_type');
      result3.event.should.equal('continue');
      result3.messages[0].body.should.contain('Please, briefly describe why you need our support');

      const request4: BotRequest = {
        language: 'en',
        event: 'continue',
        message: getTextMessage("I'm getting an error"),
        settings: getSettings(),
        context: result3.context,
        data: result3.data
      };
      const result4 = await http(getHTTPOptions(request4));
      //console.dir(result4, { colors: true, depth: 20 });
      result4.context.contexts.should.include('end');
      result4.event.should.equal('end');
      result4.messages[0].body.should.contain('Done. Thank you.');
      result4.data.name.should.contain('Antonio Obama');
      result4.data.address.should.contain('Palm Beach Street, 29 - Los Angeles');
      result4.data.supportType.should.contain('technical');
      return;
    });

    after('shutdown bot manager', function () {
      server.close();
    });
  });
  describe('Sending plain text messages and one postback message for support type', function () {
    const getSettings = function (): any {
      return {
        engine: {
          type: engineType,
          settings: {
            token: env.WIT_TOKEN
          }
        }
      };
    };
    const manager = new BotAgentManager();
    let server;
    before('starting bot manager', async function () {
      manager.registerAgent(
        engineType,
        async (req: BotRequest): Promise<BotResponse> => {
          const bot = new DataCollectorTestWitBot(req.settings.engine.settings.token);
          return bot.sendMessage(req);
        }
      );
      // Run the BotManager:
      const port = (process.env.PORT as any) || 8080;
      server = await manager.listen(port);
      return;
    });
    it('should perform data collection and then end with data filled', async function () {
      const request1: BotRequest = {
        language: 'en',
        event: 'start',
        settings: getSettings()
      };
      //console.dir(request1, { colors: true, depth: 20 });
      const result1 = await http(getHTTPOptions(request1));
      //console.dir(result1, { colors: true, depth: 20 });
      result1.context.contexts.should.include('ask_for_name');

      const request2: BotRequest = {
        language: 'en',
        event: 'continue',
        message: getTextMessage('Antonio Obama'),
        settings: getSettings(),
        context: result1.context,
        data: result1.data
      };
      //console.log('Sending msg2');
      //console.dir(request2, { colors: true, depth: 20 });
      const result2 = await http(getHTTPOptions(request2));
      //console.dir(result2, { colors: true, depth: 20 });
      result2.context.contexts.should.include('ask_for_address');
      result2.event.should.equal('continue');
      result2.messages[0].body.should.contain('Send me your full address, please');

      const request3: BotRequest = {
        language: 'en',
        event: 'continue',
        message: getTextMessage('Palm Beach Street, 29 - Los Angeles'),
        settings: getSettings(),
        context: result2.context,
        data: result2.data
      };
      //console.log('Sending msg2');
      //console.dir(request2, { colors: true, depth: 20 });
      const result3 = await http(getHTTPOptions(request3));
      //console.dir(result2, { colors: true, depth: 20 });
      result3.context.contexts.should.include('ask_for_support_type');
      result3.event.should.equal('continue');
      result3.messages[0].body.should.contain('Please, briefly describe why you need our support');

      const request4: BotRequest = {
        language: 'en',
        event: 'continue',
        message: {
          code: 'message',
          type: 'postback',
          body: "I'm getting an error"
        } as PostbackMessage,
        settings: getSettings(),
        context: result3.context,
        data: result3.data
      };
      const result4 = await http(getHTTPOptions(request4));
      //console.dir(result4, { colors: true, depth: 20 });
      result4.context.contexts.should.include('end');
      result4.event.should.equal('end');
      result4.messages[0].body.should.contain('Done. Thank you.');
      result4.data.name.should.contain('Antonio Obama');
      result4.data.address.should.contain('Palm Beach Street, 29 - Los Angeles');
      result4.data.supportType.should.contain('technical');
      return;
    });

    after('shutdown bot manager', function () {
      server.close();
    });
  });
}); // root describe - end
