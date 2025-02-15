import { io, Socket } from "socket.io-client";

export const createSocketConnection = (): Socket => {
  const socket = io("http://localhost:4000"); // Ensure this matches your backend URL
  return socket;
};
