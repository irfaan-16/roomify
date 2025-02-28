/* eslint-disable @typescript-eslint/no-explicit-any */
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
// Our <Editor> component we can reuse later
const doc = new Y.Doc();
const provider = new WebrtcProvider("my-document-id", doc); // setup a yjs provider (explained below)

export default function Editor({ setMarkDown }: { setMarkDown: any }) {
  const handleChange = async () => {
    const markdown = await editor.blocksToMarkdownLossy();
    setMarkDown(markdown);
  };
  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    // ...
    collaboration: {
      // The Yjs Provider responsible for transporting updates:
      provider,
      // Where to store BlockNote data in the Y.Doc:
      fragment: doc.getXmlFragment("document-store"),
      // Information (name and color) for this user:
      user: {
        name: "My Username",
        color: "#ff0000",
      },
      // When to show user labels on the collaboration cursor. Set by default to
      // "activity" (show when the cursor moves), but can also be set to "always".
      showCursorLabels: "always",
    },
    // ...
  });

  // Renders the editor instance using a React component.
  return <BlockNoteView editor={editor} onChange={() => handleChange()} />;
}
