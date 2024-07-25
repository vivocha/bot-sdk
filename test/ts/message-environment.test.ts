import { EnvironmentInfo } from '@vivocha/public-types';
import * as chai from 'chai';
import * as http from 'request-promise-native';
import { BotRequest } from '../../dist';
import { dummyBot } from './dummy-bot';

chai.should();

const engineType = 'custom';

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
const getSettings = function (): any {
  return {
    engine: {
      type: engineType
    }
  };
};

//root describe
describe('Testing message environment property ', function () {
  describe('Sending a start message with environment', function () {
    let environment: EnvironmentInfo = {
      host: 'localhost:8080',
      acct: 'vvc_test1',
      hmac: '123456dfghjcvbn',
      caps: {},
      campaignId: '123',
      channelId: 'web',
      entrypointId: 'qwerty',
      engagementId: '567',
      contactId: '123ertyui8',
      token: 'token123',
      tags: ['bot', 'sales'],
      optionalTags: ['vip'],
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
      geoIP: { ip: '127.0.0.1', metro_code: '02020', time_zone: 'utc' },
      apiVersion: 'v3',
      aRandomProperty: 'foo'
    };
    let server;
    before('starting bot manager', async function () {
      // Run the BotManager:
      const port = (process.env.PORT as any) || 8080;
      server = await dummyBot.listen(port);
      return;
    });
    it('should return the complete environment', async function () {
      const request1: BotRequest = {
        language: 'en',
        event: 'start',
        settings: getSettings(),
        environment
      };
      //console.dir(request1, { colors: true, depth: 20 });
      const result1 = await http(getHTTPOptions(request1));
      //console.dir(result1, { colors: true, depth: 20 });
      result1.event.should.equal('continue');
      result1.messages.should.have.lengthOf(1);
      result1.environment.should.deep.equal(environment);
      return;
    });

    after('shutdown bot manager', function () {
      server.close();
    });
  });
  describe('Sending a message with environment', function () {
    let environment: EnvironmentInfo = {
      host: 'localhost:8080',
      acct: 'vvc_test1',
      hmac: '123456dfghjcvbn',
      caps: {},
      campaignId: '123',
      channelId: 'web',
      entrypointId: 'qwerty',
      engagementId: '567',
      contactId: '123ertyui8',
      token: 'token123',
      tags: ['bot', 'sales'],
      optionalTags: ['vip'],
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
      geoIP: { ip: '127.0.0.1', metro_code: '02020', time_zone: 'utc' },
      apiVersion: 'v3',
      aRandomProperty: 'foo'
    };
    let server;
    before('starting bot manager', async function () {
      // Run the BotManager:
      const port = (process.env.PORT as any) || 8080;
      server = await dummyBot.listen(port);
      return;
    });
    it('should return the complete environment', async function () {
      const request1: BotRequest = {
        language: 'en',
        event: 'continue',
        message: getTextMessage('environment'),
        settings: getSettings(),
        environment
      };
      //console.dir(request1, { colors: true, depth: 20 });
      const result1 = await http(getHTTPOptions(request1));
      //console.dir(result1, { colors: true, depth: 20 });
      result1.event.should.equal('continue');
      result1.messages.should.have.lengthOf(1);
      result1.environment.should.deep.equal(environment);
      return;
    });

    after('shutdown bot manager', function () {
      server.close();
    });
  });

  describe('Sending a message with environment including chat capabilities', function () {
    let environment: EnvironmentInfo = {
      host: 'localhost:8080',
      acct: 'vvc_test1',
      hmac: '123456dfghjcvbn',
      caps: {
        type: 'a',
        inbound: true,
        media: {
          chat: {
            acks: 'in',
            read: 'in',
            attachment: 'both',
            location: 'in',
            customTemplateSchemaIds: ['WhatsAppTemplate']
          }
        }
      },
      campaignId: '123',
      channelId: 'web',
      entrypointId: 'qwerty',
      engagementId: '567',
      contactId: '123ertyui8',
      token: 'token123',
      tags: ['bot', 'sales'],
      optionalTags: ['vip'],
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
      geoIP: { ip: '127.0.0.1', metro_code: '02020', time_zone: 'utc' },
      apiVersion: 'v3',
      aRandomProperty: 'foo'
    };
    let server;
    before('starting bot manager', async function () {
      // Run the BotManager:
      const port = (process.env.PORT as any) || 8080;
      server = await dummyBot.listen(port);
      return;
    });
    it('should return the complete environment', async function () {
      const request1: BotRequest = {
        language: 'en',
        event: 'continue',
        message: getTextMessage('environment'),
        settings: getSettings(),
        environment
      };
      //console.dir(request1, { colors: true, depth: 20 });
      const result1 = await http(getHTTPOptions(request1));
      //console.dir(result1, { colors: true, depth: 20 });
      result1.event.should.equal('continue');
      result1.messages.should.have.lengthOf(1);
      result1.environment.should.deep.equal(environment);
      return;
    });

    after('shutdown bot manager', function () {
      server.close();
    });
  });
}); // root describe - end
