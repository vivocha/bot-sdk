import { BotAgentManager, BotFilter, BotRequest, BotResponse } from "./index";

const manager = new BotAgentManager();
manager.registerAgent('test', async (msg:BotRequest): Promise<BotResponse> => {
  return {
    engine: msg.engine,
    event: 'continue',
    message: 'ciao!'
  }
});

manager.listen(8080);


const filter = new BotFilter(async (msg:BotRequest): Promise<BotRequest> => {
  msg.data = msg.data || {};
  msg.data.availableAgents = true;
  return msg;
}, undefined);

filter.listen(8081);