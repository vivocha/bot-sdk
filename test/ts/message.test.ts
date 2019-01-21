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
});
