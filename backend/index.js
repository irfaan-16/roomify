import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { supabase } from "./supabaseClient.js";
import dotenv from "dotenv";

import fs from "fs";
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
dotenv.config(); // Loads .env into process.env
const activeRooms = {};

app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    return cb(null, `${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const { roomId } = req.body;
  console.log("BEFORE UPLOAD:", JSON.stringify(activeRooms, null, 2)); // Log before

  activeRooms[roomId].documents.push(req.file.originalname);
  io.to(roomId).emit("new-file", req.file.originalname);
  console.log("AFTER UPLOAD:", JSON.stringify(activeRooms, null, 2)); // Log after

  return res.json({
    message: "File uploaded successfully",
    filePath: `/uploads/${req.file.originalname}`,
  });
});

app.delete("/removeDocument", multer().none(), (req, res) => {
  const { filename, roomId } = req.body;
  console.log(req.body);

  const filePath = `./uploads/${filename}`;

  fs.unlink(filePath, (err) => {
    if (err) {
      console.log("Error deleting file!", err);
      return res.status(500).json({ error: "Failed to Delete the File" });
    }
    activeRooms[roomId].documents = activeRooms[roomId].documents.filter(
      (doc) => doc != filename
    );
    console.log("Room after deleting document:", activeRooms[roomId]);
    io.to(roomId).emit("file-removed", filename);
    res.json({ message: "File Deleted successfully" });
  });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});

app.use("/uploads", express.static("uploads"));

app.get("/getData", async (req, res) => {
  const { userEmail, roomId } = req.query;
  const { data, error } = await supabase
    .from("room_data")
    .select("*")
    .eq("user_email", userEmail)
    .eq("room_id", roomId);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ data });
});

// app.use("/pdfs", express.static("pdfs"));

// app.post("/download-pdf", async (req, res) => {
//   console.log("server pdf");

//   try {
//     const { markdown } = req.body;
//     console.log(markdown, "MARKDOWN");
//     if (!markdown) return res.status(400).send("Markdown content is required!");

//     // Convert Markdown to PDF
//     const pdfResult = await mdToPdf({ content: markdown });

//     if (!pdfResult || !pdfResult.content) {
//       throw new Error("PDF conversion failed!");
//     }
//     // Ensure "pdfs" directory exists
//     const pdfDir = path.join(process.cwd(), "pdfs");
//     if (!fs.existsSync(pdfDir)) {
//       console.log("creating file..");
//       fs.mkdirSync(pdfDir, { recursive: true });
//     }

//     // Generate unique filename and save PDF
//     const pdfFilename = `document-${Date.now()}.pdf`;
//     console.log(pdfFilename, "FILENAME");

//     const outputPath = path.join(pdfDir, pdfFilename);
//     fs.writeFileSync(outputPath, pdfResult.content);
//     const sendData = {
//       downloadUrl: `http://localhost:${4000}/pdfs/${pdfFilename}`,
//     };
//     // Return download URL
//     return res.json(sendData);
//   } catch (error) {
//     res.status(500).send({ msg: "Error generating your pdf", error });
//   }
// });

app.get("/roomInfo/:roomId", (req, res) => {
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
      documents: [],
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
    if (!activeRooms[roomId]) {
      console.log("Room ID does not exist!");
      socket.emit("error", "Room ID does not exist");
      return;
    }

    socket.join(roomId);
    activeRooms[roomId].participants.push({ ...userInfo, socketID: socket.id });
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
    for (const roomID in activeRooms) {
      let result = activeRooms[roomID].participants?.find(
        (p) => p.socketID === socket.id
      );

      if (result) {
        activeRooms[roomID].participants = activeRooms[
          roomID
        ].participants.filter((p) => p.socketID != socket.id);
        console.log("FILTERED ROOM:", activeRooms);
        io.to(roomID).emit("user-left", activeRooms[roomID], result);
        return;
      }
    }
  });
});

server.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
