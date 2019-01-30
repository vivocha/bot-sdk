import * as chai from 'chai';
import { BotAgentManager, BotRequest } from '../../dist';
import * as http from 'request-promise-native';
import { dummyBot } from './dummy-bot';
import bodyParser = require('body-parser');

chai.should();

const engineType = 'custom';

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
const getAttachmentMessage = function(): any {
  let msg = {
    code: 'message',
    type: 'attachment',
    url: 'https://media.giphy.com/media/l1KsqYM8Zt3yG3tVS/giphy.gif',
    meta: {
      originalUrl: 'https://media.giphy.com/media/l1KsqYM8Zt3yG3tVS/giphy.gif',
      originalName: 'Scream.gif',
      mimetype: 'image/gif'
    }
  };
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
describe('Testing a generic Bot Agent (Dummy Bot) ', function() {
  let env = process.env;
  describe('Sending a correct start message', function() {
    const getSettings = function(): any {
      return {
        engine: {
          type: engineType
        }
      };
    };
    const manager = new BotAgentManager();
    let server;
    before('starting bot manager', async function() {
      // Run the BotManager:
      const port = (process.env.PORT as any) || 8080;
      server = await dummyBot.listen(port);
      return;
    });
    it('should greet with a continue event', async function() {
      const request1: BotRequest = {
        language: 'en',
        event: 'start',
        settings: getSettings()
      };
      //console.dir(request1, { colors: true, depth: 20 });
      const result1 = await http(getHTTPOptions(request1));
      //console.dir(result1, { colors: true, depth: 20 });
      result1.event.should.equal('continue');
      result1.messages.should.have.lengthOf(1);
      result1.messages[0].body.should.contain('Hello!');
      return;
    });
    it('should be ok for a start with also a message', async function() {
      const request1: BotRequest = {
        language: 'en',
        event: 'start',
        message: {
          code: 'message',
          type: 'text',
          body: 'hello bot'
        } as any,
        settings: getSettings()
      };
      //console.dir(request1, { colors: true, depth: 20 });
      const result1 = await http(getHTTPOptions(request1));
      //console.dir(result1, { colors: true, depth: 20 });
      result1.event.should.equal('continue');
      result1.messages.should.have.lengthOf(1);
      result1.messages[0].body.should.contain('Hello!');
      return;
    });
    it('should fail when using a unknown agent type', async function() {
      const request1: BotRequest = {
        language: 'en',
        event: 'start',
        settings: {
          engine: {
            type: 'wrong-type'
          }
        }
      };
      const fullOpts = getHTTPOptions(request1);
      fullOpts['resolveWithFullResponse'] = true;
      fullOpts['simple'] = false;
      const result1 = await http(fullOpts);
      result1.statusCode.should.equal(400);
      return;
    });
    it('should fail when sending a malformed message', async function() {
      const request1: BotRequest = {
        language: 'en',
        event: 'start',
        message: {
          code: 'message',
          type: 'textS',
          body: 'maybe wrong'
        } as any,
        settings: {
          engine: {
            type: 'custom'
          }
        }
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
  describe('Sending generic text messages', function() {
    const getSettings = function(): any {
      return {
        engine: {
          type: engineType
        }
      };
    };
    const manager = new BotAgentManager();
    let server;
    before('starting bot manager', async function() {
      // Run the BotManager:
      const port = (process.env.PORT as any) || 8080;
      server = await dummyBot.listen(port);
      return;
    });
    it('sending quick, it should reply with three quick_replies', async function() {
      const request1: BotRequest = {
        language: 'en',
        event: 'continue',
        settings: getSettings(),
        message: getTextMessage('quick')
      };
      //console.dir(request1, { colors: true, depth: 20 });
      const result1 = await http(getHTTPOptions(request1));
      //console.dir(result1, { colors: true, depth: 20 });
      result1.event.should.equal('continue');
      result1.messages.should.have.lengthOf(1);
      result1.messages[0].body.should.contain('Just an example of quick replies... choose a color?');
      result1.messages[0].quick_replies.should.have.lengthOf(3);
      return;
    });
    it('sending ciao, it should reply with a text message', async function() {
      const request1: BotRequest = {
        language: 'en',
        event: 'continue',
        settings: getSettings(),
        message: getTextMessage('ciao')
      };
      //console.dir(request1, { colors: true, depth: 20 });
      const result1 = await http(getHTTPOptions(request1));
      //console.dir(result1, { colors: true, depth: 20 });
      result1.event.should.equal('continue');
      result1.messages.should.have.lengthOf(1);
      result1.messages[0].should.deep.equal({
        code: 'message',
        type: 'text',
        body: 'hello :)'
      });
      return;
    });
    it('sending quick2, it should reply with three quick_replies', async function() {
      const request1: BotRequest = {
        language: 'en',
        event: 'continue',
        settings: getSettings(),
        message: getTextMessage('quick2')
      };
      //console.dir(request1, { colors: true, depth: 20 });
      const result1 = await http(getHTTPOptions(request1));
      //console.dir(result1, { colors: true, depth: 20 });
      result1.event.should.equal('continue');
      result1.messages.should.have.lengthOf(1);
      result1.messages[0].body.should.contain('Just an example of quick replies... choose a color?');
      result1.messages[0].quick_replies.should.have.lengthOf(3);
      result1.messages[0].quick_replies.should.deep.equal([
        {
          content_type: 'text',
          title: 'Red',
          payload: 'red'
        },
        {
          content_type: 'text',
          title: 'Blue',
          payload: 'blue'
        },
        {
          content_type: 'text',
          title: 'White',
          payload: 'white'
        }
      ]);
      return;
    });
    it('sending cat, it should reply with a template', async function() {
      const request1: BotRequest = {
        language: 'en',
        event: 'continue',
        settings: getSettings(),
        message: getTextMessage('cat')
      };
      //console.dir(request1, { colors: true, depth: 20 });
      const result1 = await http(getHTTPOptions(request1));
      //console.dir(result1, { colors: true, depth: 20 });
      result1.event.should.equal('continue');
      result1.messages.should.have.lengthOf(1);
      result1.messages[0].should.have.property('template');
      const template = result1.messages[0].template;
      template.type.should.equal('generic');
      template.elements.should.have.lengthOf(1);
      template.elements[0].title.should.equal('Meow!');
      template.elements[0].should.have.property('image_url');
      template.elements[0].should.have.property('subtitle');
      template.elements[0].should.have.property('default_action');
      template.elements[0].should.have.property('buttons');
      return;
    });

    it('sending cat2, it should reply with a template', async function() {
      const request1: BotRequest = {
        language: 'en',
        event: 'continue',
        settings: getSettings(),
        message: getTextMessage('cat2')
      };
      //console.dir(request1, { colors: true, depth: 20 });
      const result1 = await http(getHTTPOptions(request1));
      //console.dir(result1, { colors: true, depth: 20 });
      result1.event.should.equal('continue');
      result1.messages.should.have.lengthOf(1);
      result1.messages[0].should.have.property('template');
      const template = result1.messages[0].template;
      template.type.should.equal('generic');
      template.elements.should.have.lengthOf(1);
      template.elements[0].title.should.equal('Meow2!');
      template.elements[0].should.have.property('image_url');
      template.elements[0].should.have.property('subtitle');
      template.elements[0].should.have.property('default_action');
      template.elements[0].should.have.property('buttons');
      const buttons = template.elements[0].buttons;
      buttons[0].should.deep.equal({
        type: 'web_url',
        url: 'https://en.wikipedia.org/wiki/Cat',
        title: 'View Website'
      });
      buttons[1].should.deep.equal({
        type: 'postback',
        title: 'OK',
        payload: 'abcd 123'
      });
      return;
    });

    it('should fail when sending a malformed message', async function() {
      const request1: BotRequest = {
        language: 'en',
        event: 'continue',
        message: {
          code: 'message',
          type: 'textS',
          body: 'maybe wrong'
        } as any,
        settings: {
          engine: {
            type: 'custom'
          }
        }
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
  describe('Sending attachment messages', function() {
    const getSettings = function(): any {
      return {
        engine: {
          type: engineType
        }
      };
    };
    const manager = new BotAgentManager();
    let server;
    before('starting bot manager', async function() {
      // Run the BotManager:
      const port = (process.env.PORT as any) || 8080;
      server = await dummyBot.listen(port);
      return;
    });
    it('sending an attachment message, it should be received and echoed', async function() {
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
      result1.messages.should.have.lengthOf(2);
      result1.messages[0].body.should.contain('You sent an ATTACHMENT');
      const meta = JSON.parse(result1.messages[1].body);
      meta.url.should.equal('https://media.giphy.com/media/l1KsqYM8Zt3yG3tVS/giphy.gif');
      meta.type.should.equal('attachment');
      meta.meta.originalUrl.should.equal('https://media.giphy.com/media/l1KsqYM8Zt3yG3tVS/giphy.gif');
      meta.meta.originalName.should.equal('Scream.gif');
      meta.meta.mimetype.should.equal('image/gif');
      return;
    });
    it('asking for an attachment message, it should be correctly sent by the bot', async function() {
      const request1: BotRequest = {
        language: 'en',
        event: 'continue',
        settings: getSettings(),
        message: getTextMessage('attach')
      };
      //console.dir(request1, { colors: true, depth: 20 });
      const result1 = await http(getHTTPOptions(request1));
      //console.dir(result1, { colors: true, depth: 20 });
      result1.event.should.equal('continue');
      result1.messages.should.have.lengthOf(1);
      const attacchMsg = result1.messages[0];
      attacchMsg.url.should.equal('https://media.giphy.com/media/l1KsqYM8Zt3yG3tVS/giphy.gif');
      attacchMsg.type.should.equal('attachment');
      attacchMsg.meta.originalUrl.should.equal('');
      attacchMsg.meta.originalName.should.equal('Scream.gif');
      attacchMsg.meta.mimetype.should.equal('image/gif');
      return;
    });

    after('shutdown bot manager', function() {
      server.close();
    });
  });
  describe('Sending a request for ending conversation', function() {
    const getSettings = function(): any {
      return {
        engine: {
          type: engineType
        }
      };
    };
    const manager = new BotAgentManager();
    let server;
    before('starting bot manager', async function() {
      // Run the BotManager:
      const port = (process.env.PORT as any) || 8080;
      server = await dummyBot.listen(port);
      return;
    });
    it('should send an end event', async function() {
      const request1: BotRequest = {
        language: 'en',
        event: 'continue',
        settings: getSettings(),
        message: getTextMessage('bye')
      };
      //console.dir(request1, { colors: true, depth: 20 });
      const result1 = await http(getHTTPOptions(request1));
      //console.dir(result1, { colors: true, depth: 20 });
      result1.event.should.equal('end');
      result1.messages.should.have.lengthOf(1);
      result1.messages[0].body.should.contain('Bye');
      return;
    });

    after('shutdown bot manager', function() {
      server.close();
    });
  });
}); // root describe - end
