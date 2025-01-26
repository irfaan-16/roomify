import { useEffect, useRef, useState } from "react";
import Message from "./Message";
import { useSocket } from "./SocketContext";
// import { Send } from "lucide-react";

interface Message {
  id: string;
  message: string;
  timestamp: string;
  isSender: boolean;
}

const Inbox = () => {
  const { socket } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

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
    if (socket && message.trim()) {
      const newMessage: Message = {
        id: `${Date.now()}`,
        message,
        timestamp: new Date().toISOString(),
        isSender: true,
      };

      // setMessages((prev) => [...prev, newMessage]); // Optimistic update
      socket.emit("send_message", newMessage); // Send to the server
      setMessage(""); // Clear the input field
    }
  };

  return (
    <div className="rounded-xl bg-white/2 max-w-96 p-4 flex flex-col min-w-96"
    >
      <div className="bg-white/4 rounded-md p-2 text-white font-bold flex justify-center gap-3">
        <button className="py-2 px-4 rounded-md cursor-pointer min-w-36">
          Ask the AI
        </button>
        <div className="w-0.5 h-10 bg-white/10"></div>
        <button className="py-2 px-4 bg-black/60 rounded-md cursor-pointer">
          Chat with Others
        </button>
      </div>

      <div className="flex flex-col justify-between h-full">
        {/* messsages */}
        <div className="flex flex-col gap-2 mt-4 max-h-96 overflow-y-auto px-3 ">
          {messages.map((msg) => (
            <Message
              key={msg.id}
              message={msg.message}
              avatar="/avatar.jpg"
              isSender={msg.isSender}
            />
          ))}

          {/* <Message
          message="Hiii how are you?!"
          avatar="/avatar.jpg"
          isSender={true}
        /> */}

          <div ref={messagesEndRef}></div>
        </div>

        <div className="pt-2 flex items-center bg-white/3 p-2 rounded-md mt-3 gap-2">
          <input
            type="text"
            placeholder="write your message..."
            className="bg-white/5 border-none outline-none text-white rounded-full px-3 py-1 text-md w-full"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          <div
            className="py-1 px-2 rounded-sm  cursor-pointer bg-white/2"
            onClick={sendMessage}
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
