/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import Message from "./Message";
import { useSocket } from "./SocketContext";
// import { Send } from "lucide-react";
import ChatBotModal from "./ChatBotModal";

interface Message {
  id: string;
  message: string;
  timestamp: string;
  isSender: boolean;
}

interface AIChatData {
  message: string;
  isPrompt: boolean;
}

const Inbox = ({ chat }: { chat: any }) => {
  const { socket } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [aiChatData, setAIChatData] = useState<AIChatData[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [currentTab, setCurrentTab] = useState<string>("AI");
  const [isChatbotOpen, setIsChatbotOpen] = useState<boolean>(false);

  const askAi = async () => {
    try {
      console.log(chat);

      chat._history.push({ role: "user", parts: [{ text: input }] });

      const result = await chat.sendMessageStream(input);
      let aiResponse: string = "";

      setAIChatData((prev) => [
        ...prev,
        { message: input, isPrompt: true } as AIChatData,
      ]);

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        aiResponse += chunkText;

        setAIChatData((prev) => {
          // Make a fresh copy of prev state
          const updatedChat = [...prev];

          if (
            updatedChat.length === 0 ||
            updatedChat[updatedChat.length - 1].isPrompt
          ) {
            // If last message is from the user, create a new AI message
            return [...updatedChat, { message: chunkText, isPrompt: false }];
          } else {
            // Append to the existing AI message correctly
            return updatedChat.map((chat, index) =>
              index === updatedChat.length - 1
                ? { ...chat, message: chat.message + chunkText }
                : chat
            );
          }
        });
      }
      chat._history.push({ role: "model", parts: [{ text: aiResponse }] });

      console.log(chat);
    } catch (err) {
      console.log(err);
    }

    setInput("");
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("receive_message", (data) => {
      console.log("Message received on client:", data); // Ensure the data matches your `Message` interface
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [socket]);

  useEffect(() => {
    if (socket) {
      console.log("Socket connected:", socket.connected);
      socket.on("connect", () => console.log("Connected to socket server"));
      socket.on("disconnect", () =>
        console.log("Disconnected from socket server")
      );
    }
  }, [socket]);

  useEffect(() => {
    // Smooth scroll to the bottom when messages update
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (socket && input.trim()) {
      console.log("sending message!");
      const newMessage: Message = {
        id: `${Date.now()}`,
        message: input,
        timestamp: new Date().toISOString(),
        isSender: true,
      };

      setMessages((prev) => [...prev, newMessage]); // Optimistic update
      socket.emit("send_message", newMessage); // Send to the server
      setInput(""); // Clear the input field
    }
  };

  return (
    <div className="rounded-xl bg-white/2 max-w-96 p-4 flex flex-col min-w-96">
      <div className="bg-white/4 rounded-md p-2 text-white font-bold flex justify-center gap-3">
        <button
          className={`py-2 px-4 rounded-md cursor-pointer min-w-36 ${
            currentTab === "AI" && "bg-black/60 "
          }`}
          onClick={() => setCurrentTab("AI")}
        >
          Ask the AI
        </button>
        <div className="w-0.5 h-10 bg-white/10"></div>
        <button
          className={`py-2 px-4 ${
            currentTab === "chat" && "bg-black/60"
          } rounded-md cursor-pointer`}
          onClick={() => setCurrentTab("chat")}
        >
          Chat with Others
        </button>
      </div>

      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col gap-2 mt-4 overflow-y-auto px-3 h-full">
          {/* AI */}

          {currentTab === "AI" ? (
            isChatbotOpen ? (
              <ChatBotModal onClose={setIsChatbotOpen} aiChatData={aiChatData}>
                <div className="pt-2 flex items-center  p-2 rounded-md mt-3 gap-2 w-full  bg-white/3">
                  <input
                    type="text"
                    placeholder="write your message..."
                    className="bg-white/5 border-none outline-none text-white rounded-full px-3 py-1 text-md w-full"
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (currentTab === "AI") askAi();
                        else sendMessage();
                      }
                    }}
                    value={input}
                  />
                  <div
                    className="py-1 px-2 rounded-sm  cursor-pointer bg-white/2"
                    onClick={currentTab === "AI" ? askAi : sendMessage}
                  >
                    {/* <Send size={20} color="#fff" /> */}
                    <p className="font-bold text-purple-600">send</p>
                  </div>
                </div>
              </ChatBotModal>
            ) : (
              <div>
                <button
                  onClick={() => setIsChatbotOpen(true)}
                  className="text-white cursor-pointer"
                >
                  expand
                </button>
                {aiChatData.map((response, idx) => {
                  return (
                    <div key={idx}>
                      <pre key={idx} className="text-white">
                        {response.message}
                      </pre>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            <div className="h-full">
              {messages.map((msg) => (
                <Message
                  key={msg.id}
                  message={msg.message}
                  avatar="/avatar.jpg"
                  isSender={msg.isSender}
                />
              ))}
            </div>
          )}
        </div>

        <div className="pt-2 flex items-center bg-white/3 p-2 rounded-md mt-3 gap-2">
          <input
            type="text"
            placeholder="write your message..."
            className="bg-white/5 border-none outline-none text-white rounded-full px-3 py-1 text-md w-full"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (currentTab === "AI") askAi();
                else sendMessage();
              }
            }}
            value={input}
          />
          <div
            className="py-1 px-2 rounded-sm  cursor-pointer bg-white/2"
            onClick={currentTab === "AI" ? askAi : sendMessage}
          >
            {/* <Send size={20} color="#fff" /> */}
            <p className="font-bold text-purple-600">send</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inbox;
