import * as chai from "chai";
import { BotAgentManager, BotRequest, BotResponse } from "../../dist";
import * as http from "request-promise-native";
import { DataCollectorTestWitBot } from "./witai-nointents-bot";
import { DataCollectorTestWitBot as OkBot } from "./bot";

chai.should();

const engineType = "WitAi";

const getTextMessage = function(body: string, payload?: string): any {
  let msg = {
    code: "message",
    type: "text",
    body
  };
  if (payload) {
    msg["payload"] = payload;
  }
  return msg;
};
const getHTTPOptions = function getOptions(body) {
  return {
    method: "POST",
    uri: "http://localhost:8080/bot/message",
    body: body,
    headers: {
      "x-vvc-host": "localhost:8080",
      "x-vvc-acct": "vvc_test1"
    },
    json: true,
    simple: false,
    resolveWithFullResponse: true
  };
};

//root describe
describe("Testing Wit.ai based bot for a simple data collection ", function() {
  let env = process.env;

  describe("Starting a bot that has NOT CONFIGURED Intents", function() {
    const getSettings = function(): any {
      return {
        engine: {
          type: engineType,
          settings: {
            token: env.WIT_TOKEN
          }
        }
      };
    };
    const manager = new BotAgentManager();
    let server;
    before("starting bot manager", async function() {
      manager.registerAgent(
        engineType,
        async (req: BotRequest): Promise<BotResponse> => {
          const bot = new DataCollectorTestWitBot(req.settings.engine.settings.token);
          return bot.sendMessage(req);
        }
      );
      // Run the BotManager:
      const port = (process.env.PORT as any) || 8080;
      server = await manager.listen(port);
      return;
    });
    it("should raise an error", async function() {
      const request1: BotRequest = {
        language: "en",
        event: "start",
        settings: getSettings()
      };
      //console.dir(request1, { colors: true, depth: 20 });
      const result1 = await http(getHTTPOptions(request1));
      result1.statusCode.should.equal(500);
      return;
    });

    after("shutdown bot manager", function() {
      server.close();
    });
  });
  describe("Starting a correctly configured bot", function() {
    const getSettings = function(): any {
      return {
        engine: {
          type: engineType,
          settings: {
            token: env.WIT_TOKEN
          }
        }
      };
    };
    const manager = new BotAgentManager();
    let server;
    before("starting bot manager", async function() {
      manager.registerAgent(
        engineType,
        async (req: BotRequest): Promise<BotResponse> => {
          const bot = new OkBot(req.settings.engine.settings.token);
          return bot.sendMessage(req);
        }
      );
      // Run the BotManager:
      const port = (process.env.PORT as any) || 8080;
      server = await manager.listen(port);
      return;
    });
    it("for a missing request message, it should raise an error", async function() {
      const request1: BotRequest = {
        language: "en",
        event: "continue",
        settings: getSettings()
      };
      //console.dir(request1, { colors: true, depth: 20 });
      const result1 = await http(getHTTPOptions(request1));
      result1.statusCode.should.equal(500);
      return;
    });
    it("for a message classified with unknown intent, contexts ok, it should use the inContext() function and return the entered text ", async function() {
      const request1: BotRequest = {
        language: "en",
        event: "continue",
        message: {
          code: "message",
          type: "text",
          body: "unknown is a state of mind"
        } as any,
        context: {
          contexts: ["ask_for_name"]
        },
        settings: getSettings()
      };
      //console.dir(request1, { colors: true, depth: 20 });
      const result1 = await http(getHTTPOptions(request1));
      result1.statusCode.should.equal(200);
      return;
    });
    after("shutdown bot manager", function() {
      server.close();
    });
  });
}); // root describe - end
