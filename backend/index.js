import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import { mdToPdf } from "md-to-pdf";
import fs from "fs";
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your React app's URL
    methods: ["GET", "POST"],
  },
});

// app.get("/data", (req, res) => {
//   res.send("<h1>Hiii</h1>");
// });

// app.get("/", (req, res) => {
//   res.send("<h1>Hiii home page</h1>");
// });
// Use CORS for the Express app

// app.use(
//   cors({
//     origin: "http://localhost:5173", // Your React app's URL
//     methods: ["GET", "POST"],
//   })
// );
app.use(cors({ origin: "*" })); // Allow all origins
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const activeRooms = {};

// Recreate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});

app.use("/pdfs", express.static("pdfs"));

app.post("/download-pdf", async (req, res) => {
  console.log("server pdf");

  try {
    const { markdown } = req.body;
    console.log(markdown, "MARKDOWN");
    if (!markdown) return res.status(400).send("Markdown content is required!");

    // Convert Markdown to PDF
    const pdfResult = await mdToPdf({ content: markdown });

    if (!pdfResult || !pdfResult.content) {
      throw new Error("PDF conversion failed!");
    }
    // Ensure "pdfs" directory exists
    const pdfDir = path.join(process.cwd(), "pdfs");
    if (!fs.existsSync(pdfDir)) {
      console.log("creating file..");
      fs.mkdirSync(pdfDir, { recursive: true });
    }

    // Generate unique filename and save PDF
    const pdfFilename = `document-${Date.now()}.pdf`;
    console.log(pdfFilename, "FILENAME");

    const outputPath = path.join(pdfDir, pdfFilename);
    fs.writeFileSync(outputPath, pdfResult.content);
    const sendData = {
      downloadUrl: `http://localhost:${4000}/pdfs/${pdfFilename}`,
    };
    // Return download URL
    return res.json(sendData);
  } catch (error) {
    res.status(500).send({ msg: "Error generating your pdf", error });
  }
});

app.get("/roomInfo/:roomId", (req, res) => {
  // const roomId = req.params.roomId;
  const { roomId } = req.params;
  console.log("Room info id received:", roomId);

  // Check if roomId exists in activeRooms
  if (!activeRooms[roomId]) {
    return res.status(404).json({ error: "Room not found" });
  }
  return res.json(activeRooms[roomId]);
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socket.on("update-scene", ({ elements, id }) => {
    console.log("server received data", elements);
    socket.broadcast.emit("receive-scene", { elements, id });
  });

  socket.on("create-room", ({ newRoomId, userInfo }) => {
    // const roomId = uuidv4();
    socket.join(newRoomId);

    activeRooms[newRoomId] = {
      host: { ...userInfo, socketId: socket.id },
      participants: [],
      active: false,
      roomId: newRoomId,
    };
    // console.log(activeRooms[newRoomId].participants);
    // console.log(`Room ${newRoomId} created by host ${userInfo.name}`);

    // io.to(newRoomId).emit("room-users", "new participant joineddddd"); // Notify room members
    console.log("ACTIVE ROOMS:", activeRooms);
    socket.emit("room-created", activeRooms[newRoomId]);
    console.log(socket.rooms);
  });

  socket.on("join-room", ({ roomId, userInfo }) => {
    //no active room with the given room ID
    console.log("room id received", roomId);
    const room = activeRooms[roomId];
    console.log("ROOM:", room);

    if (!room) {
      console.log("Room ID does not exist!");
      socket.emit("error", "Room ID does not exist");
      return;
    }

    activeRooms[roomId].participants.push({ ...userInfo, socketID: socket.id });
    io.to(roomId).emit("room-users", activeRooms[roomId].participants); // Notify room members
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
    io.to(roomId).emit("room-joined", userInfo.name, activeRooms[roomId]);

    console.log("ACTIVE ROOMS:", activeRooms);
  });

  socket.on("startMeeting", (roomId) => {
    if (!roomId) return;
    activeRooms[roomId].active = true;
    io.to(roomId).emit("meetingStarted", roomId); // Notify all users in the room
  });

  socket.on("send_message", ({ roomId, newMessage }) => {
    console.log("Server received message:", roomId, newMessage); // Debugging
    // io.to(roomId).emit("receive_message", newMessage); // Broadcast the message to all clients
    socket.broadcast.to(roomId).emit("receive_message", newMessage);
  });

  socket.on("editor_changes_send", (documentJSON) => {
    socket.broadcast.emit("editor_changes_received", documentJSON);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    // socket.leave(roomId);
    // const result=
    for (const roomID in activeRooms) {
      let result = activeRooms[roomID].participants?.find(
        (p) => p.socketID === socket.id
      );
      console.log(activeRooms[roomID], "jjjjjjjjjjjjjjjjjjj", result);

      if (result) {
        activeRooms[roomID].participants = activeRooms[
          roomID
        ].participants.filter((p) => p.socketID != socket.id);
        console.log("FILTERED ROOM:", activeRooms);
        io.to(roomID).emit("user-left", activeRooms[roomID], result);
        // io.to(roomID).emit("room-users", activeRooms[roomID].participants); // Notify room members
        return;
      }
    }
  });
});

server.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
