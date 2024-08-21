"use client";

import { Chat, ChatMessage, streamMessage } from "@/actions/stream-message";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { readStreamableValue } from "ai/rsc";
import { Menu, Plus, Send, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

export default function Home() {
  const [chats, setChats] = useState<Chat[]>(() => {
    if (typeof window !== "undefined") {
      const savedChats = localStorage.getItem("chats");
      return savedChats ? JSON.parse(savedChats) : [];
    }
    return [];
  });
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("chats", JSON.stringify(chats));
    }
  }, [chats]);

  const createNewChat = () => {
    const newChat: Chat = {
      id: new Date().toISOString(),
      name: `New Chat ${chats.length + 1}`,
      messages: []
    };
    setChats([...chats, newChat]);
    setCurrentChatId(newChat.id);
    setMessages([]);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !currentChatId) return;

    const newMessage: ChatMessage = {
      id: messages.length,
      role: "user",
      content: message
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");

    setChats((prevChats) => prevChats.map((chat) => (chat.id === currentChatId ? { ...chat, messages: [...chat.messages, newMessage] } : chat)));

    const { output } = await streamMessage([...messages, newMessage]);

    let fullResponse = "";
    for await (const delta of readStreamableValue(output)) {
      fullResponse += delta;
      setStreamingMessage(fullResponse);
    }

    const assistantMessage: ChatMessage = { id: messages.length + 1, role: "assistant", content: fullResponse };

    setMessages((prev) => [...prev, assistantMessage]);
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === currentChatId
          ? {
              ...chat,
              messages: [...chat.messages, assistantMessage]
            }
          : chat
      )
    );
    setStreamingMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDeleteChat = (chatId: string) => {
    setChats((prevChats) => prevChats.filter((chat) => chat.id !== chatId));
    if (currentChatId === chatId) {
      setCurrentChatId(null);
      setMessages([]);
    }
    setChatToDelete(null);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex">
      {sidebarOpen ? (
        <div className="w-[300px] bg-gray-800 p-4 relative">
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 left-4 p-2 bg-gray-700 rounded hover:bg-gray-600"
          >
            <Menu size={24} />
          </button>
          <button
            onClick={createNewChat}
            className="absolute top-4 right-4 p-2 bg-gray-700 rounded hover:bg-gray-600"
          >
            <Plus size={24} />
          </button>
          <h2 className="text-xl font-semibold mt-16 mb-4">Chats</h2>
          <ul>
            {chats
              .slice()
              .reverse()
              .map((chat) => (
                <li
                  key={chat.id}
                  className={`cursor-pointer p-2 rounded ${chat.id === currentChatId ? "bg-gray-700" : "hover:bg-gray-700"} group flex justify-between items-center`}
                  onClick={() => {
                    setCurrentChatId(chat.id);
                    setMessages(chat.messages);
                  }}
                >
                  {chat.name}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setChatToDelete(chat.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2
                          size={18}
                          className="text-gray-400 hover:text-red-500"
                        />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone. This will permanently delete the chat.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setChatToDelete(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteChat(chat.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </li>
              ))}
          </ul>
        </div>
      ) : (
        <button
          onClick={() => setSidebarOpen(true)}
          className="absolute top-4 left-4 p-2 bg-gray-700 rounded hover:bg-gray-600 z-10"
        >
          <Menu size={24} />
        </button>
      )}
      <div className="flex-1 p-4 flex flex-col items-center">
        <div className="w-full max-w-[800px] flex flex-col h-full">
          <h1 className="text-4xl font-bold mb-4">Chat</h1>

          <div className="flex-1 overflow-y-auto mb-4 bg-gray-800 rounded-lg p-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-4 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <p className={`${msg.role === "user" ? "bg-blue-500 ml-auto" : "bg-green-500"} text-white p-2 rounded-lg inline-block max-w-[70%]`}>{msg.content}</p>
              </div>
            ))}
            {streamingMessage && (
              <div className="mb-4 flex justify-start">
                <p className="bg-green-500 text-white p-2 rounded-lg inline-block max-w-[70%]">{streamingMessage}</p>
              </div>
            )}
          </div>

          <div className="relative">
            <TextareaAutosize
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="w-full bg-gray-800 text-white p-3 pr-12 rounded-lg resize-none"
              minRows={1}
              maxRows={5}
            />
            <button
              className="absolute right-2 bottom-2 p-2 bg-blue-500 rounded-full hover:bg-blue-600"
              onClick={handleSendMessage}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
