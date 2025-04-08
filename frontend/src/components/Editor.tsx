/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BlockNoteEditor } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";

import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useState } from "react";
interface Summary {
  content: string;
  summary: string;
}
import jsPDF from "jspdf";
import { HardDriveDownloadIcon, Shapes } from "lucide-react";
import toast from "react-hot-toast";

type EditorProps = {
  summarise: (content: string) => Promise<string>;
  setSummaries: React.Dispatch<React.SetStateAction<Summary[]>>;
  updateContent: (content: string) => void;
};

function Editor({ summarise, setSummaries, updateContent }: EditorProps) {
  const editor: BlockNoteEditor = useCreateBlockNote();
  const [selectedText, setSelectedText] = useState("");
  const [html, setHtml] = useState<string>("");

  const handleSummarise = async () => {
    try {
      const content = await summarise(selectedText);
      setSummaries(
        (prev) =>
          [...prev, { summary: content, content: selectedText }] as Summary[]
      );
      toast.success("summarised!");
    } catch (err) {
      toast.error("something went wrong!");
    }
  };

  const handleMouseUp = () => {
    const selection = window.getSelection()!.toString();
    setSelectedText(selection);
    console.log(selectedText);
  };

  const handleOnChange = async () => {
    // Converts the editor's contents from Block objects to Markdown and store to state.
    const html = await editor.blocksToFullHTML(editor.document);
    const markdown = await editor.blocksToMarkdownLossy(editor.document);
    updateContent(markdown);
    setHtml(html);
  };

  const downloadPdf = () => {
    const element = document.getElementById("pdf-content");
    if (!element) return;

    const doc = new jsPDF("p", "pt", "a4");

    doc.html(element, {
      callback: function (doc) {
        doc.save("document.pdf");
      },
      margin: [40, 40, 40, 40],
      autoPaging: "text",
      x: 10,
      y: 10,
      width: 500,
      windowWidth: 800,
    });
  };
  return (
    <div className="relative h-full" onMouseUp={handleMouseUp}>
      <div
        id="pdf-content"
        dangerouslySetInnerHTML={{ __html: html }}
        className="absolute left-[-999999]"
      />

      <BlockNoteView editor={editor} onChange={handleOnChange} />
      <div className="absolute bottom-4 right-4 flex gap-4">
        <button
          className="p-2 rounded-md bg-purple-800  text-white text-sm cursor-pointer transition hover:bg-purple-500  flex items-center gap-2"
          onClick={handleSummarise}
        >
          <Shapes size={18} />
          Summarise
        </button>
        <button
          className="p-2 rounded-md bg-purple-800 text-white text-sm cursor-pointer transition hover:bg-purple-500 flex items-center gap-2"
          onClick={downloadPdf}
        >
          <HardDriveDownloadIcon size={18} />
          Download
        </button>
      </div>
    </div>
  );
}

export default Editor;
