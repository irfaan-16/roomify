import { createContext, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
// import { createSocketConnection } from "./socket-utils"; // Import utility
import { createSocketConnection } from "../../utils/socketUtils";

interface SocketContextProps {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextProps>({ socket: null });

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = createSocketConnection();
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
