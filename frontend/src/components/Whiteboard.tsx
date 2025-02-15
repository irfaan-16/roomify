/* eslint-disable @typescript-eslint/no-explicit-any */

import { Tldraw } from "@tldraw/tldraw";
import "tldraw/tldraw.css";
import { useSyncDemo } from "@tldraw/sync";
import { useParams } from "react-router-dom";

const WhiteBoard = () => {
  const { roomId } = useParams();

  const store = useSyncDemo({ roomId: roomId! });

  return <Tldraw store={store} inferDarkMode />;
};

export default WhiteBoard;
