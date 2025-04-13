import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import EditorDataPreview from "./EditorDataPreview";
import Summaries from "./Summaries";
import { Brain } from "lucide-react";
import hljs from "highlight.js";
export type Summary = {
  content: string;
  summary: string;
};

export type AIChatMessage = {
  message: string;
  isPrompt: boolean;
};

export type RoomData = {
  id: string;
  user_email: string;
  room_id: string;
  editor_markdown: string;
  summaries: Summary[];
  aichat: AIChatMessage[];
};

export type RoomDataResponse = {
  data: RoomData[];
};

const AIPreview = ({ data }: { data: AIChatMessage[] | undefined }) => {
  if (!data) return;

  function formatMessage(text: string) {
    // 1. Handle multi-line code blocks (```)
    text = text.replace(/```([\s\S]+?)```/g, (_match, code) => {
      const firstWordMatch = code.match(/^(\S+)\s+(.*)$/s); // Extract first word before space
      if (!firstWordMatch)
        return `<pre class="code-block"><code>${code}</code></pre>`; // If there's no space, treat it as a single word

      const firstWord = firstWordMatch[1]; // First word before space
      const restOfCode = firstWordMatch[2].trim(); // Trim leading/trailing spaces in the rest
      const highlightedCode = hljs.highlightAuto(restOfCode).value;

      return `<pre class="code-block"><span class="code-lang">${firstWord}</span><code>${highlightedCode}</code></pre>`;
    });

    const regex = /\*\*(.*?)\*\*/g;
    text = text.replace(
      regex,
      (_match, p1) => `<h1 class="code-heading">${p1}</h1>`
    );
    text = text
      .split("\n") // Split the string into lines
      .map((line) => {
        if (line.startsWith("* ")) {
          return `<li>${line.slice(2)}</li>`; // Convert to <li> if it starts with "* "
        }
        return line; // Keep non-list lines unchanged
      })
      .join("\n"); // Join the lines back together

    // Wrap consecutive <li> items in a single <ul>
    text = text.replace(/(<li>.*<\/li>*)+/g, "<ul>$&</ul>");
    text = text.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

    return text;
  }

  return (
    <div className="p-4 overflow-y-auto whitespace-pre w-[90%] m-auto max-w-[1200px] text-white">
      {data.map((message: AIChatMessage) => (
        <div
          key={message.message}
          className={`mb-4${
            message.isPrompt ? "text-right" : "text-left flex gap-2"
          }`}
        >
          {!message.isPrompt && (
            <div className="p-2 rounded-md bg-white/4 h-fit mr-2">
              <Brain />
            </div>
          )}
          {message.isPrompt ? (
            <div className="rounded-full text-wrap bg-gradient-to-l to-purple-700 ml-auto max-w-fit py-2 px-4 mb-4">
              <p>{message.message}</p>
            </div>
          ) : (
            <div
              className="text-wrap leading-[1.3] mb-4"
              dangerouslySetInnerHTML={{
                __html: formatMessage(message.message),
              }}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

const DataPreview = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const userEmail = queryParams.get("userEmail");
  const roomId = queryParams.get("roomId");
  const [currentTab, setCurrentTab] = useState("editor");

  const [roomData, setRoomData] = useState<RoomData>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `/getData?roomId=${roomId}&userEmail=${userEmail}`
        );
        //   console.log(res);
        const { data } = await res.json();
        console.log(data[0]);
        setRoomData(data[0]);
        // setRoomData(res.data); // `data` field contains the array
      } catch (err) {
        console.error("Error fetching room data:", err);
      }
    };

    fetchData();
  }, [roomId, userEmail]);

  return (
    <section className="p-4 min-h-screen">
      <div className="bg-white/4  p-2 text-white font-bold flex justify-center gap-3">
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
      </div>

      <main className="previewContainer">
        {currentTab === "editor" ? (
          <EditorDataPreview markdown={roomData?.editor_markdown as string} />
        ) : currentTab === "chatbot" ? (
          <AIPreview data={roomData?.aichat} />
        ) : (
          <Summaries summaries={roomData?.summaries} />
        )}
      </main>
    </section>
  );
};
export default DataPreview;
