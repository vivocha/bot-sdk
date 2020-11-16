import { BotAgentManager, BotRequest, BotResponse } from '../../dist';
import { DataCollectorTestWitBot } from './bot';

const engineType = 'WitAi';

const manager = new BotAgentManager();
manager.registerAgent(
  engineType,
  async (req: BotRequest): Promise<BotResponse> => {
    const bot = new DataCollectorTestWitBot(req.settings.engine.settings.token);
    return bot.sendMessage(req);
  }
);
// Run the BotManager:
const port = (process.env.PORT as any) || 8080;
console.log('Wit Bot running at port ', port);
manager.listen(port);

process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT', () => process.exit(0));
