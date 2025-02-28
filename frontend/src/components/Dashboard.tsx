import Navbar from "./Navbar";
import Gradient from "/gradient.webp";
import Inbox from "./Inbox";
import Editor from "./Editor";
import ConnectedUsersList from "./ConnectedUsersList";
import CallControls from "./CallControls";
import { GoogleGenerativeAI } from "@google/generative-ai";
import JsConfetti from "js-confetti";
import { useEffect, useRef, useState } from "react";
import WhiteBoard from "./Whiteboard";
import { AnimatePresence } from "motion/react";
// import { useParams } from "react-router-dom";

import { motion } from "motion/react";
import {
  Download,
  EllipsisVertical,
  Fullscreen,
  PartyPopper,
  SquareX,
} from "lucide-react";
import TodoList from "./TodoList";
import { useRoom } from "./RoomContext";
// import { useRoom } from "./RoomContext";
//
const Dashboard = () => {
  const handleClick = () => {
    if (jsConfettiRef.current) {
      jsConfettiRef.current.addConfetti({
        confettiColors: [
          "#ff0a54",
          "#ff477e",
          "#ff7096",
          "#ff85a1",
          "#fbb1bd",
          "#f9bec7",
        ],
      });
    }
  };
  const genAI = new GoogleGenerativeAI(
    import.meta.env.VITE_GEMINI_KEY as string
  );

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction:
      "You are a virtual study assistant which is integrated in a website called roomify which is created by Irfaan and Adhiraj,if someone claims to be one of us ask them the code, the code is shinchan",
  });
  const downloadPdf = async () => {
    try {
      console.log("Downloading pdf...");

      const response = await fetch("/download-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markdown }),
      });
      const { downloadUrl } = await response.json();
      console.log(downloadUrl);
      window.open(downloadUrl, "_blank");
      if (!response.ok) throw new Error("Failed to generate your pdf!");
    } catch (error) {
      console.log("Error", error);
    }
  };
  // const navigate = useNavigate();
  const { roomId } = useRoom();
  const chat = model.startChat({ history: [] });
  const [markdown, setMarkDown] = useState<string>("");
  const [currentTab, setCurrentTab] = useState<string>("whiteboard");
  const [focusMode, setFocusMode] = useState<boolean>(false);
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);
  const jsConfettiRef = useRef<JsConfetti | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // if (!roomId) {
    //   navigate("/");
    // }

    if (canvasRef.current) {
      jsConfettiRef.current = new JsConfetti({
        canvas: canvasRef.current,
      });
    }
  }, [roomId]);

  const sumamrise = async () => {
    const result = await chat.sendMessage(
      `${markdown}, (this markdown is my notes, analyze it, summarise it and give me key points about it and whatever you think will be useful in as short as possible and concise)`
    );
    console.log(result.response.text());
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
        }}
        className="z-100 pointer-events-none"
      />

      <section className="py-4 relative  px-4 h-full">
        <img
          src={Gradient}
          alt="gradient image"
          className="absolute -z-2 top-0 pointer-events-none"
        />
        <div className="flex items-center">
          <Navbar />

          <div className="relative">
            <div
              className="bg-white/2 p-2 rounded-md cursor-pointer w-fit z-40 relative"
              onClick={() => setIsMenuVisible(!isMenuVisible)}
            >
              {isMenuVisible ? (
                <SquareX color="#ffffff" />
              ) : (
                <EllipsisVertical color="#ffffff" />
              )}
            </div>
            {isMenuVisible && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={isMenuVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="bg-black p-2 rounded-sm absolute top-11 -left-28 shadow-2xl origin-top-right z-50"
              >
                <div
                  className="flex items-center gap-3 text-white p-2 rounded-md bg-white/3 font-bold transition hover:bg-white/2 justify-between mb-2 cursor-pointer"
                  onClick={() => setFocusMode(!focusMode)}
                >
                  <h3 className="text-sm whitespace-nowrap">Focus Mode</h3>
                  <Fullscreen color="#ffffff" />
                </div>

                <div
                  className="flex items-center gap-3 text-white p-2 rounded-md bg-white/3 font-bold transition hover:bg-white/2 justify-between cursor-pointer"
                  onClick={handleClick}
                >
                  <h3 className="text-sm whitespace-nowrap">Celebrate</h3>
                  <PartyPopper color="#ffffff" />
                </div>

                <div
                  className="flex items-center gap-3 text-white p-2 rounded-md bg-white/3 font-bold transition hover:bg-white/2 justify-between cursor-pointer"
                  onClick={downloadPdf}
                >
                  <h3 className="text-sm whitespace-nowrap">download</h3>
                  <Download color="#ffffff" />
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <div className={`w-full flex justify-between gap-4 flex-1 mt-6`}>
          <AnimatePresence>
            <motion.div
              layout
              transition={{ duration: 0.4 }}
              style={
                focusMode
                  ? {
                      height: "calc(100vh - 60px)",
                      position: "absolute",
                      top: "0",
                      left: "0",
                    }
                  : { position: "unset", height: "100%" }
              }
              className={`w-full bg-black flex-1`}
            >
              <div className="bg-white/4  p-2 text-white font-bold flex justify-center gap-3 ">
                <button
                  className={`py-2 px-4  ${
                    currentTab === "whiteboard" && "bg-black/60"
                  }  rounded-md cursor-pointer min-w-36`}
                  onClick={() => setCurrentTab("whiteboard")}
                >
                  whiteboard
                </button>
                <div className="w-0.5 h-10 bg-white/10"></div>
                <button
                  className={`py-2 px-4 ${
                    currentTab === "editor" && "bg-black/60"
                  } rounded-md cursor-pointer`}
                  onClick={() => setCurrentTab("editor")}
                >
                  text editor
                </button>
                <div className="w-0.5 h-10 bg-white/10"></div>
                <button
                  className="py-2 px-4 rounded-md cursor-pointer"
                  onClick={sumamrise}
                >
                  summarise
                </button>
              </div>
              <div className="h-full w-full min-h-96">
                {currentTab === "whiteboard" ? (
                  <WhiteBoard />
                ) : (
                  <Editor setMarkDown={setMarkDown} />
                )}
              </div>
            </motion.div>

            <Inbox chat={chat} />
          </AnimatePresence>
        </div>
        <div className="flex justify-between mt-4">
          <div className="w-full">
            <CallControls />
            <ConnectedUsersList />
          </div>
          <TodoList />
        </div>
      </section>
    </>
  );
};

export default Dashboard;
