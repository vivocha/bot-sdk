import { TextMessage, IsWritingMessage, ActionMessage, MessageQuickReply } from '@vivocha/public-entities';

export interface QuickReply {
  title: string;
  payload?: string | number;
  image_url?: string;
}
export interface WebUrlButton {
  type: 'web_url';
  title: string;
  url: string;
}
export interface PostbackButton {
  type: 'postback';
  title: string;
  payload: string;
}
export interface DefaultAction {
  type: 'web_url';
  url: string;
}

/**
 * Utility class exposing static methods to compose common used Vivocha Bot Messages.
 *
 * @export
 * @class BotMessage
 */
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
  public static createTextMessageWithQuickReplies(body: string, quickReplies: QuickReply[] | string[]): TextMessage {
    const txtMsg = BotMessage.createSimpleTextMessage(body);
    txtMsg.quick_replies = BotMessage.createQuickReplies(quickReplies);
    return txtMsg;
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
  public static createQuickReplies(quickReplies: QuickReply[] | string[]): MessageQuickReply[] {
    if (!quickReplies) {
      throw new Error('quickReplies param must be valid');
    } else {
      return (quickReplies as any[]).map(qr => {
        if (typeof qr === 'string') {
          const quickReply: MessageQuickReply = {
            content_type: 'text',
            title: qr,
            payload: qr
          };
          return quickReply;
        } else {
          if (!qr.title) {
            throw new Error('a quick reply must have at least a title');
          } else {
            const quickReply: MessageQuickReply = {
              content_type: 'text',
              title: qr.title,
              payload: qr.payload || qr.title
            };
            if (qr.image_url) {
              quickReply.image_url = qr.image_url;
            }
            return quickReply;
          }
        }
      });
    }
  }
  public static createWebUrlButton(title: string, url: string): WebUrlButton {
    if (!title || !url) {
      throw new Error('In a WebURLButton, title and url are required');
    } else {
      return {
        type: 'web_url',
        title,
        url
      };
    }
  }
  public static createPostbackButton(title: string, payload: string): PostbackButton {
    if (!title || !payload) {
      throw new Error('In a PostbackButton, title and payload are required');
    } else {
      return {
        type: 'postback',
        title,
        payload
      };
    }
  }
  public static createDefaultAction(url: string): DefaultAction {
    if (!url) {
      throw new Error('In a DefaultAction url is required');
    } else {
      return {
        type: 'web_url',
        url
      };
    }
  }
}
