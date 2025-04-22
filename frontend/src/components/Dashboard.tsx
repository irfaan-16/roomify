/* eslint-disable @typescript-eslint/no-unused-vars */

import Navbar from "./Navbar";
import Gradient from "/gradient.webp";
import Inbox from "./Inbox";
import ConnectedUsersList from "./ConnectedUsersList";
import CallControls from "./CallControls";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useEffect, useRef, useState } from "react";
import WhiteBoard from "./Whiteboard";

import { Fullscreen, Save, X } from "lucide-react";
import TodoList from "./TodoList";
import { useRoom } from "./RoomContext";
import DocumentViewer from "./DocumentViewer";
import { useAuth } from "./AuthContext";
import Editor from "./Editor";
import Summaries from "./Summaries";
import ChatBotModal from "./ChatBotModal";
import toast from "react-hot-toast";
// import supabase from "utils/supabaseClient";
// import supabase from "/utils/supabaseClient";
import supabase from "../../utils/supabaseClient";
// import { useNavigate } from "react-router-dom";
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
interface AIChatData {
  message: string;
  isPrompt: boolean;
}
interface RoomInfo {
  host: Host;
  participants: ConnectedUser[];
  active: boolean;
  roomId: string;
  documents: string[];
}

interface Summary {
  content: string;
  summary: string;
}

