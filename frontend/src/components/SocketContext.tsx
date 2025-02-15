import { createContext, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
// import { createSocketConnection } from "./socket-utils"; // Import utility
import { createSocketConnection } from "../../utils/socketUtils";
interface ConnectedUser {
  picture: string;
  name: string;
  email: string;
}
// Define the context type
interface SocketContextType {
  socket: Socket | null;
  roomUsers: ConnectedUser[];
  getRoomUsersCount: () => number;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

// Define props for the provider
// interface SocketProviderProps {
//   children: ReactNode;
// }
export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [roomUsers, setRoomUsers] = useState<ConnectedUser[]>([]);
  const getRoomUsersCount = () => {
    return roomUsers.length;
  };
  useEffect(() => {
    const newSocket = createSocketConnection();
    setSocket(newSocket);
    newSocket.on("room-users", (user: ConnectedUser) =>
      setRoomUsers((prev) => [...prev, user])
    );

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, roomUsers, getRoomUsersCount }}>
      {children}
    </SocketContext.Provider>
  );
};
// Custom hook to use the socket context
export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
