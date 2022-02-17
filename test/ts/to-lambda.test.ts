import * as chai from 'chai';
import http from 'request-promise-native';
import { BotAgentManager, BotRequest, BotResponse } from '../../dist';
import { toLambda } from '../../dist/lambda';
import { DataCollectorTestWitBot } from './bot';
import { dummyBot } from './dummy-bot';

chai.should();

describe('toLambda function test', function () {
  describe('#toLambda()', function () {
    it('should return an Express Application', function () {
      toLambda(dummyBot).should.have.property('use');
    });
  });
  const should = require('chai').should();

  describe('for a lambda augmented-bot', function () {
    const engineType = 'WitAi';
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

      server = await toLambda(manager).listen(port);
      return;
    });
    it('sending a message should return a configured app', async function () {
      const engineType = 'WitAi';
      const getSettings = function (): any {
        return {
          engine: {
            type: engineType,
            settings: {
              token: process.env.WIT_TOKEN
            }
          }
        };
      };
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
          json: true,
          simple: false,
          resolveWithFullResponse: true
        };
      };

      const request1: BotRequest = {
        language: 'en',
        event: 'start',
        settings: getSettings()
      };
      //console.dir(request1, { colors: true, depth: 20 });
      const result1 = await http(getHTTPOptions(request1));
      //console.dir(result1, { colors: true, depth: 20 });
      result1.statusCode.should.equal(200);
      result1.body.event.should.equal('continue');
      return;
    });
    after('shutdown bot manager', function () {
      server.close();
    });
  });
});
