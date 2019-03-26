import { getLogger } from 'debuggo';
import { BotRequest, BotResponse, BotMessageBody } from './index';
import { Wit, log, MessageResponse } from 'node-wit';
import * as _ from 'lodash';

const logger = getLogger('vivocha.witai.driver');

/**
 * Type definition for mapping WitAi intents to related intent handlers
 */
export interface IntentsMap {
  unknown: IntentHandler;
  [intentName: string]: IntentHandler;
}
/**
 * Type definition for intent handler functions
 * @param data - a Wit.ai MessageResponse, the complete response from Wit.ai API.
 */
export interface IntentHandler {
  (data: any, request: BotRequest): Promise<NextMessage>;
}
/**
 * Type definition for "internal" messages returned by an intent handler function;
 * it represents the next message to return, including contexts
 */
export interface NextMessage {
  messages?: BotMessageBody[];
  contexts?: string[];
  data?: any;
  event: 'continue' | 'end';
}

/**
 * Abstract class representing a generic Witai Chatbot.
 * In order to write a particular WitAi chatbot for your application domain
 * just extend it and implement the required abstract members: getStartMessage() method and "fill" the intents property.
 * Then register it to a Vivocha BotAgentManager.
 */
export abstract class WitAiBot {
  protected witApp: Wit;
  readonly engine: string = 'WitAi';
  protected abstract intents: IntentsMap;

  constructor(private token: string) {
    this.witApp = new Wit({
      accessToken: token
    });
  }

  async sendMessage(request: BotRequest): Promise<BotResponse> {
    if (!this.intents) throw new Error('intents property is not initialized');
    if (request.event === 'start') {
      return this.getStartMessage(request);
    } else {
      return this.sendTextMessage(request);
    }
  }
  protected async sendTextMessage(request: BotRequest): Promise<BotResponse> {
    if (!request.message) {
      throw new Error('Missing request.message property in received text message');
    } else {
      if (request.message.type === 'text' || request.message.type === 'postback') {
        const witResponse = await this.witApp.message(request.message.body, {});
        logger.debug('Wit.ai RESPONSE', JSON.stringify(witResponse));
        const nextMessage: NextMessage = await this.getNextMessage(this.getFirstIntent(witResponse.entities) || 'unknown', witResponse, request);
        logger.debug('Message to send:', JSON.stringify(nextMessage));
        const res: BotResponse = {
          event: nextMessage.event,
          messages: nextMessage.messages,
          data: Object.assign({}, request.data, nextMessage.data || witResponse.entities),
          settings: request.settings,
          context: _.merge(request.context, { contexts: nextMessage.contexts }),
          raw: witResponse
        };
        logger.debug('Bot Response to send:', JSON.stringify(res));
        return res;
      } else {
        throw new Error(`Unsupported message type (${request.message.type})`);
      }
    }
  }
  protected async getNextMessage(intent: string, witResponse: MessageResponse, request: BotRequest): Promise<NextMessage> {
    return this.intents[intent](witResponse, request);
  }
  /**
   * Implement this method in the derived classes to return a Promise resolved with a BotResponse
   * @param request - BotRequest, the request coming from clients
   * @returns Promise<BotResponse>, containing the message to return in case of a start event
   */
  protected abstract async getStartMessage(request: BotRequest): Promise<BotResponse>;

  // utilities methods
  protected getFirstIntent(entities: any[]): string {
    return entities && entities['intent'] && Array.isArray(entities['intent']) && entities['intent'][0].value;
  }
  /**
   * Check if all contexts in toCheck are contained in contexts array
   * @param toCheck
   * @param contexts
   * @returns true if all contexts in toCheck are contained in contexts array
   */
  protected inContext(toCheck: string[], contexts: string[]): boolean {
    try {
      const set = new Set(contexts);
      const intersection = toCheck.filter(x => set.has(x));
      return intersection.length === toCheck.length;
    } catch (error) {
      return false;
    }
  }
}
