# Beginner AI Chat App

1. Create a new Next.js app

https://ui.shadcn.com/docs/installation/next

```bash
npx create-next-app@latest my-app --typescript --tailwind --eslint
```

2. Initialize Shadcn and install Button and Alert Dialog

```bash
npx shadcn-ui@latest init
```

```bash
npx shadcn-ui@latest add button alert-dialog
```

3. Install NPM Packages

```bash
npm i react-textarea-autosize ai @ai-sdk/openai remark-gfm react-markdown
npm i -D @tailwindcss/typography
```

4. Run the app

```bash
npm run dev
```

Go to localhost:3000 in your browser

5. Get an OpenAI API key and add it to a .env.local file

https://platform.openai.com/api-keys

Copy the .env.example file to .env.local

```bash
cp .env.example .env.local
```

Enter your OpenAI API key in the .env.local file

```bash
OPENAI_API_KEY=your_api_key_here
```

6. Create a actions/stream-message.ts file

```bash
touch actions/stream-message.ts
```

Copy the following code into the actions/stream-message.ts file

```ts
"use server";

import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";

export interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
}

export interface Chat {
  id: string;
  name: string;
  messages: ChatMessage[];
}

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
```

7. Clear the page.tsx file of the Next.js default content

8. Begin working on the page.tsx file

9. Enjoy!
