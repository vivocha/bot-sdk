import { API, Resource, Operation, Swagger } from 'arrest';
import { BotAgent, BotRequest, BotResponse } from '@vivocha/public-entities';

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
      "parameters": [
        {
          "in": "body",
          "schema": { "$ref": "schemas/bot_request" }
        }
      ],
      "responses": {
        "200": {
          "schema": {
            "$ref": "schemas/bot_response"
          }
        },
        "default": { "$ref": "#/responses/defaultError" }
      }
    } as any);
  }

  handler(req, res, next) {
    const msg: BotRequest = req.body as BotRequest;
    const agent = (this.api as BotAgentManager).agents[msg.engine.type];

    if (agent) {
      agent(msg).then(response => res.json(response), err => API.fireError(500, 'platform error', null, err));
    } else {
      API.fireError(400, 'unsupported bot type');
    }
  }
}

const __agents = Symbol();
export interface BotAgentRegistry {
  [type: string]: BotAgent;
}

export class BotAgentManager extends API {
  constructor() {
    super();
    delete this.parameters;
    if (this.responses) {
      delete this.responses.notFound;
    }
    if (this.definitions) {
      delete this.definitions.metadata;
      delete this.definitions.objectId;
    }
    this[__agents] = {} as BotAgentRegistry;
    this.registerSchema('bot_message', require('@vivocha/public-entities/schemas/bot_message.json') as Swagger.Schema);
    this.registerSchema('bot_request', require('@vivocha/public-entities/schemas/bot_request.json') as Swagger.Schema);
    this.registerSchema('bot_response', require('@vivocha/public-entities/schemas/bot_response.json') as Swagger.Schema);
    this.addResource(new BotAgentResource());
  }
  get agents(): BotAgentRegistry {
    return this[__agents] as BotAgentRegistry;
  }

  registerAgent(type: string, agent: BotAgent): this {
    this.agents[type] = agent;
    return this;
  }
}
