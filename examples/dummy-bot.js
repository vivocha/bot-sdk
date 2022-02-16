"use strict";
// This is a complete dummy bot to send and inspect all the supported Vivocha messages types.
// The bot is quite trivial and doesn't make use of an NLP platform, but it allows to see the Bot SDK in action.
Object.defineProperty(exports, "__esModule", { value: true });
// First, install @vivocha/bot-sdk to run this bot!
// NB: Change the following line to:
// import { BotAgentManager, BotRequest, BotResponse, TextMessage, AttachmentMessage, Attachment } from "@vivocha/bot-sdk";
const fs = require("fs");
// got is just a simple library to perform http requests (see below in the BotAgent code)
const got_1 = require("got");
const request = require("request");
const index_1 = require("../dist/index");
// A BotManager is a micro web service which exposes an API to send messages
// to registered BotAgents, it exposes a Swagger description of the API with related JSON Schemas.
// A BotManager holds a BotAgents registry.
const manager = new index_1.BotAgentManager();
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
manager.registerAgent('custom', async (msg) => {
    console.log('Incoming msg:');
    console.dir(msg, { colors: true, depth: 20 });
    const response = {
        messages: [],
        event: 'continue',
        context: msg.context || {}
    };
    // handle the start event (e.g., replying with a welcome message and the event property set to "continue")
    if (msg.event === 'start') {
        //console.log("Start event detected");
        if (msg.environment.token) {
            response.context['token'] = msg.environment.token;
        }
        response.messages = [
            index_1.BotMessage.createSimpleTextMessage('Hello! I am a DummyBot from latest version of the Vivocha Bot SDK 😎'),
            index_1.BotMessage.createTextMessageWithQuickReplies('To start, choose one of the following options to see what I can do for you', ['fullhelp', 'help'])
        ];
        response.data = {};
    }
    else if (msg.message.type === 'action') {
        const actionMessage = msg.message;
        response.messages = [
            index_1.BotMessage.createSimpleTextMessage(`You sent an Action Message, \n\naction_code: ${actionMessage.action_code}, args: ${JSON.stringify(actionMessage.args)}`)
        ];
        response.data = {};
    }
    else {
        if (msg.message.type === 'attachment') {
            response.messages = [index_1.BotMessage.createSimpleTextMessage('You sent an ATTACHMENT'), index_1.BotMessage.createSimpleTextMessage(JSON.stringify(msg.message))];
            response.data = {};
        }
        else {
            // This bot understands few sentences/commands ;)
            switch (msg.message.body.toLowerCase()) {
                case 'hi':
                    response.messages = [index_1.BotMessage.createSimpleTextMessage('Hello, again!')];
                    break;
                case 'hello':
                    response.messages = [index_1.BotMessage.createSimpleTextMessage('Hey!')];
                    break;
                case 'ciao':
                    response.messages = [index_1.BotMessage.createSimpleTextMessage('Hello! :)')];
                    break;
                case 'ok':
                    const replies = ['Good! :)', ':)', 'yup! :D', 'oook!', 'yep!', ';)'];
                    response.messages = [index_1.BotMessage.createSimpleTextMessage(replies[Math.floor(Math.random() * replies.length)])];
                    break;
                case 'bye':
                    response.messages = [index_1.BotMessage.createSimpleTextMessage('Bye, see you soon!')];
                    response.event = 'end';
                    break;
                // just an example to show how to call an external API to compose a response
                case 'code':
                    const uuidResponse = await got_1.default('https://httpbin.org/uuid', { responseType: 'json', resolveBodyOnly: true });
                    response.messages = [
                        {
                            code: 'message',
                            type: 'text',
                            body: `A brand new code generated for you is: ${uuidResponse.uuid || 0}`
                        }
                    ];
                    break;
                case 'quick':
                    response.messages = [
                        index_1.BotMessage.createTextMessageWithQuickReplies('Just an example of quick replies... choose a color?', [
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
                        }
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
                                            index_1.BotMessage.createPostbackButton('quick', 'quick'),
                                            index_1.BotMessage.createPostbackButton('team', 'team'),
                                            index_1.BotMessage.createPostbackButton('cat', 'cat'),
                                            index_1.BotMessage.createPostbackButton('cats', 'cats'),
                                            index_1.BotMessage.createPostbackButton('code', 'code'),
                                            index_1.BotMessage.createPostbackButton('pagevent', 'pagevent'),
                                            index_1.BotMessage.createPostbackButton('async', 'async'),
                                            index_1.BotMessage.createPostbackButton('attach', 'attach'),
                                            index_1.BotMessage.createPostbackButton('up-attach-file', 'up-attach-file'),
                                            index_1.BotMessage.createPostbackButton('up-attach-url', 'up-attach-url'),
                                            index_1.BotMessage.createPostbackButton('send-action', 'send-action'),
                                            index_1.BotMessage.createPostbackButton('send-is-writing', 'send-is-writing'),
                                            index_1.BotMessage.createPostbackButton('transfer', 'transfer'),
                                            index_1.BotMessage.createPostbackButton('transfer-with-data', 'transfer-with-data'),
                                            index_1.BotMessage.createPostbackButton('bye', 'bye')
                                        ]
                                    }
                                ] // end elements
                            }
                        }
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
                                                reason: 'test',
                                                params: {
                                                    a: 10,
                                                    b: 'ok'
                                                },
                                                title: 'Fire a custom event'
                                            }
                                        ]
                                    }
                                ] // end elements
                            }
                        }
                    ];
                    response.event = 'continue';
                    break;
                case 'team':
                    response.messages = [
                        index_1.BotMessage.createTextMessageWithQuickReplies('Choose a team member', [
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
                                        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Tajeschidolls_Beren_of_LoveLorien_Ragdoll_Seal_Mink_Lynx_Bicolor.jpg/1024px-Tajeschidolls_Beren_of_LoveLorien_Ragdoll_Seal_Mink_Lynx_Bicolor.jpg',
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
                        }
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
                                        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Tajeschidolls_Beren_of_LoveLorien_Ragdoll_Seal_Mink_Lynx_Bicolor.jpg/1024px-Tajeschidolls_Beren_of_LoveLorien_Ragdoll_Seal_Mink_Lynx_Bicolor.jpg',
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
                        }
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
                        }
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
                        }
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
                        }
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
                        }
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
                        }
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
                        }
                    ];
                    response.event = 'continue';
                    break;
                case 'transfer':
                    response.messages = [
                        {
                            code: 'message',
                            type: 'text',
                            body: "OK I'm transferring you to a 'jolly'-tagged agent. Bye!"
                        }
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
                        }
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
                        }
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
                        }
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
                        }
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
                        }
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
                            }
                        ];
                        response.event = 'continue';
                        try {
                            response['context'] = context;
                            await index_1.BotAgentManager.sendAsyncMessage(response, environment);
                        }
                        catch (err) {
                            console.error('Error calling %s, error is: %O', 'BotAgentManager.sendAsyncMessage()', err);
                        }
                        return;
                    }, 6 * 1000);
                    response.messages = [
                        {
                            code: 'message',
                            type: 'text',
                            body: 'Async Message set! See you in 6 sec. ⏱ 😎'
                        }
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
                        }
                    ];
                    break;
                // Send a file attachment after uploading it to Vivocha storage
                case 'up-attach-file':
                    const env = Object.assign({ token: msg.context.token }, msg.environment);
                    console.dir(env, { colors: true, depth: 20 });
                    const filename = __dirname + '/attachment.jpg';
                    const attachmentInfo = await index_1.BotAgentManager.uploadAttachment(fs.createReadStream(filename), { mimetype: 'image/jpg', desc: 'Actarus jpeg image' }, env);
                    response.messages = [
                        {
                            code: 'message',
                            type: 'attachment',
                            url: attachmentInfo.url,
                            meta: attachmentInfo.meta
                        }
                    ];
                    break;
                // Send an attachment by its URL after uploading it to Vivocha storage
                case 'up-attach-url':
                    const env2 = Object.assign({ token: msg.context.token }, msg.environment);
                    //console.dir(env2, { colors: true, depth: 20 });
                    const fileURL = 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Moon.jpg';
                    const info = await index_1.BotAgentManager.uploadAttachment(request(fileURL), { mimetype: 'image/jpg', desc: 'Moon, not the dark side' }, env2);
                    response.messages = [
                        {
                            code: 'message',
                            type: 'attachment',
                            url: info.url,
                            meta: info.meta
                        }
                    ];
                    break;
                case 'send-action':
                    response.messages = [index_1.BotMessage.createActionMessage('mySuperAction', [{ a: 'param1', b: 'param2' }])];
                    break;
                case 'send-is-writing':
                    response.messages = [index_1.BotMessage.createIsWritingMessage()];
                    break;
                default:
                    response.messages = [
                        {
                            code: 'message',
                            type: 'text',
                            body: "Sorry, I didn't get that! Could you say that again, please? TIP: send me the 'fullhelp' text ;)"
                        }
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
});
// Run the BotManager:
const port = process.env.PORT || 8888;
manager.listen(port);
console.log(`---> Dummy Bot Manager listening at port ${port}`);
// the swagger description will be available at http(s)://<server-address>/swagger.json
// and schemas at  http(s)://<server-address>/schemas/<schema-name>.
// E.g., http(s)://<server-address>/schemas/bot_request
