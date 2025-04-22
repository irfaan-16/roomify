/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { motion } from "motion/react";
import { Brain } from "lucide-react";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css"; // Change theme if needed
import { useRef } from "react";

interface AIChatData {
  message: string;
  isPrompt: boolean;
}

interface ChatbotComponentProps {
  // onClose: (arg0: boolean) => void;
  chat: any;
  aiChatData: AIChatData[];
  setAIChatData: React.Dispatch<React.SetStateAction<AIChatData[]>>;
}

export default function ChatBotModal({
  chat,
  aiChatData,
  setAIChatData,
}: ChatbotComponentProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  console.log(chat._history, "CHAT");

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

  const askAi = async () => {
    try {
      console.log(chat);

      chat._history.push({
        role: "user",
        parts: [{ text: inputRef.current?.value }],
      });

      const result = await chat.sendMessageStream(inputRef.current?.value);
      let aiResponse: string = "";

      setAIChatData((prev) => [
        ...prev,
        { message: inputRef.current?.value, isPrompt: true } as AIChatData,
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
    } finally {
      inputRef.current!.value = "";
    }
  };

  return (
    <div className="h-full min-h-[700px] max-h-[700px] flex flex-col justify-between ">
      <div className="bg-white/2 rounded-lg  w-full text-white flex-1 overflow-y-auto">
        <div className=" p-4 overflow-y-auto whitespace-pre w-[90%] m-auto max-w-[1200px] ">
          {aiChatData.map((message: AIChatData) => (
            <motion.div
              initial={{ y: 20, opacity: 0.1 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
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
            </motion.div>
          ))}
        </div>
      </div>
      <div className="pt-2 flex items-center  p-2 rounded-md mt-3 gap-2 w-full  bg-white/3 px-4">
        <input
          type="text"
          placeholder="write your message..."
          className="bg-white/5 border-none outline-none text-white rounded-full px-3 py-2 text-md w-full"
          // onChange={(e) => setInput(e.target.value)}
          ref={inputRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              askAi();
            }
          }}
        />
        <div
          className="py-1 px-2 rounded-sm  cursor-pointer bg-white/2"
          onClick={askAi}
        >
          {/* <Send size={20} color="#fff" /> */}
          <p className="font-bold text-purple-600">ask</p>
        </div>
      </div>
    </div>
  );
}
