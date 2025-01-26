import Navbar from "./Navbar";
import Gradient from "/gradient.webp";
import Inbox from "./Inbox";
import Editor from "./Editor";
import ConnectedUsersList from "./ConnectedUsersList";
import TasksList from "./TasksList";
import CallControls from "./CallControls";
// import { socket } from "../socket";
// import { useEffect, useState } from "react";
// import { io, Socket } from "socket.io-client";

// const socket: Socket = io("http://localhost:4000"); // Backend URL

const Dashboard = () => {
  // const [message, setMessage] = useState<string>("");
  // const [messages, setMessages] = useState<string[]>([]);

  // useEffect(() => {
  //   socket.on("receive_message", (data: string) => {
  //     setMessages((prevMessages) => [...prevMessages, data]);
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  // const sendMessage = () => {
  //   if (message.trim()) {
  //     socket.emit("send_message", message);
  //     setMessage("");
  //   }
  // };

  return (
    <section className="py-4 relative  px-4 ">
      <img
        src={Gradient}
        alt="gradient image"
        className="absolute -z-2 top-0 pointer-events-none"
      />
      <Navbar />

      <div className="flex justify-between gap-6 mt-6">
        <div className="w-full">
          <div className="bg-white/4  p-2 text-white font-bold flex justify-center gap-3">
            <button className="py-2 px-4 rounded-md cursor-pointer min-w-36">
              whiteboard
            </button>
            <div className="w-0.5 h-10 bg-white/10"></div>
            <button className="py-2 px-4 bg-black/60 rounded-md cursor-pointer">
              text editor
            </button>
          </div>
          <Editor />
        </div>
        <Inbox />
      </div>
      <div className="flex justify-between mt-10">
        <div className="w-full">
          <CallControls />
          <ConnectedUsersList />
        </div>
        <TasksList />
      </div>
    </section>
  );
};

export default Dashboard;
