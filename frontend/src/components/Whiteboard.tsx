/* eslint-disable @typescript-eslint/no-explicit-any */

import { Tldraw } from "@tldraw/tldraw";
import "tldraw/tldraw.css";
import { useSyncDemo } from "@tldraw/sync";

const WhiteBoard = () => {
  const store = useSyncDemo({ roomId: "my-unique-room-id" });

  return (
    <div className="h-full min-h-96">
      <Tldraw store={store} inferDarkMode />
    </div>
  );
};

export default WhiteBoard;
