import { Attachment, AttachmentMeta } from '@vivocha/public-entities';
import { BotAgent, BotRequest, BotResponse, EnvironmentInfo } from '@vivocha/public-entities/dist/bot';
import { API, Operation, Resource } from 'arrest';
import { OpenAPIV3 } from 'openapi-police';
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
  api: BotAgentManager;

  constructor(resource: BotAgentResource, path, method) {
    super(resource, path, method, 'message.send');
  }
  protected getCustomInfo(): OpenAPIV3.OperationObject {
    return {
      summary: 'Send a message to a bot',
      description: 'This endpoint sends a BotRequest to a registered bot, then a BotResponse is expected to be returned in case of success.',
      externalDocs: {
        description: 'Find more detailed info in the official Vivocha Bot SDK documentation.',
        url: 'https://github.com/vivocha/bot-sdk#overview'
      },
      requestBody: {
        description: 'The BotRequest JSON body to send to the bot',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/bot_request' },
            example: {
              language: 'en',
              event: 'continue',
              message: {
                code: 'message',
                type: 'text',
                body: 'Please, help me'
              },
              data: {
                user: 'Antonio',
                premium: true
              },
              settings: {
                engine: {
                  type: 'custom',
                  settings: {
                    myToken: 'super_secret_token',
                    anotherSetting: '123'
                  }
                }
              }
            }
          }
        },
        required: true
      },
      responses: {
        '200': {
          description: 'If sending a message to a Bot was successful, a BotResponse is returned',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/bot_response'
              },
              example: {
                event: 'continue',
                messages: [
                  {
                    code: 'message',
                    type: 'text',
                    body: 'Hello! I am a Vivocha Dummy Bot 😎'
                  },
                  {
                    code: 'message',
                    type: 'text',
                    body: 'To start, choose one of the following options to see what I can do for you',
                    quick_replies: [
                      {
                        content_type: 'text',
                        title: 'info',
                        payload: 'info'
                      },
                      {
                        content_type: 'text',
                        title: 'help',
                        payload: 'help'
                      }
                    ]
                  }
                ],
                context: {
                  botName: 'DummyBot'
                },
                data: {}
              }
            }
          }
        },
        default: {
          description: 'An error occurred sending the BotRequest',
          content: {
            'application/json': {
              schema: { $ref: '#/components/responses/defaultError' },
              example: {
                error: 400,
                message: 'unsupported bot type'
              }
            }
          }
        }
      }
    };
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
    const agent = this.api.agents[msg.settings.engine.type];
    if (agent) {
      agent(msg).then(response => res.json(BotAgentManager.normalizeResponse(response)), err => next(API.newError(500, 'platform error', err.message, err)));
    } else {
      API.fireError(400, 'unsupported bot type');
    }
  }
}

export interface BotAgentRegistry {
  [type: string]: BotAgent;
}

export class BotAgentManager extends API {
  agents: BotAgentRegistry = {};

  constructor(version: string = '4.0.0', title: string = 'Vivocha BotAgentManager API') {
    super({
      title,
      version,
      description:
        'The BotAgentManager API allows to send and receive messages to / from registered Bot Agents. The BotAgentManager API is part of the [Vivocha Bot SDK](https://github.com/vivocha/bot-sdk).',
      contact: {
        name: 'Vivocha S.p.A.',
        url: 'https://www.vivocha.com'
      }
    });
    if (this.document.components) {
      if (this.document.components.parameters) {
        this.document.components.parameters = {
          id: this.document.components.parameters.id
        };
      }
      if (this.document.components.schemas) {
        delete this.document.components.schemas.metadata;
        delete this.document.components.schemas.objectId;
      }
    }
    this.registerSchema('common', require('@vivocha/public-entities/schemas/common.json') as OpenAPIV3.SchemaObject);
    this.registerSchema('bot_message', require('@vivocha/public-entities/schemas/bot_message.json') as OpenAPIV3.SchemaObject);
    this.registerSchema('bot_request', require('@vivocha/public-entities/schemas/bot_request.json') as OpenAPIV3.SchemaObject);
    this.registerSchema('bot_response', require('@vivocha/public-entities/schemas/bot_response.json') as OpenAPIV3.SchemaObject);
    this.registerSchema('text_message', require('@vivocha/public-entities/schemas/text_message.json') as OpenAPIV3.SchemaObject);
    this.registerSchema('postback_message', require('@vivocha/public-entities/schemas/postback_message.json') as OpenAPIV3.SchemaObject);
    this.registerSchema('attachment_message', require('@vivocha/public-entities/schemas/attachment_message.json') as OpenAPIV3.SchemaObject);
    this.registerSchema('action_message', require('@vivocha/public-entities/schemas/action_message.json') as OpenAPIV3.SchemaObject);
    this.registerSchema('is_writing_message', require('@vivocha/public-entities/schemas/is_writing_message.json') as OpenAPIV3.SchemaObject);
    this.addResource(new BotAgentResource());
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
