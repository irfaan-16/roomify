/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
// import { socket } from "@/socket";
import { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "./SocketContext";

interface RoomContextType {
  roomId: string | null;
  roomInfo: RoomInfo | null;
  setRoomId: (id: string) => void;
  setRoomInfo: (roomInfo: RoomInfo) => void;
}

interface ConnectedUser {
  picture: string;
  name: string;
  email: string;
}

interface Host {
  picture: string;
  name: string;
  email: string;
  socketId: string;
}

interface RoomInfo {
  host: Host;
  participants: ConnectedUser[];
  active: boolean;
  roomId: string;
  documents: string[];
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider = ({ children }: { children: React.ReactNode }) => {
  const [roomId, setRoomId] = useState<string | null>(
    localStorage.getItem("roomId")
  );

  const { socket } = useSocket();

  const [roomInfo, setRoomInfo] = useState<RoomInfo | null>(null);

  useEffect(() => {
    if (!socket) return;

    socket.on("room-created", (_roomInfo: RoomInfo) => {
      console.log("received", _roomInfo);
      setRoomInfo(_roomInfo);
      console.log("room info after creation", roomInfo);
    });

    socket.on("room-joined", (_name: string, _roomInfo: RoomInfo) => {
      setRoomInfo(_roomInfo);
    });
  }, [roomInfo, socket]);

  useEffect(() => {
    localStorage.setItem("roomId", roomInfo?.roomId as string);
  }, [roomInfo]);

  return (
    <RoomContext.Provider value={{ roomId, setRoomId, roomInfo, setRoomInfo }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error("useRoom must be used within a RoomProvider");
  }
  return context;
};
