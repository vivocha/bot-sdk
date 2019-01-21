import { TextMessage, IsWritingMessage, ActionMessage } from '@vivocha/public-entities';

export class BotMessage {
  public static createSimpleTextMessage(body: string): TextMessage {
    if (!body) {
      throw new Error('body string is required for a TextMessage');
    } else {
      return {
        code: 'message',
        type: 'text',
        body
      } as TextMessage;
    }
  }
  public static createIsWritingMessage(): IsWritingMessage {
    return {
      code: 'message',
      type: 'iswriting'
    } as IsWritingMessage;
  }
  public static createActionMessage(actionCode: string, args: any[] = []): ActionMessage {
    if (!actionCode) {
      throw new Error('action_code string is required for an ActionMessage');
    } else {
      return {
        code: 'message',
        type: 'action',
        action_code: actionCode,
        args
      } as ActionMessage;
    }
  }
}
