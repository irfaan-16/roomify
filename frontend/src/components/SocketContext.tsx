import { createContext, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
// import { createSocketConnection } from "./socket-utils"; // Import utility
import { createSocketConnection } from "../../utils/socketUtils";

// interface ConnectedUser {
//   picture: string;
//   name: string;
//   email: string;
// }

// interface RoomInfo {
//   host: Host;
//   participants: ConnectedUser[];
//   active: boolean;
//   roomId: string;
// }
// interface Host {
//   picture: string;
//   name: string;
//   email: string;
//   socketId: string;
// }
// Define the context type

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  // const [roomUsers, setRoomUsers] = useState<ConnectedUser[]>([]);

  // const [roomInfo, setRoomInfo] = useState<RoomInfo>(
  //   JSON.parse(localStorage.getItem("roomInfo")!) || {
  //     host: {},
  //     socketId: "",
  //     roomId: "",
  //     participants: [],
  //   }
  // );

  // const getRoomUsersCount = () => {
  //   return roomInfo?.participants.length || 0;
  // };

  // useEffect(() => {
  //   localStorage.setItem("roomInfo", JSON.stringify(roomInfo));
  // }, [roomInfo]);

  useEffect(() => {
    const newSocket = createSocketConnection();
    setSocket(newSocket);

    // newSocket.on("room-users", (newUsers: ConnectedUser[]) =>
    //   setRoomInfo((prev) => ({
    //     ...prev,
    //     participants: newUsers,
    //   }))
    // );

    // newSocket.on("room-created", (roomId) => setRoomId(roomId));

    // newSocket.on("room-joined", (roomInfo: RoomInfo) => setRoomInfo(roomInfo));

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
      }}
    >
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
