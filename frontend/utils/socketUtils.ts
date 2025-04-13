import { io, Socket } from "socket.io-client";

export const createSocketConnection = (): Socket => {
  const socket = io(); // Ensure this matches your backend URL
  return socket;
};
