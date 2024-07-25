"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleWitBot = void 0;
/**
 * This is a sample bot built using Wit.ai NLP.
 * In order to use this bot you need to create and train
 * a Wit.ai app able to collect: names, phone numbers and email addresses
 * and to understand users preferring to be contacted by email or phone.
 * The Wit.ai App should be trained to detect the intents mapped in the following
 * intents property in SimpleWitBot class.
 * See comments in the code below.
 */
// NB: Change the following line to:
// import { BotRequest, BotResponse, TextMessage, BotAgentManager, WitAiBot, IntentsMap, NextMessage } from "@vivocha/bot-sdk";
const index_1 = require("../dist/index");
const _ = require("lodash");
// WitAiBot is an abstract class, so we need to:
// - set the intents property
// - implement the getStartMessage() method
class SimpleWitBot extends index_1.WitAiBot {
    constructor() {
        super(...arguments);
        // intents mappings bound to specific Wit.ai Bot, the intent names MUST match 
        // the intents as defined in Wit.ai Console.
        this.intents = {
            provide_name: (data, request) => this.askEmailorPhone(data.entities, request),
            by_email: (data, request) => this.contactMeByEmail(data, request),
            by_phone: (data, request) => this.contactMeByPhone(data, request),
            provide_phone: (data, request) => this.providePhoneNumber(data.entities, request),
            provide_email: (data, request) => this.provideEmailAddress(data.entities, request),
            unknown: (data, request) => this.unknown(data, request)
        };
    }
    // The following method is invoked only for a start event, sent by Vivocha at the very beginning
    // of the conversation (in other words it wakes-up the bot)
    async getStartMessage(request) {
        const res = {
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
    async askEmailorPhone(entities, request) {
        let name = '';
        if (entities.contact) {
            name = entities.contact.map(v => v.value).join(' ');
        }
        const pre = `Thank you ${name}, `;
        let response = {
            event: 'continue',
            messages: [prepareBotMessage(`${pre}do you prefer to be contacted by email or by phone?`)],
            data: { name },
            contexts: ['recontact_by_email_or_phone']
        };
        return response;
    }
    ;
    // user said she prefers to be contacted by email...
    async contactMeByEmail(data, request) {
        let response = {};
        if (this.inContext(request.context.contexts, ['recontact_by_email_or_phone'])) {
            response = {
                messages: [prepareBotMessage('Good, send me your email address, please')],
                contexts: [...request.context.contexts, 'ask_for_email'],
                event: 'continue',
                data: request.data
            };
        }
        else {
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
    async contactMeByPhone(data, request) {
        let response = {};
        if (this.inContext(request.context.contexts, ['recontact_by_email_or_phone'])) {
            response = {
                messages: [prepareBotMessage(`OK ${request.data.name}, text me your phone number, please`)],
                contexts: [...request.context.contexts, 'ask_for_phone'],
                event: 'continue',
                data: request.data
            };
        }
        else {
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
    async providePhoneNumber(data, request) {
        let response = {};
        if (this.inContext(request.context.contexts, ['ask_for_phone', 'recontact_by_email_or_phone'])) {
            response = {
                messages: [prepareBotMessage(`Perfect, ${request.data.name}. We will call you as soon as possible. Thank you and bye! :)`)],
                contexts: ['end'],
                // collect phone number entity
                data: { phone: data.phone_number[0].value },
                // Bot sends the 'end' event to communicate to Vivocha to close the contact, conversation finished.
                event: 'end'
            };
        }
        else {
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
    async provideEmailAddress(data, request) {
        let response = {};
        if (this.inContext(request.context.contexts, ['ask_for_email', 'recontact_by_email_or_phone'])) {
            response = {
                messages: [prepareBotMessage(`Perfect, ${request.data.name}. We will send soon an email to the provided address. Thank you and goodbye! :)`)],
                contexts: ['end'],
                // collect email address
                data: { email: data.email[0].value },
                event: 'end'
            };
        }
        else {
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
    async unknown(data, request) {
        let response = {
            event: 'continue',
            messages: [prepareBotMessage("Sorry, I didn't get that. Can you say it again?")],
            contexts: request.context.contexts,
            data: request.data || {}
        };
        return response;
    }
}
exports.SimpleWitBot = SimpleWitBot;
// just prepares a complete Vivocha TextMessage
function prepareBotMessage(body) {
    return {
        code: 'message',
        type: 'text',
        body
    };
}
// Create a BotManager and register the Wit.ai Bot Agent
const manager = new index_1.BotAgentManager();
manager.registerAgent('WitAi', async (req) => {
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
