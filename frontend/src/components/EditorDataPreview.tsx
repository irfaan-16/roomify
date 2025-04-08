import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { useEffect } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EditorDataPreview = ({ markdown }: { markdown: string }) => {
  const editor = useCreateBlockNote();

  async function loadHTML() {
    const blocks = await editor.tryParseMarkdownToBlocks(markdown);
    editor.replaceBlocks(editor.document, blocks);
  }

  useEffect(() => {
    // editor.replaceBlocks(editor.document, blocks);
    loadHTML();
  }, [markdown, editor]);

  return <BlockNoteView editor={editor} editable={false} />;
};

export default EditorDataPreview;
