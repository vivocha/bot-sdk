import { BotAgentManager, BotRequest, BotResponse } from '../../dist/index';
import { DataCollectorTestWitBot } from './bot';

const port = (process.env.PORT as any) || 8080;
console.log('Starting Wit.ai DataCollector at port: ', port);
const manager = new BotAgentManager();
manager.registerAgent(
  'WitAi',
  async (req: BotRequest): Promise<BotResponse> => {
    console.log('REQUEST:');
    console.dir(req, { colors: true, depth: 20 });
    const bot = new DataCollectorTestWitBot(req.settings.engine.settings.token);
    return bot.sendMessage(req);
  }
);
manager.listen(port);
