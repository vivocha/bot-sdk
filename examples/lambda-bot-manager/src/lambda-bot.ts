// install and import @vivocha/bot-sdk to run this bot!
// replace next line with:
// import { BotFilter, BotRequest, toLambda, serverless } from '@vivocha/bot-sdk';
import got from 'got';
import { BotAgentManager, BotRequest, BotResponse, serverless, TextMessage, toLambda } from '../../../dist/index';
// A BotManager is a web server which exposes an API to send messages
// to registered BotAgents, it exposes a Swagger description of the API with related JSON Schemas.
// A BotManager holds a BotAgents registry.
const manager = new BotAgentManager();

// A BotAgent actually represents the Bot implementation and basically it is
// a function which takes a BotRequest message in input and returns a Promise,
// resolved with a BotResponse message.
// The body of the BotAgent function contains all the code to call the specific
// Bot implementation APIs (e.g., Watson, Dialogflow, etc...) or to implement a new customized one from scratch.

// The following BotAgent is a dummy chat bot implementation just to show
// how easy is to run a simple Bot using the Vivocha Bot SDK;
// it receives simple text "commands" sending back to the user several
// different types of messages, including quick replies and templates with images, URLs, and so on...
// The BotAgent is then registered to the BotManager which will forward all
// the incoming messages (sent by Vivocha Platform) containing (in this case) an engine type === 'custom' in
// the settings property.
manager.registerAgent(
  'custom',
  async (msg: BotRequest): Promise<BotResponse> => {
    console.log('Incoming MSG: ', msg);

    const response: BotResponse = {
      settings: {
        engine: msg.settings.engine
      },
      messages: [],
      event: 'continue'
    };

    // handle the start event (e.g., replying with a welcome message and event set to "continue")
    if (msg.event === 'start') {
      console.log('Start event detected');
      response.messages = [
        {
          code: 'message',
          type: 'text',
          body: 'Hello! I am a Lambda DummyBot :) Write help to see what I can do for you.'
        } as TextMessage
      ];
      response.data = {};
    } else {
      // This bot understands few sentences ;)
      switch ((msg.message as any).body.toLowerCase()) {
        case 'hi':
          response.messages = [
            {
              code: 'message',
              type: 'text',
              body: 'Hello again!'
            } as TextMessage
          ];
          break;
        case 'hello':
          response.messages = [
            {
              code: 'message',
              type: 'text',
              body: 'Hey!'
            } as TextMessage
          ];
          break;
        case 'ciao':
          response.messages = [
            {
              code: 'message',
              type: 'text',
              body: 'hello :)'
            } as TextMessage
          ];
          break;
        case 'ok':
          const replies = ['Good! :)', ':)', 'yup! :D', 'oook!', 'yep!', ';)'];
          response.messages = [
            {
              code: 'message',
              type: 'text',
              body: replies[Math.floor(Math.random() * replies.length)]
            } as TextMessage
          ];
          break;
        case 'bye':
          response.messages = [
            {
              code: 'message',
              type: 'text',
              body: 'Bye, see you soon!'
            } as TextMessage
          ];
          response.event = 'end';
          break;
        // just an example to show how to call an external API to compose a response
        case 'code':
          const uuidResponse: any = await got('https://httpbin.org/uuid', { responseType: 'json', resolveBodyOnly: true });
          response.messages = [
            {
              code: 'message',
              type: 'text',
              body: `A brand new code generated for you is: ${uuidResponse.uuid || 0}`
            } as TextMessage
          ];
          break;
        case 'quick':
          response.messages = [
            {
              code: 'message',
              type: 'text',
              body: 'Just an example of quick replies... choose a color?',
              quick_replies: [
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
              ]
            } as any
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
                    title: 'You can send me the following messages',
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
                        title: 'tm-buttons',
                        payload: 'tm-buttons'
                      },
                      {
                        type: 'postback',
                        title: 'tm-elements',
                        payload: 'tm-elements'
                      },
                      {
                        type: 'postback',
                        title: 'bye',
                        payload: 'bye'
                      },
                      {
                        type: 'postback',
                        title: 'pagevent',
                        payload: 'pagevent'
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
              body: "OK I'm transferring you to a jolly agent. Bye!"
            } as TextMessage
          ];
          response.event = 'end';
          response.data = {
            transferToAgent: 'jolly'
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
        default:
          response.messages = [
            {
              code: 'message',
              type: 'text',
              body: "Sorry, I didn't get that! Could you say that again, please?"
            } as TextMessage
          ];
      }
    }
    console.log('Sending Response ', response);
    return response;
  }
);

module.exports.handler = serverless(toLambda(manager));
