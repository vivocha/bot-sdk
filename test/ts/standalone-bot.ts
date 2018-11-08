import { dummyBot } from './dummy-bot';

const port = (process.env.PORT as any) || 8080;
console.log('Starting Dummy Bot at port: ', port);
dummyBot.listen(port);
