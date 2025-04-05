/* eslint-disable @typescript-eslint/no-unused-vars */
import Navbar from "./Navbar";
import Gradient from "/gradient.webp";
import Inbox from "./Inbox";
import ConnectedUsersList from "./ConnectedUsersList";
import CallControls from "./CallControls";
import { GoogleGenerativeAI } from "@google/generative-ai";
import JsConfetti from "js-confetti";
import { useEffect, useRef, useState } from "react";
import WhiteBoard from "./Whiteboard";
import { AnimatePresence } from "motion/react";

import { motion } from "motion/react";
import {
  Download,
  EllipsisVertical,
  Fullscreen,
  PartyPopper,
  SquareX,
  X,
} from "lucide-react";
import TodoList from "./TodoList";
import { useRoom } from "./RoomContext";
import DocumentViewer from "./DocumentViewer";
import { useAuth } from "./AuthContext";
import Editor from "./Editor";
// import { useRoom } from "./RoomContext";
//
interface ConnectedUser {
  picture: string;
  name: string;
  email: string;
}

interface Host {
  picture: string;
  name: string;
  email: string;
  socketId: string;
}

interface RoomInfo {
  host: Host;
  participants: ConnectedUser[];
  active: boolean;
  roomId: string;
  documents: string[];
}

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
  const { roomId, roomInfo, setRoomInfo } = useRoom();
  const chat = model.startChat({ history: [] });
  const { session } = useAuth();
  const [markdown, setMarkDown] = useState<string>("");
  const [currentTab, setCurrentTab] = useState<string>("whiteboard");
  const [focusMode, setFocusMode] = useState<boolean>(false);
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);
  const jsConfettiRef = useRef<JsConfetti | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [documentSrc, setDocumentSrc] = useState<string>("");

  const handleViewDocument = (docUrl: string) => {
    setCurrentTab("document");
    setDocumentSrc(docUrl);
  };

  const removeDocument = async (docUrl: string) => {
    const formData = new FormData();

    formData.append("filename", docUrl);
    formData.append("roomId", roomId as string);

    try {
      const response = await fetch("http://localhost:4000/removeDocument", {
        method: "DELETE",
        body: formData,
      });
      const data = await response.json();
      setRoomInfo(((prev: RoomInfo) => {
        const updatedDocuments = prev.documents.filter((doc) => doc != docUrl); // Ensure uniqueness
        return { ...prev, documents: updatedDocuments };
      }) as unknown as RoomInfo);
    } catch (err) {
      console.log("Deleting Error!");
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      jsConfettiRef.current = new JsConfetti({
        canvas: canvasRef.current,
      });
    }
  }, []);

  const sumamrise = async () => {
    const result = await chat.sendMessage(
      `${markdown}, (this markdown is my notes, analyze it, summarise it and give me key points about it and whatever you think will be useful in as short as possible and concise)`
    );
    console.log(result.response.text());
  };

  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setFile(e.target.files[0]); // Get the selected file
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first!");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("roomId", roomId as string);

    try {
      const response = await fetch("http://localhost:4000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      alert(`File uploaded successfully! File Path: ${data.filePath}`);
    } catch (error) {
      console.error("Upload error:", error);
    }
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
                {roomInfo?.documents.map((docUrl) => {
                  return (
                    <div
                      key={docUrl + Date.now()}
                      title={docUrl}
                      className=" p-2 px-3 bg-white/2 text-center rounded-sm cursor-pointer flex gap-2"
                      onClick={() => handleViewDocument(docUrl)}
                    >
                      <X
                        color="red"
                        className="p-1 bg-white/5 rounded-sm hover:bg-white transition"
                        onClick={() => removeDocument(docUrl)}
                      />
                      <span className="max-w-24 truncate">{docUrl}</span>
                    </div>
                  );
                })}
              </div>
              <div className="h-full w-full min-h-96">
                {currentTab === "whiteboard" ? (
                  <WhiteBoard />
                ) : currentTab === "document" ? (
                  // <Editor setMarkDown={setMarkDown} />
                  <DocumentViewer src={documentSrc} />
                ) : (
                  // <Editor setMarkDown={setMarkDown} />
                  <Editor />
                )}
              </div>
            </motion.div>

            <Inbox chat={chat} />
          </AnimatePresence>
        </div>
        <div className="flex justify-between mt-4">
          <div className="w-full">
            {session?.user?.user_metadata.email === roomInfo?.host.email && (
              <div className="text-white">
                <input type="file" onChange={handleFileChange} />
                <input
                  type="text"
                  hidden
                  name="roomId"
                  value={roomId as string}
                />
                <button onClick={handleUpload}>Upload</button>
              </div>
            )}

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
