import { BotRequest, BotRequestFilter, BotResponse, BotResponseFilter, EnvironmentInfo } from '@vivocha/public-entities/dist/bot';
import { API, Operation, Resource } from 'arrest';
import { OpenAPIV3 } from 'openapi-police';
import { getVvcEnvironment } from './util';

const defaultRequestFilter: BotRequestFilter = async (): Promise<BotRequest> => {
  throw API.newError(400, 'request filtering not supported');
};
const defaultResponseFilter: BotResponseFilter = async (): Promise<BotResponse> => {
  throw API.newError(400, 'response filtering not supported');
};

class BotFilterResource extends Resource {
  constructor(reqFilter: BotRequestFilter, resFilter: BotResponseFilter) {
    super({
      name: 'Filter',
      namePlural: 'Filter'
    });
    this.addOperation(new FilterRequest(this, reqFilter));
    this.addOperation(new FilterResponse(this, resFilter));
  }
}

class FilterRequest extends Operation {
  constructor(resource: BotFilterResource, protected filter: BotRequestFilter = defaultRequestFilter) {
    super(resource, '/request', 'post', 'request');
  }
  protected getCustomInfo(): OpenAPIV3.OperationObject {
    return {
      summary: 'Send a BotRequest to a request BotFilter',
      description: 'This endpoint sends a BotRequest to a request BotFilter, a BotRequest is expected to be returned in case of success.',
      externalDocs: {
        description: 'Find more detailed info in the official Vivocha Bot SDK documentation.',
        url: 'https://github.com/vivocha/bot-sdk#bot-filters'
      },
      requestBody: {
        description: 'The BotRequest JSON body to send to the request BotFilter',
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
              settings: {}
            }
          }
        },
        required: true
      },
      responses: {
        '200': {
          description: 'The request was successfully handled, the manipulated/filtered BotRequest is returned',
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
                  premium: true,
                  dataFromFilter: 'yes'
                },
                settings: {}
              }
            }
          }
        },
        default: {
          description: 'An error occurred sending the BotRequest to the BotFilter',
          content: {
            'application/json': {
              schema: { $ref: '#/components/responses/defaultError' },
              example: {
                error: 400,
                message: 'request filtering not supported'
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
    this.filter(msg).then(response => res.json(response), next);
  }
}

class FilterResponse extends Operation {
  constructor(resource: BotFilterResource, protected filter: BotResponseFilter = defaultResponseFilter) {
    super(resource, '/response', 'post', 'response');
  }
  protected getCustomInfo(): OpenAPIV3.OperationObject {
    return {
      summary: 'Send a BotResponse to a response BotFilter',
      description: 'This endpoint sends a BotResponse to a response BotFilter, a BotResponse is expected to be returned in case of success.',
      externalDocs: {
        description: 'Find more detailed info in the official Vivocha Bot SDK documentation.',
        url: 'https://github.com/vivocha/bot-sdk#bot-filters'
      },
      requestBody: {
        description: 'The BotResponse JSON body to send to the response BotFilter',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/bot_response' },
            example: {
              event: 'end',
              messages: [
                {
                  code: 'message',
                  type: 'text',
                  body: 'Bye, see you soon!'
                }
              ],
              context: {}
            }
          }
        },
        required: true
      },
      responses: {
        '200': {
          description: 'The response was successfully handled, the manipulated/filtered BotResponse is returned',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/bot_response' },
              example: {
                event: 'end',
                messages: [
                  {
                    code: 'message',
                    type: 'text',
                    body: 'Bye, see you soon!'
                  },
                  {
                    code: 'message',
                    type: 'text',
                    body: 'An extra BYE added by a response BotFilter ;)'
                  }
                ],
                context: {
                  checkedByBotFilter: true
                }
              }
            }
          }
        },
        default: {
          description: 'An error occurred sending the BotResponse to the BotFilter',
          content: {
            'application/json': {
              schema: { $ref: '#/components/responses/defaultError' },
              example: {
                error: 400,
                message: 'response filtering not supported'
              }
            }
          }
        }
      }
    };
  }

  handler(req, res, next) {
    const msg: BotResponse = req.body as BotResponse;
    let vivochaEnvironment = msg.environment || {};
    const headers = req.headers;
    if (headers) {
      const headersEnvironment: EnvironmentInfo = getVvcEnvironment(headers);
      if (Object.keys(headersEnvironment).length) {
        vivochaEnvironment = { ...vivochaEnvironment, ...headersEnvironment };
      }
    }
    msg['environment'] = vivochaEnvironment;
    this.filter(msg).then(response => res.json(response), next);
  }
}

export class BotFilter extends API {
  constructor(reqFilter: BotRequestFilter = defaultRequestFilter, resFilter: BotResponseFilter = defaultResponseFilter) {
    super({
      title: 'Vivocha BotFilter API',
      version: '4.0.0',
      description:
        'The BotFilter API allows to filter/manipulate BotRequests and/or BotResponses. The BotFilter API is part of the [Vivocha Bot SDK](https://github.com/vivocha/bot-sdk).',
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
    this.registerSchema('multi_attachment_message', require('@vivocha/public-entities/schemas/multi_attachment_message.json') as OpenAPIV3.SchemaObject);
    this.registerSchema('action_message', require('@vivocha/public-entities/schemas/action_message.json') as OpenAPIV3.SchemaObject);
    this.registerSchema('is_writing_message', require('@vivocha/public-entities/schemas/is_writing_message.json') as OpenAPIV3.SchemaObject);
    this.registerSchema('location_message', require('@vivocha/public-entities/schemas/location_message.json') as OpenAPIV3.SchemaObject);
    this.addResource(new BotFilterResource(reqFilter, resFilter));
  }
}
