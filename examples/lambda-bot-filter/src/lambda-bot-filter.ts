// install and import @vivocha/bot-sdk to run this bot filter!
// replace next line with:
// import { BotFilter, BotRequest, toLambda, serverless } from '@vivocha/bot-sdk';
import { BotFilter, BotRequest, toLambda, serverless } from '../../../dist/index';

// A really simple BotFilter implementation
// which augments the BotRequest in input with a number of availableAgents
// and sets if user is premium
// (like in the domain of customer support services)
const filter = new BotFilter(async (msg: BotRequest): Promise<BotRequest> => {
  msg.data = msg.data || {};
  // maybe calling an API...
  msg.data.availableAgents = 5;
  // maybe calling an API or reading from a DB...
  msg.data.isPremiumUser = true;
  return msg;
}, undefined);

module.exports.handler = serverless(toLambda(filter));
