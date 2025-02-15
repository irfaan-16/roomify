/* eslint-disable @typescript-eslint/no-explicit-any */

import { Tldraw } from "@tldraw/tldraw";
import "tldraw/tldraw.css";
import { useSyncDemo } from "@tldraw/sync";

const WhiteBoard = () => {
  const store = useSyncDemo({ roomId: "my-unique-room-id" });

  return <Tldraw store={store} inferDarkMode />;
};

export default WhiteBoard;
