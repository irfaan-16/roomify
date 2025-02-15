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

let sceneData = null; // Store the latest scene

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
const activeRooms = {};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socket.on("update-scene", ({ elements, id }) => {
    console.log("server received data", elements);
    socket.broadcast.emit("receive-scene", { elements, id });
  });

  socket.on("create-room", (newRoomId) => {
    // const roomId = uuidv4();
    socket.join(newRoomId);
    // activeRooms[newRoomId] = { host: socket.id, participants: [userInfo] };
    // console.log(activeRooms[newRoomId].participants);
    // console.log(`Room ${newRoomId} created by host ${userInfo.name}`);

    // io.to(newRoomId).emit("room-users", "new participant joineddddd"); // Notify room members

    console.log(socket.rooms);
  });

  socket.on("join-room", ({ roomId, userInfo }) => {
    io.to(roomId).emit("room-users", userInfo); // Notify room members

    socket.join(roomId);
    // activeRooms[roomId].participants.push(userInfo);
    console.log(`User ${socket.id} joined room ${roomId}`);
    socket.emit("room-joined", roomId);
  });

  socket.on("send_message", (roomId, message) => {
    console.log("Server received message:", message); // Debugging
    io.to(roomId).emit("receive_message", { user: socket.id, message }); // Broadcast the message to all clients
  });

  socket.on("editor_changes_send", (documentJSON) => {
    socket.broadcast.emit("editor_changes_received", documentJSON);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

server.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
