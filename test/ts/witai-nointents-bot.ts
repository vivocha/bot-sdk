import { getLogger } from "debuggo";
import { BotRequest, BotResponse, TextMessage, WitAiBot, IntentsMap, NextMessage } from "../../dist";
import * as _ from "lodash";

const logger = getLogger("WitAi-test-bot");

export interface Sentences {
  [key: string]: string;
}

export class DataCollectorTestWitBot extends WitAiBot {
  static strings: Sentences = {
    startMsg: "Hello, I'm a bot. What's your full name?",
    address: "Send me your full address, please",
    supportType: "Please, briefly describe why you need our support",
    endMsg: "Done. Thank you.",
    fallbackMsg: "Just a temporary error. Please, retry later."
  };

  protected intents: IntentsMap = undefined;

  async getStartMessage(request: BotRequest): Promise<BotResponse> {
    const message: TextMessage = {
      code: "message",
      type: "text",
      body: DataCollectorTestWitBot.strings.startMsg
    } as any;
    const res: BotResponse = {
      event: "continue",
      messages: [message],
      data: request.data || {},
      settings: request.settings,
      context: _.merge(request.context, { contexts: ["ask_for_name"] })
    };
    return res;
  }

  private async provideFullName(data): Promise<NextMessage> {
    let name: string = "";

    if (data.entities.contact) {
      name = data.entities.contact.map(v => v.value).join(" ");
    } else {
      name = data["_text"];
    }
    const pre = name.length > 0 ? `Thank you ${name},` : "Thank you,";
    let response: NextMessage;
    const txtMessage: TextMessage = {
      code: "message",
      type: "text",
      body: `${pre} ${DataCollectorTestWitBot.strings.address}`
    } as any;
    response = {
      messages: [txtMessage],
      data: { name },
      event: "continue",
      contexts: ["ask_for_address"]
    };
    return response;
  }

  private async provideAddress(witData, request): Promise<NextMessage> {
    let response: NextMessage;
    const txtMessage: TextMessage = {
      code: "message",
      type: "text",
      body: DataCollectorTestWitBot.strings.supportType
    } as any;
    response = {
      messages: [txtMessage],
      data: Object.assign({}, request.data, { address: witData["_text"] }),
      event: "continue",
      contexts: ["ask_for_support_type"]
    };
    return response;
  }

  private async provideSupportType(data, request): Promise<NextMessage> {
    let response = {} as NextMessage;
    const txtMessage: TextMessage = {
      code: "message",
      type: "text"
    } as any;

    txtMessage["body"] = DataCollectorTestWitBot.strings.endMsg;
    response = {
      messages: [txtMessage],
      contexts: ["end"],
      data: Object.assign({}, request.data, {
        supportType: data.entities ? data.entities["support_type"][0].value : data["_text"]
      }),
      event: "end"
    } as NextMessage;
    return response;
  }

  private async unknown(data, request): Promise<NextMessage> {
    if (this.inContext(request.context.contexts, ["ask_for_name"]) && data["_text"]) {
      logger.info(
        `intent was unknown, context was: ${
          request.context.contexts
        } but contact info was provided. Accepting it as name and going to ask for private or business.`
      );
      logger.debug("Response from Wit.ai was: ", JSON.stringify(data));
      return this.provideFullName(data);
    } else {
      const txtMessage: TextMessage = {
        code: "message",
        type: "text",
        body: "Can you reformulate, please?"
      } as any;
      let response: NextMessage = {
        messages: [txtMessage],
        event: "continue",
        contexts: request.context.contexts,
        data: request.data || {}
      };
      return response;
    }
  }
}

process.on("SIGTERM", () => process.exit(0));
process.on("SIGINT", () => process.exit(0));
