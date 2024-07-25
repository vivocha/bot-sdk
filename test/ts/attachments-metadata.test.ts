import * as chai from 'chai';
import * as _ from 'lodash';
import { getVvcEnvironment } from '../../dist/util';
import { EnvironmentInfo, BotResponse } from '@vivocha/public-types/dist/bot';
import { AttachmentMessage, BotAgentManager, TextMessage } from '../../dist';

chai.should();

describe('Testing BotAgentManager.normalizeResponse()', function() {
  describe('A BotResponse with only one AttachmentMessage', function() {
    it('with ref property already set in AttachmentMetadata, the BotResponse should be returned unchanged', function() {
      const origResponse: BotResponse = {
        event: 'continue',
        context: {},
        messages: [
          {
            code: 'message',
            type: 'attachment',
            url: 'https://media.giphy.com/media/l1KsqYM8Zt3yG3tVS/giphy.gif',
            meta: {
              originalUrl: 'https://media.giphy.com/media/l1KsqYM8Zt3yG3tVS/giphy.gif',
              originalName: 'Scream.gif',
              mimetype: 'image/gif',
              ref: 'a-1010'
            }
          } as AttachmentMessage
        ]
      };

      const fixedResponse = BotAgentManager.normalizeResponse(origResponse);
      fixedResponse.should.deep.equal(origResponse);
    });
    it('with NO ref property already set in AttachmentMetadata, the BotResponse should contain the meta property with a ref set to an uuid', function() {
      const origResponse: BotResponse = {
        event: 'continue',
        context: { a: 10 },
        messages: [
          {
            code: 'message',
            type: 'attachment',
            url: 'https://media.giphy.com/media/l1KsqYM8Zt3yG3tVS/giphy.gif',
            meta: {
              originalUrl: 'https://media.giphy.com/media/l1KsqYM8Zt3yG3tVS/giphy.gif',
              originalName: 'Scream.gif',
              mimetype: 'image/gif'
            }
          } as AttachmentMessage
        ]
      };

      const fixedResponse = BotAgentManager.normalizeResponse(origResponse);
      const attachmentMsg: AttachmentMessage = fixedResponse.messages[0] as AttachmentMessage;
      fixedResponse.event.should.equal(origResponse.event);
      fixedResponse.context.should.deep.equal(origResponse.context);
      attachmentMsg.code.should.equal('message');
      attachmentMsg.type.should.equal('attachment');
      attachmentMsg.url.should.equal('https://media.giphy.com/media/l1KsqYM8Zt3yG3tVS/giphy.gif');
      attachmentMsg.meta.originalUrl.should.equal('https://media.giphy.com/media/l1KsqYM8Zt3yG3tVS/giphy.gif');
      attachmentMsg.meta.originalName.should.equal('Scream.gif');
      attachmentMsg.meta.mimetype.should.equal('image/gif');
      attachmentMsg.meta.should.have.property('ref');
      attachmentMsg.meta.ref.should.be.lengthOf(36);
    });
  });
  describe('A BotResponse with two AttachmentMessages', function() {
    it('with ref property already set in AttachmentMetadata, the BotResponse should be returned unchanged', function() {
      const origResponse: BotResponse = {
        event: 'continue',
        context: {},
        messages: [
          {
            code: 'message',
            type: 'attachment',
            url: 'https://media.giphy.com/media/l1KsqYM8Zt3yG3tVS/giphy.gif',
            meta: {
              originalUrl: 'https://media.giphy.com/media/l1KsqYM8Zt3yG3tVS/giphy.gif',
              originalName: 'Scream.gif',
              mimetype: 'image/gif',
              ref: 'a-1010'
            }
          } as AttachmentMessage,
          {
            code: 'message',
            type: 'attachment',
            url: 'https://media.giphy.com/media/l1KsqYM8Zt3yG3tVS/giphy.gif',
            meta: {
              originalUrl: 'https://media.giphy.com/media/l1KsqYM8Zt3yG3tVS/giphy.gif',
              originalName: 'Test.gif',
              mimetype: 'image/gif',
              ref: 'a-2020'
            }
          } as AttachmentMessage
        ]
      };

      const fixedResponse = BotAgentManager.normalizeResponse(origResponse);
      fixedResponse.should.deep.equal(origResponse);
    });
    it('with NO ref property already set in AttachmentMetadata, the BotResponse should contain the meta property with a ref set to an uuid', function() {
      const origResponse: BotResponse = {
        event: 'continue',
        context: { a: 10 },
        messages: [
          {
            code: 'message',
            type: 'attachment',
            url: 'https://media.giphy.com/media/l1KsqYM8Zt3yG3tVS/giphy.gif',
            meta: {
              originalUrl: 'https://media.giphy.com/media/l1KsqYM8Zt3yG3tVS/giphy.gif',
              originalName: 'Scream.gif',
              mimetype: 'image/gif'
            }
          } as AttachmentMessage,
          {
            code: 'message',
            type: 'attachment',
            url: 'https://media.giphy.com/media/l1KsqYM8Zt3yG3tVS/giphy.gif',
            meta: {
              originalUrl: 'https://media.giphy.com/media/l1KsqYM8Zt3yG3tVS/giphy.gif',
              originalName: 'Test.gif',
              mimetype: 'image/gif'
            }
          } as AttachmentMessage
        ]
      };

      const fixedResponse = BotAgentManager.normalizeResponse(origResponse);
      const attachmentMsg: AttachmentMessage = fixedResponse.messages[0] as AttachmentMessage;
      fixedResponse.event.should.equal(origResponse.event);
      fixedResponse.context.should.deep.equal(origResponse.context);
      attachmentMsg.code.should.equal('message');
      attachmentMsg.type.should.equal('attachment');
      attachmentMsg.url.should.equal('https://media.giphy.com/media/l1KsqYM8Zt3yG3tVS/giphy.gif');
      attachmentMsg.meta.originalUrl.should.equal('https://media.giphy.com/media/l1KsqYM8Zt3yG3tVS/giphy.gif');
      attachmentMsg.meta.originalName.should.equal('Scream.gif');
      attachmentMsg.meta.mimetype.should.equal('image/gif');
      attachmentMsg.meta.should.have.property('ref');
      attachmentMsg.meta.ref.should.be.lengthOf(36);

      const attachmentMsgB: AttachmentMessage = fixedResponse.messages[1] as AttachmentMessage;
      fixedResponse.event.should.equal(origResponse.event);
      fixedResponse.context.should.deep.equal(origResponse.context);
      attachmentMsgB.code.should.equal('message');
      attachmentMsgB.type.should.equal('attachment');
      attachmentMsgB.url.should.equal('https://media.giphy.com/media/l1KsqYM8Zt3yG3tVS/giphy.gif');
      attachmentMsgB.meta.originalUrl.should.equal('https://media.giphy.com/media/l1KsqYM8Zt3yG3tVS/giphy.gif');
      attachmentMsgB.meta.originalName.should.equal('Test.gif');
      attachmentMsgB.meta.mimetype.should.equal('image/gif');
      attachmentMsgB.meta.should.have.property('ref');
      attachmentMsgB.meta.ref.should.be.lengthOf(36);
    });
  });
  describe('A BotResponse with NO AttachmentMessages', function() {
    it('the BotResponse with one text message should be returned unchanged', function() {
      const origResponse: BotResponse = {
        event: 'continue',
        context: {},
        messages: [
          {
            code: 'message',
            type: 'text',
            body: 'Choose a team member',
            quick_replies: [
              {
                content_type: 'text',
                title: 'Federico',
                payload: 'federico',
                image_url: 'https://www.vivocha.com/wp-content/uploads/2017/03/team_federico.png'
              },
              {
                content_type: 'text',
                title: 'Andrea',
                payload: 'andrea',
                image_url: 'https://www.vivocha.com/wp-content/uploads/2017/03/team_andrea.png'
              },
              {
                content_type: 'text',
                title: 'Antonio',
                payload: 'antonio',
                image_url: 'https://www.vivocha.com/wp-content/uploads/2017/05/team-antonio.png'
              }
            ]
          } as any
        ]
      };

      const fixedResponse = BotAgentManager.normalizeResponse(origResponse);
      fixedResponse.should.deep.equal(origResponse);
    });
    it('the BotResponse with several messages should be returned unchanged', function() {
      const origResponse: BotResponse = {
        event: 'continue',
        context: {},
        messages: [
          {
            code: 'message',
            type: 'text',
            body: 'Choose a team member',
            quick_replies: [
              {
                content_type: 'text',
                title: 'Federico',
                payload: 'federico',
                image_url: 'https://www.vivocha.com/wp-content/uploads/2017/03/team_federico.png'
              },
              {
                content_type: 'text',
                title: 'Andrea',
                payload: 'andrea',
                image_url: 'https://www.vivocha.com/wp-content/uploads/2017/03/team_andrea.png'
              },
              {
                content_type: 'text',
                title: 'Antonio',
                payload: 'antonio',
                image_url: 'https://www.vivocha.com/wp-content/uploads/2017/05/team-antonio.png'
              }
            ]
          } as any,
          {
            code: 'message',
            type: 'text',
            body: 'Just a TEST'
          } as TextMessage,
          {
            code: 'message',
            type: 'text',
            body: 'Just an example of generic templates:',
            template: {
              type: 'generic',
              elements: [
                {
                  title: 'Meow!',
                  image_url:
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Tajeschidolls_Beren_of_LoveLorien_Ragdoll_Seal_Mink_Lynx_Bicolor.jpg/1024px-Tajeschidolls_Beren_of_LoveLorien_Ragdoll_Seal_Mink_Lynx_Bicolor.jpg',
                  subtitle: 'We have the right cat for everyone.',

                  default_action: {
                    type: 'web_url',
                    url: 'https://en.wikipedia.org/wiki/Cat'
                  },

                  buttons: [
                    {
                      type: 'web_url',
                      url: 'https://en.wikipedia.org/wiki/Cat',
                      title: 'View Website'
                    },
                    {
                      type: 'postback',
                      title: 'OK',
                      payload: 'abcd 123'
                    }
                  ]
                }
              ] // end elements
            }
          } as any
        ]
      };

      const fixedResponse = BotAgentManager.normalizeResponse(origResponse);
      fixedResponse.should.deep.equal(origResponse);
    });
  });
  describe('A BotResponse with mixed messages', function() {
    it('the BotResponse with one text message and an attachment message with ref should be returned unchanged', function() {
      const origResponse: BotResponse = {
        event: 'continue',
        context: {},
        messages: [
          {
            code: 'message',
            type: 'text',
            body: 'Choose a team member',
            quick_replies: [
              {
                content_type: 'text',
                title: 'Federico',
                payload: 'federico',
                image_url: 'https://www.vivocha.com/wp-content/uploads/2017/03/team_federico.png'
              },
              {
                content_type: 'text',
                title: 'Andrea',
                payload: 'andrea',
                image_url: 'https://www.vivocha.com/wp-content/uploads/2017/03/team_andrea.png'
              },
              {
                content_type: 'text',
                title: 'Antonio',
                payload: 'antonio',
                image_url: 'https://www.vivocha.com/wp-content/uploads/2017/05/team-antonio.png'
              }
            ]
          } as any,
          {
            code: 'message',
            type: 'attachment',
            url: 'https://media.giphy.com/media/l1KsqYM8Zt3yG3tVS/giphy.gif',
            meta: {
              originalUrl: 'https://media.giphy.com/media/l1KsqYM8Zt3yG3tVS/giphy.gif',
              originalName: 'Scream.gif',
              mimetype: 'image/gif',
              ref: 'a-1010'
            }
          } as AttachmentMessage
        ]
      };

      const fixedResponse = BotAgentManager.normalizeResponse(origResponse);
      fixedResponse.should.deep.equal(origResponse);
    });
    it('the BotResponse with several mixed complete messages should be returned unchanged', function() {
      const origResponse: BotResponse = {
        event: 'continue',
        context: {},
        messages: [
          {
            code: 'message',
            type: 'text',
            body: 'Choose a team member',
            quick_replies: [
              {
                content_type: 'text',
                title: 'Federico',
                payload: 'federico',
                image_url: 'https://www.vivocha.com/wp-content/uploads/2017/03/team_federico.png'
              },
              {
                content_type: 'text',
                title: 'Andrea',
                payload: 'andrea',
                image_url: 'https://www.vivocha.com/wp-content/uploads/2017/03/team_andrea.png'
              },
              {
                content_type: 'text',
                title: 'Antonio',
                payload: 'antonio',
                image_url: 'https://www.vivocha.com/wp-content/uploads/2017/05/team-antonio.png'
              }
            ]
          } as any,
          {
            code: 'message',
            type: 'text',
            body: 'Just a TEST'
          } as TextMessage,
          {
            code: 'message',
            type: 'attachment',
            url: 'https://media.giphy.com/media/l1KsqYM8Zt3yG3tVS/giphy.gif',
            meta: {
              originalUrl: 'https://media.giphy.com/media/l1KsqYM8Zt3yG3tVS/giphy.gif',
              originalName: 'Scream.gif',
              mimetype: 'image/gif',
              ref: 'a-1010'
            }
          } as AttachmentMessage,
          {
            code: 'message',
            type: 'text',
            body: 'Just an example of generic templates:',
            template: {
              type: 'generic',
              elements: [
                {
                  title: 'Meow!',
                  image_url:
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Tajeschidolls_Beren_of_LoveLorien_Ragdoll_Seal_Mink_Lynx_Bicolor.jpg/1024px-Tajeschidolls_Beren_of_LoveLorien_Ragdoll_Seal_Mink_Lynx_Bicolor.jpg',
                  subtitle: 'We have the right cat for everyone.',

                  default_action: {
                    type: 'web_url',
                    url: 'https://en.wikipedia.org/wiki/Cat'
                  },

                  buttons: [
                    {
                      type: 'web_url',
                      url: 'https://en.wikipedia.org/wiki/Cat',
                      title: 'View Website'
                    },
                    {
                      type: 'postback',
                      title: 'OK',
                      payload: 'abcd 123'
                    }
                  ]
                },
                {
                  code: 'message',
                  type: 'attachment',
                  url: 'https://media.giphy.com/media/l1KsqYM8Zt3yG3tVS/giphy.gif',
                  meta: {
                    originalUrl: 'https://media.giphy.com/media/l1KsqYM8Zt3yG3tVS/giphy.gif',
                    originalName: 'Scream.gif',
                    mimetype: 'image/gif',
                    ref: 'a-3030'
                  }
                } as AttachmentMessage
              ] // end elements
            }
          } as any
        ]
      };

      const fixedResponse = BotAgentManager.normalizeResponse(origResponse);
      fixedResponse.should.deep.equal(origResponse);
    });
    it('the BotResponse containing five MIXED incomplete messages return the attachment messages with a ref set to an uuid', function() {
      const origResponse: BotResponse = {
        event: 'continue',
        context: {},
        messages: [
          {
            code: 'message',
            type: 'text',
            body: 'Choose a team member',
            quick_replies: [
              {
                content_type: 'text',
                title: 'Federico',
                payload: 'federico',
                image_url: 'https://www.vivocha.com/wp-content/uploads/2017/03/team_federico.png'
              },
              {
                content_type: 'text',
                title: 'Andrea',
                payload: 'andrea',
                image_url: 'https://www.vivocha.com/wp-content/uploads/2017/03/team_andrea.png'
              },
              {
                content_type: 'text',
                title: 'Antonio',
                payload: 'antonio',
                image_url: 'https://www.vivocha.com/wp-content/uploads/2017/05/team-antonio.png'
              }
            ]
          } as any,
          {
            code: 'message',
            type: 'text',
            body: 'Just a TEST'
          } as TextMessage,
          {
            code: 'message',
            type: 'attachment',
            url: 'https://media.giphy.com/media/l1KsqYM8Zt3yG3tVS/giphy.gif',
            meta: {
              originalUrl: 'https://media.giphy.com/media/l1KsqYM8Zt3yG3tVS/giphy.gif',
              originalName: 'Scream.gif',
              mimetype: 'image/gif'
            }
          } as AttachmentMessage,
          {
            code: 'message',
            type: 'text',
            body: 'Just an example of generic templates:',
            template: {
              type: 'generic',
              elements: [
                {
                  title: 'Meow!',
                  image_url:
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Tajeschidolls_Beren_of_LoveLorien_Ragdoll_Seal_Mink_Lynx_Bicolor.jpg/1024px-Tajeschidolls_Beren_of_LoveLorien_Ragdoll_Seal_Mink_Lynx_Bicolor.jpg',
                  subtitle: 'We have the right cat for everyone.',

                  default_action: {
                    type: 'web_url',
                    url: 'https://en.wikipedia.org/wiki/Cat'
                  },

                  buttons: [
                    {
                      type: 'web_url',
                      url: 'https://en.wikipedia.org/wiki/Cat',
                      title: 'View Website'
                    },
                    {
                      type: 'postback',
                      title: 'OK',
                      payload: 'abcd 123'
                    }
                  ]
                }
              ] // end elements
            }
          } as any,
          {
            code: 'message',
            type: 'attachment',
            url: 'https://media.giphy.com/media/l1KsqYM8Zt3yG3tVS/giphy.gif',
            meta: {
              originalUrl: 'https://media.giphy.com/media/l1KsqYM8Zt3yG3tVS/giphy.gif',
              originalName: 'Scream.gif',
              mimetype: 'image/gif',
              ref: 'a-3030'
            }
          } as AttachmentMessage
        ]
      };
      const copyOfResponse = _.cloneDeep(origResponse);
      const fixedResponse = BotAgentManager.normalizeResponse(origResponse);
      fixedResponse.messages.should.have.lengthOf(copyOfResponse.messages.length);
      fixedResponse.should.not.deep.equal(copyOfResponse);
      fixedResponse.messages[0].should.deep.equal(copyOfResponse.messages[0]);
      fixedResponse.messages[1].should.deep.equal(copyOfResponse.messages[1]);
      fixedResponse.messages[2].should.not.deep.equal(copyOfResponse.messages[2]);
      fixedResponse.messages[3].should.deep.equal(copyOfResponse.messages[3]);
      fixedResponse.messages[4].should.deep.equal(copyOfResponse.messages[4]);

      (fixedResponse.messages[2] as AttachmentMessage).meta.should.have.property('ref');
      (fixedResponse.messages[2] as AttachmentMessage).meta.ref.should.be.lengthOf(36);
    });
  });
});
