/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import Message from "./Message";
import { useSocket } from "./SocketContext";
// import { Send } from "lucide-react";
// import ChatBotModal from "./ChatBotModal";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface Message {
  id: string;
  message: string;
  timestamp: string;
  senderEmail: string;
  senderImage: string;
}

// interface AIChatData {
//   message: string;
//   isPrompt: boolean;
// }

const Inbox = () => {
  const { socket } = useSocket();
  const { roomId } = useParams(); // Get Room ID from URL
  const { session } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const notify = (msg: string, senderImage: string) =>
    toast.success(msg, {
      duration: 5000,
      position: "bottom-right",
      icon: (
        <img src={senderImage} alt="avatar" className="rounded-full max-w-8" />
      ),
      iconTheme: {
        primary: "green",
        secondary: "black",
      },
      style: {
        backgroundColor: "green",
        color: "#fff",
      },
    });

  useEffect(() => {
    if (!socket) return;

    socket.on("receive_message", (data) => {
      console.log("Message received on client:", data); // Ensure the data matches your `Message` interface
      setMessages((prev) => [...prev, data]);

      notify(data.message, data.senderImage);
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
        senderEmail: session.user.user_metadata.email,
        senderImage: session.user.user_metadata.picture,
      };

      setMessages((prev) => [...prev, newMessage]); // Optimistic update
      socket.emit("send_message", { roomId, newMessage }); // Send to the server
      setInput(""); // Clear the input field
    }
  };

  return (
    <div className="rounded-xl bg-white/2 max-w-96 p-4 flex flex-col min-w-96">
      <h1 className="text-white p-2 bg-purple-800 rounded-md font-bold">
        Inbox
      </h1>

      <div className="flex flex-col justify-between max-h-[700px] min-h-[700px]">
        <div className="flex flex-col gap-2 mt-4 h-full">
          <div className="h-full">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center max-h-[620px]">
                <h1 className="text-white text-center  text-xl">
                  Start the conversation!💬
                </h1>
              </div>
            ) : (
              <div className="overflow-y-scroll pr-2">
                {messages.map((msg) => (
                  <Message
                    key={msg.id}
                    message={msg.message}
                    avatar={msg.senderImage}
                    isSender={
                      msg.senderEmail === session.user.user_metadata.email
                    }
                  />
                ))}
              </div>
            )}
          </div>
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
                sendMessage();
              }
            }}
            value={input}
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
