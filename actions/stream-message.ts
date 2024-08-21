"use server";

import { ChatMessage } from "@/app/chat/page";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";

export async function streamMessage(messages: ChatMessage[]) {
  const stream = createStreamableValue("");

  (async () => {
    const { textStream } = await streamText({
      model: openai("gpt-4o-mini"),
      messages: [{ role: "system", content: "You are a helpful assistant." }, ...messages]
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();

  return { output: stream.value };
}
