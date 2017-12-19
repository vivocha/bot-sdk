# Vivocha Bot SDK
*Javascript / Typescript SDK to create Vivocha Bot Agents and Filters*

---

This SDK allows to write Vivocha Bot Agents integrating existing bots, built and trained using your preferred bot platform (E.g., Dialogflow, IBM Watson Conversation, etc...).
Then, by creating a BotManager it is possible to register multi-platform bot implementations and let Vivocha communicate with them through a well-defined, clear and uniform message-based interface.

## Overview / the big picture

![Overview](https://cdn.rawgit.com/vivocha/bot-sdk/3f711793/docs/vivocha-bot-sdk.svg)


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


