"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bot_sdk_1 = require("@vivocha/bot-sdk"); // install and use @vivocha/bot-sdk to run this bot!
// A really simple BotFilter implementation
// which augments the BotRequest in input with a number of availableAgents 
// and sets if user is premium
// (like in the domain of customer support services)
const filter = new bot_sdk_1.BotFilter(async (msg) => {
    msg.data = msg.data || {};
    // maybe calling an API...
    msg.data.availableAgents = 5;
    // maybe calling an API or reading from a DB...
    msg.data.isPremiumUser = true;
    return msg;
}, undefined);
module.exports.handler = bot_sdk_1.serverless(bot_sdk_1.toLambda(filter));
