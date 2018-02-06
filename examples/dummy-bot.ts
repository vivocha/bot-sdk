import { BotAgentManager, BotFilter, BotRequest, BotResponse, TextMessage } from "../dist/index";
// got is just a simple library to perform http requests (see below in the BotAgent code)
import * as got from 'got';

// A BotManager is a web server which exposes an API to send messages
// to registered BotAgents, it exposes a Swagger description of the API with related JSON Schemas.
// A BotManager holds a BotAgents registry.
const manager = new BotAgentManager();

// A BotAgent actually represents the Bot implementation and basically it is
// a function which takes a BotRequest message in input and returns a Promise
// resolved with a BotResponse message.
// The body of the BotAgent function contains all the code to call the specific
// Bot implementation APIs (e.g., Watson, Dialogflow, etc...) or to implement a new customized one from scratch.

// The following BotAgent is a dummy chat bot implementation just to show
// how easy is to run a simple Bot using the Vivocha Bot SDK, sendind back to the user
// different types of message.
// The BotAgent is then registered to the BotManager which will forward all
// the incoming messages (sent by Vivocha Platform) containing (in this case) an engine type === 'custom' in
// the settings property.
manager.registerAgent('custom', async (msg: BotRequest): Promise<BotResponse> => {

    console.log('Incoming MSG: ', msg);

    const response: BotResponse = {
        settings: {
            engine: msg.settings.engine
        },
        messages: [],
        event: 'continue'
    };

    // handle the start event (e.g., replying with a welcome message)
    if (msg.event === 'start') {
        console.log('Start event detected');
        response.messages = [{
            code: 'message',
            type: 'text',
            body: 'Hello! I am a DummyBot :)'
        } as TextMessage];
    } else {
        // This bot understands few sentences ;)
        switch (msg.message.body.toLowerCase()) {
            case 'hi':
                response.messages = [{
                    code: 'message',
                    type: 'text',
                    body: 'Hello again!'
                } as TextMessage];
                break;
            case 'ok':
                response.messages = [{
                    code: 'message',
                    type: 'text',
                    body: 'Good! :)'
                } as TextMessage];
                break;
            case 'bye':
                response.messages = [{
                    code: 'message',
                    type: 'text',
                    body: 'Bye, see you soon!'
                } as TextMessage];
                response.event = 'end';
                break;
            // just an example to show how to call an external API to compose a response    
            case 'code':
                response.messages = [{
                    code: 'message',
                    type: 'text',
                    body: `A brand new code for you is: ${(await got('https://httpbin.org/uuid', {
                        json: true
                    })).body.uuid || 0}`
                } as TextMessage];
                break;
            case 'quick':
                response.messages = [{
                    code: 'message',
                    type: 'text',
                    body: 'Just an example of quick replies... which color?',
                    quick_replies: [{
                        content_type: 'text',
                        payload: 'red'
                    },
                    {
                        content_type: 'text',
                        payload: 'blue'
                    },
                    {
                        content_type: 'text',
                        payload: 'white'
                    }
                    ]
                }];
                response.event = 'continue';
                break;
            default:
                response.messages = [{
                    code: 'message',
                    type: 'text',
                    body: "Sorry, I didn't get that! Could you say that again, please?"
                } as TextMessage];
        };                
    }
    console.log('Sending Response ', response);
    return response;
});

// Run the BotManager:
const port = process.env.PORT as any || 8888;
manager.listen(port);
console.log(`Dummy Bot Manager listening at port ${port}`);

// the swagger description will be available at http(s)://<server-address>/swagger.json
// and schemas at  http(s)://<server-address>/schemas/<schema-name>.
// E.g., http(s)://<server-address>/schemas/bot_request