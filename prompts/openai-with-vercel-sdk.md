# OpenAI with Vercel SDK

The following are instructions on how to use the OpenAI API with the Vercel SDK to stream chat responses in a Next.js app.

## Setup

Notify the user in chat that they need to install the following packages:

```bash
npm i openai ai @ai-sdk/openai
```

## Example Frontend Usage

This is an example how to implement the frontend.

```tsx
"use client";

import { useState } from "react";
import { Message, continueConversation } from "./actions";
import { readStreamableValue } from "ai/rsc";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export default function Home() {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");

  return (
    <div>
      <div>
        {conversation.map((message, index) => (
          <div key={index}>
            {message.role}: {message.content}
          </div>
        ))}
      </div>

      <div>
        <input
          type="text"
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
          }}
        />
        <button
          onClick={async () => {
            const { messages, newMessage } = await continueConversation([...conversation, { role: "user", content: input }]);

            let textContent = "";

            for await (const delta of readStreamableValue(newMessage)) {
              textContent = `${textContent}${delta}`;

              setConversation([...messages, { role: "assistant", content: textContent }]);
            }
          }}
        >
          Send Message
        </button>
      </div>
    </div>
  );
}
```

## Example Backend Usage

This is an example how to implement the backend.

```ts
"use server";

import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { createStreamableValue } from "ai/rsc";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function continueConversation(history: Message[]) {
  "use server";

  const stream = createStreamableValue();

  (async () => {
    const { textStream } = await streamText({
      model: openai("gpt-3.5-turbo"),
      system: "You are a dude that doesn't drop character until the DVD commentary.",
      messages: history
    });

    for await (const text of textStream) {
      stream.update(text);
    }

    stream.done();
  })();

  return {
    messages: history,
    newMessage: stream.value
  };
}
```

## Relevant Docs

Below are some relevant docs for reference:

OpenAI Provider
The OpenAI provider contains language model support for the OpenAI chat and completion APIs and embedding model support for the OpenAI embeddings API.

Setup
The OpenAI provider is available in the @ai-sdk/openai module. You can install it with

pnpm
npm
yarn
pnpm add @ai-sdk/openai
Provider Instance
You can import the default provider instance openai from @ai-sdk/openai:

import { openai } from '@ai-sdk/openai';
If you need a customized setup, you can import createOpenAI from @ai-sdk/openai and create a provider instance with your settings:

import { createOpenAI } from '@ai-sdk/openai';

const openai = createOpenAI({
// custom settings, e.g.
compatibility: 'strict', // strict mode, enable when using the OpenAI API
});
You can use the following optional settings to customize the OpenAI provider instance:

baseURL string

Use a different URL prefix for API calls, e.g. to use proxy servers. The default prefix is https://api.openai.com/v1.

apiKey string

API key that is being send using the Authorization header. It defaults to the OPENAI_API_KEY environment variable.

organization string

OpenAI Organization.

project string

OpenAI project.

headers Record<string,string>

Custom headers to include in the requests.

fetch (input: RequestInfo, init?: RequestInit) => Promise<Response>

Custom fetch implementation. Defaults to the global fetch function. You can use it as a middleware to intercept requests, or to provide a custom fetch implementation for e.g. testing.

compatibility "strict" | "compatible"

OpenAI compatibility mode. Should be set to strict when using the OpenAI API, and compatible when using 3rd party providers. In compatible mode, newer information such as streamOptions are not being sent, resulting in NaN token usage. Defaults to 'compatible'.

Language Models
The OpenAI provider instance is a function that you can invoke to create a language model:

const model = openai('gpt-4-turbo');
It automatically selects the correct API based on the model id. You can also pass additional settings in the second argument:

const model = openai('gpt-4-turbo', {
// additional settings
});
The available options depend on the API that's automatically chosen for the model (see below). If you want to explicitly select a specific model API, you can use .chat or .completion.

Example
You can use OpenAI language models to generate text with the generateText function:

import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

