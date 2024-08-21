"use client";

import { streamMessage } from "@/actions/stream-message";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { readStreamableValue } from "ai/rsc";
import { Ellipsis, Send, Sidebar, SquarePen, Trash2, WandSparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import ReactTextareaAutosize from "react-textarea-autosize";
import remarkGfm from "remark-gfm";

export interface Chat {
  id: number;
  name: string;
  messages: ChatMessage[];
  createdAt: number;
}

export interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasBegunGenerating, setHasBegunGenerating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<number | null>(null);
  const [clearChatsDialogOpen, setClearChatsDialogOpen] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    const savedChats = localStorage.getItem("chats");
    if (savedChats) {
      const parsedChats = JSON.parse(savedChats);
      setChats(parsedChats.sort((a: Chat, b: Chat) => b.createdAt - a.createdAt));
      if (parsedChats.length > 0) {
        setCurrentChatId(parsedChats[0].id);
        setMessages(parsedChats[0].messages);
      }
    }
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentChatId]);

  const saveChatsToLocalStorage = (updatedChats: Chat[]) => {
    localStorage.setItem("chats", JSON.stringify(updatedChats));
  };

  const handleCreateChat = () => {
    if (isGenerating) return;
    const newChat: Chat = {
      id: Date.now(),
      name: `Chat ${chats.length + 1}`,
      messages: [],
      createdAt: Date.now()
    };
    const updatedChats = [...chats, newChat].sort((a, b) => b.createdAt - a.createdAt);
    setChats(updatedChats);
    saveChatsToLocalStorage(updatedChats);
    setCurrentChatId(newChat.id);
    setMessages([]);
    setInput("");
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSendMessage = async () => {
    if (isGenerating) return;
    const startingInput = input;

    setIsGenerating(true);
    setHasBegunGenerating(false);
    setInput("");

    try {
      let chatId = currentChatId;
      let updatedChats = [...chats];

      if (!chatId || !chats.find((chat) => chat.id === chatId)) {
        const newChat: Chat = {
          id: Date.now(),
          name: startingInput.slice(0, 50),
          messages: [],
          createdAt: Date.now()
        };
        updatedChats.push(newChat);
        chatId = newChat.id;
        setCurrentChatId(chatId);
      }

      const newMessage: ChatMessage = {
        id: Date.now(),
        role: "user",
        content: startingInput
      };

      updatedChats = updatedChats.map((chat) => (chat.id === chatId ? { ...chat, messages: [...chat.messages, newMessage] } : chat));

      setChats(updatedChats);
      saveChatsToLocalStorage(updatedChats);
      setMessages(updatedChats.find((chat) => chat.id === chatId)?.messages || []);

      const { output } = await streamMessage(updatedChats.find((chat) => chat.id === chatId)?.messages || []);
      const assistantMessageId = Date.now();

      const newAssistantMessage: ChatMessage = { id: assistantMessageId, role: "assistant", content: "" };
      updatedChats = updatedChats.map((chat) => (chat.id === chatId ? { ...chat, messages: [...chat.messages, newAssistantMessage] } : chat));
      setChats(updatedChats);
      saveChatsToLocalStorage(updatedChats);
      setMessages(updatedChats.find((chat) => chat.id === chatId)?.messages || []);

      for await (const chunk of readStreamableValue(output)) {
        if (!hasBegunGenerating) {
          setHasBegunGenerating(true);
        }

        updatedChats = updatedChats.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                messages: chat.messages.map((msg) => (msg.id === assistantMessageId ? { ...msg, content: msg.content + chunk } : msg))
              }
            : chat
        );
        setChats(updatedChats);
        saveChatsToLocalStorage(updatedChats);
        setMessages(updatedChats.find((chat) => chat.id === chatId)?.messages || []);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setInput(startingInput);
    } finally {
      setIsGenerating(false);
      setHasBegunGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChats = () => {
    if (isGenerating) return;
    setClearChatsDialogOpen(true);
  };

  const confirmClearChats = () => {
    setChats([]);
    saveChatsToLocalStorage([]);
    setMessages([]);
    setCurrentChatId(null);
    setClearChatsDialogOpen(false);
  };

  const handleSelectChat = (chatId: number) => {
    if (isGenerating) return;
    setCurrentChatId(chatId);
    setMessages(chats.find((chat) => chat.id === chatId)?.messages || []);
  };

  const handleDeleteChat = (chatId: number, e: React.MouseEvent) => {
    if (isGenerating) return;
    e.stopPropagation();
    setChatToDelete(chatId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteChat = () => {
    if (chatToDelete) {
      const updatedChats = chats.filter((chat) => chat.id !== chatToDelete);
      setChats(updatedChats);
      saveChatsToLocalStorage(updatedChats);
      if (currentChatId === chatToDelete) {
        setCurrentChatId(null);
        setMessages([]);
      }
    }
    setDeleteDialogOpen(false);
    setChatToDelete(null);
  };

  const scrollToBottom = useCallback(() => {
    if (autoScroll && scrollContainerRef.current) {
      const { scrollHeight, clientHeight } = scrollContainerRef.current;
      scrollContainerRef.current.scrollTop = scrollHeight - clientHeight;
    }
  }, [autoScroll]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      const isScrolledToBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 10;
      setAutoScroll(isScrolledToBottom);
    }
  }, []);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  return (
    <>
      <div className="flex h-screen">
        {isSidebarOpen && (
          <div className="w-[300px] border-r flex flex-col">
            <div className="flex justify-between border-b p-4">
              <Sidebar
                className="size-6 cursor-pointer hover:opacity-80"
                onClick={handleToggleSidebar}
              />

              <SquarePen
                className={cn("size-6 cursor-pointer hover:opacity-80", isGenerating && "opacity-50 cursor-not-allowed")}
                onClick={handleCreateChat}
              />
            </div>

            <div className="flex flex-col gap-2 p-4 flex-grow overflow-y-auto">
              {chats.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-gray-500">No chats.</div>
                </div>
              ) : (
                chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={cn("cursor-pointer p-2 rounded flex justify-between items-center group", chat.id === currentChatId ? "bg-neutral-700" : "hover:bg-neutral-700", isGenerating && "pointer-events-none opacity-50")}
                    onClick={() => handleSelectChat(chat.id)}
                  >
                    <div className="truncate flex-1 mr-2">{chat.name}</div>
                    <Trash2
                      className={cn("size-4 opacity-0 group-hover:opacity-100 cursor-pointer hover:text-neutral-500 flex-shrink-0", isGenerating && "opacity-50 cursor-not-allowed")}
                      onClick={(e) => handleDeleteChat(chat.id, e)}
                    />
                  </div>
                ))
              )}
            </div>

            {chats.length > 0 && (
              <div className="mt-auto border-t p-4">
                <Button
                  className="w-full"
                  onClick={handleClearChats}
                  disabled={isGenerating}
                >
                  Clear Chats
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex gap-4 p-4 items-center relative">
            {!isSidebarOpen && (
              <div className="flex gap-4">
                <Sidebar
                  className="size-6 cursor-pointer hover:opacity-80"
                  onClick={handleToggleSidebar}
                />

                <SquarePen
                  className={cn("size-6 cursor-pointer hover:opacity-80", isGenerating && "opacity-50 cursor-not-allowed")}
                  onClick={handleCreateChat}
                />
              </div>
            )}

            <div className={cn("absolute inset-0 flex items-center justify-center pointer-events-none", isSidebarOpen && "mt-6")}>
              <div className="text-xl font-bold whitespace-nowrap truncate px-12">{chats.find((chat) => chat.id === currentChatId)?.name || "Chat Name"}</div>
            </div>
          </div>

          <div
            ref={scrollContainerRef}
            className="flex-1 flex flex-col px-12 overflow-auto w-full max-w-[1000px] mx-auto mt-8"
          >
            {messages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-gray-500">No messages.</div>
            ) : (
              <div className="flex flex-col gap-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
                  >
                    {message.role === "assistant" && (
                      <div className="border rounded-full p-1.5 mr-2 h-fit">
                        <WandSparkles className="size-5" />
                      </div>
                    )}
                    <div className={cn("p-2 rounded-full break-words whitespace-pre-wrap", message.role === "user" ? "border bg-neutral-800 ml-auto px-4" : "max-w-[75%]")}>
                      {message.role === "assistant" ? (
                        <ReactMarkdown
                          className="prose dark:prose-invert text-foreground space-y-0"
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p({ children }) {
                              return <p className="m-0">{children}</p>;
                            }
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      ) : (
                        message.content
                      )}
                      {message.role === "assistant" && message.content === "" && isGenerating && <Ellipsis className="animate-pulse size-6" />}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="flex justify-center mb-2 mt-12">
            <div className="relative max-w-[800px] w-full">
              <ReactTextareaAutosize
                ref={inputRef}
                className="resize-none rounded-lg p-4 pr-12 w-full focus:outline-none"
                rows={2}
                maxRows={14}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
                onKeyDown={handleKeyDown}
                disabled={isGenerating}
              />

              <Send
                className={cn("absolute right-4 bottom-[22px] top-auto translate-y-0 size-6 cursor-pointer hover:text-neutral-500", isGenerating && "opacity-50 cursor-not-allowed")}
                onClick={handleSendMessage}
              />
            </div>
          </div>
        </div>
      </div>

      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. This will permanently delete the chat.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteChat}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={clearChatsDialogOpen}
        onOpenChange={setClearChatsDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Chats</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to clear all chats? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmClearChats}>Clear All</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
