import { API, Resource, Operation, Swagger } from 'arrest';
import { BotRequestFilter, BotResponseFilter, BotRequest, BotResponse } from '@vivocha/public-entities';

const defaultRequestFilter: BotRequestFilter = async () => { API.fireError(400, 'request filtering not supported')};
const defaultResponseFilter: BotResponseFilter = async () => { API.fireError(400, 'response filtering not supported')};

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
            "$ref": "schemas/bot_request"
          }
        },
        "default": { "$ref": "#/responses/defaultError" }
      }
    } as any);
  }

  handler(req, res, next) {
    const msg: BotRequest = req.body as BotRequest;
    this.filter(msg).then(response => res.json(response), next);
  }
}

class FilterResponse extends Operation {
  constructor(resource: BotFilterResource, protected filter: BotResponseFilter = defaultResponseFilter) {
    super(resource, '/response', 'post', 'response');
    this.setInfo({
      "parameters": [
        {
          "in": "body",
          "schema": { "$ref": "schemas/bot_response" }
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
    const msg: BotResponse = req.body as BotResponse;
    this.filter(msg).then(response => res.json(response), next);
  }
}

export class BotFilter extends API {
  constructor(reqFilter: BotRequestFilter = defaultRequestFilter, resFilter: BotResponseFilter = defaultResponseFilter) {
    super();
    delete this.parameters;
    if (this.responses) {
      delete this.responses.notFound;
    }
    if (this.definitions) {
      delete this.definitions.metadata;
      delete this.definitions.objectId;
    }
    this.registerSchema('bot_message', require('@vivocha/public-entities/schemas/bot_message.json') as Swagger.Schema);
    this.registerSchema('bot_request', require('@vivocha/public-entities/schemas/bot_request.json') as Swagger.Schema);
    this.registerSchema('bot_response', require('@vivocha/public-entities/schemas/bot_response.json') as Swagger.Schema);
    this.addResource(new BotFilterResource(reqFilter, resFilter));
  }
}