const { text } = await generateText({
model: openai('gpt-4-turbo'),
prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
OpenAI language models can also be used in the streamText, generateObject, streamObject, and streamUI functions (see AI SDK Core and AI SDK RSC).

Model Capabilities
Model Image Input Object Generation Tool Usage Tool Streaming
gpt-4o
gpt-4o-mini
gpt-4-turbo
gpt-4
gpt-3.5-turbo
The table above lists popular models. You can also pass any available provider model ID as a string if needed.

Chat Models
You can create models that call the OpenAI chat API using the .chat() factory method. The first argument is the model id, e.g. gpt-4. The OpenAI chat models support tool calls and some have multi-modal capabilities.

const model = openai.chat('gpt-3.5-turbo');
OpenAI chat models support also some model specific settings that are not part of the standard call settings. You can pass them as an options argument:

const model = openai.chat('gpt-3.5-turbo', {
logitBias: {
// optional likelihood for specific tokens
'50256': -100,
},
user: 'test-user', // optional unique user identifier
});
The following optional settings are available for OpenAI chat models:

logitBias Record<number, number>

Modifies the likelihood of specified tokens appearing in the completion.

Accepts a JSON object that maps tokens (specified by their token ID in the GPT tokenizer) to an associated bias value from -100 to 100. You can use this tokenizer tool to convert text to token IDs. Mathematically, the bias is added to the logits generated by the model prior to sampling. The exact effect will vary per model, but values between -1 and 1 should decrease or increase likelihood of selection; values like -100 or 100 should result in a ban or exclusive selection of the relevant token.

As an example, you can pass {"50256": -100} to prevent the token from being generated.

logProbs boolean | number

Return the log probabilities of the tokens. Including logprobs will increase the response size and can slow down response times. However, it can be useful to better understand how the model is behaving.

Setting to true will return the log probabilities of the tokens that were generated.

Setting to a number will return the log probabilities of the top n tokens that were generated.

parallelToolCalls boolean

Whether to enable parallel function calling during tool use. Default to true.

useLegacyFunctionCalls boolean

Whether to use legacy function calling. Defaults to false.

Required by some open source inference engines which do not support the tools API. May also provide a workaround for parallelToolCalls resulting in the provider buffering tool calls, which causes streamObject to be non-streaming.

Prefer setting parallelToolCalls: false over this option.

structuredOutputs boolean

Whether to use structured outputs. Defaults to false.

When enabled, tool calls and object generation will be strict and follow the provided schema.

user string

A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. Learn more.

Structured Outputs
You can enable OpenAI structured outputs by setting the structuredOutputs option to true. Structured outputs are a form of grammar-guided generation. The JSON schema is used as a grammar and the outputs will always conform to the schema.

import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

const result = await generateObject({
model: openai('gpt-4o-2024-08-06', {
structuredOutputs: true,
}),
schemaName: 'recipe',
schemaDescription: 'A recipe for lasagna.',
schema: z.object({
name: z.string(),
ingredients: z.array(
z.object({
name: z.string(),
amount: z.string(),
}),
),
steps: z.array(z.string()),
}),
prompt: 'Generate a lasagna recipe.',
});

console.log(JSON.stringify(result.object, null, 2));
OpenAI structured outputs have several limitations, in particular around the supported schemas, and are therefore opt-in.

For example, optional schema properties are not supported. You need to change Zod .nullish() and .optional() to .nullable().

Completion Models
You can create models that call the OpenAI completions API using the .completion() factory method. The first argument is the model id. Currently only gpt-3.5-turbo-instruct is supported.

const model = openai.completion('gpt-3.5-turbo-instruct');
OpenAI completion models support also some model specific settings that are not part of the standard call settings. You can pass them as an options argument:

const model = openai.completion('gpt-3.5-turbo-instruct', {
echo: true, // optional, echo the prompt in addition to the completion
logitBias: {
// optional likelihood for specific tokens
'50256': -100,
},
suffix: 'some text', // optional suffix that comes after a completion of inserted text
user: 'test-user', // optional unique user identifier
});
The following optional settings are available for OpenAI completion models:

echo: boolean

Echo back the prompt in addition to the completion.

logitBias Record<number, number>

Modifies the likelihood of specified tokens appearing in the completion.

Accepts a JSON object that maps tokens (specified by their token ID in the GPT tokenizer) to an associated bias value from -100 to 100. You can use this tokenizer tool to convert text to token IDs. Mathematically, the bias is added to the logits generated by the model prior to sampling. The exact effect will vary per model, but values between -1 and 1 should decrease or increase likelihood of selection; values like -100 or 100 should result in a ban or exclusive selection of the relevant token.

As an example, you can pass {"50256": -100} to prevent the <|endoftext|> token from being generated.

logProbs boolean | number

Return the log probabilities of the tokens. Including logprobs will increase the response size and can slow down response times. However, it can be useful to better understand how the model is behaving.

Setting to true will return the log probabilities of the tokens that were generated.

Setting to a number will return the log probabilities of the top n tokens that were generated.

suffix string

The suffix that comes after a completion of inserted text.

user string

A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. Learn more.

Embedding Models
You can create models that call the OpenAI embeddings API using the .embedding() factory method.

const model = openai.embedding('text-embedding-3-large');
OpenAI embedding models support several aditional settings. You can pass them as an options argument:

const model = openai.embedding('text-embedding-3-large', {
dimensions: 512 // optional, number of dimensions for the embedding
user: 'test-user' // optional unique user identifier
})
The following optional settings are available for OpenAI embedding models:

dimensions: number

Echo back the prompt in addition to the completion.

user string

A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. Learn more.

Model Capabilities
Model Default Dimensions Custom Dimensions
text-embedding-3-large 3072
text-embedding-3-small 1536
text-embedding-ada-002 1536
