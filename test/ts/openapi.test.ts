import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import http from 'request-promise-native';
import { BotAgentManager } from '../../dist/agent';
import { dummyBot } from './dummy-bot';

chai.should();
chai.use(chaiAsPromised);

describe('Testing BotManager API OpenAPI ', function () {
  let env = process.env;
  const port = (process.env.PORT as any) || 8080;
  const getHTTPOptions = function getOptions() {
    return {
      method: 'GET',
      uri: `http://localhost:${port}/openapi.json`,
      json: true
    };
  };
  describe('Getting the OpenAPI.json', function () {
    const manager = new BotAgentManager();
    let server;
    before('starting bot manager', async function () {
      //console.log('Starting bot manager at port:', port);
      server = await dummyBot.listen(port);
      return;
    });
    it('Should return a OpenAPI.json', async function () {
      const doc = await http(getHTTPOptions());
      //console.dir(swagger, { colors: true, depth: 20 });
      doc.should.be.ok;
      doc.openapi.should.match(/^3\./);
      doc.should.have.property('info');
      doc.components.parameters.should.have.property('id');
      doc.components.responses.should.have.property('notFound');
      doc.paths['/bot/message'].post.requestBody.content.should.have.property('application/json');
    });

    it('Should contain a valid Attachment Message JSON schema', async function () {
      const doc = await http(getHTTPOptions());
      doc.should.be.ok;
      const properties = doc.components.schemas.attachment_message.properties;
      properties.should.be.ok;
      properties.should.have.property('code');
      properties.should.have.property('type');
      properties.should.have.property('url');
      properties.should.have.property('meta');
      properties.should.not.have.property('encrypted');
      properties.meta.should.not.have.property('$ref');
    });
    it('Should contain a valid  Attachment METADATA JSON schema', async function () {
      const doc = await http(getHTTPOptions());
      doc.should.be.ok;
      const properties = doc.components.schemas.attachment_message.properties.meta.properties;
      properties.should.be.ok;
      properties.should.have.property('originalUrl');
      properties.should.have.property('originalId');
      properties.should.have.property('originalUrlHash');
      properties.should.have.property('originalName');
      properties.should.have.property('mimetype');
      properties.should.have.property('desc');
      properties.should.have.property('key');
      properties.should.have.property('ref');
      properties.should.have.property('size');
    });

    after('shutdown bot manager', function () {
      server.close();
    });
  });
});
