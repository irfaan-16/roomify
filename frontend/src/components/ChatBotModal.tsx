/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { motion, AnimatePresence } from "motion/react";
import { Brain, X } from "lucide-react";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css"; // Change theme if needed

interface AIChatData {
  message: string;
  isPrompt: boolean;
}
interface ChatbotComponentProps {
  onClose: (arg0: boolean) => void;
  aiChatData: AIChatData[];
  children: React.ReactNode;
}

export default function ChatBotModal({
  onClose,
  aiChatData,
  children,
}: ChatbotComponentProps) {
  function formatMessage(text: string) {
    // 1. Handle multi-line code blocks (```)
    text = text.replace(/```([\s\S]+?)```/g, (_match, code) => {
      const firstWordMatch = code.match(/^(\S+)\s+(.*)$/s); // Extract first word before space
      if (!firstWordMatch)
        return `<pre class="code-block"><code>${code}</code></pre>`; // If there's no space, treat it as a single word

      const firstWord = firstWordMatch[1]; // First word before space
      const restOfCode = firstWordMatch[2].trim(); // Trim leading/trailing spaces in the rest
      const highlightedCode = hljs.highlightAuto(restOfCode).value;

      return `<pre class="code-block"><span class="code-lang">${firstWord}</span><code dangerouslySetInnerHTML={{ __html: ${highlightedCode} }}></code></pre>`;
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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="inset-0 fixed left-0 bg-black bg-opacity-50 z-[320] text-white px-14 py-16"
      >
        <div className="px-28 bg-white/2 rounded-lg h-full w-full">
          <div className="flex justify-between items-center p-4">
            <h2 className="text-lg font-semibold">Chatbot</h2>
            <button
              onClick={() => onClose(false)}
              className="cursor-pointer bg-red-700 p-2 rounded-md hover:bg-red-900 transition"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className=" p-4 overflow-y-auto whitespace-pre fit-height">
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
        {children}
      </motion.div>

      {/* {children} */}
    </AnimatePresence>
  );
}
