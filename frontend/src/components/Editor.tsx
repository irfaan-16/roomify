// import "@blocknote/core/fonts/inter.css";
// import { BlockNoteView } from "@blocknote/mantine";
// import "@blocknote/mantine/style.css";
// import { useCreateBlockNote } from "@blocknote/react";
// import { useSocket } from "./SocketContext";
// import { useEffect, useRef } from "react";

// const Editor = () => {
//   const editor = useCreateBlockNote();
//   const { socket } = useSocket();
//   const isUpdatingFromServer = useRef(false);

//   useEffect(() => {
//     if (!socket) return;

//     // Listen for changes from the server
//     socket.on("editor_changes_received", (serverBlocks) => {
//       console.log("Changes received from other clients:", serverBlocks);

//       // Prevent emitting changes triggered by server updates
//       isUpdatingFromServer.current = true;

//       // Replace the blocks in the editor with the server data
//       editor.replaceBlocks(editor.document, serverBlocks);

//       // Allow local changes again
//       setTimeout(() => (isUpdatingFromServer.current = false), 0);
//     });

//     return () => {
//       socket.off("editor_changes_received");
//     };
//   }, [socket, editor]);

//   const handleEditorChange = () => {
//     if (!socket || isUpdatingFromServer.current) return;

//     const documentData = editor.document;
//     console.log("Emitting changes to others:", documentData);

//     // Emit the local changes to the server
//     socket.emit("editor_changes_send", documentData);
//   };

//   return <BlockNoteView editor={editor} onChange={handleEditorChange} />;
// };

// export default Editor;

"use client"; // this registers <Editor> as a Client Component
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
// Our <Editor> component we can reuse later
const doc = new Y.Doc();
const provider = new WebrtcProvider("my-document-id", doc); // setup a yjs provider (explained below)

export default function Editor() {
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
  return <BlockNoteView editor={editor} />;
}
