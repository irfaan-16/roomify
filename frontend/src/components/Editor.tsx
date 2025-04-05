/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Block, BlockNoteEditor } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

function Editor() {
  const editor: BlockNoteEditor = useCreateBlockNote();

  return (
    <BlockNoteView
      editor={editor}
      onChange={() => {
        console.log(JSON.stringify(editor.document));
      }}
    />
  );
}

export default Editor;
