// This is a complete dummy bot to send and inspect all the supported Vivocha messages types.
// The bot is quite trivial and doesn't make use of an NLP platform, but it allows to see the Bot SDK in action.

// First, install @vivocha/bot-sdk to run this bot!
// NB: Change the following line to:
// import { BotAgentManager, BotRequest, BotResponse, TextMessage, AttachmentMessage, Attachment } from "@vivocha/bot-sdk";
import { BotAgentManager, BotRequest, BotResponse, TextMessage, AttachmentMessage, Attachment, BotMessage, ActionMessage } from '../dist/index';
// got is just a simple library to perform http requests (see below in the BotAgent code)
import * as got from 'got';
import * as request from 'request';
import * as fs from 'fs';
import { Stream } from 'stream';

// A BotManager is a micro web service which exposes an API to send messages
// to registered BotAgents, it exposes a Swagger description of the API with related JSON Schemas.
// A BotManager holds a BotAgents registry.
const manager = new BotAgentManager();

// A BotAgent actually represents the Bot implementation and basically it is
// a function which takes a BotRequest message in input and returns a Promise,
// resolved with a BotResponse message.
// The body of the BotAgent function contains all the code to call the specific
// Bot implementation APIs (e.g., Watson, Dialogflow, etc...) or to implement a new custom one from scratch.

// The following BotAgent is a dummy chat bot implementation just to show
// how easy is to run a simple Bot using the Vivocha Bot SDK;
// it receives simple text "commands" sending back to the user several
// different types of messages, including quick replies and templates with images, URLs, and so on...
// The BotAgent is then registered in the BotManager which will forward all
// the incoming messages (sent by Vivocha Platform) containing (in this case) an engine type === 'custom' in
// the settings property.

