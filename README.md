# Vivocha Bot SDK
*Javascript / Typescript SDK to create Bot Agents and Filters for the [Vivocha](https://www.vivocha.com) platform
*

---

This SDK allows to write Vivocha Bot Agents integrating existing bots, built and trained using your preferred bot platform (E.g., Dialogflow, IBM Watson Conversation, etc...).
Then, by creating a BotManager it is possible to register multi-platform bot implementations and let Vivocha communicate with them through a well-defined, clear and uniform message-based interface.

## Overview / The Big Picture

The following picture shows an high-level overview of the Vivocha Bot SDK and its software components.

![Overview](https://cdn.rawgit.com/vivocha/bot-sdk/60ad7685/docs/vivocha-bot-sdk.svg)

### BotAgents and Manager TL;DR (how to use it)
A `BotAgent` represents and communicates with a particular Bot implementation platform.
A `BotManager` exposes a Web API acting as a gateway to registered `BotAgent`s.

Usually, the steps to use agents and managers are:

1. Write a `BotAgent` for every Bot/NLP platform you need to support, handling / wrapping messages of type `BotRequest` and `BotResponse`;
2. create a `BotAgentManager` instance;
3. register the `BotAgent`s defined at step 1) to the `BotAgentManager`, through the `registerAgent(key, botAgent)` method, where `key` is the choosen bot engine (e.g, `Dialogflow`, `Watson`, ...) and `agent` is a `BotAgent` instance;
4. run the `BotAgentManager` service through its `listen()` method, it exposes a Web API;
5. call the Web API endpoints to send messages to the bot agents in a uniform way. The manager forwards the message to the right registered `BotAgent` thanks to the `engine.type` message property, used as `key` in step 3). API is full described by its Swagger specification, available at `http://<BotAgentManager-Host>:<port>/swagger.json`.


### BotFilters TL;DR (how to use it)

A `BotFilter` is a Web service to filter/manipulate/enrich/transform `BotRequest`s and/or `BotResponse`s. 
For example, a `BotFilter` can enrich a request calling an external API to get additional data before sending it to a BotAgent, or it can filter a response coming form a BotAgent to transform data it contains before forwarding it to a user.

Basically, to write a filter you have to:

1. Instantiate a `BotFilter` specifying a `BotRequestFilter` or a `BotResponseFilter`. These are the functions containing your logic to manipulate/filter/enrich requests to bots and responses from them. Inside themyou can call external web services, transform data and do whatever you need to do to achieve your application-specific goal.
A `BotFilter` can provide a filter for only a request, only a response or both.
2. run the `BotFilter` service through its `listen()` method, it exposes a Web API; API is full described by its Swagger specification, available at `http://<BotFilter-Host>:<port>/swagger.json`.



---

## BotAgents

A `BotAgent` represents an abstract Bot implementation and it directly communicates with a particular Bot / NLP platform (like Dialogflow, IBM Watson Conversation and so on...).
In the Vivocha model, a Bot is represented by a function with the following signature:

In Typescript:

```javascript
(request: BotRequest): Promise<BotResponse>
```


In Javascript:

```javascript
let botAgent = async (request) => {
    // the logic to interact with the particular bot implementation
    // goes here, then produce a BotResponse message...
    ...    
    return response
}
```
### BotRequest
TBD
- messages
- EVENTS (important!)
- config
- engine
- etc...

### BotResponse
TBD


## BotManager

A Bot Manager is a registry microservice, which basically provides two main functionalities:

1. allows to register an undefined number of `BotAgent`s;
2. exposes a Web API to send messages and receive responses to/from `BotAgent`s, acting as a gateway using a normalized interface.


### Registering a Bot Agent
TBD

### Web API
TBD


---

## Bot Filters
TBD


