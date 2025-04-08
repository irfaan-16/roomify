/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useSocket } from "./SocketContext";
import { useNavigate } from "react-router-dom";
import { useRoom } from "./RoomContext";
// import { useRoom } from "./RoomContext";
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

const SocketListener = () => {
  const { socket } = useSocket();
  const { roomInfo, setRoomInfo } = useRoom();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("room info updated", roomInfo);
    // do other stuff here
  }, [roomInfo]);

  useEffect(() => {
    if (!socket) return;

    socket.on("redirectToPage", (redirectTo) => {
      console.log("hahahah");

      window.location.href = redirectTo; // Redirect the user
    });

    socket.on("room-joined", (name: string) => {
      console.log(name, "OUTPUT");

      toast.success(`${name} has joined the meeting🚀`);
    });

    socket.on("new-file", (url: string) => {
      setRoomInfo(((prev: RoomInfo) => {
        const updatedDocuments = new Set([...prev.documents, url]); // Ensure uniqueness
        return { ...prev, documents: Array.from(updatedDocuments) };
      }) as unknown as RoomInfo);
    });

    socket.on("file-removed", (url: string) => {
      setRoomInfo(((prev: RoomInfo) => {
        const updatedDocuments = prev.documents.filter((elem) => elem != url); // Ensure uniqueness
        return { ...prev, documents: Array.from(updatedDocuments) };
      }) as unknown as RoomInfo);
    });

    socket.on("meetingStarted", (roomId: string) => {
      console.log("ROOOOMMM INFOOOOOO", roomInfo);

      const obj = { ...roomInfo, active: true } as RoomInfo;
      setRoomInfo(obj);
      navigate(`/room/${roomId}`);
    });

    socket.on("user-left", (roomInfo: RoomInfo, { name }: { name: string }) => {
      setRoomInfo(roomInfo);
      toast.error(`${name} has left the meeting💩`);
    });
  }, [navigate, roomInfo, setRoomInfo, socket]);

  return null;
};

export default SocketListener;
