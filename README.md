# Vivocha Bot SDK

_JavaScript / TypeScript SDK to create Bot Agents and Filters for the [Vivocha](https://www.vivocha.com) platform_.

| ![Logo](https://raw.githubusercontent.com/vivocha/bot-sdk/master/docs/bot-sdk.svg?sanitize=true) |
| :-----------------------------------------------------------------------------------: |
| [![NPM version](https://img.shields.io/npm/v/@vivocha/bot-sdk.svg?style=flat)](https://www.npmjs.com/package/@vivocha/bot-sdk)  [![Build Status](https://travis-ci.org/vivocha/bot-sdk.svg?branch=master)](https://travis-ci.org/vivocha/bot-sdk)  [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)|


---

**IMPORTANT: this version of the Bot SDK is a developer preview, which introduces some breaking changes. It is intended to be used with the new version of the Vivocha platform, currently under active development. Before using this SDK, please contact dev@vivocha.com.**

The Vivocha Bot SDK allows to write Vivocha Bot Agents integrating existing bots, built and trained using your preferred bot / NLP platform. E.g., Dialogflow, IBM Watson Assistant (formerly Conversation), Wit.ai, Microsoft Bot framework, etc...
Moreover, the SDK enables writing new bots from scratch or integrating virtually any API-based chatbot platform with Vivocha.

By creating a BotManager it is possible to register multi-platform bot implementations allowing the Vivocha Platform to communicate with them through a well-defined and uniform message-based API, providing a rich set of multi-media chat messages.

---

**Tested with Node.js version 12.x**.

To start with the Bot SDK it is recommended to:

- install it from NPM: `npm i @vivocha/bot-sdk`

or

- download the latest stable release from [here](https://github.com/vivocha/bot-sdk/releases)

---

## Table of Contents

- [Overview](https://github.com/vivocha/bot-sdk#overview)
- [Quick Start, by Example](https://github.com/vivocha/bot-sdk#quick-start-by-example)
  - [BotAgents and Manager](https://github.com/vivocha/bot-sdk#botagents-and-manager)
  - [BotFilters](https://github.com/vivocha/bot-sdk#botfilters)
- [BotAgent](https://github.com/vivocha/bot-sdk#botagent)
  - [BotRequest](https://github.com/vivocha/bot-sdk#botrequest)
    - [BotSettings](https://github.com/vivocha/bot-sdk#botsettings)
    - [BotEngineSettings](https://github.com/vivocha/bot-sdk#botenginesettings)
    - [BotRequest Example](https://github.com/vivocha/bot-sdk#botrequest-example)
  - [BotResponse](https://github.com/vivocha/bot-sdk#botresponse)
    - [BotResponse Examples](https://github.com/vivocha/bot-sdk#botresponse-examples)
  - [BotMessage](https://github.com/vivocha/bot-sdk#botmessage)
    - [Text Message](https://github.com/vivocha/bot-sdk#text-message)
    - [Postback Message](https://github.com/vivocha/bot-sdk#postback-message)
    - [Attachment Message](https://github.com/vivocha/bot-sdk#attachment-message)
    - [Action Message](https://github.com/vivocha/bot-sdk#action-message)
    - [IsWriting Message](https://github.com/vivocha/bot-sdk#iswriting-message)
    - [Location Message](https://github.com/vivocha/bot-sdk#location-message)
  - [MessageQuickReply](https://github.com/vivocha/bot-sdk#messagequickreply)
  - [MessageTemplate](https://github.com/vivocha/bot-sdk#messagetemplate)
  - [TemplateElement](https://github.com/vivocha/bot-sdk#templateelement)
  - [DefaultAction](https://github.com/vivocha/bot-sdk#defaultaction)
  - [Button](https://github.com/vivocha/bot-sdk#button)
    - [PostbackButton](https://github.com/vivocha/bot-sdk#postbackbutton)
    - [WebURLButton](https://github.com/vivocha/bot-sdk#weburlbutton)
    - [CustomEventButton](https://github.com/vivocha/bot-sdk#customeventbutton)
- [Bot Messages Utilities](https://github.com/vivocha/bot-sdk#bot-messages-utilities)
- [BotManager](https://github.com/vivocha/bot-sdk#botmanager)
  - [Registering a Bot Agent](https://github.com/vivocha/bot-sdk#registering-a-bot-agent)
  - [BotManager Web API](https://github.com/vivocha/bot-sdk#botmanager-web-api)
- [Bot Filters](https://github.com/vivocha/bot-sdk#bot-filters)
  - [BotFilter Web API](https://github.com/vivocha/bot-sdk#botfilter-web-api)
- [About Vivocha Bots and Transfers to Human Agents](https://github.com/vivocha/bot-sdk#about-vivocha-bots-and-transfers-to-human-agents)
- [Sending Attachments](https://github.com/vivocha/bot-sdk#sending-attachments)
- [Asynchronous Bot Responses](https://github.com/vivocha/bot-sdk#asynchronous-bot-responses)
- [Supported Bot and NLP Platforms](https://github.com/vivocha/bot-sdk#supported-bot-and-nlp-platforms)
  - [Dialogflow](https://github.com/vivocha/bot-sdk#dialogflow)
    - [Dialogflow V2](https://github.com/vivocha/bot-sdk#dialogflow-v2)
      - [Vivocha Bot Messages and Dialogflow V2](https://github.com/vivocha/bot-sdk#vivocha-bot-messages-and-dialogflow-v2)
      - [Data collection and Dialogflow System Entities](https://github.com/vivocha/bot-sdk#data-collection-and-dialogflow-system-entities)
      - [Dialogflow Constraints, Hints and Tips](https://github.com/vivocha/bot-sdk#dialogflow-constraints-hints-and-tips)
  - [IBM Watson Assistant](https://github.com/vivocha/bot-sdk#ibm-watson-assistant-integration-guidelines)
    - [Vivocha Rich Messages and Watson Assistant](https://github.com/vivocha/bot-sdk#vivocha-rich-messages-and-watson-assistant)
    - [Watson Assistant Hints and Tips](https://github.com/vivocha/bot-sdk#watson-assistant-hints-and-tips)
  - [Wit.ai, writing chat bots](https://github.com/vivocha/bot-sdk#witai-writing-chat-bots)
    - [Wit.ai Bot Configuration](https://github.com/vivocha/bot-sdk#witai-bot-configuration)
    - [Wit.ai with Vivocha Hint and Tips](https://github.com/vivocha/bot-sdk#witai-with-vivocha-hint-and-tips)
  - [Microsoft Bots](https://github.com/vivocha/bot-sdk#microsoft-bots)
    - [Using the Bot Framework version 4](https://github.com/vivocha/bot-sdk#using-the-bot-framework-version-4)
    - [Using the Bot Framework version 3](https://github.com/vivocha/bot-sdk#using-the-bot-framework-version-3)
- [Running BotManagers and BotFilters as AWS Lambdas](https://github.com/vivocha/bot-sdk#running-botmanagers-and-botfilters-as-aws-lambdas)
  - [Prerequisites](https://github.com/vivocha/bot-sdk#prerequisites)
  - [Writing a BotManager or a BotFilter as a Lambda Function](https://github.com/vivocha/bot-sdk#writing-a-botmanager-or-a-botfilter-as-a-lambda-function)
- [Running Tests](https://github.com/vivocha/bot-sdk#running-tests)

---

## [Overview](#overview)

The Vivocha platform provides out-of-the-box native support for chat bots built using [IBM Watson Assistant (formerly Conversation)](https://www.ibm.com/watson/services/conversation), [Dialogflow](https://dialogflow.com/) and [Microsoft Bot Framework](https://dev.botframework.com) platforms. This means that it is possible to integrate these particular bot implementations with Vivocha simply using the Vivocha configuration app and specificing few settings, like authentication tokens, and following some, very simple, mandatory guidelines when building the bot, at design time.
The first sections of this documentation focus on building custom Bot Agents using the Bot SDK, which allows to integrate them with the Vivocha system with ease and also provides a library to quickly write bots using the [Wit.ai](https://wit.ai) NLP platform.

The last sections of this guide are dedicated to the integration guidelines for chatbots built with the four supported platforms: IBM Watson Assistant (formerly Conversation), Dialogflow, Microsoft Bot Framework and Wit.ai and about how to transfer contacts from a bot to another agent.

The following picture shows an high-level overview of the Vivocha Bot SDK and its software components.

| ![Overview](https://cdn.rawgit.com/vivocha/bot-sdk/fd208ab2/docs/vivocha-bot-sdk.svg) |
| :-----------------------------------------------------------------------------------: |
|              **FIGURE 1 - Overview of the main modules of the Bot SDK**               |

## [Quick Start, by Example](#quick-start-by-example)

The `examples` folder contains some samples of Bot Managers, a Wit.ai Bot implementation and a Filter, along with some related HTTP requests to show how to call their APIs.

See:

- `sample`: dead simple bot Agent and Manager plus a Bot Filter, read and use the `examples/http-requests/sample.http` file to learn more and to run them;
- `dummy-bot`: a simple bot (Agent and Manager) able to understand some simple "commands" to return several types of messages, including quick replies and templates. You can run it and connect to Vivocha as a *custom* Bot Agent (read more [here](https://docs.vivocha.com/docs/vcb-external-services#section-bot-agents)), then just send to the bot the *fullhelp* text message by chat to discover its capabilities.
- `sample-wit`: a simple bot using the Wit.ai platform.

**TIP:** For a quick start learning about the format of requests, responses and messages body, including quick replies and templates, see the [Dummy Bot](https://github.com/vivocha/bot-sdk/blob/master/examples/dummy-bot.ts) code.

**IMPORTANT**: To learn how to connect a bot to the Vivocha Platform, start from the related [Vivocha Documentation](https://docs.vivocha.com/docs/vcb-external-services#section-bot-agents).

---

### [BotAgents and Manager](#botagents-and-manager)

**TL;DR**

A `BotAgent` represents and communicates with a particular Bot implementation platform.
A `BotManager` exposes a Web API acting as a gateway to registered `BotAgent`s.

Usually, the steps to use agents and managers are:

1. Write a `BotAgent` for every Bot/NLP platform you need to support, handling / wrapping / transforming messages of `BotRequest` and `BotResponse` types;
2. create a `BotAgentManager` instance;
3. register the `BotAgent`s defined in step 1) to the `BotAgentManager`, through the `registerAgent(key, botAgent)` method, where `key` (string) is the choosen bot engine (e.g, `DialogflowV2`, `Watson`, etc...) and `agent` is a `BotAgent` instance;
4. run the `BotAgentManager` service through its `listen()` method, it exposes a Web API;
5. call the Web API endpoints to send messages to the bot agents in a uniform way. The manager forwards the message to the right registered `BotAgent` thanks to the `engine.type` message property, used as `key` in step 3). The API is fully described by its OpenAPI 3.0 specification, available at `http://<BotAgentManager-Host>:<port>/openapi.json`.

---

### [BotFilters](#botfilters)

**TL;DR**

A `BotFilter` is a micro (web) service to filter/manipulate/enrich/transform `BotRequest`s and/or `BotResponse`s.
For example, a `BotFilter` can enrich a request calling an external API to get additional data before sending it to a BotAgent, or it can filter a response coming from a BotAgent to transform data before forwarding it to the user chat.

Basically, to write a filter you have to:

1. Instantiate a `BotFilter` specifying a `BotRequestFilter` or a `BotResponseFilter`. These are the functions containing your logic to manipulate/filter/enrich requests to bots and responses from them. Inside them you can call, for example, external web services, access to DBs, transform data and do whatever you need to do to achieve your application-specific goal. A `BotFilter` can provide a filter only for requests, only for responses or both;
2. run the `BotFilter` service through its `listen()` method, it exposes a Web API; the API is fully described by its OpenAPI specification, available at `http://<BotFilter-Host>:<port>/openapi.json`.

---

## [BotAgent](#botagent)

A `BotAgent` represents an abstract Bot implementation and it directly communicates with a particular Bot / NLP platform (like Dialogflow, IBM Watson Assistant, Microsoft Bots, and so on...).
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

| PROPERTY      | VALUE                                                                                           | DESCRIPTION                                                                                                                                                                                                                               |
| ------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`event`**   | string: `start` or `continue` or `end` or a custom string                                       | `start` event is sent to wake-up the Bot; `continue` tells the Bot to continue the conversation; `end` to set the conversation as finished; a custom string can be set for specific custom internal Bot functionalities.                  |
| `message`     | (optional) object, see **[BotMessage](https://github.com/vivocha/bot-sdk#botmessage)** below    | the message to send to the BotAgent                                                                                                                                                                                                       |
| `language`    | (optional) string. E.g., `en`, `it`, ...                                                        | language string, mandatory for some Bot platforms.                                                                                                                                                                                        |
| `data`        | (optional) object                                                                               | an object containing data to send to the Bot. Its properties must be of basic type. E.g., `{"firstname":"Antonio", "lastname": "Smith", "code": 12345}`                                                                                   |
| `context`     | (optional) object                                                                               | Opaque, Bot specific context data                                                                                                                                                                                                         |
| `tempContext` | (optional) object                                                                               | Temporary context, useful to store volatile data; i.e., in bot filters chains.                                                                                                                                                            |
| `environment` | (optional) object, see **[Environment](https://github.com/vivocha/bot-sdk#environment)**        | Vivocha specific environment data, sent by the platform, like: `host`, `acct`, `hmac`, `campaignId`, `channelId`, `entrypointId`, `engagementId`, `contactId`, `tags`, `token`, etc... For a bot used in data collections of type `Bot`, the `environment` object DOES NOT contain neither the `contactId` property (because it is a pre-contact task) nor the `token` property. The `token` property is sent by Vivocha only when `event` is `start`, and ONLY and ONLY IF the configured Bot URL is under **HTTPS**.|
| `settings`    | (optional) **[BotSettings](https://github.com/vivocha/bot-sdk#botsettings)** object (see below) | Bot platform settings.                                                                                                                                                                                                                    |

#### [BotMessage](#botmessage)

Some contents and definitions of the Vivocha Bot Messages are inspired by the [Facebook Messenger](https://developers.facebook.com/docs/messenger-platform/reference/) messages specification, but adapted and extended as needed by the Vivocha Platform.
Currently, messages' `quick_replies` and `template` properties are supported **ONLY** in BotResponses. Also messages of type **IsWriting** and **Action** are supported in BotResponses **ONLY**.

**Notes**: Generally speaking, while messages containing _quick replies_ or _templates_ have no particular constraints about the number of elements (and buttons, etc...), please take into consideration that Facebook Messenger have some contraints about them, i.e., in the number of quick replies or buttons per message; therefore, if you're supporting chats also through the Facebook Messenger channel, then you need to be compliant to its specification (more details about Messenger messages constraints can be found [here](https://developers.facebook.com/docs/messenger-platform/reference/)).
Anyway, in case of an exceeding number of elements, the Vivocha platform will trim them before sending to Messenger clients.

A BotMessage can be of five different types: **Text Message**, **Postback Message**, **Attachment Message**, **Action Message** and **IsWriting Message**.

##### [Text Message](#text-message)

A Text BotMessage can be used by a bot to send from simple, text-based messages to more complex messages containing quick replies and templates.

A Text Message has the following properties (required are in **bold**):

| PROPERTY                    | VALUE                                                                                                                                                                | DESCRIPTION                                                                                                                                                                 |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`code`**                  | string, value is always `message`                                                                                                                                    | Vivocha code type for Bot messages.                                                                                                                                         |
| **`type`**                  | string, value is `text`                                                                                                                                         | Vivocha Bot message type.                                                                                                                                                   |
| **`body`**                  | string                                                                                                                                                               | the message text body.                                                                                                                                                      |
| `payload`                   | (optional) string                                                                                                                                                    | a custom payload, usually used to send back the payload of a quick reply or of a postback button in a BotRequest, after the user clicks / taps the corresponding UI button. |
| `quick_replies_orientation` | (optional) string: `vertical` or `horizontal`                                                                                                                        | in case of a message with `quick_replies` it indicates the quick replies buttons group orientation to show in the client; default is `horizontal`. Orientation option is supported by the official Vivocha interaction.|
| `quick_replies`             | (optional) an array of **[MessageQuickReply](https://github.com/vivocha/bot-sdk#messagequickreply)** objects (see below) | an array of quick replies.                                                                                                                                                   |
| `template`                  | (optional) a **[MessageTemplate](https://github.com/vivocha/bot-sdk#messagetemplate)** object                | a template object.                                                                                                                                                  |
---

##### [Postback Message](#postback-message)

A Postback Message can be sent to a bot to convey a simple text content and, optionally, a custom payload.
Its properties are (required are in **bold**):

| PROPERTY                    | VALUE                                                                                                                                                                | DESCRIPTION                                                                                                                                                                 |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`code`**                  | string, value is always `message`                                                                                                                                    | Vivocha code type for Bot messages.                                                                                                                                         |
| **`type`**                  | string, set to `postback`                                                                                                                                         | Vivocha Bot message type.                                                                                                                                                   |
| **`body`**                  | string                                                                                                                                                               | the message text body.                                                                                                                                                      |
| `payload`                   | (optional) string                                                                                                                                                    | a custom payload, usually used to send back the payload of a postback button of a template. |
---

##### [Attachment Message](#attachment-message)

A message containing an attachment that can be sent/received to/from a bot to send files. See **[Sending Attachments](https://github.com/vivocha/bot-sdk#sending-attachments)** section in this document for more details about sending attachments to/from a bot.

Its properties are (required are in **bold**):

| PROPERTY                    | VALUE                                                                                                                                                                | DESCRIPTION                                                                                                                                                                 |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`code`**                  | string, value is always `message`                                                                                                                                    | Vivocha code type for Bot messages.                                                                                                                                         |
| **`type`**                  | string, value is `attachment`                                                                                                                                         | Vivocha Bot message type.                                                                                                                                                   |
| **`url`**                  | string   | the URL from which download the attachment.                                                                                                                                                      |
| **`meta`**                   | an object of **[Attachment Metadata](https://github.com/vivocha/bot-sdk#attachment-metadata)** type |  this object contains some metadata about the attachment being sent. |

---

##### [Attachment Metadata](#attachment-metadata)

Attachment metadata object.

Properties are (required are in **bold**):

| PROPERTY   | VALUE             | DESCRIPTION |
| ---------- | ----------------- | ----------- |
| **`mimetype`** | string           | MIME Type of the attachment|
| `originalUrl` | (optional) string | the original URL of the attachment. It could be different than the attachment `url` property value in case the attachment is being served by a CDN or remote storage|
| `originalUrlHash` | (optional) string | a hash related to the attachment, it will be automatically "calculated" by Vivocha platform |
| `originalId` | (optional) string | unique Id, automatically assigned by Vivocha when uploaded using the `BotAgentManager.uploadAttachment() method`|
| `originalName` | (optional) string | the original file name of the attachment |
| `desc` | (optional) string | brief description of the attachment |
| `size` | (optional) number | attachment size, as in normal HTTP Content-Length header |
| `ref` | (optional) string | A reference ID to correlate the attachment message. It can be used by the client to avoid showing the attachment message twice in the user chat widget. If not set, the Bot SDK will add it, generating an UUID as value |
---

##### [Action Message](#action-message)

An Action Message contains a custom action name with optional parameters that can be sent to a client (i.e. the Vivocha Interaction App or a mobile app) to mimic a Remote Procedure Call (RPC).

The Action Message has the following specific properties (required ones are in **bold**):

| PROPERTY                    | VALUE                                                                                                                                                                | DESCRIPTION                                                                                                                                                                 |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`code`**                  | string, value is always `message`                                                                                                                                    | Vivocha code type for Bot messages                                                                                                                                         |
| **`type`**                  | string, value is `action`                                                                                                                                         | Specific Vivocha Bot message type                                                                                                                                                  |
| **`action_code`**                  | string   | the custom action name (e.g, the remote procedure name)                                                                                                                                                     |
| **`args`**                   | an array of items of any type. Can be an empty array|  the args array eventually contains the arguments required by the specified `action_code` action (intended as a remote procedure to call). |

---

##### [IsWriting Message](#iswriting-message)

An IsWriting Message can be sent by a Bot in a BotResponse to tell/show in the user's chat that the bot is writing/preparing a response.

The IsWriting Message specific properties are the following (required are in **bold**):

| PROPERTY                    | VALUE                                                                                                                                                                | DESCRIPTION                                                                                                                                                                 |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`code`**                  | string, value is always `message`                                                                                                                                    | Vivocha code type for Bot messages                                                                                                                                         |
| **`type`**                  | string, value is `iswriting`                                                                                                                                         | Specific Vivocha Bot message type                                                                                                                                                  |

##### [Location Message](#location-message)

An Location Message contains a geo data with optional parameters that can be sent to a client (i.e. the Vivocha Interaction App or a mobile app) or to a Bot.

The Location Message has the following specific properties (required ones are in **bold**):

| PROPERTY                    | VALUE                                                                                                                                                                | DESCRIPTION                                                                                                                                                                 |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`code`**                  | string, value is always `message`                                                                                                                                    | Vivocha code type for Bot messages                                                                                                                                         |
| **`type`**                  | string, value is `location`                                                                                                                                         | Specific Vivocha Bot message type                                                                                                                                                  |
| **`longitude`**                  | number   | longitude value                                                                                                                                                     |
| **`latitude`**                   |  number |  latitude value  |
| `countryCode`                   |  (Optional) string |  code of the country |
| `countryName`                   |  (Optional) string |  name of the country |
| `region`                   |  (Optional) string |  region name |
| `city`                   |  (Optional) string |  name of the city |
| `accuracy`                   |  (Optional) number |  position accuracy |
| `timezone`                   |  (Optional) string |  timezone code |
| `speed`                   |  (Optional) number |  speed value |
| `altitude`                   |  (Optional) number |  altitude in meters |

---

##### [Environment](#environment)

Environment property contains Vivocha specific environment data, sent by the platform. See the table below for details about conveyed data.

**NB**:

- for a bot used in data collections of type `Bot`, the `environment` object DOES NOT contain neighter the `contactId` property (because it is a pre-contact task) nor the `token` property.
- The `token` property is sent by Vivocha only when `event` is `start`, and ONLY and ONLY IF the configured Bot URL is under **HTTPS**.

The `environment` object has the following properties, ALL OPTIONAL:

| PROPERTY                    | VALUE    | DESCRIPTION                                                                                                                                                                 |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| `host`                   | (optional) string                               | Vivocha server host |
| `acct` | (optional) string  | Vivocha account Id|
| `hmac`             | (optional) string | HMAC of the bot message                                                                                                                                                   |
| `caps`                  | (optional) a **[ChannelCapabilities](https://github.com/vivocha/bot-sdk#channel-capabilities)** object                | Capabilities of the channel through the end user contact has been created |
| `campaignId`| (optional) string | Id of the Vivocha Campaign from which the contact has been created |
| `channelId`| (optional) string | Id of the Vivocha Channel from which the contact has been created |
| `entrypointId`| (optional) string | Id of the Vivocha Campaign's Entrypoint by which the contact has been created |
| `engagementId`| (optional) string | Id of the Vivocha Engagement by which the contact has been created |
| `contactId`| (optional) string | Id of the contact |
| `token`| (optional) string | JWT to authenticate Vivocha API calls. The `token` property is sent by Vivocha only when `event` is `start`, and ONLY and ONLY IF the configured Bot URL is under **HTTPS**. In order to use it, the Bot MUST save it. |
| `tags`| (optional) an array of strings | Contact tags |
| `optionalTags`| (optional) an array of strings | Optional contact tags |
| `userAgent`| (optional) string | User Agent info |
| `geoIP`| (optional) a **[GeoIP](https://github.com/vivocha/bot-sdk#geoip)** object  | Geo IP information about the contact |
|`apiVersion`|(optional) string, like `v2`, `v3`, ...| when set it represents the Vivocha API version to call, if needed |
---

##### [Channel Capabilities](#channel-capabilities)

**TBD**

##### [GeoIP](#geoip)

GeoIP information about the contact. The GeoIP object has the following (ALL OPTIONAL) properties:

EnvironmentGeoIP {
  country_code?: string;
  country_name?: string;
  latitude?: number;
  longitude?: number;
  continent_code?: string;
  ip?: string;
  region?: string;
  city?: string;
  postal_code?: string;
  metro_code: string;
  time_zone: string;
}

| PROPERTY                    | VALUE    | DESCRIPTION                                                                                                                                                                 |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| `country_code`                   | (optional) string                               | Country code |
| `country_name` | (optional) string  | Country name|
| `latitude` | (optional) number  | Latitude|
| `longitude` | (optional) number  | Longitude|
| `continent_code` | (optional) string  | Code of the Continent|
| `ip` | (optional) string  | IP Address|
| `region` | (optional) string  | Name of the region|
| `city` | (optional) string  | City name|
| `postal_code` | (optional) string  | Postal Code for the City|
| `metro_code` | (optional) string  | Metro Code|
| `time_zone` | (optional) string  | Contact's timezone|

---

#### [BotSettings](#botsettings)

Bot platform settings object. Along with the `engine` property (see the table below), it is possible to set an arbitrarily number of properties. In case, it is responsability of the specific Bot implementation / platform to handle them.

| PROPERTY | VALUE                                                                                                       | DESCRIPTION                         |
| -------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| `engine` | (optional) **[BotEngineSettings](https://github.com/vivocha/bot-sdk#botenginesettings)** object (see below) | Specific Bot/NLP Platform settings. |
---

#### [BotEngineSettings](#botenginesettings)

Its properties are (required are in **bold**):

| PROPERTY   | VALUE             | DESCRIPTION                                                                                                                                                                                                                                                                                                                                                                                  |
| ---------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`type`** | string            | Unique bot engine identifier, i.e., the platform name, like: `Watson`, `DialogflowV2`, `WitAi`, `Microsoft`, `custom`, `mybot`, ...                                                                                                                                                                                                                                                                                            |
| `settings` | (optional) object | Specific settings to send to the BOT/NLP platform. E.g. for Watson Assistant (formerly Conversation) is an object like `{"workspaceId": "<id>" "username": "<usrname>", "password": "<passwd>"}`; for a Wit.ai bot is something like: `{"token": "<wit_token>"}`, and so on... You need to refer to the documentation of the specific Bot Platform used. |
---

#### [MessageQuickReply](#messagequickreply)

Its properties are (required are in **bold**):

| PROPERTY           | VALUE                           | DESCRIPTION                                                   |
| ------------------ | ------------------------------- | ------------------------------------------------------------- |
| **`content_type`** | string, accepted value: `text`  | Type of the content of the quick reply                        |
| **`title`**            | string               | title of the quick reply (usually is the text shown in the quick reply UI button)     |
| `payload`          | (optional) a string or a number | application specific value, string or number related to the quick reply |
| `image_url`        | (optional) string               | a URL of an image to be shown in the quick reply UI |
---

**Example 1**: A BotResponse message containing three simple **quick replies**

```javascript
{
    ...
    "messages": [
        {
            "code": "message",
            "type": "text",
            "body": "Just an example of quick replies... which color?",
            "quick_replies": [
                {
                    "content_type": "text",
                    "title": "Red",
                    "payload": "red 1"
                },
                {
                    "content_type": "text",
                    "title": "Blue",
                    "payload": "blue 2"
                },
                {
                    "content_type": "text",
                    "title": "White",
                    "payload": "white 3"
                }
            ]
        }
    ],
    "event": "continue",
    "data": {}
}
```

Which is rendered by the Vivocha interaction app like in the following screenshot:

| <img src="https://cdn.rawgit.com/vivocha/bot-sdk/79a72947/docs/quick-replies-h.png" width=300 /> |
| :----------------------------------------------------------------------------------------------: |
|                    **A BotResponse containing a message with quick replies**                     |

**Example 2**: A BotResponse message containing three **quick replies** with vertical orientation

```javascript
{
    ...
    "messages": [
        {
            "code": "message",
            "type": "text",
            "body": "Just an example of quick replies... which color?",
            "quick_replies": [
                {
                    "content_type": "text",
                    "title": "Red",
                    "payload": "red 1"
                },
                {
                    "content_type": "text",
                    "title": "Blue",
                    "payload": "blue 2"
                },
                {
                    "content_type": "text",
                    "title": "White",
                    "payload": "white 3"
                }
            ],
            "quick_replies_orientation": "vertical"
        }
    ],
    "event": "continue",
    "data": {}
}
```

Which is rendered by the Vivocha interaction app like in the following screenshot:

| <img src="https://cdn.rawgit.com/vivocha/bot-sdk/79a72947/docs/quick-replies-v.png" width=300 /> |
| :----------------------------------------------------------------------------------------------: |
|       **A BotResponse containing a message with quick replies with vertical orientation**        |

**Example 3**: A BotResponse message containing some **quick replies** with images

```javascript
{
    ...
    "messages": [
        {
            "code": "message",
            "type": "text",
            "body": "Choose a team member",
            "quick_replies": [
                {
                    "content_type": "text",
                    "title": "Federico",
                    "payload": "federico 1",
                    "image_url": "https://www.vivocha.com/wp-content/uploads/2017/03/team_federico.png"
                },
                {
                    "content_type": "text",
                    "title": "Andrea",
                    "payload": "andrea 2",
                    "image_url": "https://www.vivocha.com/wp-content/uploads/2017/03/team_andrea.png"
                },
                {
                    "content_type": "text",
                    "title": "Antonio",
                    "payload": "antonio 3",
                    "image_url": "https://www.vivocha.com/wp-content/uploads/2017/05/team-antonio.png"
                },
                {
                    "content_type": "text",
                    "title": "Marco",
                    "payload": "marco 4",
                    "image_url": "https://www.vivocha.com/wp-content/uploads/2017/03/Marco_Amadori.png"
                }
            ]
        }
    ],
    "event": "continue",
    "data": {}
}
```

Which is rendered by the Vivocha interaction app like in the following screenshot:

| <img src="https://cdn.rawgit.com/vivocha/bot-sdk/79a72947/docs/quick-replies-icons.gif" width=300 /> |
| :--------------------------------------------------------------------------------------------------: |
|          **A BotResponse containing a message with some quick replies containing an image**          |

---

#### [MessageTemplate](#messagetemplate)

Properties are (required are in **bold**):

| PROPERTY   | VALUE                                                                                                                                     | DESCRIPTION                                                                                                |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **`type`** | string, accepted values are: `generic` or `list`                                                                                          | Template type, currently only `generic` and `list` types are supported                                     |
| `elements` | (optional) an array of **[generic template Elements](https://github.com/vivocha/bot-sdk#templateelement)**                                | elements defined by **[TemplateElement](https://github.com/vivocha/bot-sdk#templateelement)** object specification |
| `buttons`  | (optional) only in case of a template where `type` == `list`, an array of **[Button](https://github.com/vivocha/bot-sdk#button)** objects | the buttons to display in the bottom part of the template.                                                 |
---

#### [TemplateElement](#templateelement)

Generally, a Template Element can be an object of any type, **BUT** if you want to use the out-of-the box templates rendering provided by the Vivocha interaction app, or the automatic template conversion implemented for some channels, you need to strictly follow the following specs:

in a Template Element only the property `title` is mandatory, but at least one optional property among the following must be set in addition to it.

| PROPERTY         | VALUE                                                                                   | DESCRIPTION                                                                                |
| ---------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **`title`**      | string                                                                                  | the text to display as title in the template rendering                                     |
| `subtitle`       | (optional) string                                                                       | an optional subtitle to display in the template                                            |
| `image_url`      | (optional) string                                                                       | a valid URL for an image to display in the template                                        |
| `default_action` | (optional) **[DefaultAction](https://github.com/vivocha/bot-sdk#defaultaction)** object | an object representing the default action to execute when the template is clicked / tapped |
| `buttons`        | (optional) an array of **[Button](https://github.com/vivocha/bot-sdk#button)** objects  | the buttons to display in the template element.                                            |
---

**Example 4**: A BotResponse message containing a _generic template_

```javascript
{
    ...
    "messages": [
        {
            "code": "message",
            "type": "text",
            "body": "Just an example of generic template:",
            "template": {
                "type": "generic",
                "elements": [
                    {
                        "title": "Meow!",
                        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Adult_Scottish_Fold.jpg/1920px-Adult_Scottish_Fold.jpg",
                        "subtitle": "We have the right cat for everyone.",
                        "default_action": {
                            "type": "web_url",
                            "url": "https://en.wikipedia.org/wiki/Cat"
                        },
                        "buttons": [
                            {
                                "type": "web_url",
                                "url": "https://en.wikipedia.org/wiki/Cat",
                                "title": "View Website"
                            },
                            {
                                "type": "postback",
                                "title": "OK",
                                "payload": "ok abcd 123"
                            }
                        ]
                    }
                ]
            }
        }
    ],
    "event": "continue",
    "data": {}
}
```

which is rendered by the Vivocha interaction app like in the following screenshot:

| <img src="https://cdn.rawgit.com/vivocha/bot-sdk/79a72947/docs/generic-template.png" width=300 /> |
| :-----------------------------------------------------------------------------------------------: |
|                  **A BotResponse message containing only one generic template**                   |

**Example 5**: A BotResponse message containing a **carousel of generic templates**

```javascript
{
    ...
    "messages": [
        {
            "code": "message",
            "type": "text",
            "body": "Just an example of generic template:",
            "template": {
                "type": "generic",
                "elements": [
                    {
                        "title": "Meow!",
                        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Adult_Scottish_Fold.jpg/1920px-Adult_Scottish_Fold.jpg",
                        "subtitle": "Scottish fold",
                        "default_action": {
                            "type": "web_url",
                            "url": "https://en.wikipedia.org/wiki/Cat"
                        },
                        "buttons": [
                            {
                                "type": "web_url",
                                "url": "https://en.wikipedia.org/wiki/Cat",
                                "title": "View Website"
                            },
                            {
                                "type": "postback",
                                "title": "OK",
                                "payload": "ok abcd 123"
                            }
                        ]
                    },
                    {
                        "title": "Meow!",
                        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Tajeschidolls_Beren_of_LoveLorien_Ragdoll_Seal_Mink_Lynx_Bicolor.jpg/1024px-Tajeschidolls_Beren_of_LoveLorien_Ragdoll_Seal_Mink_Lynx_Bicolor.jpg",
                        "subtitle": "Ragdoll",
                        "default_action": {
                            "type": "web_url",
                            "url": "https://en.wikipedia.org/wiki/Cat"
                        },
                        "buttons": [
                            {
                                "type": "web_url",
                                "url": "https://en.wikipedia.org/wiki/Cat",
                                "title": "View Website"
                            },
                            {
                                "type": "postback",
                                "title": "OK",
                                "payload": "ok abcd 123"
                            }
                        ]
                    }
                ]
            }
        }
    ],
    "event": "continue",
    "data": {}
}
```

Which is shown in the Vivocha web interaction app as in the following screenshot:

| <img src="https://cdn.rawgit.com/vivocha/bot-sdk/79a72947/docs/generic-template-carousel.gif" width=300 /> |
| :--------------------------------------------------------------------------------------------------------: |
|                    **A BotResponse message containing a carousel of generic templates**                    |

**Example 6**: A BotResponse message containing a **list template**

```javascript
{
    ...
    "messages": [
        {
            "code": "message",
            "type": "text",
            "body": "List template",
            "template": {
                "type": "list",
                "elements": [
                    {
                        "title": "Documentation part 1 - 2018",
                        "subtitle": "All documents about our products available in 2018. Advertisement, User's guides, technical info...",
                        "default_action": {
                            "type": "web_url",
                            "url": "https://www.vivocha.com"
                        }
                    },
                    {
                        "title": "Documentation part 2 - 2017",
                        "subtitle": "All documents about our products available in 2017. Advertisement, User's guides, technical info...",
                        "default_action": {
                            "type": "web_url",
                            "url": "https://www.vivocha.com"
                        }
                    },
                    {
                        "title": "Documentation part 3 - 2011-2016",
                        "subtitle": "All deprecated documents about old products no more available...",
                        "default_action": {
                            "type": "web_url",
                            "url": "https://www.vivocha.com"
                        }
                    }
                ],
                "buttons": [
                    {
                        "type": "postback",
                        "title": "More",
                        "payload": "view_more"
                    }
                ]
            }
        }
    ],
    "event": "continue",
    "data": {}
}
```

Which is rendered by the Vivocha interaction app like in the following screenshot:

| <img src="https://cdn.rawgit.com/vivocha/bot-sdk/79a72947/docs/list-template.png" width=300 /> |
| :--------------------------------------------------------------------------------------------: |
|                      **A BotResponse message containing a list template**                      |

**Example 7**: A BotResponse message containing a **list template with links (buttons)**

```javascript
{
    ...
   "messages": [
        {
            "code": "message",
            "type": "text",
            "body": "list template",
            "template": {
                "type": "list",
                "elements": [
                    {
                        "title": "Visit our website",
                        "subtitle": "All our products in one place. News, plans, tips, prices.",
                        "default_action": {
                            "type": "web_url",
                            "url": "https://www.pintux.it"
                        },
                        "buttons": [
                            {
                                "title": "View",
                                "type": "web_url",
                                "url": "https://www.pintux.it"
                            }
                        ]
                    },
                    {
                        "title": "Technical documentation",
                        "subtitle": "Technical info, API documentation, tutorials and more...",
                        "default_action": {
                            "type": "web_url",
                            "url": "https://www.lensculture.com"
                        },
                        "buttons": [
                            {
                                "title": "OK",
                                "type": "postback",
                                "payload": "OK-123"
                            }
                        ]
                    }
                ],
                "buttons": [
                    {
                        "type": "postback",
                        "title": "More",
                        "payload": "view_more"
                    }
                ]
            }
        }
    ],
    "event": "continue",
    "data": {}
}
```

Which is rendered by the Vivocha interaction app like in the following screenshot:

| <img src="https://cdn.rawgit.com/vivocha/bot-sdk/79a72947/docs/list-template-btn.png" width=300 /> |
| :------------------------------------------------------------------------------------------------: |
|             **A BotResponse message containing a list template with links (buttons)**              |

##### Custom Template Elements

If you provide a custom Template Element, you will need to customize also the end user interaction app, in order to properly show the custom template element as you have designed it.
An example of a custom Template Element can be found [here](https://github.com/vivocha/bot-sdk#using-the-bot-framework-version-4), where a custom message coming from a Microsoft Bot will be sent to the interaction app unchanged.

---

#### [DefaultAction](#defaultaction)

Properties are (required are in **bold**):


| PROPERTY   | VALUE                                    | DESCRIPTION                                           |
| ---------- | ---------------------------------------- | ----------------------------------------------------- |
| **`type`** | string, admitted value is only `web_url` | default action type, it always refers to a web URL |
| **`url`**  | string                                   | a valid URL to open in the browser when executing the default action |

---

#### [Button](#button)

A Button object can be one of the following types: **[PostbackButton](https://github.com/vivocha/bot-sdk#postbackbutton)**, **[WebURLButton](https://github.com/vivocha/bot-sdk#weburlbutton)** or a **[CustomEventButton](https://github.com/vivocha/bot-sdk#customeventbutton)**

##### [PostbackButton](#postbackbutton)

A postback button is used to send back to the bot a response made of a title and a payload.

Properties are (required are in **bold**):

| PROPERTY      | VALUE                            | DESCRIPTION                                                     |
| ------------- | -------------------------------- | --------------------------------------------------------------- |
| **`type`**    | string, always set to `postback` | the postback button type                                        |
| **`title`**   | string                           | the button text to display and to send back in the message body |
| **`payload`** | string                           | a custom payload to send back to the bot                        |
---

##### [WebURLButton](#weburlbutton)

A WebURL button is used to open a web page at the specified URL.

Properties are (required are in **bold**):

| PROPERTY    | VALUE                           | DESCRIPTION                                            |
| ----------- | ------------------------------- | ------------------------------------------------------ |
| **`type`**  | string, always set to `web_url` | the WebURL button type                                 |
| **`title`** | string                          | the button text to display                             |
| **`url`**   | string                          | the URL of the page to open when the button is pressed |
---

##### [CustomEventButton](#customeventbutton)

This button allows to fire a custom event in the website page where the Vivocha interaction app / chat is running.
In order to work, a _contact-custom-event_ must be configured in the particular Vivocha Campaign.

Properties are (required are in **bold**):

| PROPERTY    | VALUE                                                                 | DESCRIPTION                |
| ----------- | --------------------------------------------------------------------- | -------------------------- |
| **`type`**  | string, a custom type string **other than** `web_url` and `postback`   | the custom type            |
| **`title`** | string                                                                | the button text to display |
| `<custom_properties...>` | any type | additional data to set in the custom event `context.data` property |

**Example**: A BotResponse message containing a **CustomEventButton** with arbitrary custom properties

```javascript
{
    code: 'message',
    type: 'text',
    body: 'Just an event',
    template: {
      type: 'generic',
      elements: [
        {
          title: 'You can fire the following page events',
          buttons: [
            {
              type: 'page_event',
              reason: 'test',
              params: {
                a: 10,
                b: 'ok'
              },
              title: 'Fire a custom event'
            }
          ]
        }
      ]
    }
}

```

---

#### BotRequest Example

Example of a request sent to provide the name in a conversation with a Wit.ai based Bot.

```javascript
{
    "language": "en",
    "event": "continue",
    "message": {
        "code": "message",
        "type": "text",
        "body": "my name is Antonio Watson"
    },
    "settings": {
       "engine": {
          "type": "WitAi",
          "settings": {
            "token": "abcd-123"
          }
        }
    },
    "context": {
        "contexts": [
            "ask_for_name"
        ]
    }
}
```

---

### [BotResponse](#botresponse)

Responses are sent back by BotAgents, BotManagers and BotFilters to convey a Bot platform reply back to the Vivocha platform.

A BotResponse is a JSON with the following properties and it is similar to a `BotRequest`, except for some fields (in **bold** the required properties):

| PROPERTY      | VALUE                                                                                                               | DESCRIPTION                                                                                                                                                                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`event`**   | string: `continue` or `end`                                                                                         | `continue` event is sent back to Vivocha to continue the conversation, in other words it means that the bot is awaiting for the next user message; `end` is sent back with the meaning that Bot finished its tasks.                                    |
| `messages`    | (optional) an array of **[BotMessage](https://github.com/vivocha/bot-sdk#botmessage)** objects (same as BotRequest) | the messages sent back by the BotAgent including quick replies and templates with images, buttons, etc...                                                                                                                                            |
| `language`    | (optional) string. E.g., `en`, `it`, ...                                                                            | language string code                                                                                                                                                                                                                                 |
| `data`        | (optional) object                                                                                                   | an object containing data collected or computed by the Bot. Its properties must be of simple type. E.g., `{"firstname":"Antonio", "lastname": "Smith", "code": 12345, "availableAgents": 5}`                                                         |
| `context`     | (optional) object                                                                                                   | Opaque, Bot specific context data. The Vivocha platform will send it immutated to the Bot in the next iteration.                                                                                                                                     |
| `tempContext` | (optional) object                                                                                                   | Temporary context, useful to store volatile data, i.e., in bot filters chains.                                                                                                                                                                       |
| `raw`         | (optional) object                                                                                                   | raw, platform specific, unparsed bot response. The bot can fill it with arbitrary data or with the original response from a specific bot platform, for example. The `raw` property it will never be forwarded to the client (i.e., the Vivocha interaction app) but it can be used, for example, by response bot filters chains.                                                                                                                                                                                                  |
---

#### BotResponse Examples

An example of text response sent back by a Wit.ai based Bot.
It is related to the request in the BotRequest sample above in this document.

```javascript
{
  "event": "continue",
  "messages": [
    {
      "code": "message",
      "type": "text",
      "body": "Thank you Antonio Watson, do you prefer to be contacted by email or by phone?"
    }
  ],
  "data": {
    "name": "Antonio Watson"
  },
  "context": {
    "contexts": [
      "recontact_by_email_or_phone"
    ]
  },
  "raw": {
    "_text": "my name is Antonio Watson",
    "entities": {
      "contact": [
        {
          "suggested": true,
          "confidence": 0.9381,
          "value": "Antonio Watson",
          "type": "value"
        }
      ],
      "intent": [
        {
          "confidence": 0.9950627479,
          "value": "provide_name"
        }
      ]
    },
    "msg_id": "0ZUymTwNbUPLh6xp6"
  }
}
```

Another BotResponse example, including three **quick replies**:

```javascript
{
    "event": "continue",
    "messages": [
        {
            "code": "message",
            "type": "text",
            "body": "Hello Alice, please choose a color...",
            "quick_replies": [
                {
                    "content_type": "text",
                    "title": "Red",
                    "payload": "red"
                },
                {
                    "content_type": "text",
                    "title": "Blue",
                    "payload": "blue"
                },
                {
                    "content_type": "text",
                    "title": "White",
                    "payload": "white"
                }
            ]
        }
    ],
    "data": {
      "name": "Alice"
    }
}
```

A BotResponse including a **List Template**:

```javascript
{
    "event": "continue",
    "messages": [{
                    "code": "message",
                    "type": "text",
                    "body": "A list template",
                    "template": {
                        "type": "list",
                        "elements": [
                            {
                                "title": "Item 1",
                                "subtitle": "This is the subtitle for the item number one linked to the Vivocha website",
                                "default_action": {
                                    "type": "web_url",
                                    "url": "https://www.vivocha.com"
                                }
                            },
                            {
                                "title": "Item 2",
                                "subtitle": "This is the subtitle for the item number two linked to the Vivocha Tech blog",
                                "default_action": {
                                    "type": "web_url",
                                    "url": "http://tech.vivocha.com",
                                }
                            },
                            {
                                "title": "Item 3",
                                "subtitle": "This is the subtitle for the item number three linked to the Vivocha Team webpage",
                                "default_action": {
                                    "type": "web_url",
                                    "url": "https://www.vivocha.com/team"
                                }
                            }
                        ],
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "More",
                                "payload": "view_more"
                            }
                        ]
                    }
                }
    ],
    "data": {
      "name": "Alice"
    }
}
```

---

## [Bot Messages Utilities](#bot-messages-utilities)

The Bot SDK provides a `BotMessage` utility class to make easier "composing" some of the most frequently used Vivocha bot messages and messages elements.

The `BotMessage` class exposes the following (static) methods:

```javascript
BotMessage.createSimpleTextMessage(body: string): TextMessage
```

Creates and returns a [Text Message](https://github.com/vivocha/bot-sdk#text-message), given a string to use as the body of the message.

---

```javascript
BotMessage.createTextMessageWithQuickReplies(body: string, quickReplies: QuickReply[] | string[]): TextMessage
```

Creates and returns a [Text Message](https://github.com/vivocha/bot-sdk#text-message) with the `quick_replies` property set, given a string to use as the body of the message and an array of quick replies title strings or complete definition objects.

---

```javascript
BotMessage.createQuickReplies(quickReplies: QuickReply[] | string[]): MessageQuickReply[]
```

Creates and returns an array of correctly set [MessageQuickReply](https://github.com/vivocha/bot-sdk#messagequickreply), given an array of simplified quick replies definitions, or an array of strings to be used both as title and payload of a quick reply.
This methos is useful to create and set the `quick_replies` property of a TextMessage.

---

```javascript
BotMessage.createActionMessage(actionCode: string, args: any[] = []): ActionMessage
```

Creates and returns an [Action Message](https://github.com/vivocha/bot-sdk#action-message) given its `action_code` and (optionally) its `args`.

---

```javascript
BotMessage.createIsWritingMessage(): IsWritingMessage
```

Creates and returns an [IsWriting Message](https://github.com/vivocha/bot-sdk#iswriting-message).

---

```javascript
BotMessage.createWebUrlButton(title: string, url: string): WebUrlButton
```

Creates and returns a [WebURLButton](https://github.com/vivocha/bot-sdk#weburlbutton).

---

```javascript
BotMessage.createPostbackButton(title: string, payload: string): PostbackButton
```

Creates and returns a [PostbackButton](https://github.com/vivocha/bot-sdk#postbackbutton).

---

```javascript
BotMessage.createDefaultAction(url: string): DefaultAction
```

Creates and returns a [DefaultAction](https://github.com/vivocha/bot-sdk#defaultaction) object to be set in a Generic Template element.

```javascript
BotMessage.createLocationMessage(options: LocationMessageContent): DefaultAction
```

Creates and returns a [LocationMessage](https://github.com/vivocha/bot-sdk#location-message) given its content as `options`, where `LocationMessageContent` is an object defined as follows:

```javascript
{
  longitude: number;
  latitude: number;
  countryCode?: string;
  countryName?: string;
  region?: string;
  city?: string;
  accuracy?: number;
  timezone?: string;
  speed?: number;
  altitude?: number;
}
```

---
---

## [BotManager](#botmanager)

A `BotManager` is a bot registry microservice, which basically provides two main functionalities:

1. it allows to register an undefined number of `BotAgent`s;
2. it exposes a web API to send messages and receive responses to/from `BotAgent`s, acting as a gateway using a normalized interface.

### [Registering a Bot Agent](#registering-a-bot-agent)

In the code contained in the `examples` directory it is possible to read in detail how to create and register Bot Agents.
Briefly, to register a BotAgent, **[BotManager](https://github.com/vivocha/bot-sdk#botmanager)** provides a `registerAgent()` method:

```javascript
const manager = new BotAgentManager();
manager.registerAgent('custom', async (msg: BotRequest): Promise<BotResponse> => {

    // Bot Agent application logic goes here
    // I.e., call the specific Bot implementation APIs (e.g., Watson, Dialogflow, etc...)
    // adapting requests and responses.
    ...
}
```

The BotManager allows to register several BotAgents by specifying different `type` parameters (first param in `registerAgent()` method. E.g., `Watson`, `DialogflowV2`, `WitAi`, `custom`, `mySuperBot`, etc... ).
In this way it is possible to have a multi-bot application instance, the BotManager will forward the requests to the correct registered bot, matching the registered BotAgent `type` with the `settings.engine.type` property in incoming BotRequests.

### [BotManager Web API](#botmanager-web-api)

The BotManager `listen()` method starts a Web server microservice, exposing the following API endpoint:

**`POST /bot/message`** - Sends a `BotRequest` and replies with a `BotResponse`.

After launching a BotManager service, the detailed info, and the OpenAPI 3.0-based API description, are always available at URL:

`http(s)://<Your-BotAgentManager-Host>:<port>/openapi.json`

---

## [Bot Filters](#bot-filters)

BotFilters are Web (micro)services to augment or adapt or transform BotRequests before reaching a Bot, and/or to augment or adapt or transform BotResponses coming from a Bot before returning back them to the Vivocha platform. It is also possible to chain several BotFilters in order to have specialized filters related to the application domain.

Next picture shows an example of a BotFilters chain:

| ![BotFilters Chain](https://cdn.rawgit.com/vivocha/bot-sdk/dc4d07ff/docs/vivocha-BotFilters-Chain.svg) |
| :----------------------------------------------------------------------------------------------------: |
|                **FIGURE 2 - An example of a BotFilters chain configured using Vivocha**                |

The same BotFilter instance can act as a filter for requests, as a filter for responses or both.
See `BotFilter` class constructor to configure it as you prefer.

Figure 2 shows an example of a BotFilter chain: **BotFilters A**, **B** and **C** are configured to act as request filters; in other words they receive a BotRequest and return the same BotRequest maybe augmented with more data or transformed as a particular application requires. For example, **BotFilter A** may add data after reading from a DB, **BotFilter B** may call an API or external service to see if a given user has a premium account (consequentially setting in the request a `isPremium` boolean property), and so on...
When it's time to send a request to a BotAgent (through a BotManager), the Vivocha platform will **sequentially call** all the filters in the request chain before forwarding the resulting request to the Bot.

**BotFilter D** is a response filter and notice that **BotFilter A** is also configured to be a response filter; thus, when a response comes from the Bot, Vivocha **sequentially calls** all the response BotFilters in the response chain before sending back to a chat the resulting response. For example: a response BotFilter can hide or encrypt data coming from a Bot or it can on-the-fly convert currencies, or format dates or call external services and APIs to get useful additional data to send back to users.

As an example, refer to `examples/sample.ts(.js)` files where it is defined a runnable simple BotFilter.

### [BotFilter Web API](#botfilter-web-api)

The BotFilter `listen()` method runs a Web server microservice, exposing the following API endpoints:

**`POST /filter/request`** - For a **request BotFilter**, it receives a `BotRequest` and returns a `BotRequest`.

**`POST /filter/response`** - For a **response BotFilter**, it receives a `BotResponse` and returns a `BotResponse`.

After launching a BotFilter service, the detailed info, and the OpenAPI 3.0 description, are always available at URL:

`http(s)://<Your-BotFilter-Host>:<port>/openapi.json`

---

## [About Vivocha Bots and Transfers to Human Agents](#about-vivocha-bots-and-transfers-to-human-agents)

In the Vivocha model, a Bot is just like a "normal" agent, able to handle contacts, chat with users and also able to transfer a particular current contact to another agent (a human agent or, maybe, to another Bot). Configuring a Bot to fire a transfer to other agents in Vivocha is a quite straightforward process.

1. using the Vivocha console, configure the bot to manage transfers. A transfer can be of two types: _transfer to tag_ and _transfer to agent_. The former will fire a transfer to other agents having a specified tag where the latter only to a specific agent by (nick)name. Therefore, creating a transfer rule involves specifying a _data key_ (a property name) to be found in a `BotResponse` and its corresponding _value_ to check, plus the agents tag or nick name to transfer to. For example, the next picture shows a _transfer to tag_ Bot configuration which will be fired anytime the BotResponse `data` object contains a sub-property named `transferToAgent` set to `sales` in order to transfer the contact to an agent tagged with `sales`.

| ![A contact transfer configuration example](https://cdn.rawgit.com/vivocha/bot-sdk/e0746125/docs/transfer.png) |
| :-----------------: |
| **FIGURE 4 - Vivocha Bots can transfer contacts to other agents (human agents or, why not?, to another Bot) when necessary. This picture shows a transfer to tag Bot configuration fired anytime the `BotResponse` `data` object contains a sub-property named `transferToAgent` set to `sales`, in order to transfer the contact to another agent tagged with `sales`** |

2. when a transfer is required, the particular Bot implementation must return a BotResponse with: the `event` property set to `end` AND the `data` property containing the configured transfer sub-property (as `transferToAgent` in the previous example) set to the specified value. The following JSON snippet shows a BotResponse for the transfer configuration described in step 1)

```javascript
{
  "event": "end",
  "messages": [ {
    "code": "message",
    "type": "text",
    "body": "OK I'm transferring you to a sales agent. Bye! 😊"
  } ],
  "settings": {
    "engine": {
        "type": "custom",
        "settings": {...}
     }
  },
  "data": {
    "firstname": "Daenerys",
    "lastname": "Targaryen",
    ...
    "transferToAgent": "sales"
  }
}
```

**NOTES**:

- if your bot is built through the **IBM Watson Assistant** platform, and you're using the built-in Vivocha Watson integration, then set the transfer property directly as a context variable in the dialog node which ends the conversation and a transfer is required;

- if the bot is developed through the **Dialogflow platform**, and you're using the built-in Vivocha Dialogflow integration, then set the transfer property in the `parameters` property of a returned context (i.e., using a Firebase Cloud Functions-based fulfillment or using the *Action and parameters* section in the Dialogflow console);

- if the bot is written using **Wit.ai** and the module provided by this SDK, just return the transfer property in the BotResponse `data` field (see `examples/dummy-bot(.ts | .js)` code for the `transfer` case).

- if the bot is written using the **Microsoft Bot Framework** and you're using the built-in Vivocha driver, then see the dedicated **Transfer to other agents** chapter in the [Microsoft Bots](https://github.com/vivocha/bot-sdk#microsoft-bots) section of this document.

---

## [Sending Attachments](#sending-attachments)

When a bot based on the Vivocha Bot SDK needs to send an attachment to a chat user, there are two available options, depending on the will to save the attachment in the Vivocha Secure Storage before sending it to the final user or not.

### Sending Attachments using the Vivocha Secure Storage

This case is a two step process.
To upload the attachment a `token` is needed. At first (and **only the first time**), start message (`event === "start"` in the BotRequest), Vivocha sends in the `environment` BotRequest property also an authentication `token`; Bot implementations, whishing to use this feature, MUST save the token, i.e, adding it to `context` property in the resulting `BotResponse`, for later use.

1. **upload the attachment to the Vivocha Secure Storage**: the `BotAgentmanager` class provides the `uploadAttachment()` static method in order to save the attachment in the Vivocha Secure Storage. Its signature is as follows:

```javascript
static async uploadAttachment(attachmentStream: Stream, attachmentMeta: AttachmentMeta, environment: EnvironmentInfo): Promise<Attachment>
```

where:

- `attachmentStream` is a Node.js `Stream` from which read the attachment bytes. The Stream can be created from a file or from a remote URL, see `examples/dummy-bot.ts (.js)` for the code about these two cases;

- `attachmentMeta` is an object of type [Attachment Metadata](https://github.com/vivocha/bot-sdk#attachment-metadata). In this case it is enough to specify only the `mimetype` and `desc` properties, for example: `{ mimetype: 'image/jpeg', desc: 'Our 500 car in red color' }`;

- `environment`, the `environment` object property sent by Vivocha to the bot in each BotRequest that **MUST also include the `token` property**. At first (and **only the first time**), start message (`event === "start"` in the BotRequest), Vivocha sends in the `environment` BotRequest property also a `token`; Bot implementations, whishing to use this feature, MUST save this token and, in order to properly call this method, include it in the BotRequest `environment` property. Then, an example of correct `environment` param to call this method is something like:

```json
"environment": {
    "campaignId": "5bc...",
    "channelId": "web",
    "entrypointId": "1234",
    "engagementId": "5678",
    "contactId": "20166...ba",
    "host": "f11.vivocha.com",
    "acct": "acmecorp",
    "hmac": "bf51...b71",
    "token": "abcd.123.4567..."
}
```

The method will return a Promise containing an `Attachment` object.
The Vivocha `Attachment` object has the following properties:

| PROPERTY                    | VALUE            | DESCRIPTION   |
| --------------------------- | -----------------| ----------------------------------- |
| **`url`**                  | string   | the URL from which download the attachment from the Vivocha Secure Storage   |
| **`meta`**                 | an object of **[Attachment Metadata](https://github.com/vivocha/bot-sdk#attachment-metadata)** type |  this object contains metadata about the uploaded attachment. |

---

**N.B.** Uploading an attachment to Vivocha Secure Storage doesn't automatically result in sending an Attachment Message to the user. Thus, the step 2 below is needed:

2. **prepare and send a Vivocha Attachment Message**: using the `Attachment` object resulting from the `BotAgentmanager.uploadAttachment()` method invocation, compose and send an [Attachment Message](https://github.com/vivocha/bot-sdk#attachment-message) filling the required `url` and `meta` properties with the values of the corresponding properties in the `Attachment` object obtained from step 1.

**Example 8: Composing an Attachment Message (related to an image uploaded to Vivocha Secure Storage) in a BotResponse**:

```javascript
    ...
    const fileURL = 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Moon.jpg';
    const attachMeta = await BotAgentManager.uploadAttachment(request(fileURL) as Stream, { mimetype: 'image/jpeg', desc: 'Moon, not the dark side' }, environmentWithToken);
    const messages = [ {
        code: 'message',
        type: 'attachment',
        url: attachMeta.url,
        meta: attachMeta.meta
      } as AttachmentMessage
    ];
    const response: BotResponse = {
      messages,
      event: 'continue',
      context: {...},
      ...
    };
    
    // send back the BotResponse
    ...
```

In the example above, `request` is the [homonymous Node.js module](https://www.npmjs.com/package/request).


### Sending Attachments directly, not using the Vivocha Secure Storage

When uploading the attachment to Vivocha Secure Storage is not required and it's ok to send it through its public URL, then just send an **[Attachment Message](https://github.com/vivocha/bot-sdk#attachment-message)** using the original attachment info to send.

**Example 9: an Attachment Message (not being uploaded to Vivocha Secure Storage) in a BotResponse**:

```javascript
    ...
    "messages": [{
                    "code": "message",
                    "type": "attachment",
                    "url": "https://media.giphy.com/media/l1KsqYM8Zt3yG3tVS/giphy.gif",
                    "meta": {
                        "originalUrl": "",
                        "originalName": "Scream.gif",
                        "mimetype: 'image/gif"
                    }
              }];
    ...
```

---

## [Asynchronous Bot Responses](#asynchronous-bot-responses)

Generally, the Vivocha - Bots communication model is synchronous (request-response): Vivocha sends an HTTP request to a Bot(Manager, Agent) and it expects to receive a response within a standard HTTP timeout amount of time.

However, in some cases involving time-consuming long responses from a bot, it is needed to send back a BotResponse when available, following an asynchronous model.
This mode works as follows:

1. At first (and **only the first time**), start message (`event === "start"` in the BotRequest), Vivocha sends in the `environment` BotRequest property also a `token`; Bot implementations, whishing to use this feature, MUST save the token, i.e, adding it to `context` property in the resulting `BotResponse`.

Thus, an example of BotRequest `environment` for a start message could be:

```json
"environment": {
    "campaignId": "5bc...",
    "channelId": "web",
    "entrypointId": "1234",
    "engagementId": "5678",
    "contactId": "20166...ba",
    "host": "f11.vivocha.com",
    "acct": "acmecorp",
    "hmac": "bf51...b71",
    "token": "abcd.123.4567..."
}
```

2. At any time, when the bot implementation needs to send a BotResponse to Vivocha (then to the user), there are two options:

    **2.1. Invoke the `BotAgentManager.sendAsyncMessage()` static method**

    The method has the following signature:

    ```javascript
    static async sendAsyncMessage(response: BotResponse, environment: EnvironmentInfo): Promise<http.FullResponse>
    ```

    where:

    - `response` is a complete [BotResponse](https://github.com/vivocha/bot-sdk#botresponse)
    - `environment` is an environment object as above and **MUST include the `token` property**.

    And it returns a Promise with a `http.FullResponse` object containing the call result.


    **2.2. Directly call the following Vivocha API endpoint**:

    ```text
    POST https://<HOST>/a/<ACCOUNT_ID>/api/v3/contacts/<CONTACT_ID>/bot-response
    ```

    with HTTP **headers** containing the authentication as:

    ```text
    Authorization: Bearer <TOKEN>
    ```

    Where:

    - `HOST` is the `environment.host` property
    - `ACCOUNT_ID` is the `environment.acct` property
    - `CONTACT_ID` is the `environment.contactId` property
    - `TOKEN` is the `environment.token` property

    The **body** of the API call must contain a standard [BotResponse](https://github.com/vivocha/bot-sdk#botresponse).

---
---

## [Supported Bot and NLP Platforms](#supported-bot-and-nlp-platforms)

Next sections briefly provide some guidelines to integrate bots built using some supported platforms through **the Vivocha native built-in drivers / settings**.

**N.B.: Vivocha can be integrated with any Bot platform**, if you're using a platform different than the supported you need to write a driver able to receive / send Vivocha BotRequest / BotResponse messages and communicate with the particular, chosen, Bot Platform. This can be done using this Bot SDK.

### [Dialogflow](#dialogflow)

[Dialogflow Bot Platform](https://dialogflow.com) allows the creation of bot agents and conversation flows by its nice web console and related tools.

**IMPORTANT: V1 of Dialogflow's API is not longer available, and V1 bots DO NOT work with Vivocha anymore, as Google dismissed V1 API on October 23, 2019.**
Please migrate your existing Dialogflow bots to API V2 and properly (re)configure them in Vivocha.

It is **mandatory** to create a **Dialogflow V2** Vivocha Bot Agent for all new bots.

#### [Dialogflow V2](#dialogflow-v2)

**Dialogflow API V2 is the default version of Dialogflow's API**, which is enabled by default for all newly created bots. In order to configure a new Dialogflow Bot in the *Vivocha Campaign Builder* you need to generate and download the authentication & authorization credentials from the Google Cloud Platform. Next session describes how to obtain the Google credentials for Dialogflow API V2.

##### [Authentication and Configuration](#authentication-and-configuration)

Dialogflow API V2 abandons using an API token and introduces the [Google Cloud Platform Service Account](https://developers.google.com/identity/protocols/OAuth2ServiceAccount) authentication mechanism.

Briefly, to configure a Dialogflow V2 bot in Vivocha you need to configure the authentication in the Google Cloud Platform and to download the automatically generated JSON file, which contains the required credentials.
To generate the authentication file, you can follow this [Setting up authentication](https://dialogflow.com/docs/reference/v2-auth-setup) guide, following  steps from 1 to 11.

Summarizing, the required steps are:

1. create / migrate a Dialogflow bot to API V2;
2. enter in the *Google Cloud Platform*, clicking the *Project Id* name in Dialogflow settings;
3. Select *IAM and Admin* on the menu and create a new *Service Account*:

    3.1. enter a *name* for the service account;

    3.2. set a *role*: under Dialogflow, select *Dialogflow API Client*;

    3.3. create a key of type *JSON*; file download should start.

At the end of the process you can download a JSON file. Quoting the Google documentation: *you can only download this file once, so make sure to save the file and keep it somewhere safe. If you lose this key or it becomes compromised, you can use the same process to create another.*

Once you've downloaded the JSON file you can upload it in the related Bot Agent configuration page in the *Vivocha Campaign Builder > Library > External Services* section, be sure to select **Dialogflow V2** as Engine.

Also, set a *start event* for the bot, as described in the [Dialogflow Constraints, Hints and Tips](https://github.com/vivocha/bot-sdk#dialogflow-constraints-hints-and-tips) section below.

##### [Vivocha Bot Messages and Dialogflow V2](#vivocha-bot-messages-and-dialogflow-v2)

Thanks to the Vivocha built-in support for Dialogflow V2, it is possible to directly send responses containing Vivocha Bot Messages (bot messages format is described in detail **[in this section](https://github.com/vivocha/bot-sdk#botmessage)**).

To send Vivocha Bot Messages in a response from a Dialogflow _Intent_, just add a response with a _Custom payload_ by its console, and enter a valid JSON for the `messages` property, as required by the [Vivocha BotMessage](https://github.com/vivocha/bot-sdk#botmessage) format.

For example, the following valid snippet is related to a response from Dialogflow with a custom payload for a Vivocha Bot message containing a carousel of two templates:

```javascript
{
  "messages": [
    {
      "code": "message",
      "type": "text",
      "body": "Just an example of generic template",
      "template": {
        "type": "generic",
        "elements": [
          {
            "title": "Meow!",
            "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Tajeschidolls_Beren_of_LoveLorien_Ragdoll_Seal_Mink_Lynx_Bicolor.jpg/1024px-Tajeschidolls_Beren_of_LoveLorien_Ragdoll_Seal_Mink_Lynx_Bicolor.jpg",
            "subtitle": "We have the right cat for everyone.",
            "default_action": {
              "type": "web_url",
              "url": "https://en.wikipedia.org/wiki/Cat"
            },
            "buttons": [
              {
                "type": "web_url",
                "url": "https://en.wikipedia.org/wiki/Cat",
                "title": "View Website"
              },
              {
                "type": "postback",
                "title": "OK",
                "payload": "OK"
              }
            ]
          },
          {
            "title": "Meow!",
            "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Adult_Scottish_Fold.jpg/1920px-Adult_Scottish_Fold.jpg",
            "subtitle": "We have the right cat for everyone.",
            "default_action": {
              "type": "web_url",
              "url": "https://en.wikipedia.org/wiki/Cat"
            },
            "buttons": [
              {
                "type": "web_url",
                "url": "https://en.wikipedia.org/wiki/Cat",
                "title": "View Website"
              },
              {
                "type": "postback",
                "title": "OK",
                "payload": "OK"
              }
            ]
          }
        ]
      }
    }
  ]
}
```

While the following is an example of a Dialogflow response with a custom payload containing a Vivocha message with quick replies:

```javascript
{
  "messages": [
    {
      "code": "message",
      "type": "text",
      "body": "Hello from VVC Dialogflow V2, choose an action",
      "quick_replies": [
        {
          "content_type": "text",
          "title": "help",
          "payload": "help"
        },
        {
          "content_type": "text",
          "title": "exit",
          "payload": "exit"
        },
        {
          "content_type": "text",
          "title": "info",
          "payload": "info"
        }
      ]
    }
  ]
}
```

Sending a well-formed message enables the Vivocha interaction apps and widgets to correctly show these rich messages to the customer.

##### [Data collection and Dialogflow System Entities](#data-collection-and-dialogflow-system-entities)

Dialogflow's system entities are pre-built entities to facilitate handling the most popular common concepts and data types when extracting parameters, using slot-filling and handling entities and data, in general.

The Vivocha built-in Dialogflow V2 driver automatically parse all system entities that produce a result as: 

- a **string** (e.g., `@sys.any`, `@sys.date`, `@sys.address`, `@sys.color`, ...)
- a **number** (e.g., `@sys.number`, `@sys.ordinal`, ...)
- an **object** having the **amount** property (e.g., `@sys.age`, `@sys.unit-currency`, `@sys.temperature`, `@sys.duration`, ...).

In all the other cases, the resulting *object* produced by Dialogflow for the particular system entity will be stringified, and the Vivocha `BotResponse.data` property will contain it unchanged and "raw".
Read more about [Dialogflow System Entities](https://cloud.google.com/dialogflow-enterprise/docs/reference/system-entities) [here](https://cloud.google.com/dialogflow-enterprise/docs/reference/system-entities).

##### [Dialogflow Constraints, Hints and Tips](#dialogflow-constraints-hints-and-tips)

In order to seamlessly integrate a bot agent built with Dialogflow V2 with the Vivocha platform using the built-in driver, some contraints must be followed when creating the bot in the Dialogflow platform:

1. the bot MUST HAVE an intent triggerable by a **event** to start the conversation. Vivocha will trigger it as the very first step to wake-up the bot. Usually, the bot replies with a welcome message. The name given to such event must be set as the *start event* configuration property in the Vivocha Campaign Builder;

2. when the Dialogflow bot needs to **end the conversation** it must explicitely send an output context EXACTLY named *end*;

3. **only for a start event**, when needed, the Vivocha platform sends data parameters bound to that start event (For example, the data collected by a pre-contact form). Then, the bot can extract required data from it using Dialogflow expressions like `#START.myParameter`. During the conversation, instead, Vivocha always sends data as parameters conveyed by a special context named *VVC_DATA_PAYLOAD_CONTEXT*. To have access to the conveyed data on bot-side, set this context in intents' input contexts, as required by your bot agent. Data can be accessed using expressions like: `#VVC_DATA_PAYLOAD_CONTEXT.myParameter`;

4. when a message sent by Vivocha to the bot contains a *payload* (e.g., as resulting by pressing on a quick reply or on a postback button), data is set as the value of the property named *VVC_MessagePayload* in the parameters of the special context named *VVC_DATA_PAYLOAD_CONTEXT*; Thus, chat message payload can be accessed through the following Dialogflow expression: `#VVC_DATA_PAYLOAD_CONTEXT.VVC_MessagePayload`.

5. be careful using contexts, they are the only powerful and exclusive way to correlate intents and follow-up intents in a conversation to build the entire conversation flow and branches;

6. use slot-filling / parameters to collect data from the user; data will be collected by Dialogflow as parameters and set in the corresponding defined output contexts. Vivocha will automatically collect and set them in the Vivocha `BotResponse.data` property;

7. in order to require a transfer to another agent, in the particular intent the bot must set an output context named *end* and it must be be instructed to set a `transferToAgent` parameter with an arbitrary corresponding string value. Then, that value must be used in the transfer configuration in the Vivocha admin console, as described in the [Transfer to Human Agents section](https://github.com/vivocha/bot-sdk#about-vivocha-bots-and-transfers-to-human-agents).

---

### [IBM Watson Assistant: integration guidelines](#ibm-watson-assistant-integration-guidelines)

[Watson Assistant (formerly Conversation)](https://www.ibm.com/watson/services/conversation) provides a tool to create conversation flows: Dialogs.

**IMPORTANT**: Since the end of October 2019, the Vivocha native driver for Watson Assistant uses a *IAM/apikey-based authentication* and IBM Watson Assistant API v1. IBM deprecated the previous *username/password*-based authentication scheme. In order to properly configure a Watson Assistant Bot in the Vivocha Campaign Builder you will need its `workspaceId`, the `apikey` and the service `URL`, as provided by the IBM Watson Assistant dialogs web console.
Among them, you can also set a particular API version, which Vivocha will use when calling the IBM Watson Assistant API v1 endpoints.
If you don't have an `apikey`, remember that your old bots must be migrated as required by IBM, see [this post, for example](https://medium.com/ibm-watson/identity-and-access-management-updates-for-watson-services-12b6344b9cf).

Integration guidelines:

1. Watson Assistant doesn't handle events, only messages, thus you must create an intent trained to understand the word _start_ (simulating an event, in this case).

2. To communicate that a conversation flow/branch is complete, in each leaf node of the Dialog node, set a specific context parameter to `true` named as specified by `endEventKey` property in the module constructor; **Important**: in order to use the default Vivocha driver, just set the `dataCollectionComplete` context parameter to `true` in each Watson Assistant Dialog leaf node; it can be set using the Watson Assistant _JSON Editor_ for a particular dialog node; like in:

```javascript
...
"context": {
    "dataCollectionComplete": true
}
...
```

3. If you need to perfom data collection tasks, remember that you have to configure the bot _slot-filling_ feature in the dedicated nodes of the Dialog section.

4. When a message sent to the bot contains the `payload` property (like in the case when it is sent as a reaction to a postback button, for example) and it is sent through the default Vivocha drivers, then the message `payload` value will be passed to Watson Assistant as a context parameter named `VVC_MessagePayload`. Therefore, it can be retrieved and used as a variable or slot in the Watson Assistant bot logic.

#### [Vivocha Rich Messages and Watson Assistant](#vivocha-rich-messages-and-watson-assistant)

Thanks to the Vivocha built-in support for IBM Watson Assistant, it is possible to send from this bot platform responses containing rich Vivocha-compliant bot messages (bot messages format is described **[in this section](https://github.com/vivocha/bot-sdk#botmessage)**).

To send rich Vivocha messages as responses from the Watson platform, in its workspace console, _Dialog_ tab, select the particular dialog node, and in the _Then respond with_ section, open the embedded _JSON Editor_ and just add a response with a valid JSON object for the `messages` property, just inside the predefined `output` object (as defined by the Watson Assistant responses format).

For example, the following valid snippet is related to a response from a Watson Assistant bot, with a custom payload for a Vivocha Bot message containing a body along with three quick replies:

```javascript
{
  "output": {
    "messages": [
      {
        "body": "Hello from Watson, please choose an action",
        "code": "message",
        "type": "text",
        "quick_replies": [
          {
            "title": "help",
            "payload": "help",
            "content_type": "text"
          },
          {
            "title": "documents",
            "payload": "documents",
            "content_type": "text"
          },
          {
            "title": "exit",
            "payload": "exit",
            "content_type": "text"
          }
        ]
      }
    ]
  }
}
```

Sending a well-formed custom message enables the Vivocha interaction apps and widgets to correctly show these rich messages to the customer.

#### [Watson Assistant Hints and Tips](#watson-assistant-hints-and-tips)

Using the IBM Watson Assistant workspace:

- Slot-filling and parameters can be defined for every node in the Dialog tab;

- a slot-filling can be specified for every Dialog node and the JSON output can be configured using the related JSON Editor;

- An Entity can be of type `pattern`: this allows to define regex-based entities. To save in the context the entered value for a pattern entity it should be used the following syntax: `@NAME_OF_THE_ENTITY.literal`.

E.g., for slot filling containing a pattern entity like:

**Check for**: `@ContactInfo` - **Save it as**: `$email`

configure the particular slot through _Edit Slot > ... > Open JSON Editor_ as:

```javascript
...
"context": {
    "email": "@ContactInfo.literal"
}
...
```

- In a Dialog node, if you need to quickly check if an entered input is included within a predefined list of values, you can use the following condition expression:

```javascript
'milan,cagliari,london,rome,berlin'.split(',').contains(input.text.toLowerCase());
```

---

### [Wit.ai, writing chat bots](#witai-writing-chat-bots)

[Wit.ai](https://wit.ai) is a pure Natural Language Processing (NLP) platform. Using the Web console it is not possible to design Bot's dialog flows or conversations, anymore. Therefore, all the bot application logic, conversation flows, contexts and so on... (in other words: the Bot itself) must be coded outside, calling Wit.ai APIs (mainly) to process natural language messages coming from the users. Through creating an App in Wit.ai and training the system for the specific application domain, it is possible to let it processing messages and extract information from them, like (but not only): user intents end entities, along with their confidence value.

Skipping platform-specific details, in order to create Wit.ai Chat Bots and integrate them with the Vivocha Platform you have to:

1. Create and train a Wit.ai App, _naming intents_ that will be used by the coded Bot;

2. Write the code of your Bot subclassing the `WitAiBot` class provided by this SDK, mapping intents defined in 1) to handler functions;

3. Run the coded Bot (Agent) using a BotManager and configure it using the Vivocha web console.

The next picture shows how this integration works:

|                                             ![Wit.ai bots integration](https://cdn.rawgit.com/vivocha/bot-sdk/9d8cb4a0/docs/Wit.ai-Vivocha.png)                                             |
| :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| **FIGURE 3 - The Vivocha - Wit.ai integration model: subclassing to provided WitAiBot class it is possible to quickly code bots using Wit.ai NLP tool without writing specific API calls.** |

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

Note that the `unknown` mapping is needed to handle all the cases when Wit.ai isn't able to extract an intent. For example, the associated handler function could reply with a message like the popular _"Sorry I didn’t get that!"_ text ;)

2. implementing the `getStartMessage(request: BotRequest)` which is called by Vivocha to start a bot instance only at the very beggining of a conversation with a user;

More details can be found in the dedicated `examples/sample-wit.ts(.js)` sample files.

#### [Wit.ai Bot Configuration](#witai-bot-configuration)

In the *Vivocha Campaign Builder* configure a Bot Agent with *Engine == custom* and set a preferred string for *Engine type*. This string MUST be equal to the key provided to the `BotManager.registerAgent()` method in your bot code (see the `examples/sample-wit.ts(.js)` sample files). Moreover, configure the Bot Agent with the following JSON as settings:

```json
{
    "token": "<Wit.ai SERVER ACCESS TOKEN>"
}
```

where `<Wit.ai SERVER ACCESS TOKEN>` is the *Server (or Client) Access Token* provided by Wit.ai; it can be found in the *Wit Console > Settings*.

#### [Wit.ai with Vivocha Hint and Tips](#witai-with-vivocha-hint-and-tips)

- use BotRequest/BotResponse `context.contexts` array property to set contexts, in order to drive your bot in taking decisions about which conversation flow branch follow and about what reply to the user. To check contexts, the `WitAiBot`class provides the `inContext()` method. See the example to discover more;

- in each intent mapping handler which decides to terminate the conversation, remember to send back a response with the `event` property set to `end`.

---

### [Microsoft Bots](#microsoft-bots)

Vivocha provides built-in native support also for bots implemented using the **[Microsoft Bot Framework](https://dev.botframework.com) version 3 and 4** and deployed on Azure.

In particular, the integration is based on the **Microsoft Direct Line API 3.0 Channel**.

#### Prerequisites

- **[Direct Line 3.0 Channel](https://docs.microsoft.com/en-us/azure/bot-service/bot-service-channel-connect-directline) MUST be enabled** for the specific bot on Azure Bot Service.

#### Configuration

1. In the Microsoft Azure Bot Platform, for the target bot configure a **Direct Line 3.0 Channel**; specifying a *Site* name, thus two *secret keys* are generated and proposed
2. In Vivocha Campaign Builder > Library, create a BotAgent, with the following settings:

Settings:

| PROPERTY      | DESCRIPTION / VALUE  |
| --------------| -------------------------------------------------------------------------------------------------------------------|
| **Engine**    | Select **Microsoft** |
| **Direct Line Site Id**     | Site Id / name as set for Direct Line Channel in Microsoft Azure service |
| **Secret key**    |  One of the two Secret Keys generated by the Direct Line Channel configuration in Microsoft Azure service|
| **Start message**    | (Optional) the message to send to the Bot as start message. **N.B.**: the Bot must be properly written / trained to understand it and, usually, to reply with a welcome message. **If not set** (leaved empty), the Vivocha platform will send to the Microsoft Bot instance an Activity of type `conversationUpdate`, thus the bot should properly handle that Activity type and reply with a welcome message to be shown in the user's chat widget/app.  |
| **Auto convert messages**    | if **checked (default)** the native driver will convert the incoming MS Bot Messages to Vivocha Messages, if supported. If **not checked**, no conversion is attempted. For detailed info see **Supported Microsoft Bot Messages** section below in this chapter|
| **Transfer Key** | (Optional) the property key to expect in BotResponses `data` property to request a transfer to another agent. If not set, default is `transferToAgent` and it must be properly used in the Bot configuration in the Vivocha Agent Console. See **Transfer to Another Agent** section below in this chapter       |
| **Transfer value** | (Optional) the value of the configured **Transfer Key** property to expect in BotResponses `data` property to request a transfer to another agent. If not set, default is `AGENT` and it must be used in the Bot configuration in Agent Console. See the **Transfer to Another Agent** section below in this document |

---

### [Using the Bot Framework version 4](#using-the-bot-framework-version-4)

The following documentation and guidelines apply if you are developing the bot using the **Microsoft Bot Framework v. 4.x**.

#### Messages

Sending messages from a MS Bot to Vivocha can be achieved in three ways:

1. sending simple text messages from the Microsoft Bot;
2. sending more complex messages through the `attachments` property in MS Bot messages;
3. sending messages already expressed in the Vivocha Bot Message format, set directly inside the `channelData` property of the Microsoft Bot messages.

**Example: sending Vivocha Messages from the Bot using the `channelData` property in Microsoft Bot messages**:

```javascript
const chDataReply = { type: ActivityTypes.Message };
chDataReply.channelData = {
                      "messages": [ {
                      "code": "message",
                      "type": "text",
                      "body": "Just an example of generic template",
                      "template": {
                        "type": "generic",
                        "elements": [
                          {
                            "title": "Meow!",
                            "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Tajeschidolls_Beren_of_LoveLorien_Ragdoll_Seal_Mink_Lynx_Bicolor.jpg/1024px-Tajeschidolls_Beren_of_LoveLorien_Ragdoll_Seal_Mink_Lynx_Bicolor.jpg",
                            "subtitle": "We have the right cat for everyone.",
                            "default_action": {
                              "type": "web_url",
                              "url": "https://en.wikipedia.org/wiki/Cat"
                            },
                            "buttons": [
                              {
                                "type": "web_url",
                                "url": "https://en.wikipedia.org/wiki/Cat",
                                "title": "View Website"
                              },
                              {
                                "type": "postback",
                                "title": "OK",
                                "payload": "OK"
                              }
                            ]
                          },
                          {
                            "title": "Meow!",
                            "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Adult_Scottish_Fold.jpg/1920px-Adult_Scottish_Fold.jpg",
                            "subtitle": "We have the right cat for everyone.",
                            "default_action": {
                              "type": "web_url",
                              "url": "https://en.wikipedia.org/wiki/Cat"
                            },
                            "buttons": [
                              {
                                "type": "web_url",
                                "url": "https://en.wikipedia.org/wiki/Cat",
                                "title": "View Website"
                              },
                              {
                                "type": "postback",
                                "title": "OK",
                                "payload": "OK"
                              }
                            ]
                          }
                        ]
                      }
                    }
                  ]
};
await turnContext.sendActivity(chDataReply);
```

---

**Example: sending Vivocha Messages from the MS Bot using the `channelData` property in Microsoft Bot messages, also sending an end of conversation**:

```javascript
const chEndDataReply = { type: ActivityTypes.EndOfConversation };
chEndDataReply.channelData = {
                            "messages": [ {
                            "code": "message",
                            "type": "text",
                            "body": "Just an example of generic template",
                            "template": {
                              "type": "generic",
                              "elements": [
                                {
                                  "title": "Meow!",
                                  "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Tajeschidolls_Beren_of_LoveLorien_Ragdoll_Seal_Mink_Lynx_Bicolor.jpg/1024px-Tajeschidolls_Beren_of_LoveLorien_Ragdoll_Seal_Mink_Lynx_Bicolor.jpg",
                                  "subtitle": "We have the right cat for everyone.",
                                  "default_action": {
                                    "type": "web_url",
                                    "url": "https://en.wikipedia.org/wiki/Cat"
                                  },
                                  "buttons": [
                                    {
                                      "type": "web_url",
                                      "url": "https://en.wikipedia.org/wiki/Cat",
                                      "title": "View Website"
                                    },
                                    {
                                      "type": "postback",
                                      "title": "OK",
                                      "payload": "OK"
                                    }
                                  ]
                                },
                                {
                                  "title": "Meow!",
                                  "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Adult_Scottish_Fold.jpg/1920px-Adult_Scottish_Fold.jpg",
                                  "subtitle": "We have the right cat for everyone.",
                                  "default_action": {
                                    "type": "web_url",
                                    "url": "https://en.wikipedia.org/wiki/Cat"
                                  },
                                  "buttons": [
                                    {
                                      "type": "web_url",
                                      "url": "https://en.wikipedia.org/wiki/Cat",
                                      "title": "View Website"
                                    },
                                    {
                                      "type": "postback",
                                      "title": "OK",
                                      "payload": "OK"
                                    }
                                  ]
                                }
                              ]
                            }
                          }
                        ]
};
await turnContext.sendActivity(chEndDataReply);
```

---

#### Supported Microsoft Bot Messages

If `autoConvertMessages` property is checked in settings, the Vivocha Bot Driver will attempt to convert the messages coming from the bot and expressed in Microsoft Messages format to the Vivocha Bot messages specific format, if supported.
Then, the driver will act as follows:

##### Case 1: Messages Auto-convert is ON (checked)

The following table lists auto convert support current status of MS Bot messages:

| Microsoft Message Type           | Automatic Conversion                           | Converted to VVC Message          |
| ------------------ | ------------------------------- | -------------------------------------------------------------  |
| Adaptive Card      | No                              | -                                                              |
| **Animation Card** | Yes                             | Generic Template                                               |
| **Hero Card**      | Yes                              | Generic Template                                               |
| **Thumbnail Card** | Yes                             | Generic Template                                               |
| Receipt Card       | No                              | -                                                              |
| **Signin Card**    | Yes                             | Generic Template                                               |
| Video Card         | No                              | -                                                              |
| **Message with Actions**         | Yes                   | Message with Quick Replies                                     |
| **Message with Carousels**         | Yes                   | Message with multimple templates                             |

If the Bot sends an attachment with an unsupported Microsoft Message Type, then it is converted to a special Vivocha template element, which `type` is `ms_raw` and has the following properties:

```text
{
  "title": "Unsupported Microsoft Bot message type, you need to write a custom renderer. See the element property in raw JSON.",
  "type": "ms_raw",
  "element": < ORIGINAL RAW body of the Microsoft Bot Message Attachment >
}
```

In this way, the Vivocha interaction app can be customized to parse and render the specific `ms_raw` template element.

**Example: A full Vivocha Message resulting from converting an unsupported Microsoft Bot message attachment along with a supported one**

```json
{
  "messages": [
    {
      "code": "message",
      "type": "text",
      "template": {
        "type": "generic",
        "elements": [
          {
            "title": "Unsupported Microsoft Bot message type, you need to write a custom renderer. See the element property in raw JSON.",
            "type": "ms_raw",
            "element": {
              "contentType": "application/vnd.microsoft.card.video",
              "content": {
                "title": "Video",
                "subtitle": "No way.",
                "text": "not supported video card",
                "media": [{ "url": "https://media.giphy.com/media/eTdN7L04C6puE/giphy.gif" }],
                "buttons": [{ "type": "openUrl", "title": "Search GIFs", "value": "http://giphy.com" }],
                "shareable": false,
                "autoloop": false,
                "autostart": false
              }
            }
          },
          {
            "title": "Mia... rhjlkmyu",
            "subtitle": "glitch. Just new modern cat GIFs",
            "image_url": "https://media.giphy.com/media/ktvFa67wmjDEI/giphy.gif",
            "buttons": [{ "type": "web_url", "title": "Search GIFs", "url": "http://giphy.com" }]
          }
        ]
      }
    }
  ],
  "event": "continue",
  "data": {},
  "context": { "conversationId": "JOrLGNyvift87iQ1opfAJo" },
  "raw": {
    "activities": [
      {
        "type": "message",
        "id": "JOrLGNyvift87iQ1opfAJo|0000005",
        "timestamp": "2018-11-09T17:16:48.9957975Z",
        "localTimestamp": "2018-11-09T17:16:48.872+00:00",
        "channelId": "directline",
        "from": { "id": "vvc-echo-bot", "name": "vvc-echo-bot" },
        "conversation": { "id": "JOrLGNyvift87iQ1opfAJo" },
        "inputHint": "acceptingInput",
        "attachments": [
          {
            "contentType": "application/vnd.microsoft.card.video",
            "content": {
              "title": "Video",
              "subtitle": "No way.",
              "text": "not supported video card",
              "media": [{ "url": "https://media.giphy.com/media/eTdN7L04C6puE/giphy.gif" }],
              "buttons": [{ "type": "openUrl", "title": "Search GIFs", "value": "http://giphy.com" }],
              "shareable": false,
              "autoloop": false,
              "autostart": false
            }
          },
          {
            "contentType": "application/vnd.microsoft.card.animation",
            "content": {
              "title": "Mia... rhjlkmyu",
              "subtitle": "glitch.",
              "text": "Just new modern cat GIFs",
              "media": [{ "url": "https://media.giphy.com/media/ktvFa67wmjDEI/giphy.gif" }],
              "buttons": [{ "type": "openUrl", "title": "Search GIFs", "value": "http://giphy.com" }],
              "shareable": false,
              "autoloop": false,
              "autostart": false
            }
          }
        ],
        "replyToId": "JOrLGNyvift87iQ1opfAJo|0000004"
      }
    ],
    "conversationId": "JOrLGNyvift87iQ1opfAJo"
  }
}

```

##### Case 2: Message Auto-convert is OFF (unchecked)

When auto-convert messages is switched OFF, the Vivocha driver will not convert any message coming from the bot.
Instead, it generated a message with a special `ms_raw` template type containing the unparsed, raw, original Microsoft message.

The template format is as follows:

```text
{
      "code": "message",
      "type": "text",
      "template": {
        "type": "ms_raw",
        "elements": [
          < ORIGINAL RAW JSON Microsoft Bot Message body as object >
        ]
      }
```

Like in the following example:

**Example: a complete Vivocha message containing the *ms_raw* special template type when auto-convert of Microsoft messages is OFF**

```json
{
  "messages": [
    {
      "code": "message",
      "type": "text",
      "template": {
        "type": "ms_raw",
        "elements": [
          {
            "activities": [
              {
                "type": "message",
                "id": "8jiPwElwjZU49w8EMz1Zmb|0000003",
                "timestamp": "2018-11-09T17:35:46.5847969Z",
                "localTimestamp": "2018-11-09T17:35:46.448+00:00",
                "channelId": "directline",
                "from": { "id": "vvc-echo-bot", "name": "vvc-echo-bot" },
                "conversation": { "id": "8jiPwElwjZU49w8EMz1Zmb" },
                "inputHint": "acceptingInput",
                "attachments": [
                  {
                    "contentType": "application/vnd.microsoft.card.hero",
                    "content": {
                      "title": "Classic White T-Shirt",
                      "subtitle": "100% Soft and Luxurious Cotton",
                      "text": "Price is $25and carried in sizes (S, M, L, and XL)",
                      "images": [{ "url": "https://upload.wikimedia.org/wikipedia/commons/9/9a/Wikipedia-T-shirt.jpg" }],
                      "buttons": [{ "type": "imBack", "title": "Buy", "value": "Buy THIS" }]
                    }
                  }
                ],
                "replyToId": "8jiPwElwjZU49w8EMz1Zmb|0000002"
              }
            ],
            "conversationId": "8jiPwElwjZU49w8EMz1Zmb"
          }
        ]
      }
    }
  ],
  "event": "continue",
  "data": {},
  "context": { "conversationId": "8jiPwElwjZU49w8EMz1Zmb" },
  "raw": {
    "activities": [
      {
        "type": "message",
        "id": "8jiPwElwjZU49w8EMz1Zmb|0000003",
        "timestamp": "2018-11-09T17:35:46.5847969Z",
        "localTimestamp": "2018-11-09T17:35:46.448+00:00",
        "channelId": "directline",
        "from": { "id": "vvc-echo-bot", "name": "vvc-echo-bot" },
        "conversation": { "id": "8jiPwElwjZU49w8EMz1Zmb" },
        "inputHint": "acceptingInput",
        "attachments": [
          {
            "contentType": "application/vnd.microsoft.card.hero",
            "content": {
              "title": "Classic White T-Shirt",
              "subtitle": "100% Soft and Luxurious Cotton",
              "text": "Price is $25 and carried in sizes (S, M, L, and XL)",
              "images": [{ "url": "https://upload.wikimedia.org/wikipedia/commons/9/9a/Wikipedia-T-shirt.jpg" }],
              "buttons": [{ "type": "imBack", "title": "Buy", "value": "Buy THIS" }]
            }
          }
        ],
        "replyToId": "8jiPwElwjZU49w8EMz1Zmb|0000002"
      }
    ],
    "conversationId": "8jiPwElwjZU49w8EMz1Zmb"
  }
}

```

---

#### Data Collection with Microsoft Bot Framework 4

Data is collected by the Vivocha driver **only, and only if**:

- the Microsoft Bot Message has the `channelData.data` property set (an object)

**Example of sending a Microsoft Bot message with `channelData` set**

```javascript
// in the MS bot v4 implementation code
const activity = { type: ActivityTypes.EndOfConversation };
activity.channelData = {
                          "data": {
                                "transferToAgent": "AGENT",
                                "firstname": "Iggy",
                                "lastname": "Pop",
                                "email": "iguana@pop.com",
                                "issue": "Technical"
                          }
};
await turnContext.sendActivity(activity);
```

---

#### End of conversation messages and Vivocha `end event`

To end a conversation (thus, generating a `"event": "end"` in the resulting Vivocha BotResponse), the bot must return an `activity` with `activity.type` property set to `endOfConversation` in the Microsoft Bot message to be sent.

---

#### Transfer to other Agents

To request a transfer to another agent, the Microsoft Bot should return a text message with:

- `channelData.data` property containing a sub property as in:

```text
{
  ...
  <settings.transferKey>: <settings.transferValue>
}
```

where:

- `settings.transferKey` is the related property key configured for the particular bot
- `settings.transferValue` is the related property value configured for the particular bot

**example:**

```text
{"tranferToAgent": "human"}
```

**NB**: whether an `endOfConversation` message is sent by the bot or not, when the configured `settings.transferKey` is found to be equal to the configured `settings.transferValue`, then in the resulting Vivocha BotResponse the `event` property **is automatically always set** to `end`.

---

### [Using the Bot Framework version 3](#using-the-bot-framework-version-3)

The following documentation and guidelines apply if you are developing the bot using the **Microsoft Bot Framework v. 3.0**.

#### Messages

Sending messages from a MS Bot to Vivocha can be achieved in three ways:

1. sending simple text messages from the Microsoft Bot;
2. sending more complex messages through the `attachments` property in MS Bot messages;
3. sending messages already expressed in the Vivocha Bot Message format, set directly inside the `channelData` property of the Microsoft Bot messages.

**Example: sending Vivocha Messages from the Bot using the `channelData` property in Microsoft Bot messages**:

```javascript
let msg = {};
msg.text = 'Test custom channelData';
msg.channelData = {
                "messages": [ {
      "code": "message",
      "type": "text",
      "body": "Just an example of generic template",
      "template": {
        "type": "generic",
        "elements": [
          {
            "title": "Meow!",
            "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Tajeschidolls_Beren_of_LoveLorien_Ragdoll_Seal_Mink_Lynx_Bicolor.jpg/1024px-Tajeschidolls_Beren_of_LoveLorien_Ragdoll_Seal_Mink_Lynx_Bicolor.jpg",
            "subtitle": "We have the right cat for everyone.",
            "default_action": {
              "type": "web_url",
              "url": "https://en.wikipedia.org/wiki/Cat"
            },
            "buttons": [
              {
                "type": "web_url",
                "url": "https://en.wikipedia.org/wiki/Cat",
                "title": "View Website"
              },
              {
                "type": "postback",
                "title": "OK",
                "payload": "OK"
              }
            ]
          },
          {
            "title": "Meow!",
            "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Adult_Scottish_Fold.jpg/1920px-Adult_Scottish_Fold.jpg",
            "subtitle": "We have the right cat for everyone.",
            "default_action": {
              "type": "web_url",
              "url": "https://en.wikipedia.org/wiki/Cat"
            },
            "buttons": [
              {
                "type": "web_url",
                "url": "https://en.wikipedia.org/wiki/Cat",
                "title": "View Website"
              },
              {
                "type": "postback",
                "title": "OK",
                "payload": "OK"
              }
            ]
          }
        ]
      }
    }
  ]
};
session.send(msg);
```

---

**Example: sending Vivocha Messages from the MS Bot using the `channelData` property in Microsoft Bot messages, also sending an end of conversation**:

```javascript
var cmsg = {};
cmsg.type = 'endOfConversation';
cmsg.text = 'Test custom channelData';
cmsg.channelData = {
      "messages": [ {
      "code": "message",
      "type": "text",
      "body": "Just an example of generic template VVC2",
      "template": {
        "type": "generic",
        "elements": [
          {
            "title": "Meow!",
            "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Tajeschidolls_Beren_of_LoveLorien_Ragdoll_Seal_Mink_Lynx_Bicolor.jpg/1024px-Tajeschidolls_Beren_of_LoveLorien_Ragdoll_Seal_Mink_Lynx_Bicolor.jpg",
            "subtitle": "We have the right cat for everyone.",
            "default_action": {
              "type": "web_url",
              "url": "https://en.wikipedia.org/wiki/Cat"
            },
            "buttons": [
              {
                "type": "web_url",
                "url": "https://en.wikipedia.org/wiki/Cat",
                "title": "View Website"
              },
              {
                "type": "postback",
                "title": "OK",
                "payload": "OK"
              }
            ]
          },
          {
            "title": "Meow!",
            "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Adult_Scottish_Fold.jpg/1920px-Adult_Scottish_Fold.jpg",
            "subtitle": "We have the right cat for everyone.",
            "default_action": {
              "type": "web_url",
              "url": "https://en.wikipedia.org/wiki/Cat"
            },
            "buttons": [
              {
                "type": "web_url",
                "url": "https://en.wikipedia.org/wiki/Cat",
                "title": "View Website"
              },
              {
                "type": "postback",
                "title": "OK",
                "payload": "OK"
              }
            ]
          }
        ]
      }
    }
  ]
};
session.endConversation(cmsg);
```

---

#### Supported Microsoft Bot Messages

If `autoConvertMessages` property is checked in settings, the Vivocha Bot Driver will attempt to convert the messages coming from the bot and expressed in Microsoft Messages format to the Vivocha Bot messages specific format, if supported.
Then, the driver will act as follows:

##### Case 1: Messages Auto-convert is ON (checked)

The following table lists auto convert support current status of MS Bot messages:

| Microsoft Message Type           | Automatic Conversion                           | Converted to VVC Message          |
| ------------------ | ------------------------------- | -------------------------------------------------------------  |
| Adaptive Card      | No                              | -                                                              |
| **Animation Card** | Yes                             | Generic Template                                               |
| **Hero Card**      | Yes                              | Generic Template                                               |
| **Thumbnail Card** | Yes                             | Generic Template                                               |
| Receipt Card       | No                              | -                                                              |
| **Signin Card**    | Yes                             | Generic Template                                               |
| Video Card         | No                              | -                                                              |
| **Message with Actions**         | Yes                   | Message with Quick Replies                                     |
| **Message with Carousels**         | Yes                   | Message with multimple templates                             |

If the Bot sends an attachment with an unsupported Microsoft Message Type, then it is converted to a special Vivocha template element, which `type` is `ms_raw` and has the following properties:

```text
{
  "title": "Unsupported Microsoft Bot message type, you need to write a custom renderer. See the element property in raw JSON.",
  "type": "ms_raw",
  "element": < ORIGINAL RAW body of the Microsoft Bot Message Attachment >
}
```

In this way, the Vivocha interaction app can be customized to parse and render the specific `ms_raw` template element.

**Example: A full Vivocha Message resulting from converting an unsupported Microsoft Bot message attachment along with a supported one**

```json
{
  "messages": [
    {
      "code": "message",
      "type": "text",
      "template": {
        "type": "generic",
        "elements": [
          {
            "title": "Unsupported Microsoft Bot message type, you need to write a custom renderer. See the element property in raw JSON.",
            "type": "ms_raw",
            "element": {
              "contentType": "application/vnd.microsoft.card.video",
              "content": {
                "title": "Video",
                "subtitle": "No way.",
                "text": "not supported video card",
                "media": [{ "url": "https://media.giphy.com/media/eTdN7L04C6puE/giphy.gif" }],
                "buttons": [{ "type": "openUrl", "title": "Search GIFs", "value": "http://giphy.com" }],
                "shareable": false,
                "autoloop": false,
                "autostart": false
              }
            }
          },
          {
            "title": "Mia... rhjlkmyu",
            "subtitle": "glitch. Just new modern cat GIFs",
            "image_url": "https://media.giphy.com/media/ktvFa67wmjDEI/giphy.gif",
            "buttons": [{ "type": "web_url", "title": "Search GIFs", "url": "http://giphy.com" }]
          }
        ]
      }
    }
  ],
  "event": "continue",
  "data": {},
  "context": { "conversationId": "JOrLGNyvift87iQ1opfAJo" },
  "raw": {
    "activities": [
      {
        "type": "message",
        "id": "JOrLGNyvift87iQ1opfAJo|0000005",
        "timestamp": "2018-11-09T17:16:48.9957975Z",
        "localTimestamp": "2018-11-09T17:16:48.872+00:00",
        "channelId": "directline",
        "from": { "id": "vvc-echo-bot", "name": "vvc-echo-bot" },
        "conversation": { "id": "JOrLGNyvift87iQ1opfAJo" },
        "inputHint": "acceptingInput",
        "attachments": [
          {
            "contentType": "application/vnd.microsoft.card.video",
            "content": {
              "title": "Video",
              "subtitle": "No way.",
              "text": "not supported video card",
              "media": [{ "url": "https://media.giphy.com/media/eTdN7L04C6puE/giphy.gif" }],
              "buttons": [{ "type": "openUrl", "title": "Search GIFs", "value": "http://giphy.com" }],
              "shareable": false,
              "autoloop": false,
              "autostart": false
            }
          },
          {
            "contentType": "application/vnd.microsoft.card.animation",
            "content": {
              "title": "Mia... rhjlkmyu",
              "subtitle": "glitch.",
              "text": "Just new modern cat GIFs",
              "media": [{ "url": "https://media.giphy.com/media/ktvFa67wmjDEI/giphy.gif" }],
              "buttons": [{ "type": "openUrl", "title": "Search GIFs", "value": "http://giphy.com" }],
              "shareable": false,
              "autoloop": false,
              "autostart": false
            }
          }
        ],
        "replyToId": "JOrLGNyvift87iQ1opfAJo|0000004"
      }
    ],
    "conversationId": "JOrLGNyvift87iQ1opfAJo"
  }
}

```

##### Case 2: Message Auto-convert is OFF (unchecked)

When auto-convert messages is switched OFF, the Vivocha driver will not convert any message coming from the bot.
Instead, it generated a message with a special `ms_raw` template type containing the unparsed, raw, original Microsoft message.

The template format is as follows:

```text
{
      "code": "message",
      "type": "text",
      "template": {
        "type": "ms_raw",
        "elements": [
          < ORIGINAL RAW JSON Microsoft Bot Message body as object >
        ]
      }
```

Like in the following example:

**Example: a complete Vivocha message containing the special template type when auto-convert of Microsoft messages is OFF**

```json
{
  "messages": [
    {
      "code": "message",
      "type": "text",
      "template": {
        "type": "ms_raw",
        "elements": [
          {
            "activities": [
              {
                "type": "message",
                "id": "8jiPwElwjZU49w8EMz1Zmb|0000003",
                "timestamp": "2018-11-09T17:35:46.5847969Z",
                "localTimestamp": "2018-11-09T17:35:46.448+00:00",
                "channelId": "directline",
                "from": { "id": "vvc-echo-bot", "name": "vvc-echo-bot" },
                "conversation": { "id": "8jiPwElwjZU49w8EMz1Zmb" },
                "inputHint": "acceptingInput",
                "attachments": [
                  {
                    "contentType": "application/vnd.microsoft.card.hero",
                    "content": {
                      "title": "Classic White T-Shirt",
                      "subtitle": "100% Soft and Luxurious Cotton",
                      "text": "Price is $25and carried in sizes (S, M, L, and XL)",
                      "images": [{ "url": "https://upload.wikimedia.org/wikipedia/commons/9/9a/Wikipedia-T-shirt.jpg" }],
                      "buttons": [{ "type": "imBack", "title": "Buy", "value": "Buy THIS" }]
                    }
                  }
                ],
                "replyToId": "8jiPwElwjZU49w8EMz1Zmb|0000002"
              }
            ],
            "conversationId": "8jiPwElwjZU49w8EMz1Zmb"
          }
        ]
      }
    }
  ],
  "event": "continue",
  "data": {},
  "context": { "conversationId": "8jiPwElwjZU49w8EMz1Zmb" },
  "raw": {
    "activities": [
      {
        "type": "message",
        "id": "8jiPwElwjZU49w8EMz1Zmb|0000003",
        "timestamp": "2018-11-09T17:35:46.5847969Z",
        "localTimestamp": "2018-11-09T17:35:46.448+00:00",
        "channelId": "directline",
        "from": { "id": "vvc-echo-bot", "name": "vvc-echo-bot" },
        "conversation": { "id": "8jiPwElwjZU49w8EMz1Zmb" },
        "inputHint": "acceptingInput",
        "attachments": [
          {
            "contentType": "application/vnd.microsoft.card.hero",
            "content": {
              "title": "Classic White T-Shirt",
              "subtitle": "100% Soft and Luxurious Cotton",
              "text": "Price is $25 and carried in sizes (S, M, L, and XL)",
              "images": [{ "url": "https://upload.wikimedia.org/wikipedia/commons/9/9a/Wikipedia-T-shirt.jpg" }],
              "buttons": [{ "type": "imBack", "title": "Buy", "value": "Buy THIS" }]
            }
          }
        ],
        "replyToId": "8jiPwElwjZU49w8EMz1Zmb|0000002"
      }
    ],
    "conversationId": "8jiPwElwjZU49w8EMz1Zmb"
  }
}

```

---

#### Data Collection with Microsoft Bot Framework 3.0

Data is collected by the Vivocha driver **only, and only if**:

- the Microsoft Bot Message has the `entities` property set (an array)
- the Microsoft Bot Message has the `channelData.data` property set (an object)

**Example of sending a Microsoft Bot message with `Entities`**

```javascript
// inside the MS bot implementation code
let dmsg = new builder.Message(session);
dmsg.text('A message with entities');
dmsg.addEntity({color: 'RED', car: '500'});
session.send(dmsg);
```

**Example of sending a Microsoft Bot message with `channelData` set**

```javascript
// inside the MS bot implementation code
var sdmsg = {};
sdmsg.text = 'A message custom data in channelData property, see JSON';
sdmsg.channelData = {
  "data":{
    "firstname": "Iggy",
    "lastname": "Pop",
    "nickname": "Iguana"
  }
};
session.send(sdmsg);
```

---

#### End of conversation messages and Vivocha `end event`

To end a conversation (thus, generating a `"event": "end"` in the resulting Vivocha BotResponse), the bot must return an `activity` with `activity.type` property set to `endOfConversation` in the Microsoft Bot message to be sent.

---

#### Transfer to other Agents

To request a transfer to another agent, the Microsoft Bot should return a text message with:

- `channelData.data` property containing a sub property as in:

```text
{
  ...
  <settings.transferKey>: <settings.transferValue>
}
```

OR

- a message with an `entity` set to a JSON like:

```text
{<settings.transferKey>: <settings.transferValue>}
```

where:

- `settings.transferKey` is the related property key configured for the particular bot
- `settings.transferValue` is the related property value configured for the particular bot

**example:**

```text
{"tranferToAgent": "human"}
```

**NB**: whether an `endOfConversation` message is sent by the bot or not, when the configured `settings.transferKey` is found to be equal to the configured `settings.transferValue`, then in the resulting Vivocha BotResponse the `event` property **is always set** to `end`.

---
---

## [Running BotManagers and BotFilters as AWS Lambdas](#running-botmanagers-and-botfilters-as-aws-lambdas)

Starting from version 2.6.0, the Vivocha Bot SDK supports running **Bot Managers & Agents and Bot Filters as Lambda Functions** in **[AWS Lambda](https://aws.amazon.com/lambda)**, resulting in a great flexibility and scalability added by this serverless-applications platform.

In order to simplify the overall deployment process we use the **[Serverless Framework & Tools](https://serverless.com)**.

### [Prerequisites](#prerequisites)

1. an **Amazon Web Services (AWS)** valid account
2. your environment configured with _AWS credentials_ (please see [this page](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html) or [this guide](https://serverless.com/framework/docs/providers/aws/guide/credentials/))
3. the Serverless framework, thus install Serverless as global: `npm i -g serverless`

As a reference, the `examples` directory contains two Lambda functions:

- `lambda-bot-manager` is a Lambda-deployable Bot Manager for a dummy bot accepting some commands
- `lambda-bot-filter` is a BotFilter (same as in `sample.(ts|js)` file) deployable as AWS Lambda.

### [Writing a BotManager or a BotFilter as a Lambda Function](#writing-a-botmanager-or-a-botfilter-as-a-lambda-function)

As a recap for the previous sections, to run a Vivocha `BotManager` or a `BotFilter`, once having written the code you can call their `listen()` method, which runs a web server, and you're done.

To run them as a Lambda Function, basically you have to:

1. as always, install the `@vivocha/bot-sdk` and in your code, import `serverless` and `toLambda` from the Vivocha Bot SDK, like in the following snippet:

```javascript
import {BotFilter, BotRequest, ..., toLambda, serverless } from '@vivocha/bot-sdk';
```

2. Keep your existing BotManager and BotAgent or BotFilter code **BUT DON'T** invoke the `listen()` method, just add the following line at the end of the file:

```javascript
module.exports.handler = serverless(toLambda(manager));
```

where, in this case, `manager` is your `BotManager` instance.

3. In the project root directory, create a `serverless.yaml` file (or copy one of those contained in the `examples directory`, as mentioned before in this document). This file should have a configuration like the following (related to a BotFilter):

```yaml
# serverless.yml
# the name of your service (manager or filter) as in package.json
service: lambda-bot-filter
provider:
  name: aws
  # we need Node.js AWS environment set to v8.10
  runtime: nodejs8.10
  # stage name, change as you prefer, i.e.: prod
  stage: dev
  # AWS region, change it as needed
  region: us-west-2
  # Endpoint type, default is EDGE. Uncomment next line to deploy to closed gov clouds
  #endpointType: REGIONAL
  timeout: 30
functions:
  # name of your Lambda function
  lambda-bot-filter:
    description: Lambda-based Vivocha Bot Filter sample
    # name of the file/handler where you put the module.exports.handler=... statement
    handler: dist/lambda-bot-filter.handler
    events:
      # Configuration related to the API HTTP Gateway, leave it as follows, if possible.
      - http: 'ANY /'
      - http: 'ANY {proxy+}'
```

4. (optional) if you've written the code in TypeScript, then compile your code

5. run the command:

```sh
sls deploy
```

If the deploy process is successful, you should have an output like the following:

```text
service: lambda-bot-filter
stage: dev
region: us-west-2
stack: lambda-bot-filter-dev
api keys:
  None
endpoints:
  ANY - https://abcdef123kwc82.execute-api.us-west-2.amazonaws.com/dev
  ANY - https://abcdef123kwc82.execute-api.us-west-2.amazonaws.com/dev/{proxy+}
functions:
  lambda-bot-filter: lambda-bot-filter-dev-lambda-bot-filter
```

In the response above, AWS returned the endpoint base URL of our Lambda, thus **this is not the complete URL**.

Therefore, **for our BotFilter example**, the resulting complete filter endpoint URL to use in the Vivocha Bot configuration console will be:

`https://abcdef123kwc82.execute-api.us-west-2.amazonaws.com/dev/filter/request`

The process in case of a BotManager is the same.

Likewise, if you have deployed as Lambda a **BotManager** the complete endpoint URL to use will be something like the following:

`https://abcdef567kwc82.execute-api.us-west-2.amazonaws.com/dev/bot/message`

Done.

---
---

## [Running Tests](#running-tests)

In order to locally run the tests you need a [Wit.ai](https://wit.ai) account.

Then, in your Wit.ai console:

1. create a new app by **importing** the `/test/data/witai-test-app.zip` file, name it as you prefer;
2. in app _settings_ section, generate a _Client Access Token_, copy it;

Then, in your copy of the Bot SDK project:

3. create a `.env` file in the root directory
4. in the `.env` file add the following line:

```text
WIT_TOKEN=<YOUR_CLIENT_ACCESS_TOKEN> 
```

Save it.

5. run the tests with the command:

```sh
npm run test
```

OR (with coverage)

```sh
npm run cover
```