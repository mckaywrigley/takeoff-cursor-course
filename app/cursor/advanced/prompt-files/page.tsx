"use client";

import { readStreamableValue } from "ai/rsc";
import { useState } from "react";
import { Message, continueConversation } from "./actions";

export default function PromptFiles() {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Prompt Files</h1>

      <div className="mb-4 space-y-2">
        {conversation.map((message, index) => (
          <div
            key={index}
            className={`p-2 rounded ${message.role === "user" ? "bg-blue-100" : "bg-green-100"}`}
          >
            <strong>{message.role}:</strong> {message.content}
          </div>
        ))}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow border rounded p-2"
          placeholder="Type your message..."
        />
        <button
          onClick={async () => {
            const { messages, newMessage } = await continueConversation([...conversation, { role: "user", content: input }]);
            let textContent = "";
            for await (const delta of readStreamableValue(newMessage)) {
              textContent = `${textContent}${delta}`;
              setConversation([...messages, { role: "assistant", content: textContent }]);
            }
            setInput("");
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
