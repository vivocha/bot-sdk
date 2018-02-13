# Vivocha Bot SDK
*JavaScript / TypeScript SDK to create Bot Agents and Filters for the [Vivocha](https://www.vivocha.com) platform*

---

This SDK allows to write Vivocha Bot Agents integrating existing bots, built and trained using your preferred bot / NLP platform (E.g., Dialogflow, IBM Watson Conversation, Wit.ai, etc...).
By creating a BotManager it is possible to register multi-platform bot implementations and let Vivocha communicate with them through a well-defined, clear and uniform message-based interface.

## Overview / The Big Picture

The following picture shows an high-level overview of the Vivocha Bot SDK and its software components.

![Overview](https://cdn.rawgit.com/vivocha/bot-sdk/fd208ab2/docs/vivocha-bot-sdk.svg)

## Quick Start by example

The `example` folder contains two executable Bot Managers and a Filter along with some related HTTP requests to show how to call their APIs.

See:

- `sample`: dead simple bot Agent and Manager plus a Bot Filter, read and use the `examples/http-requests/sample.http` file to learn more and to run them;
- `dummy-bot`: a simple bot (Agent and Manager) able to understand some simple "commands". Read and use the `examples/http-requests/dummy-bot.http` file to learn more and to run and interact with them.

---

### BotAgents and Manager TL;DR (how to use it)
A `BotAgent` represents and communicates with a particular Bot implementation platform.
A `BotManager` exposes a Web API acting as a gateway to registered `BotAgent`s.

Usually, the steps to use agents and managers are:

1. Write a `BotAgent` for every Bot/NLP platform you need to support, handling / wrapping messages of type `BotRequest` and `BotResponse`;
2. create a `BotAgentManager` instance;
3. register the `BotAgent`s defined at step 1) to the `BotAgentManager`, through the `registerAgent(key, botAgent)` method, where `key` (string) is the choosen bot engine (e.g, `Dialogflow`, `Watson`, ...) and `agent` is a `BotAgent` instance;
4. run the `BotAgentManager` service through its `listen()` method, it exposes a Web API;
5. call the Web API endpoints to send messages to the bot agents in a uniform way. The manager forwards the message to the right registered `BotAgent` thanks to the `engine.type` message property, used as `key` in step 3). API is full described by its Swagger specification, available at `http://<BotAgentManager-Host>:<port>/swagger.json`.

---

### BotFilters TL;DR (how to use it)

A `BotFilter` is a Web service to filter/manipulate/enrich/transform `BotRequest`s and/or `BotResponse`s. 
For example, a `BotFilter` can enrich a request calling an external API to get additional data before sending it to a BotAgent, or it can filter a response coming form a BotAgent to transform data it contains before forwarding it to a user.

Basically, to write a filter you have to:

1. Instantiate a `BotFilter` specifying a `BotRequestFilter` or a `BotResponseFilter`. These are the functions containing your logic to manipulate/filter/enrich requests to bots and responses from them. Inside themyou can call external web services, transform data and do whatever you need to do to achieve your application-specific goal.
A `BotFilter` can provide a filter for only a request, only a response or both.
2. run the `BotFilter` service through its `listen()` method, it exposes a Web API; API is full described by its Swagger specification, available at `http://<BotFilter-Host>:<port>/swagger.json`.



---

## BotAgent

A `BotAgent` represents an abstract Bot implementation and it directly communicates with a particular Bot / NLP platform (like Dialogflow, IBM Watson Conversation and so on...).
In the Vivocha model, a Bot is represented by a function with the following signature:

In Typescript:

```javascript
(request: BotRequest): Promise<BotResponse>
```


In JavaScript:

```javascript
let botAgent = async (request) => {
    // the logic to interact with the particular bot implementation
    // goes here, then produce a BotResponse message...
    ...    
    return response;
}
```
### BotRequest

Requests are sent to BotAgents, BotManagers and BotFilters.
A BotRequest is a JSON with the following properties (in **bold** the required properties):

property | value | description
| ------ | ------ | -----------
| **`event`** | string: `start` or `continue` or `end` or a custom string | `start` event is sent to wake-up the Bot; `continue` tells the Bot to continue the conversation; `end` to set the conversation as finished; a custom string can be set for specific custom internal Bot functionalities.
`message` | (optional) object, see **BotMessage** below | the message to send to the BotAgent
`language` | (optional) string. E.g., `en`, `it`, ... | language string, mandatory for some Bot platforms.
`data` | (optional) object | an object containing data to send to the Bot. Its properties must be of simple type. E.g., `{"firstname":"Antonio", "lastname": "Smith", "code": 12345}`
`context` | (optional) object | Opaque, Bot specific context data
`tempContext` | (optional) object | Temporary context, useful to store volatile data, i.e., in bot filters chains.
`settings` | (optional) **BotSettings** object (see below)| Bot platform settings.

