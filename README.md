# Vivocha Bot SDK

*JavaScript / TypeScript SDK to create Bot Agents and Filters for the [Vivocha](https://www.vivocha.com) platform*

---

This SDK allows to write Vivocha Bot Agents integrating existing bots, built and trained using your preferred bot / NLP platform (E.g., Dialogflow, IBM Watson Conversation, Wit.ai, etc...).
By creating a BotManager it is possible to register multi-platform bot implementations and let Vivocha communicate with them through a well-defined, clear and uniform message-based interface.

## [Overview](#overview)

The Vivocha platform provides out-of-the-box support for chat bots built using [IBM Watson Conversation](https://www.ibm.com/watson/services/conversation) and [Dialogflow](https://dialogflow.com/) platforms. This means that it is possible to integrate these particular bots implementation with Vivocha simply using the Vivocha configuration app and specificing few settings, like authentication tokens and following some, very simple, mandatory guidelines when building the bots, at design time.
The first sections of this documentation focus on building custom Bot Agents using the Bot SDK, which allows to integrate them with the Vivocha system with ease and also provides a library to write bots using [Wit.ai](https://wit.ai) NLP platform.

The last three sections of this guide are dedicated to the integration guidelines for bots built with the three supported platforms: IBM Watson Conversation, Dialogflow and Wit.ai.

The following picture shows an high-level overview of the Vivocha Bot SDK and its software components.

| ![Overview](https://cdn.rawgit.com/vivocha/bot-sdk/fd208ab2/docs/vivocha-bot-sdk.svg) |
|:---:|
| **FIGURE 1 - Overview of the main modules of the Bot SDK**|

## [Quick Start, by Example](#quick-start)

The `examples` folder contains some samples of Bot Managers, a Wit.ai Bot implementation and a Filter, along with some related HTTP requests to show how to call their APIs.

See:

- `sample`: dead simple bot Agent and Manager plus a Bot Filter, read and use the `examples/http-requests/sample.http` file to learn more and to run them;
- `dummy-bot`: a simple bot (Agent and Manager) able to understand some simple "commands". Read and use the `examples/http-requests/dummy-bot.http` file to learn more and to run and interact with them.
- `sample-wit`: a simple bot using Wit.ai platform.

---

### [BotAgents and Manager TL;DR (how to use it)](#bot-agents-managers-tldr)

A `BotAgent` represents and communicates with a particular Bot implementation platform.
A `BotManager` exposes a Web API acting as a gateway to registered `BotAgent`s.

Usually, the steps to use agents and managers are:

1. Write a `BotAgent` for every Bot/NLP platform you need to support, handling / wrapping messages of type `BotRequest` and `BotResponse`;
2. create a `BotAgentManager` instance;
3. register the `BotAgent`s defined at step 1) to the `BotAgentManager`, through the `registerAgent(key, botAgent)` method, where `key` (string) is the choosen bot engine (e.g, `Dialogflow`, `Watson`, ...) and `agent` is a `BotAgent` instance;
4. run the `BotAgentManager` service through its `listen()` method, it exposes a Web API;
5. call the Web API endpoints to send messages to the bot agents in a uniform way. The manager forwards the message to the right registered `BotAgent` thanks to the `engine.type` message property, used as `key` in step 3). API is full described by its Swagger specification, available at `http://<BotAgentManager-Host>:<port>/swagger.json`.

---

### [BotFilters TL;DR (how to use it)](#bot-filters-tldr)

A `BotFilter` is a Web service to filter/manipulate/enrich/transform `BotRequest`s and/or `BotResponse`s. 
For example, a `BotFilter` can enrich a request calling an external API to get additional data before sending it to a BotAgent, or it can filter a response coming form a BotAgent to transform data it contains before forwarding it to a user.

Basically, to write a filter you have to:

1. Instantiate a `BotFilter` specifying a `BotRequestFilter` or a `BotResponseFilter`. These are the functions containing your logic to manipulate/filter/enrich requests to bots and responses from them. Inside themyou can call external web services, transform data and do whatever you need to do to achieve your application-specific goal. A `BotFilter` can provide a filter for only a request, only a response or both.
2. run the `BotFilter` service through its `listen()` method, it exposes a Web API; API is full described by its Swagger specification, available at `http://<BotFilter-Host>:<port>/swagger.json`.

---

## [BotAgent](#botagent)

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

### [BotRequest](#botrequest)

Requests are sent to BotAgents, BotManagers and BotFilters.
A BotRequest is a JSON with the following properties (in **bold** the required properties):

property | value | description
| ------ | ------ | ----------- |
| **`event`** | string: `start` or `continue` or `end` or a custom string | `start` event is sent to wake-up the Bot; `continue` tells the Bot to continue the conversation; `end` to set the conversation as finished; a custom string can be set for specific custom internal Bot functionalities.
`message` | (optional) object, see **[BotMessage](https://github.com/vivocha/bot-sdk#botmessage)** below | the message to send to the BotAgent
`language` | (optional) string. E.g., `en`, `it`, ... | language string, mandatory for some Bot platforms.
`data` | (optional) object | an object containing data to send to the Bot. Its properties must be of simple type. E.g., `{"firstname":"Antonio", "lastname": "Smith", "code": 12345}`
`context` | (optional) object | Opaque, Bot specific context data
`tempContext` | (optional) object | Temporary context, useful to store volatile data, i.e., in bot filters chains.
`settings` | (optional) **[BotSettings](https://github.com/vivocha/bot-sdk#botsettings)** object (see below)| Bot platform settings.

#### [BotMessage](#botmessage)

property | value | description
| ------ | ------ | ----------- |
| **`code`** | string, value is always `message` | Vivocha code type for Bot messages.
| **`type`** | string: `text` or `postback` | Vivocha Bot message type.
| **`body`** | string | the message text body.
| `quick_replies` | (optional) only in case of `type` == `text` messages, an array of **[MessageQuickReply](https://github.com/vivocha/bot-sdk#messagequickreply)** objects (see below) | an array of quick replies
| `template` | (optional) only in case of `type` == `text` messages, an object with a required `type` string property and an optional `elements` object array property| a template object

#### [BotSettings](#botsettings)

property | value | description
| ------ | ------ | -----------
| `engine` | (optional) **[BotEngineSettings](https://github.com/vivocha/bot-sdk#botenginesettings)** object (see below)| Specific Bot/NLP Platform settings.

#### [BotEngineSettings](#botenginesettings)

property | value | description
| ------ | ------ | ----------- |
| **`type`** | string | Unique bot engine identifier, i.e., the platform name, like: `Watson`, `Dialogflow`, ...
| `settings` | (optional) object | Specific settings to send to the BOT/NLP platform. E.g. for Watson Conversation is an object like `{"workspaceId": "<id>" "username": "<usrname>", "password": "<passwd>"}`; for a Dialogflow bot is something like: `{"token": "<token>", "startEvent": "MyCustomStartEvent"}`.

#### [MessageQuickReply](#messagequickreply)

property | value | description
| ------ | ------ | ----------- |
| **`content_type`** | string, admited values: `text` or `location` | Type of the content of the Quick Reply
| `title`| (optional) string | title of the message
| `payload` | (optional) a string or a number | string or number related to the `content-type` property value
| `image_url` | (optional) string | a URL of an image

---

### [BotResponse](#botresponse)

Responses are sent back by BotAgents, BotManagers and BotFilters to convay a Bot platform reply back to the Vivocha platform.
A BotResponse is a JSON with the following properties and it is similar to a `BotRequest`, except for some fields (in **bold** the required properties):

property | value | description
| ------ | ------ | ----------- |
| **`event`** | string: `continue` or `end` | `continue` event is sent back to Vivocha to continue the conversation, in other words it means that the bot is awaiting for the next user message; `end` is sent back with the meaning that Bot finished is task.
`messages` | (optional) an array of **BotMessage** objects, see **BotMessage**, above | the messages sent back by the BotAgent
`language` | (optional) string. E.g., `en`, `it`, ... | language string
`data` | (optional) object | an object containing data collected or computed by the Bot. Its properties must be of simple type. E.g., `{"firstname":"Antonio", "lastname": "Smith", "code": 12345}`
`context` | (optional) object | Opaque, Bot specific context data. The Vivocha platform will send it immutated to the Bot in the next iteration.
`tempContext` | (optional) object | Temporary context, useful to store volatile data, i.e., in bot filters chains.
`settings` | (optional) **BotSettings** object (see above)| Bot platform settings.
`raw` | (optional) object | raw, platform specific, unparsed bot response.

---

## [BotManager](#botmanager)

A Bot Manager is a bot registry microservice, which basically provides two main functionalities:

1. it allows to register an undefined number of `BotAgent`s;
2. it exposes a Web API to send messages and receive responses to/from `BotAgent`s, acting as a gateway using a normalized interface.


### [Registering a Bot Agent](#register-botagent)

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
In this way it is possible to have a multi-bot application instance, the BotManager will forward the requests to the correct registered bot, matching the registered BotAgent `type` with the `settings.engine.type` property in incoming BotRequests.

### [BotManager Web API](#botmanager-api)

The BotManager `listen()` method launches a Web server microservice, exposing the following API endpoint:

`POST /bot/message`

Sends a `BotRequest` and replies with a `BotResponse`.

Detailed info and a Swagger based API description is always available at:

`http(s)://<Your-BotAgentManager-Host>:<port>/swagger.json`

---

## [Bot Filters](#botfilters)

BotFilters are Web (micro)services to augment or adapt or transform BotRequests before reaching a Bot, and/or to augment or adapt or transform BotResponses coming from a Bot before returing back to the Vivocha platform. It is also possible to chain several BotFilters in order to have specialized filters related to the application domain.

Next picture shows an example of a BotFilters chain:

| ![BotFilters Chain](https://cdn.rawgit.com/vivocha/bot-sdk/dc4d07ff/docs/vivocha-BotFilters-Chain.svg) |
|:---:|
| **FIGURE 2  - An example of a BotFilters chain configured using Vivocha** |

The same BotFilter instance can act as a filter for requests, as a filter for responses or both.
See `BotFilter` class constructor to configure it as you prefer.

Figure 2 shows an example of a BotFilter chain: **BotFilters A**, **B** and **C** are configured to act as request filters; in other words they receive a BotRequest and return the same BotRequest maybe augmented with more data or transformed as a particular application requires. For example, **BotFilter A** may add data after reading from a DB, **BotFilter B** may call an API or external service to see if a given user has a premium account (consequentially setting in the request a `isPremium` boolean property), and so on...
When it's time to send a request to a BotAgent (through a BotManager), the Vivocha platform will **sequentially call** all the filters in the request chain before forwarding the resulting request to the Bot.

**BotFilter D** is a response filter and notice that **BotFilter A** is also configured to be a response filter; thus, when a response comes from the Bot, Vivocha **sequentially calls** all the response BotFilters in the response chain before sending back to a chat the resulting response. For example: a response BotFilter can hide or encrypt data coming from a Bot or it can on-the-fly convert currencies, or format dates or call external services and APIs to get useful additional data to send back to users.

As an example, refer to `examples/sample.ts(.js)` files where it is defined a runnable simple BotFilter.

### [BotFilter Web API](#botfilter-api)

The BotFilter `listen()` method launches a Web server microservice, exposing the following API endpoints:

`POST /filter/request` - For a request BotFilter, it receives a `BotRequest` and returns a `BotRequest`.

`POST /filter/response` - For a response BotFilter, it receives a `BotResponse` and returns a `BotResponse`.

Detailed info and a Swagger based API description is always available at:

`http(s)://<Your-BotFilter-Host>:<port>/swagger.json`

---

## [Supported Bot / NLP Platforms](#botplatforms)

Next sections briefly provide some guidelines to integrate Bots built with the three supported platforms and using the default drivers / settings.

**N.B.: Vivocha can be integrated with any Bot Platform**, if you're using a platform different than the supported you need to write a driver and a BotManager to use BotRequest / BotResponse messages and communicate with the particular chosen Bot Platform. 

### [Dialogflow: integration guidelines](#dialogflow-guidelines)

[Dialogflow Bot Platform](https://dialogflow.com/) allows the creation of conversation flows using its nice Intents feature.
Feel free to build your conversation flow as you prefer, related to the specific Bot application domain, BUT, in order to properly work with Vivocha, taking advantage of the out-of-the-box support it provides, it is mandatory to follow the guidelines:

1. Must exists in Dialogflow an intent configured to be triggered by a start event. The start event name configured in a Dialogflow intent must exactly match the start event configured in Vivocha; Default is always: `start`.

2. At the end of each conversation branch designed in Dialogflow, the bot MUST set a special context named (exactly) `end`, to tell to Vivocha that Bot's task is finished and to terminate the chat conversation.

3. Data passed to the Bot through Vivocha drivers are always contained inside a special context named `SESSION_MESSAGE_DATA_PAYLOAD`. Thus, the Dialogflow bot can access to data "stored" in that particular context in each intent that needs to get information; i.e., to extract real-time data coming from BotFilters. If the bot implementation needs to extract passed data/parameters, it can access to that context through (for example) the expression: `#SESSION_MESSAGE_DATA_PAYLOAD.my_parameter_name` - see Dialogflow documentation).

#### [Dialogflow Hints & Tips](#dialogflow-hints)

In the Dialogflow console:

- Use the embedded Firebase Cloud Functions editor to write complex and effective fulfillments (like calling external APIs from the bot, transforming data and so on...); return `followUp` events to jump to a particular intent node in your bot;
- be careful using contexts, they are the only powerful and exclusive way to correlate intents and follow-up intents in a conversation;
- use slot-filling / parameters to collect data from the user.

---

### [IBM Watson Conversation: integration guidelines](#watson-guidelines)

[Watson Conversation](https://www.ibm.com/watson/services/conversation) provides a tool to create conversation flows: Dialogs.

1. Watson Conversation doesn't handle events, only messages, thus you must create an intent trained to understand the word "start“ (simulating an event, in this case).

2. To communicate that a conversation flow/branch is complete, in each leaf node of the Dialog node, set a context parameter to `true` named as specified by `endEventKey` property in the module constructor; **Important**: in order to use the default Vivocha driver, just set the `dataCollectionComplete` context parameter to `true` in each Watson Conversation Dialog leaf node; it can be set using the Conversation *JSON Editor* in a particular dialog node; like in:

```javascript
...
"context": {
    "dataCollectionComplete": true
}
...
```

3. If you need to perfom data collection tasks, remember that you have to configure the bot *slot-filling* feature in the nodes of the Dialog section.

#### [Watson Conversation Hints & Tips](#watson-hints)

Using the IBM Watson Conversation workspace:

- Slot-filling and parameters can be defined for every node in the Dialog tab;

- a slot-filling can be specified for every Dialog node and the JSON output can be configured using the related JSON Editor;

- An Entity can be of type `pattern`: this allows to define regex-based entities. To save in the context the entered value for a pattern entity it should be used the following syntax: `@NAME_OF_THE_ENTITY.literal`.

E.g., for slot filling containing a pattern entity like:

**Check for**: `@ContactInfo` - **Save it as**: `$email`

configure the particular slot through *Edit Slot > ... > Open JSON Editor* as:

```javascript
...
"context": {
    "email": "@ContactInfo.literal"
}
...
```

- In a Dialog node, if you need to quickly check if an entered input is included within a predefined list of values, you can use the following condition expression:

```javascript
"milan,cagliari,london,rome,berlin".split(",").contains(input.text.toLowerCase())
```

---

### [Wit.ai, writing chat bots](#witai-guidelines)

[Wit.ai](https://wit.ai) is a pure Natural Language Processing (NLP) platform. Using the Web console it is not possible to design Bot's dialog flows or conversations, anymore. Therefore, all the bot application logic, conversation flows, contexts and so on... (in other words: the Bot itself) must be coded outside, calling Wit.ai APIs (mainly) to process natural language messages coming from users. Creating an App in Wit.ai and training the system for the specific application domain, it is possible to let it processing messages and extract information from them, like (but not only): user intents end entities, along with their confidence value.

Skipping platform-specific details, in order to create Wit.ai Chat Bots and integrate them with the Vivocha Platform you have to:

1. Create and train a Wit.ai App, *naming intents* whcih will be used by the coded Bot;

2. Write the code of your Bot subclassing the `WitAiBot` class provided by this SDK, mapping intents defined in 1) to handler functions;

3. Run the coded Bot (Agent) using a BotManager and configure it using the Vivocha web console.

The next picture shows how this integration works:

| ![Wit.ai bots integration](https://cdn.rawgit.com/vivocha/bot-sdk/9d8cb4a0/docs/Wit.ai-Vivocha.png) |
|:---:|
| **FIGURE 3  - The Vivocha - Wit.ai integration model: subclassing to provided WitAiBot class it is possible to quickly code bots using Wit.ai NLP tool without writing specific API calls.** |

Subclassing the `WitAiBot` allows writing Bots using Wit.ai NLP.
Subclassing that class implies:

1. defining a `IntentsMap`: it maps intents names as coming from Wit.ai to custom intent handler functions. E.g, in the following (TypeScript) snippet are defined the required intents mapping to handle a simple customer info collection;

```javascript
export class SimpleWitBot extends WitAiBot {

    protected intents: IntentsMap = {
        provide_name: (data, request) => this.askEmailorPhone(data.entities, request),
        by_email: (data, request) => this.contactMeByEmail(data, request),
        by_phone: (data, request) => this.contactMeByPhone(data, request),
        provide_phone: (data, request) => this.providePhoneNumber(data.entities, request),
        provide_email: (data, request) => this.provideEmailAddress(data.entities, request),
        unknown: (data, request) => this.unknown(data, request)
    };
    ...

    // write intent handlers here...
}
```

Note that the `unknown` mapping is needed to handle all the cases when Wit.ai isn't able to extract an intent. For example, the associated handler function could reply with a message like the popular *"Sorry I didn’t get that!"* text ;)

2. implementing the `getStartMessage(request: BotRequest)` which is called by Vivocha to start a bot instance only at the very beggining of a conversation with a user;

More details can be found in the dedicated `examples/sample-wit.ts(.js)` sample files.

#### [Wit.ai & Vivocha Hint & Tips](#witai-hints)

- use BotRequest/BotResponse `context.contexts` array property to set contexts, in order to drive your bot in taking decisions about which conversation flow branch follow and about what reply to the user. To check contexts, the `WitAiBot`class provides the `inContext()` method. See the example to discover more;

- in each intent mapping handler which decides to terminate the conversation, remember to send back a response with the `event` property set to `end`.

---
