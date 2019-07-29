import { Attachment, AttachmentMeta } from '@vivocha/public-entities';
import { BotAgent, BotRequest, BotResponse, EnvironmentInfo } from '@vivocha/public-entities/dist/bot';
import { API, Operation, Resource, Swagger } from 'arrest';
import * as http from 'request-promise-native';
import { Stream } from 'stream';
import * as uuid from 'uuid/v1';
import { getVvcEnvironment } from './util';

class BotAgentResource extends Resource {
  constructor() {
    super({
      name: 'Bot',
      namePlural: 'Bot'
    });
    this.addOperation(new SendMessage(this, '/message', 'post'));
  }
}

class SendMessage extends Operation {
  constructor(resource: BotAgentResource, path, method) {
    super(resource, path, method, 'message.send');
    this.setInfo({
      parameters: [
        {
          in: 'body',
          name: 'body',
          description: 'the BotRequest body',
          schema: { $ref: 'schemas/bot_request' }
        }
      ],
      responses: {
        '200': {
          description: 'Sending a message to a Bot was successful, a BotResponse is returned',
          schema: {
            $ref: 'schemas/bot_response'
          }
        },
        default: { $ref: '#/responses/defaultError' }
      }
    } as any);
  }

  handler(req, res, next) {
    const msg: BotRequest = req.body as BotRequest;
    let vivochaEnvironment = msg.environment || {};
    const headers = req.headers;
    if (headers) {
      const headersEnvironment: EnvironmentInfo = getVvcEnvironment(headers);
      if (Object.keys(headersEnvironment).length) {
        vivochaEnvironment = { ...vivochaEnvironment, ...headersEnvironment };
      }
    }
    msg['environment'] = vivochaEnvironment;
    const agent = (this.api as BotAgentManager).agents[msg.settings.engine.type];
    if (agent) {
      agent(msg).then(response => res.json(BotAgentManager.normalizeResponse(response)), err => next(API.newError(500, 'platform error', err.message, err)));
    } else {
      API.fireError(400, 'unsupported bot type');
    }
  }
}

const __agents = Symbol();
export interface BotAgentRegistry {
  [type: string]: BotAgent;
}

const sdkVersion = '3.4.0';

export class BotAgentManager extends API {
  constructor(version: string = sdkVersion, title: string = 'Vivocha BotAgentManager API') {
    super({
      swagger: '2.0',
      info: {
        title,
        version: version
      },
      paths: {}
    });
    if (this.parameters) {
      this.parameters = {
        id: this.parameters.id
      };
    }
    /*
    if (this.responses) {
      delete this.responses.notFound;
    }
    */
    if (this.definitions) {
      delete this.definitions.metadata;
      delete this.definitions.objectId;
    }
    this[__agents] = {} as BotAgentRegistry;
    this.registerSchema('bot_message', require('@vivocha/public-entities/schemas/bot_message.json') as Swagger.Schema);
    this.registerSchema('bot_request', require('@vivocha/public-entities/schemas/bot_request.json') as Swagger.Schema);
    this.registerSchema('bot_response', require('@vivocha/public-entities/schemas/bot_response.json') as Swagger.Schema);
    this.registerSchema('text_message', require('@vivocha/public-entities/schemas/text_message.json') as Swagger.Schema);
    this.registerSchema('postback_message', require('@vivocha/public-entities/schemas/postback_message.json') as Swagger.Schema);
    this.registerSchema('attachment_message', require('@vivocha/public-entities/schemas/attachment_message.json') as Swagger.Schema);
    this.registerSchema('attachment_metadata', require('@vivocha/public-entities/schemas/attachment_metadata.json') as Swagger.Schema);
    this.registerSchema('action_message', require('@vivocha/public-entities/schemas/action_message.json') as Swagger.Schema);
    this.registerSchema('is_writing_message', require('@vivocha/public-entities/schemas/is_writing_message.json') as Swagger.Schema);
    this.addResource(new BotAgentResource());
  }
  get agents(): BotAgentRegistry {
    return this[__agents] as BotAgentRegistry;
  }

  registerAgent(type: string, agent: BotAgent): this {
    this.agents[type] = agent;
    return this;
  }

  static async sendAsyncMessage(response: BotResponse, environment: EnvironmentInfo): Promise<http.FullResponse> {
    if (!environment.token || !environment.host || !environment.acct || !environment.contactId) {
      throw new Error('Missing property in environment parameter, please include all of: token, host, acct and contactId');
    } else {
      const url = `https://${environment.host}/a/${environment.acct}/api/v2/contacts/${environment.contactId}/bot-response`;
      const httpOptions = {
        method: 'POST',
        uri: url,
        body: BotAgentManager.normalizeResponse(response),
        headers: {
          authorization: `Bearer ${environment.token}`
        },
        json: true,
        resolveWithFullResponse: true,
        simple: true,
        time: true
      };
      return http(httpOptions);
    }
  }

  static async uploadAttachment(attachmentStream: Stream, attachmentMeta: AttachmentMeta, environment: EnvironmentInfo): Promise<Attachment> {
    if (!environment.token || !environment.host || !environment.acct || !environment.contactId) {
      throw new Error('Missing property in environment parameter, please include all of: token, host, acct and contactId');
    } else {
      let url = `https://${environment.host}/a/${environment.acct}/api/v2/contacts/${environment.contactId}/bot-attach`;
      const qs = {};
      if (attachmentMeta.ref) {
        qs['ref'] = attachmentMeta.ref;
      }
      if (attachmentMeta.desc) {
        qs['desc'] = attachmentMeta.desc;
      }
      const httpOptions = {
        method: 'POST',
        uri: url,
        qs,
        formData: {
          file: attachmentStream
        },
        headers: {
          authorization: `Bearer ${environment.token}`,
          'content-type': 'multipart/form-data'
        },
        resolveWithFullResponse: true,
        simple: true,
        time: true
      };
      const response = await http(httpOptions);
      return JSON.parse(response.body);
    }
  }

  /**
   * Check if something is missing in a BotResponse and, in case, return the resulting fixed instance
   * @param response
   * @returns the fixed BotResponse
   */
  static normalizeResponse(response: BotResponse): BotResponse {
    try {
      // for an AttachmentMessage check if the metadata ref property is set. If not, set it to an uuid.
      if (response.messages && response.messages.length) {
        const correctMessages = response.messages.map(m => {
          if (m.type === 'attachment') {
            if (!m.meta.ref) {
              m.meta['ref'] = uuid();
            }
          }
          return m;
        });
        response.messages = correctMessages;
      }
    } catch (error) {
    } finally {
      return response;
    }
  }
}
