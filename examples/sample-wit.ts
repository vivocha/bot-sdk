/**
 * This is a sample bot built using Wit.ai NLP.
 * In order to use this bot you need to create and train
 * a Wit.ai app able to collect: names, phone numbers and email addresses 
 * and to understand users preferring to be contacted by email or phone.
 * The Wit.ai App should be trained to detect the intents mapped in the following 
 * intents property in SimpleWitBot class.
 * See comments in the code below.
 */

import { BotRequest, BotResponse, TextMessage, BotAgentManager, WitAiBot, IntentsMap, NextMessage } from '../dist/index';
import { Wit, log, MessageResponse } from 'node-wit';
import * as _ from 'lodash';

// WitAiBot is an abstract class, so we need to:
// - set the intents property
// - implement the getStartMessage() method
export class SimpleWitBot extends WitAiBot {
    // intents mappings bound to specific Wit.ai Bot, the intent names MUST match 
    // the intents as defined in Wit.ai Console.
    protected intents: IntentsMap = {
        provide_name: (data, request) => this.askEmailorPhone(data.entities, request),
        by_email: (data, request) => this.contactMeByEmail(data, request),
        by_phone: (data, request) => this.contactMeByPhone(data, request),
        provide_phone: (data, request) => this.providePhoneNumber(data.entities, request),
        provide_email: (data, request) => this.provideEmailAddress(data.entities, request),
        unknown: (data, request) => this.unknown(data, request)
    };

    // The following method is invoked only for a start event, sent by Vivocha at the very beginning
    // of the conversation (in other words it wakes-up the bot)
    async getStartMessage(request: BotRequest): Promise<BotResponse> {
        const res: BotResponse = {
            event: 'continue',
            messages: [prepareBotMessage("Hello, I'm a Vivocha Wit Bot, what's your name?")],
            data: request.data,
            settings: request.settings,
            //Please note how contexts are set (and checked in each intent handler)
            context: _.merge(request.context, { contexts: ['ask_for_name'] })
        };
        return res;
    }

    // user provided her name, then the Wit.ai 'provide_name' was detected
    private async askEmailorPhone(entities, request): Promise<NextMessage> {
        let name: string = '';
        if (entities.contact) {
            name = entities.contact.map(v => v.value).join(' ');
        }
        const pre = `Thank you ${name}, `;
        let response: NextMessage = {
            event: 'continue',
            messages: [prepareBotMessage(`${pre}do you prefer to be contacted by email or by phone?`)],
            data: { name },
            contexts: ['recontact_by_email_or_phone']
        };
        return response;
    };

    // user said she prefers to be contacted by email...
    private async contactMeByEmail(data, request): Promise<NextMessage> {
        let response = {} as NextMessage;
        if (this.inContext(request.context.contexts, ['recontact_by_email_or_phone'])) {
            response = {
                messages: [prepareBotMessage('Good, send me your email address, please')],
                contexts: [...request.context.contexts, 'ask_for_email'],
                event: 'continue',
                data: request.data
            }
        } else {
            response = {
                messages: [prepareBotMessage('ERROR')],
                contexts: ['end'],
                data: request.data || {},
                event: 'end'
            };
        }
        return response;
    }

    // user chose to be contacted by phone
    private async contactMeByPhone(data, request): Promise<NextMessage> {
        let response = {} as NextMessage;
        if (this.inContext(request.context.contexts, ['recontact_by_email_or_phone'])) {
            response = {
                messages: [prepareBotMessage(`OK ${request.data.name}, text me your phone number, please`)],
                contexts: [...request.context.contexts, 'ask_for_phone'],
                event: 'continue',
                data: request.data
            }
        } else {
            response = {
                messages: [prepareBotMessage('ERROR')],
                contexts: ['end'],
                data: request.data || {},
                event: 'end'
            };
        }
        return response;
    }

    // user sent her phone number and the correponding intent was detected by the Wit.ai NLP engine
    private async providePhoneNumber(data, request): Promise<NextMessage> {
        let response = {} as NextMessage;
        if (this.inContext(request.context.contexts, ['ask_for_phone', 'recontact_by_email_or_phone'])) {
            response = {
                messages: [prepareBotMessage(`Perfect, ${request.data.name}. We will call you as soon as possible. Thank you and bye! :)`)],
                contexts: ['end'],
                // collect phone number entity
                data: { phone: data.phone_number[0].value },
                // Bot sends the 'end' event to communicate to Vivocha to close the contact, conversation finished.
                event: 'end'
            }
        } else {
            response = {
                messages: [prepareBotMessage('ERROR')],
                contexts: ['end'],
                data: request.data || {},
                event: 'end'
            };
        }
        return response;
    }

    // user chose to be recontacted by email and provided the related address
    private async provideEmailAddress(data, request): Promise<NextMessage> {
        let response = {} as NextMessage;
        if (this.inContext(request.context.contexts, ['ask_for_email', 'recontact_by_email_or_phone'])) {
            response = {
                messages: [prepareBotMessage(`Perfect, ${request.data.name}. We will send soon an email to the provided address. Thank you and goodbye! :)`)],
                contexts: ['end'],
                // collect email address
                data: { email: data.email[0].value },
                event: 'end'
            }
        } else {
            response = {
                messages: [prepareBotMessage('ERROR')],
                contexts: ['end'],
                data: request.data || {},
                event: 'end'
            };
        }
        return response;
    }

    // when Wit.ai is not able to detect an intent, WitAiBot class maps an 'unknown' intent, here's the handler
    private async unknown(data, request): Promise<NextMessage> {
        let response: NextMessage = {
            event: 'continue',
            messages: [prepareBotMessage("Sorry, I didn't get that. Can you say it again?")],
            contexts: request.context.contexts,
            data: request.data || {}
        };
        return response;
    }
}

// just prepares a complete Vivocha TextMessage
function prepareBotMessage(body: string): TextMessage {
    return {
        code: 'message',
        type: 'text',
        body
    };
}

// Create a BotManager and register the Wit.ai Bot Agent
const manager: BotAgentManager = new BotAgentManager();
manager.registerAgent('WitAi', async (req: BotRequest): Promise<BotResponse> => {
    const bot = new SimpleWitBot(req.settings.engine.settings.token);
    return bot.sendMessage(req);
});

const port = process.env.PORT ? parseInt(process.env.PORT || '') : 8888;
// run the Bot
manager.listen(port);
console.log(`SimpleWitBot listening at port: ${port}`);

process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT', () => process.exit(0));


// RUN this with: node sample-wit
// If you need to change the default 8888 port, run: PORT=<port-number> node sample-wit