const express = require("express");
const http = require("http");
const path = require("path");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

mongoose.connect("mongodb://127.0.0.1:27017/code-block");
const roomCounts = {};
const db = mongoose.connection;

db.on("connected", () => {
  console.log("Mongoose connection open");
});

const CodeBlock = mongoose.model(
  "CodeBlock",
  new mongoose.Schema({
    title: String,
    code: String,
    accessed: Boolean,
    solution: String,
  })
);

app.use(cors());
app.use(express.json());

app.get("/api/codeblocks", async (req, res) => {
  const codeblocks = await CodeBlock.find();
  res.json(codeblocks);
});

app.get("/api/codeblocks/:id", async (req, res) => {
  const codeblock = await CodeBlock.findById(req.params.id);
  codeblock["accessed"] = roomCounts[codeblock._id].length === 2;
  res.json(codeblock);
});

app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

io.on("connection", (socket) => {
  console.log("---------------------------------");
  console.log("Client connected:", socket.id);

  socket.on("joinCodeblock", (codeblockId, callback) => {
    if (!roomCounts[codeblockId]) {
      roomCounts[codeblockId] = [];
    }
    roomCounts[codeblockId].push(socket.id);
    console.log(`Client joined codeblock ${codeblockId}`);
    callback({ status: "joined" });
  });

  socket.on("codeUpdate", (data) => {
    socket.broadcast.emit("codeUpdate", data);
  });

  socket.on("disconnect", () => {
    Object.keys(roomCounts).forEach((roomKey) => {
      roomCounts[roomKey] = roomCounts[roomKey].filter(
        (clientId) => clientId !== socket.id
      );
    });
    console.log("Client disconnected:", socket.id);
  });
});

const ensureCodeBlocks = async () => {
  const count = await CodeBlock.countDocuments();
  if (count !== 0) return;

  await CodeBlock.create([
    {
      title: "Async Case",
      code: "async function fetchData() { return await fetch('api/data'); }",
      solution:
        "async function fetchData() { return await fetch('api/data').then(res => res.json()); }",
    },
    {
      title: "Callback Hell",
      code: "fs.readFile('file.txt', function(err, data) { console.log(data); });",
      solution:
        "fs.promises.readFile('file.txt').then(data => console.log(data));",
    },
    {
      title: "Promise Example",
      code: "new Promise((resolve, reject) => { resolve('Success!'); })",
      solution:
        "new Promise((resolve, reject) => { setTimeout(() => resolve('Success!'), 1000); })",
    },
    {
      title: "Fetch API Usage",
      code: "fetch('api/data').then(res => res.json()).then(data => console.log(data));",
      solution:
        "async function getData() { const response = await fetch('api/data'); const data = await response.json(); console.log(data); }",
    },
  ]);
};
ensureCodeBlocks();
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
