const express = require("express");
const cors = require("cors");
const { nanoid } = require("nanoid");
const db = require("./database/db");
const http = require("http");
const { Server } = require("socket.io");
const upload = require("./middleware/upload");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE"]
  }
});
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`Rooms for ${socket.id}:`, [...socket.rooms]);
    console.log(socket.rooms);
    console.log(`${socket.id} joined ${roomId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const PORT = 5000;
app.get("/",(req,res) => {
  res.send("OTAC server is Running");
});

app.post("/create",(req , res) => {
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  if (!req.body || !req.body.content) {
    return res.status(400).json({
      message: "Content is required",
    });
  }

  const content = req.body.content;
  const id = nanoid(6);

  const created_at = Date.now();
  const expires_at = created_at + 5 * 60 * 1000;
  const status = "active";

  console.log(id);

  const statement = db.prepare(`
    INSERT INTO clips (
      id,
      type,
      content,
      filename,
      filepath,
      filesize,
      mimetype,
      status,
      created_at,
      expires_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  statement.run(
    id,
    "text",
    content,
    null,
    null,
    null,
    null,
    status,
    created_at,
    expires_at
  );

  res.json({
    id,
    expires_at
  });
});

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "No file uploaded",
    });
  }

  const id = nanoid(6);
  const created_at = Date.now();
  const expires_at = created_at + 5 * 60 * 1000;
  const status = "active";

  const statement = db.prepare(`
    INSERT INTO clips (
      id,
      type,
      content,
      filename,
      filepath,
      filesize,
      mimetype,
      status,
      created_at,
      expires_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  statement.run(
    id,
    "file",
    null,
    req.file.originalname,
    req.file.filename,
    req.file.size,
    req.file.mimetype,
    status,
    created_at,
    expires_at
  );

  res.json({
    id,
    filename: req.file.originalname,
    storedAs: req.file.filename,
    expires_at,
  });
});

app.get("/clip/:id", (req , res) => {
  const id = req.params.id;
  console.log(id);

  const statement = db.prepare(`
    SELECT * FROM clips
    WHERE id = ?
  `);

  const clip = statement.get(id);
  
  if(!clip){
    return res.status(404).json({
      message: "clipboard not found"
    });

  }

  const currentTime = Date.now();

  if(currentTime > clip.expires_at){
    return res.status(410).json({
      message:"clipboard has expires"
    });
  }

  console.log(clip);

  if (clip.type === "text") {
    return res.json({
      type: "text",
      content: clip.content,
    });
  }

  if (clip.type === "file") {
    return res.json({
      type: "file",
      filename: clip.filename,
      filepath: clip.filepath,
      filesize: clip.filesize,
      mimetype: clip.mimetype,
    });
  }

  res.status(500).json({
    message: "Unknown clipboard type",
  });
});

app.delete("/clip/:id", (req, res) => {
  const id = req.params.id;

  const statement = db.prepare(`
    UPDATE clips
    SET status = ?
    WHERE id = ?
  `);
  
  statement.run("consumed", id);

  console.log("Emitting to room:", id);
  io.to(id).emit("clipboard-consumed");

  console.log(`Clipboard ${id} consumed`);

  res.json({
    message: "Clipboard marked as consumed"
  });
});

app.get("/history", (req, res) => {
  const statement = db.prepare(`
    SELECT *
    FROM clips
    ORDER BY created_at DESC
  `);

  const history = statement.all();

  res.json(history);
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});