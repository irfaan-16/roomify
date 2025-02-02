import Navbar from "./Navbar";
import Gradient from "/gradient.webp";
import Inbox from "./Inbox";
import Editor from "./Editor";
import ConnectedUsersList from "./ConnectedUsersList";
import TasksList from "./TasksList";
import CallControls from "./CallControls";
import { GoogleGenerativeAI } from "@google/generative-ai";
import JsConfetti from "js-confetti";
import { useEffect, useRef, useState } from "react";
import WhiteBoard from "./Whiteboard";

const Dashboard = () => {
  console.log("dashboard rendered!");
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
  console.log(import.meta.env.VITE_GEMINI_KEY);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction:
      "You are a virtual study assistant which is integrated in a website called roomify",
  });
  const chat = model.startChat({ history: [] });
  const [markdown, setMarkDown] = useState<string>("");
  const [currentTab, setCurrentTab] = useState<string>("whiteboard");

  const jsConfettiRef = useRef<JsConfetti | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    // Initialize js-confetti with a single canvas
    if (canvasRef.current) {
      jsConfettiRef.current = new JsConfetti({
        canvas: canvasRef.current,
      });
    }
  }, []);
  const sumamrise = async () => {
    const result = await chat.sendMessage(
      `${markdown}, (this markdown is my notes, analyze it, summarise it and give me key points about it)`
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
          zIndex: -1,
          height: "100%",
          width: "100%",
        }}
      />
      <section className="py-4 relative  px-4 ">
        <img
          src={Gradient}
          alt="gradient image"
          className="absolute -z-2 top-0 pointer-events-none"
        />
        <Navbar />

        <div className="flex justify-between gap-6 mt-6">
          <div className="w-full">
            <button
              onClick={handleClick}
              className="text-white cursor-pointer bg-purple-600 rounded-sm p-2 font-bold"
            >
              🎉🎉
            </button>
            ;
            <div className="bg-white/4  p-2 text-white font-bold flex justify-center gap-3">
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
            {currentTab === "whiteboard" ? (
              <WhiteBoard />
            ) : (
              <Editor setMarkDown={setMarkDown} />
            )}
          </div>
          <Inbox chat={chat} />
        </div>
        <div className="flex justify-between mt-10">
          <div className="w-full">
            <CallControls />
            <ConnectedUsersList />
          </div>
          <TasksList />
        </div>
      </section>
    </>
  );
};

export default Dashboard;
