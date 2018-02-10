"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../dist/index");
// A very simple BotManager and BotAgent implementation
const manager = new index_1.BotAgentManager();
manager.registerAgent('test', async (msg) => {
    const response = {
        settings: {
            engine: msg.settings.engine
        },
        messages: [{
                code: 'message',
                type: 'text',
                body: 'This is a test. Bye.'
            }],
        event: 'end'
    };
    return response;
});
// Run the BotManager
manager.listen(8080);
console.log('BotManager listening at port 8080');
// A really simple BotFilter implementation
// which augments the BotRequest in input with a number of availableAgents 
// (like in the domain of customer support services)
const filter = new index_1.BotFilter(async (msg) => {
    msg.data = msg.data || {};
    msg.data.availableAgents = true;
    return msg;
}, undefined);
filter.listen(8081);
console.log('BotFilter listening at port 8081');