manager.registerAgent(
  'custom',
  async (msg: BotRequest): Promise<BotResponse> => {
    console.log('Incoming msg:');
    console.dir(msg, { colors: true, depth: 20 });
    const response: BotResponse = {
      messages: [],
      event: 'continue',
      context: msg.context || {}
    };

    // handle the start event (e.g., replying with a welcome message and the event property set to "continue")
    if (msg.event === 'start') {
      //console.log("Start event detected");
      if ((msg.environment as any).token) {
        response.context['token'] = (msg.environment as any).token;
      }
      response.messages = [
        BotMessage.createSimpleTextMessage('Hello! I am a DummyBot from Bot SDK 3.2.0 😎'),
        {
          code: 'message',
          type: 'text',
          body: 'To start, choose one of the following options to see what I can do for you ',
          quick_replies: [
            {
              title: 'fullhelp',
              payload: 'fullhelp',
              content_type: 'text'
            },
            {
              title: 'help',
              payload: 'help',
              content_type: 'text'
            }
          ]
        } as TextMessage
      ];
      response.data = {};
    } else if ((msg.message as any).type === 'action') {
      const actionMessage: ActionMessage = msg.message as ActionMessage;
      response.messages = [
        BotMessage.createSimpleTextMessage(
          `You sent an Action Message, \n\naction_code: ${actionMessage.action_code}, args: ${JSON.stringify(actionMessage.args)}`
        )
      ];
      response.data = {};
    } else {
      if ((msg.message as any).type === 'attachment') {
        response.messages = [BotMessage.createSimpleTextMessage('You sent an ATTACHMENT'), BotMessage.createSimpleTextMessage(JSON.stringify(msg.message))];
        response.data = {};
      } else {
        // This bot understands few sentences/commands ;)
        switch ((msg.message as any).body.toLowerCase()) {
          case 'hi':
            response.messages = [BotMessage.createSimpleTextMessage('Hello, again!')];
            break;
          case 'hello':
            response.messages = [BotMessage.createSimpleTextMessage('Hey!')];
            break;
          case 'ciao':
            response.messages = [BotMessage.createSimpleTextMessage('Hello! :)')];
            break;
          case 'ok':
            const replies = ['Good! :)', ':)', 'yup! :D', 'oook!', 'yep!', ';)'];
            response.messages = [BotMessage.createSimpleTextMessage(replies[Math.floor(Math.random() * replies.length)])];
            break;
          case 'bye':
            response.messages = [BotMessage.createSimpleTextMessage('Bye, see you soon!')];
            response.event = 'end';
            break;
          // just an example to show how to call an external API to compose a response
          case 'code':
            response.messages = [
              {
                code: 'message',
                type: 'text',
                body: `A brand new code generated for you is: ${(await got('https://httpbin.org/uuid', {
                  json: true
                })).body.uuid || 0}`
              } as TextMessage
            ];
            break;
          case 'quick':
            response.messages = [
              BotMessage.createTextMessageWithQuickReplies('Just an example of quick replies... choose a color?', [
                {
                  title: 'Red',
                  payload: 'red'
                },
                {
                  title: 'Blue',
                  payload: 'blue'
                },
                {
                  title: 'White',
                  payload: 'white'
                }
              ])
            ];
            response.event = 'continue';
            break;
          case 'help':
            response.messages = [
              {
                code: 'message',
                type: 'text',
                body: 'Just an example of generic template:',
                template: {
                  type: 'generic',
                  elements: [
                    {
                      title: 'Here are (some) commands you can send',
                      buttons: [
                        {
                          type: 'postback',
                          title: 'quick',
                          payload: 'quick'
                        },
                        {
                          type: 'postback',
                          title: 'team',
                          payload: 'team'
                        },
                        {
                          type: 'postback',
                          title: 'cat',
                          payload: 'cat'
                        },
                        {
                          type: 'postback',
                          title: 'cats',
                          payload: 'cats'
                        },
                        {
                          type: 'postback',
                          title: 'transfer',
                          payload: 'trasfer'
                        },
                        {
                          type: 'postback',
                          title: 'bye',
                          payload: 'bye'
                        }
                      ]
                    }
                  ] // end elements
                }
              } as any
            ];
            response.event = 'continue';
            break;
          case 'fullhelp':
            response.messages = [
              {
                code: 'message',
                type: 'text',
                body: 'Full list of commands',
                template: {
                  type: 'generic',
                  elements: [
                    {
                      title: 'Here is the full list of commands you can send me',
                      buttons: [
                        {
                          type: 'postback',
                          title: 'quick',
                          payload: 'quick'
                        },
                        {
                          type: 'postback',
                          title: 'team',
                          payload: 'team'
                        },
                        {
                          type: 'postback',
                          title: 'cat',
                          payload: 'cat'
                        },
                        {
                          type: 'postback',
                          title: 'cats',
                          payload: 'cats'
                        },
                        {
                          type: 'postback',
                          title: 'code',
                          payload: 'code'
                        },
                        {
                          type: 'postback',
                          title: 'async',
                          payload: 'async'
                        },
                        {
                          type: 'postback',
                          title: 'attach',
                          payload: 'attach'
                        },
                        {
                          type: 'postback',
                          title: 'up-attach-file',
                          payload: 'up-attach-file'
                        },
                        {
                          type: 'postback',
                          title: 'up-attach-url',
                          payload: 'up-attach-url'
                        },
                        {
                          type: 'postback',
                          title: 'send-action',
                          payload: 'send-action'
                        },
                        {
                          type: 'postback',
                          title: 'send-is-writing',
                          payload: 'send-is-writing'
                        },
                        {
                          type: 'postback',
                          title: 'transfer',
                          payload: 'trasfer'
                        },
                        {
                          type: 'postback',
                          title: 'transfer-with-data',
                          payload: 'transfer-with-data'
                        },
                        {
                          type: 'postback',
                          title: 'bye',
                          payload: 'bye'
                        }
                      ]
                    }
                  ] // end elements
                }
              } as any
            ];
            response.event = 'continue';
            break;
          case 'pagevent':
            response.messages = [
              {
                code: 'message',
                type: 'text',
                body: 'Just an event',
                template: {
                  type: 'generic',
                  elements: [
                    {
                      title: 'You can handle the following page events',
                      buttons: [
                        {
                          type: 'page_event',
                          url: 'https://en.wikipedia.org/wiki/Cat',
                          title: 'View Website'
                        }
                      ]
                    }
                  ] // end elements
                }
              } as any
            ];
            response.event = 'continue';
            break;
          case 'team':
            response.messages = [
              BotMessage.createTextMessageWithQuickReplies('Choose a team member', [
                {
                  title: 'Federico',
                  payload: 'federico',
                  image_url: 'https://www.vivocha.com/wp-content/uploads/2017/03/team_federico.png'
                },
                {
                  title: 'Andrea',
                  payload: 'andrea',
                  image_url: 'https://www.vivocha.com/wp-content/uploads/2017/03/team_andrea.png'
                },
                {
                  title: 'Antonio',
                  payload: 'antonio',
                  image_url: 'https://www.vivocha.com/wp-content/uploads/2017/05/team-antonio.png'
                }
              ])
            ];
            response.event = 'continue';
            break;
          case 'cat':
            response.messages = [
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
            ];
            response.event = 'continue';
            break;
          case 'cats':
            response.messages = [
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
                      title: 'Meow!',
                      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Adult_Scottish_Fold.jpg/1920px-Adult_Scottish_Fold.jpg',
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
            ];
            response.event = 'continue';
            break;
          case 'andrea':
            response.messages = [
              {
                code: 'message',
                type: 'text',
                body: 'Andrea Lovicu',
                template: {
                  type: 'generic',
                  elements: [
                    {
                      title: 'Andrea Lovicu',
                      image_url: 'https://www.vivocha.com/wp-content/uploads/2017/03/team_andrea.png',
                      subtitle: 'Head of Development',

                      default_action: {
                        type: 'web_url',
                        url: 'https://www.vivocha.com/team/'
                      },

                      buttons: [
                        {
                          type: 'web_url',
                          url: 'https://www.vivocha.com/team/',
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
            ];
            response.event = 'continue';
            break;
          case 'federico':
            response.messages = [
              {
                code: 'message',
                type: 'text',
                body: 'Federico Pinna',
                template: {
                  type: 'generic',
                  elements: [
                    {
                      title: 'Federico Pinna',
                      image_url: 'https://www.vivocha.com/wp-content/uploads/2017/03/team_federico.png',
                      subtitle: 'Founder & CTO',

                      default_action: {
                        type: 'web_url',
                        url: 'https://www.vivocha.com/team/'
                      },

                      buttons: [
                        {
                          type: 'web_url',
                          url: 'https://www.vivocha.com/team/',
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
            ];
            response.event = 'continue';
            break;
          case 'antonio':
            response.messages = [
              {
                code: 'message',
                type: 'text',
                body: 'Antonio Pintus',
                template: {
                  type: 'generic',
                  elements: [
                    {
                      title: 'Antonio Pintus',
                      image_url: 'https://www.vivocha.com/wp-content/uploads/2017/05/team-antonio.png',
                      subtitle: 'Senior Software Enginner',

                      default_action: {
                        type: 'web_url',
                        url: 'https://www.vivocha.com/team/'
                      },

                      buttons: [
                        {
                          type: 'web_url',
                          url: 'https://www.vivocha.com/team/',
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
            ];
            response.event = 'continue';
            break;
          case 'red':
            response.messages = [
              {
                code: 'message',
                type: 'text',
                body: 'RED is the color',
                template: {
                  type: 'generic',
                  elements: [
                    {
                      title: 'Red is a nice choice',
                      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Vermillon_pigment.jpg/800px-Vermillon_pigment.jpg',
                      subtitle: 'RED Pigments',

                      default_action: {
                        type: 'web_url',
                        url: 'https://en.wikipedia.org/wiki/Red'
                      },

                      buttons: [
                        {
                          type: 'web_url',
                          url: 'https://en.wikipedia.org/wiki/Red',
                          title: 'More info...'
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
            ];
            response.event = 'continue';
            break;
          case 'blue':
            response.messages = [
              {
                code: 'message',
                type: 'text',
                body: 'BLUE is the color',
                template: {
                  type: 'generic',
                  elements: [
                    {
                      title: 'Blue is a good choice',
                      image_url: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Indigo_plant_extract_sample.jpg',
                      subtitle: 'Blue...',

                      default_action: {
                        type: 'web_url',
                        url: 'https://en.wikipedia.org/wiki/Blue'
                      },

                      buttons: [
                        {
                          type: 'web_url',
                          url: 'https://en.wikipedia.org/wiki/Blue',
                          title: 'More info...'
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
            ];
            response.event = 'continue';
            break;
          case 'white':
            response.messages = [
              {
                code: 'message',
                type: 'text',
                body: 'White is amazing',
                template: {
                  type: 'generic',
                  elements: [
                    {
                      title: 'White is a very nice choice',
                      image_url: 'https://upload.wikimedia.org/wikipedia/commons/7/71/Ivory_Gull_Portrait.jpg',
                      subtitle: 'White is nice!',

                      default_action: {
                        type: 'web_url',
                        url: 'https://en.wikipedia.org/wiki/White'
                      },

                      buttons: [
                        {
                          type: 'web_url',
                          url: 'https://en.wikipedia.org/wiki/White',
                          title: 'More info...'
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
            ];
            response.event = 'continue';
            break;

          case 'transfer':
            response.messages = [
              {
                code: 'message',
                type: 'text',
                body: "OK I'm transferring you to a 'jolly'-tagged agent. Bye!"
              } as TextMessage
            ];
            response.event = 'end';
            response.data = {
              transferToAgent: 'jolly'
            };
            break;
          // In order to show data to an agent on the Vivocha Agent Desktop, create a data collection with the
          // following field names (see response.data property below). Then, add it to the configured bot.
          case 'transfer-with-data':
            response.messages = [
              {
                code: 'message',
                type: 'text',
                body: "OK I'm transferring you to a 'jolly'-tagged agent with some collected data. Bye Bye!"
              } as TextMessage
            ];
            response.event = 'end';
            response.data = {
              transferToAgent: 'jolly',
              fullName: 'Johnny Dummy Bot',
              city: 'Cagliari',
              topic: 'Technical',
              priority: 5
            };
            break;
          case 'tm-buttons':
            response.messages = [
              {
                code: 'message',
                type: 'text',
                body: 'Too many buttons',
                template: {
                  type: 'generic',
                  elements: [
                    {
                      title: 'Too many buttons',
                      subtitle: 'to FB Messenger only the first 3 buttons are sent',

                      default_action: {
                        type: 'web_url',
                        url: 'https://en.wikipedia.org/wiki/Cat'
                      },

                      buttons: [
                        {
                          type: 'postback',
                          title: 'Button1',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button2',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button3',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button4',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button5',
                          payload: 'abcd 123'
                        }
                      ]
                    }
                  ] // end elements
                }
              } as any
            ];
            response.event = 'continue';
            break;
          case 'tm-elements':
            response.messages = [
              {
                code: 'message',
                type: 'text',
                body: 'Too many buttons',
                template: {
                  type: 'generic',
                  elements: [
                    {
                      title: '1',
                      subtitle: 'to FB Messenger only the first 3 buttons are sent',

                      default_action: {
                        type: 'web_url',
                        url: 'https://en.wikipedia.org/wiki/Cat'
                      },

                      buttons: [
                        {
                          type: 'postback',
                          title: 'Button1',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button2',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button3',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button4',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button5',
                          payload: 'abcd 123'
                        }
                      ]
                    },
                    {
                      title: '2',
                      subtitle: 'only the first 3 buttons are sent',

                      default_action: {
                        type: 'web_url',
                        url: 'https://en.wikipedia.org/wiki/Cat'
                      },

                      buttons: [
                        {
                          type: 'postback',
                          title: 'Button1',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button2',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button3',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button4',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button5',
                          payload: 'abcd 123'
                        }
                      ]
                    },
                    {
                      title: '3',
                      subtitle: 'only the first 3 buttons are sent',

                      default_action: {
                        type: 'web_url',
                        url: 'https://en.wikipedia.org/wiki/Cat'
                      },

                      buttons: [
                        {
                          type: 'postback',
                          title: 'Button1',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button2',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button3',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button4',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button5',
                          payload: 'abcd 123'
                        }
                      ]
                    },
                    {
                      title: '4',
                      subtitle: 'only the first 3 buttons are sent',

                      default_action: {
                        type: 'web_url',
                        url: 'https://en.wikipedia.org/wiki/Cat'
                      },

                      buttons: [
                        {
                          type: 'postback',
                          title: 'Button1',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button2',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button3',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button4',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button5',
                          payload: 'abcd 123'
                        }
                      ]
                    },
                    {
                      title: '5',
                      subtitle: 'only the first 3 buttons are sent',

                      default_action: {
                        type: 'web_url',
                        url: 'https://en.wikipedia.org/wiki/Cat'
                      },

                      buttons: [
                        {
                          type: 'postback',
                          title: 'Button1',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button2',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button3',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button4',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button5',
                          payload: 'abcd 123'
                        }
                      ]
                    },
                    {
                      title: '6',
                      subtitle: 'only the first 3 buttons are sent',

                      default_action: {
                        type: 'web_url',
                        url: 'https://en.wikipedia.org/wiki/Cat'
                      },

                      buttons: [
                        {
                          type: 'postback',
                          title: 'Button1',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button2',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button3',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button4',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button5',
                          payload: 'abcd 123'
                        }
                      ]
                    },
                    {
                      title: '7',
                      subtitle: 'only the first 3 buttons are sent',

                      default_action: {
                        type: 'web_url',
                        url: 'https://en.wikipedia.org/wiki/Cat'
                      },

                      buttons: [
                        {
                          type: 'postback',
                          title: 'Button1',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button2',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button3',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button4',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button5',
                          payload: 'abcd 123'
                        }
                      ]
                    },
                    {
                      title: '8',
                      subtitle: 'only the first 3 buttons are sent',

                      default_action: {
                        type: 'web_url',
                        url: 'https://en.wikipedia.org/wiki/Cat'
                      },

                      buttons: [
                        {
                          type: 'postback',
                          title: 'Button1',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button2',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button3',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button4',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button5',
                          payload: 'abcd 123'
                        }
                      ]
                    },
                    {
                      title: '9',
                      subtitle: 'only the first 3 buttons are sent',

                      default_action: {
                        type: 'web_url',
                        url: 'https://en.wikipedia.org/wiki/Cat'
                      },

                      buttons: [
                        {
                          type: 'postback',
                          title: 'Button1',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button2',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button3',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button4',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button5',
                          payload: 'abcd 123'
                        }
                      ]
                    },
                    {
                      title: '10',
                      subtitle: 'only the first 3 buttons are sent',

                      default_action: {
                        type: 'web_url',
                        url: 'https://en.wikipedia.org/wiki/Cat'
                      },

                      buttons: [
                        {
                          type: 'postback',
                          title: 'Button1',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button2',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button3',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button4',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button5',
                          payload: 'abcd 123'
                        }
                      ]
                    },
                    {
                      title: '11',
                      subtitle: 'only the first 3 buttons are sent',

                      default_action: {
                        type: 'web_url',
                        url: 'https://en.wikipedia.org/wiki/Cat'
                      },

                      buttons: [
                        {
                          type: 'postback',
                          title: 'Button1',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button2',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button3',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button4',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button5',
                          payload: 'abcd 123'
                        }
                      ]
                    },
                    {
                      title: '12',
                      subtitle: 'only the first 3 buttons are sent',

                      default_action: {
                        type: 'web_url',
                        url: 'https://en.wikipedia.org/wiki/Cat'
                      },

                      buttons: [
                        {
                          type: 'postback',
                          title: 'Button1',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button2',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button3',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button4',
                          payload: 'abcd 123'
                        },
                        {
                          type: 'postback',
                          title: 'Button5',
                          payload: 'abcd 123'
                        }
                      ]
                    }
                  ] // end elements
                }
              } as any
            ];
            response.event = 'continue';
            break;

          case 'datacoll':
            response.messages = [
              {
                code: 'message',
                type: 'text',
                body: 'Using the collected data',
                quick_replies: [
                  {
                    content_type: 'text',
                    title: msg.data.a,
                    payload: msg.data.a
                  },
                  {
                    content_type: 'text',
                    title: msg.data.b,
                    payload: msg.data.b
                  },
                  {
                    content_type: 'text',
                    title: msg.data.c,
                    payload: msg.data.c
                  }
                ]
              } as any
            ];
            response.event = 'continue';
            break;
          case 'stringify':
            response.messages = [
              {
                code: 'message',
                type: 'text',
                body: 'Using a JSON string in data',
                quick_replies: [
                  {
                    content_type: 'text',
                    title: JSON.parse(msg.data.json).a,
                    payload: JSON.parse(msg.data.json).a
                  },
                  {
                    content_type: 'text',
                    title: JSON.parse(msg.data.json).b,
                    payload: JSON.parse(msg.data.json).b
                  }
                ]
              } as any
            ];
            response.event = 'continue';
            break;
          // async messaging
          case 'async':
            const context = msg.context;
            const environment = Object.assign({ token: context.token }, msg.environment);
            setTimeout(async () => {
              response.messages = [
                {
                  code: 'message',
                  type: 'text',
                  body: 'Async bot responses',
                  template: {
                    type: 'generic',
                    elements: [
                      {
                        title: `HEY! This is an Async Message`,
                        image_url: 'https://media.giphy.com/media/zhmIHStBa2ezu/giphy.gif',
                        subtitle: 'Just a little crazy',
                        buttons: [
                          {
                            type: 'postback',
                            title: 'OK',
                            payload: 'ok1'
                          }
                        ]
                      }
                    ] // end elements
                  }
                } as any
              ];
              response.event = 'continue';
              try {
                response['context'] = context;
                await BotAgentManager.sendAsyncMessage(response, environment);
              } catch (err) {
                console.error('Error calling %s, error is: %O', 'BotAgentManager.sendAsyncMessage()', err);
              }
              return;
            }, 6 * 1000);

            response.messages = [
              {
                code: 'message',
                type: 'text',
                body: 'Async Message set! See you in 6 sec. ⏱ 😎'
              } as any
            ];
            response.event = 'continue';
            break;
          // Send and attachment directly, without uploading it to Vivocha storage
          case 'attach':
            response.messages = [
              {
                code: 'message',
                type: 'attachment',
                url: 'https://media.giphy.com/media/l1KsqYM8Zt3yG3tVS/giphy.gif',
                meta: {
                  originalUrl: '',
                  originalName: 'Scream.gif',
                  mimetype: 'image/gif'
                }
              } as AttachmentMessage
            ];
            break;
          // Send a file attachment after uploading it to Vivocha storage
          case 'up-attach-file':
            const env = Object.assign({ token: msg.context.token }, msg.environment);
            console.dir(env, { colors: true, depth: 20 });
            const filename = __dirname + '/attachment.jpg';
            const attachmentInfo: Attachment = await BotAgentManager.uploadAttachment(
              fs.createReadStream(filename),
              { mimetype: 'image/jpg', desc: 'Actarus jpeg image' },
              env
            );
            response.messages = [
              {
                code: 'message',
                type: 'attachment',
                url: attachmentInfo.url,
                meta: attachmentInfo.meta
              } as AttachmentMessage
            ];
            break;
          // Send an attachment by its URL after uploading it to Vivocha storage
          case 'up-attach-url':
            const env2 = Object.assign({ token: msg.context.token }, msg.environment);
            //console.dir(env2, { colors: true, depth: 20 });
            const fileURL = 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Moon.jpg';
            const info = await BotAgentManager.uploadAttachment(request(fileURL) as Stream, { mimetype: 'image/jpg', desc: 'Moon, not the dark side' }, env2);
            response.messages = [
              {
                code: 'message',
                type: 'attachment',
                url: info.url,
                meta: info.meta
              } as AttachmentMessage
            ];
            break;
          case 'send-action':
            response.messages = [BotMessage.createActionMessage('mySuperAction', [{ a: 'param1', b: 'param2' }])];
            break;
          case 'send-is-writing':
            response.messages = [BotMessage.createIsWritingMessage()];
            break;
          default:
            response.messages = [
              {
                code: 'message',
                type: 'text',
                body: "Sorry, I didn't get that! Could you say that again, please? TIP: send me the 'fullhelp' text ;)"
              } as TextMessage
            ];
        }
      }
    }
    console.log('Sending Response');
    console.dir(response, { colors: true, depth: 20 });

    // manage conversation context
    if (!response.context && msg.context) {
      response['context'] = msg.context;
    }
    return response;
  }
);

// Run the BotManager:
const port = (process.env.PORT as any) || 8888;
manager.listen(port);
console.log(`---> Dummy Bot Manager listening at port ${port}`);

// the swagger description will be available at http(s)://<server-address>/swagger.json
// and schemas at  http(s)://<server-address>/schemas/<schema-name>.
// E.g., http(s)://<server-address>/schemas/bot_request