const Dashboard = () => {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  // const navigate = useNavigate();

  const genAI = new GoogleGenerativeAI(
    import.meta.env.VITE_GEMINI_KEY as string
  );

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction:
      "You are a virtual study assistant which is integrated in a website called roomify which is created by Irfaan and Adhiraj",
  });
  const { roomId, roomInfo, setRoomInfo } = useRoom();
  const chatRef = useRef<ReturnType<typeof model.startChat> | null>(null);
  const editorContentRef = useRef<string>("");

  const { session } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>("whiteboard");
  const [focusMode, setFocusMode] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("no file selected!");

  useEffect(() => {
    if (!chatRef.current) {
      chatRef.current = model.startChat({ history: [] });
    }
  }, [model]);

  const [documentSrc, setDocumentSrc] = useState<string>("");
  const [aiChatData, setAIChatData] = useState<AIChatData[]>([]);

  useEffect(() => {
    if (roomInfo?.documents.length === 0) {
      setCurrentTab("editor");
    } else {
      setDocumentSrc(roomInfo?.documents[roomInfo.documents.length - 1] || "");
    }
  }, [roomInfo?.documents]);

  const handleViewDocument = (docUrl: string) => {
    setCurrentTab("document");
    setDocumentSrc(docUrl);
  };

  const removeDocument = async (docUrl: string) => {
    const formData = new FormData();

    formData.append("filename", docUrl);
    formData.append("roomId", roomId as string);

    try {
      const response = await fetch("/removeDocument", {
        method: "DELETE",
        body: formData,
      });
      await response.json();
      setRoomInfo(((prev: RoomInfo) => {
        const updatedDocuments = prev.documents.filter((doc) => doc != docUrl); // Ensure uniqueness
        return { ...prev, documents: updatedDocuments };
      }) as unknown as RoomInfo);
    } catch (err) {
      toast.error("Deleting Error!");
    } finally {
      setDocumentSrc("");
      setCurrentTab("editor");
    }
  };

  const sumamrise = async (content: string) => {
    const result = await chatRef.current!.sendMessage(
      `${content},(this is my notes, analyze it, summarise it and give me key points about it and whatever you think will be useful in as short as possible and concise)`
    );
    return result.response.text();
  };

  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      setFileName(file.name);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first!");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("roomId", roomId as string);

    try {
      const response = await fetch("/upload", {
        method: "POST",
        body: formData,
      });

      await response.json();
      toast.success("File uploaded successfully!");
    } catch (error) {
      toast.error(`Upload error: ${error}`);
    }
  };

  async function handleSave() {
    const { error } = await supabase.from("room_data").insert([
      {
        user_email: session.user.user_metadata.email,
        room_id: roomId,
        editor_markdown: editorContentRef.current,
        summaries: summaries,
        aichat: aiChatData,
      },
    ]);

    if (error) {
      toast.error("Error saving data:");
      console.error("Error saving data:", error.message);
    } else {
      toast.success(
        `Data saved,https://roomify-hrjc.ondrender.com/data?userEmail=${session.user.user_metadata.email}&roomId=${roomId}`,
        { removeDelay: 3000 }
      );
      // console.log("Data saved:", data);
    }
  }

  return (
    <>
      <section className="py-4 relative px-4 h-screen">
        <img
          src={Gradient}
          alt="gradient image"
          className="absolute -z-2 top-0 pointer-events-none"
        />
        <div className="flex items-center">
          <div>
            <button
              className="flex gap-2 text-white p-2 rounded-md bg-purple-800 font-bold transition hover:bg-purple-900 justify-between cursor-pointer z-30 select-none"
              onClick={handleSave}
            >
              <Save />
              save
            </button>
          </div>
          <Navbar />

          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-3 text-white p-2 rounded-md bg-purple-800 font-bold transition hover:bg-purple-900 justify-between cursor-pointer z-30 select-none"
              onClick={() => setFocusMode(!focusMode)}
            >
              <h3 className="text-sm whitespace-nowrap">Focus Mode</h3>
              <Fullscreen color="#ffffff" />
            </div>
            {session?.user?.user_metadata.email === roomInfo?.host.email && (
              <div className="flex items-center gap-1">
                <button
                  onClick={handleClick}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-800 text-white rounded-sm shadow-lg hover:bg-purple-900 transition duration-300 ease-in-out focus:outline-none cursor-pointer"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M4 12l1.5-1.5m0 0L12 4.5m0 0l6.5 6.5M12 4.5V16"
                    />
                  </svg>
                  Select File
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div>
                  <p
                    className="text-white text-xs max-w-24 truncate"
                    title={fileName}
                  >
                    {fileName}
                  </p>
                  <button
                    className="bg-white text-purple-800 px-2 rounded-sm py-[1px] text-sm font-bold cursor-pointer hover:bg-white/70 transition"
                    onClick={handleUpload}
                  >
                    Upload
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className={`w-full flex justify-between gap-4 mt-6 min-h-[700px] h-full`}
        >
          <div
            style={
              focusMode
                ? {
                    height: "120vh",
                    position: "absolute",
                    top: "0",
                    left: "0",
                  }
                : { position: "unset", height: "90%" }
            }
            className={`w-full bg-black flex-1`}
          >
            <div className="bg-white/4  p-2 text-white font-bold flex justify-center gap-3">
              <button
                className={`py-2 px-4  ${
                  currentTab === "whiteboard" && "bg-purple-800"
                }  rounded-md cursor-pointer min-w-36`}
                onClick={() => setCurrentTab("whiteboard")}
              >
                Whiteboard
              </button>
              <div className="w-0.5 h-10 bg-white/10"></div>
              <button
                className={`py-2 px-4 ${
                  currentTab === "editor" && "bg-purple-800"
                } rounded-md cursor-pointer`}
                onClick={() => setCurrentTab("editor")}
              >
                Text Editor
              </button>
              <div className="w-0.5 h-10 bg-white/10"></div>

              <button
                className={`py-2 px-4 ${
                  currentTab === "summaries" && "bg-purple-800"
                } rounded-md cursor-pointer`}
                onClick={() => setCurrentTab("summaries")}
              >
                Summaries
              </button>
              <div className="w-0.5 h-10 bg-white/10"></div>

              <button
                className={`py-2 px-4 ${
                  currentTab === "chatbot" && "bg-purple-800"
                } rounded-md cursor-pointer`}
                onClick={() => setCurrentTab("chatbot")}
              >
                AI Chatbot
              </button>

              {roomInfo?.documents.map((docUrl) => {
                return (
                  <div
                    key={docUrl + Date.now()}
                    title={docUrl}
                    className=" p-2 px-3 bg-white/2 text-center rounded-sm cursor-pointer flex gap-2"
                    onClick={() => handleViewDocument(docUrl)}
                  >
                    {session?.user?.user_metadata.email ===
                      roomInfo?.host.email && (
                      <X
                        color="red"
                        className="p-1 bg-white/5 rounded-sm hover:bg-white transition"
                        onClick={() => {
                          removeDocument(docUrl);
                        }}
                      />
                    )}
                    <span className="max-w-24 truncate">{docUrl}</span>
                  </div>
                );
              })}
            </div>
            <div className="h-full">
              {currentTab === "whiteboard" ? (
                <WhiteBoard />
              ) : currentTab === "editor" ? (
                <Editor
                  summarise={sumamrise}
                  setSummaries={setSummaries}
                  updateContent={(content) =>
                    (editorContentRef.current = content)
                  }
                />
              ) : currentTab === "summaries" ? (
                <Summaries summaries={summaries} />
              ) : currentTab === "chatbot" ? (
                <ChatBotModal
                  chat={chatRef.current}
                  setAIChatData={setAIChatData}
                  aiChatData={aiChatData}
                />
              ) : (
                <DocumentViewer src={documentSrc} />
              )}
            </div>
          </div>

          <Inbox />
        </div>
        <div className="flex justify-between mt-4 border-2">
          <div className="w-full">
            {session?.user.user_metadata.email === roomInfo?.host.email && (
              <CallControls />
            )}
            <ConnectedUsersList />
          </div>
          <TodoList />
        </div>
      </section>
    </>
  );
};

export default Dashboard;
