import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your React app's URL
    methods: ["GET", "POST"],
  },
});
const activeRooms = {};

// app.get("/data", (req, res) => {
//   res.send("<h1>Hiii</h1>");
// });

// app.get("/", (req, res) => {
//   res.send("<h1>Hiii home page</h1>");
// });
// Use CORS for the Express app
app.use(
  cors({
    origin: "http://localhost:5173", // Your React app's URL
    methods: ["GET", "POST"],
  })
);

// Recreate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Generate a room ID and assign the host
  socket.on("createRoom", () => {
    const roomId = uuidv4();
    activeRooms[roomId] = { host: socket.id }; // Save the room with its host
    socket.join(roomId);
    console.log(`Room ${roomId} created by host ${socket.id}`);
    socket.emit("roomCreated", roomId); // Notify the host of the room ID
  });

  // Join a room
  socket.on("joinRoom", (roomId) => {
    if (activeRooms[roomId]) {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
      socket.emit("roomJoined", roomId); // Confirm joining
      io.to(roomId).emit("newParticipant", socket.id); // Notify room members
    } else {
      socket.emit("error", "Room does not exist"); // Handle invalid room IDs
    }
  });

  // Listen for "send_message" from clients
  socket.on("send_message", (roomId, message) => {
    console.log("Server received message:", message); // Debugging
    io.to(roomId).emit("receive_message", { user: socket.id, message }); // Broadcast the message to all clients
  });

  socket.on("editor_changes_send", (documentJSON) => {
    // console.log("Editor changes received", documentJSON);
    socket.broadcast.emit("editor_changes_received", documentJSON);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

server.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
