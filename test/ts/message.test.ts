import * as chai from 'chai';
import { BotMessage } from '../../dist/message';

chai.should();

describe('Testing BotMessage creation factory', function() {
  describe('Calling createSimpleTextMessage()', function() {
    it('with a string, it should return a correct TextMessage', function() {
      const msg = BotMessage.createSimpleTextMessage('OK');
      msg.should.deep.equal({
        code: 'message',
        type: 'text',
        body: 'OK'
      });
    });
    it('with an undefined body param, it should throw an error', function() {
      (function() {
        BotMessage.createSimpleTextMessage(undefined);
      }.should.throw(Error, /body string is required for a TextMessage/));
    });
  });
  describe('Calling createTextMessageWithQuickReplies()', function() {
    it('with a body string and a good array of quick replies def, it should return a correct TextMessage', function() {
      const msg = BotMessage.createTextMessageWithQuickReplies('Choose a color', [
        {
          title: 'red'
        },
        {
          title: 'blue'
        }
      ]);
      msg.should.deep.equal({
        code: 'message',
        type: 'text',
        body: 'Choose a color',
        quick_replies: [
          {
            content_type: 'text',
            title: 'red',
            payload: 'red'
          },
          {
            content_type: 'text',
            title: 'blue',
            payload: 'blue'
          }
        ]
      });
    });
    it('with a body string and an ampty array of quick replies def, it should return a message with quick_replies as an empty array', function() {
      const msg = BotMessage.createTextMessageWithQuickReplies('Choose a color', []);
      msg.should.deep.equal({
        code: 'message',
        type: 'text',
        body: 'Choose a color',
        quick_replies: []
      });
    });
    it('with an undefined body param, it should throw an error', function() {
      (function() {
        BotMessage.createTextMessageWithQuickReplies(undefined, [
          {
            title: 'red'
          },
          {
            title: 'blue'
          }
        ]);
      }.should.throw(Error, /body string is required for a TextMessage/));
    });
    it('with an good body param and an undefined array of quick replies def, it should throw an error', function() {
      (function() {
        BotMessage.createTextMessageWithQuickReplies('Choose a color', undefined);
      }.should.throw(Error, /quickReplies param must be valid/));
    });
  });
  describe('Calling createActionMessage()', function() {
    it('with a string and no args, it should return a correct ActionMessage', function() {
      const msg = BotMessage.createActionMessage('myAction');
      msg.should.deep.equal({
        code: 'message',
        type: 'action',
        action_code: 'myAction',
        args: []
      });
    });
    it('with a string and args, it should return a correct ActionMessage', function() {
      const msg = BotMessage.createActionMessage('myAction', ['a', 123, {}]);
      msg.should.deep.equal({
        code: 'message',
        type: 'action',
        action_code: 'myAction',
        args: ['a', 123, {}]
      });
    });
    it('with an undefined action code, it should throw an error', function() {
      (function() {
        BotMessage.createActionMessage(undefined);
      }.should.throw(Error, /action_code string is required for an ActionMessage/));
    });
  });
  describe('Calling createQuickReplies()', function() {
    it('with an array of two good text-based quick replies and no payload, should return a correct quick reply message array with titles and payloads from titles', function() {
      const msg = BotMessage.createQuickReplies([
        {
          title: 'red'
        },
        {
          title: 'blue'
        }
      ]);
      msg.should.deep.equal([
        {
          content_type: 'text',
          title: 'red',
          payload: 'red'
        },
        {
          content_type: 'text',
          title: 'blue',
          payload: 'blue'
        }
      ]);
    });
    it('with an array of three good text-based quick replies with payload, should return a correct quick reply message array with titles and payloads', function() {
      const msg = BotMessage.createQuickReplies([
        {
          title: 'red',
          payload: 'r'
        },
        {
          title: 'blue',
          payload: 12
        },
        {
          title: 'white',
          payload: 'w'
        }
      ]);
      msg.should.deep.equal([
        {
          content_type: 'text',
          title: 'red',
          payload: 'r'
        },
        {
          content_type: 'text',
          title: 'blue',
          payload: 12
        },
        {
          content_type: 'text',
          title: 'white',
          payload: 'w'
        }
      ]);
    });
    it('with an array of three good text-based quick replies with payload and image_urls, should return a correct quick reply message array with titles and payloads and image_urls', function() {
      const msg = BotMessage.createQuickReplies([
        {
          title: 'red',
          payload: 'r',
          image_url: 'http://cat.me.ok'
        },
        {
          title: 'blue',
          payload: 12,
          image_url: 'http://cat.me.ok'
        },
        {
          title: 'white',
          payload: 'w',
          image_url: 'http://cat.me.ok'
        }
      ]);
      msg.should.deep.equal([
        {
          content_type: 'text',
          title: 'red',
          payload: 'r',
          image_url: 'http://cat.me.ok'
        },
        {
          content_type: 'text',
          title: 'blue',
          payload: 12,
          image_url: 'http://cat.me.ok'
        },
        {
          content_type: 'text',
          title: 'white',
          payload: 'w',
          image_url: 'http://cat.me.ok'
        }
      ]);
    });
    it('with an array of two good quick replies with images and no payload, should return a correct quick reply message array with image_urls and payloads based on titles', function() {
      const msg = BotMessage.createQuickReplies([
        {
          title: 'A',
          image_url: 'http://a.b.c'
        },
        {
          title: 'B',
          image_url: 'http://a.b.z'
        }
      ]);
      msg.should.deep.equal([
        {
          content_type: 'text',
          title: 'A',
          payload: 'A',
          image_url: 'http://a.b.c'
        },
        {
          title: 'B',
          payload: 'B',
          content_type: 'text',
          image_url: 'http://a.b.z'
        }
      ]);
    });
    it('with an empty array, it shoukd return an empty array', function() {
      const msg = BotMessage.createQuickReplies([]);
      msg.should.have.lengthOf(0);
    });
    it('with an undefined param, it should throw an error', function() {
      (function() {
        BotMessage.createQuickReplies(undefined);
      }.should.throw(Error, /quickReplies param must be valid/));
    });
    describe('Calling createIsWritingMessage', function() {
      it('it should return a correct TextMessage', function() {
        const msg = BotMessage.createIsWritingMessage();
        msg.should.deep.equal({
          code: 'message',
          type: 'iswriting'
        });
      });
    });
  });
  describe('Calling createIsWritingMessage', function() {
    it('it should return a correct TextMessage', function() {
      const msg = BotMessage.createIsWritingMessage();
      msg.should.deep.equal({
        code: 'message',
        type: 'iswriting'
      });
    });
  });
});
