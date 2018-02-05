import { BotAgentManager, BotFilter, BotRequest, BotResponse } from "../dist/index";

// A very simple BotManager and BotAgent implementation
const manager = new BotAgentManager();
manager.registerAgent('test', async (msg: BotRequest): Promise<BotResponse> => {
  const response: BotResponse = {
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
const filter = new BotFilter(async (msg: BotRequest): Promise<BotRequest> => {
  msg.data = msg.data || {};
  msg.data.availableAgents = true;
  return msg;
}, undefined);

filter.listen(8081);
console.log('BotManager listening at port 8081');
