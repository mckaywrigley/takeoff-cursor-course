"use server";

import { ChatMessage } from "@/app/page";
import { createStreamableValue } from "ai/rsc";
import OpenAI from "openai";

const openai = new OpenAI();

export async function streamMessage(messages: ChatMessage[]) {
  const stream = createStreamableValue("");

  (async () => {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: "You are a helpful assistant." }, ...messages],
      stream: true
    });

    for await (const chunk of completion) {
      if (chunk.choices[0].delta.content) {
        stream.update(chunk.choices[0].delta.content);
      }
    }

    stream.done();
  })();

  return { output: stream.value };
}
