"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// install and import @vivocha/bot-sdk to run this bot filter!
// replace next line with:
// import { BotFilter, BotRequest, toLambda, serverless } from '@vivocha/bot-sdk';
const index_1 = require("../../../dist/index");
// A really simple BotFilter implementation
// which augments the BotRequest in input with a number of availableAgents
// and sets if user is premium
// (like in the domain of customer support services)
const filter = new index_1.BotFilter(async (msg) => {
    msg.data = msg.data || {};
    // maybe calling an API...
    msg.data.availableAgents = 5;
    // maybe calling an API or reading from a DB...
    msg.data.isPremiumUser = true;
    return msg;
}, undefined);
module.exports.handler = index_1.serverless(index_1.toLambda(filter));
