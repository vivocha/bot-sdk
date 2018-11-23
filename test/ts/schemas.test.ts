import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { BotAgentManager } from '../../dist/agent';
import { BotRequest, BotResponse } from '@vivocha/public-entities/dist/bot';
import { dummyBot } from './dummy-bot';
import * as http from 'request-promise-native';

chai.should();
chai.use(chaiAsPromised);

describe('Testing BotManager API Schemas ', function() {
  let env = process.env;
  const port = (process.env.PORT as any) || 8080;
  const getHTTPOptions = function getOptions(schemaName: string) {
    return {
      method: 'GET',
      uri: `http://localhost:${port}/schemas/${schemaName}`,
      json: true
    };
  };
  describe('Getting Attachment_Message Schema', function() {
    const manager = new BotAgentManager();
    let server;
    before('starting bot manager', async function() {
      //console.log('Starting bot manager at port:', port);
      server = await dummyBot.listen(port);
      return;
    });
    it('Should return the Attachment Message JSON schema', async function() {
      const schema = await http(getHTTPOptions('attachment_message'));
      //console.dir(swagger, { colors: true, depth: 20 });
      schema.should.be.ok;

      schema.properties.should.have.property('code');
      schema.properties.should.have.property('type');
      schema.properties.should.have.property('url');
      schema.properties.should.have.property('meta');
      schema.properties.should.not.have.property('encrypted');
      schema.properties.meta['$ref'].should.be.equal('attachment_metadata');

      return;
    });
    it('Should return the Attachment METADATA JSON schema', async function() {
      const schema = await http(getHTTPOptions('attachment_metadata'));
      //console.dir(swagger, { colors: true, depth: 20 });
      schema.should.be.ok;
      schema.properties.should.have.property('originalUrl');
      schema.properties.should.have.property('originalId');
      schema.properties.should.have.property('originalUrlHash');
      schema.properties.should.have.property('originalName');
      schema.properties.should.have.property('mimetype');
      schema.properties.should.have.property('desc');
      schema.properties.should.have.property('key');
      schema.properties.should.have.property('ref');
      schema.properties.should.have.property('size');
      return;
    });
    after('shutdown bot manager', function() {
      server.close();
    });
  });
});
