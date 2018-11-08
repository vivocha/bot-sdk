import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { BotAgentManager } from '../../dist/agent';
import { BotRequest, BotResponse } from '@vivocha/public-entities/dist/bot';
import { dummyBot } from './dummy-bot';
import * as SwaggerParser from 'swagger-parser';
import * as http from 'request-promise-native';

chai.should();
chai.use(chaiAsPromised);

describe('Testing BotManager API SWAGGER ', function() {
  let env = process.env;
  const port = (process.env.PORT as any) || 8080;
  const getHTTPOptions = function getOptions() {
    return {
      method: 'GET',
      uri: `http://localhost:${port}/swagger.json`,
      json: true
    };
  };
  describe('Getting the Swagger.json', function() {
    const manager = new BotAgentManager();
    let server;
    before('starting bot manager', async function() {
      //console.log('Starting bot manager at port:', port);
      server = await dummyBot.listen(port);
      return;
    });
    it('Should return a Swagger.json', async function() {
      const swagger = await http(getHTTPOptions());
      //console.dir(swagger, { colors: true, depth: 20 });
      swagger.should.be.ok;
      swagger.swagger.should.equal('2.0');
      swagger.should.have.property('info');
      swagger.parameters.should.have.property('id');
      swagger.responses.should.have.property('notFound');
      swagger.paths['/bot/message'].post.parameters[0].should.have.property('name');
    });
    it.skip('Returned Swagger should be valid', async function() {
      return SwaggerParser.validate(`http://localhost:${port}/swagger.json`).should.be.eventually.fulfilled;
    });
    after('shutdown bot manager', function() {
      server.close();
    });
  });
});