#### BotMessage

property | value | description
| ------ | ------ | -----------
| **`code`** | string, value is always `message` | Vivocha code type for Bot messages.
| **`type`** | string: `text` or `postback` | Vivocha Bot message type.
| **`body`** | string | the message text body.
| `quick_replies` | only in case of `type` == `text` messages, an array of **MessageQuickReply** objects (see below) | an array of quick replies
| `template` | only in case of `type` == `text` messages, an object with a required `type` string property and an optional `elements` object array property| a template object

#### BotSettings

property | value | description
| ------ | ------ | -----------
| `engine` | (optional) **BotEngineSettings** object (see below)| Specific Bot/NLP Platform settings.

#### BotEngineSettings

property | value | description
| ------ | ------ | -----------
| **`type`** | string | Unique bot engine identifier, i.e., the platform name, like: `Watson`, `Dialogflow`, ...
| `settings` | (optional) object | Specific settings to send to the BOT/NLP platform. E.g. for Watson Conversation is an object like `{"workspaceId": "<id>" "username": "<usrname>", "password": "<passwd>"}`; for a Dialogflow bot is something like: `{"token": "<token>", "startEvent": "MyCustomStartEvent"}`.

---

### BotResponse

Responses are sent back by BotAgents, BotManagers and BotFilters to convay a Bot platform reply back to the Vivocha platform.
A BotResponse is a JSON with the following properties and it is similar to a `BotRequest`, except for some fields (in **bold** the required properties):

property | value | description
| ------ | ------ | -----------
| **`event`** | string: `continue` or `end` | `continue` event is sent back to Vivocha to continue the conversation, in other words it means that the bot is awaiting for the next user message; `end` is sent back with the meaning that Bot finished is task.
`messages` | (optional) an array of **BotMessage** objects, see **BotMessage**, above | the messages sent back by the BotAgent
`language` | (optional) string. E.g., `en`, `it`, ... | language string
`data` | (optional) object | an object containing data collected or computed by the Bot. Its properties must be of simple type. E.g., `{"firstname":"Antonio", "lastname": "Smith", "code": 12345}`
`context` | (optional) object | Opaque, Bot specific context data. The Vivocha platform will send it immutated to the Bot in the next iteration.
`tempContext` | (optional) object | Temporary context, useful to store volatile data, i.e., in bot filters chains.
`settings` | (optional) **BotSettings** object (see above)| Bot platform settings.
`raw` | (optional) object | raw, platform specific, unparsed bot response.

---

## BotManager

A Bot Manager is a bot registry microservice, which basically provides two main functionalities:

1. it allows to register an undefined number of `BotAgent`s;
2. it exposes a Web API to send messages and receive responses to/from `BotAgent`s, acting as a gateway using a normalized interface.


### Registering a Bot Agent

In the code contained in the `examples` directory it is possible to read in detail how to create and register Bot Agents.
Briefly, to register a BotAgent, **BotManager** provides a `registerAgent()` method:

```javascript
const manager = new BotAgentManager();
manager.registerAgent('custom', async (msg: BotRequest): Promise<BotResponse> => {

    // Bot Agent application logic goes here
    // I.e., call the specific Bot implementation APIs (e.g., Watson, Dialogflow, etc...)
    // adapting requests and responses.
    ...
}
```

The BotManager allows to register several BotAgents by specifying different `type` parameters (first param in `registerAgent()` method. E.g., `Watson`, `Dialogflow`, `WitAi`, `custom`,  ecc... ).
In this way it is possible to have a multi-bot application instance, the BotManager will forward the requests to the correct registered bot matching the registered BotAgent `type` with the `settings.engine.type` property in BotRequests.

### Web API

The BotManager `listen()` method launches a Web microservice exposing the following API endpoint:

`POST /bot/message`

Sends a `BotRequest` and reply with a `BotResponse`.

Detailed info and Swagger based API description is always available at:

`http://<BotAgentManager-Host>:<port>/swagger.json`


---

## Bot Filters
TBD


### Web API
TBD

`/filter/request`

`/filter/response`

---

# Writing Wit.ai Chat Bots
TBD

