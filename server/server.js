const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

mongoose.connect("mongodb://127.0.0.1:27017/code-block");

const db = mongoose.connection;

db.on("connected", () => {
  console.log("Mongoose connection open");
});

const CodeBlock = mongoose.model(
  "CodeBlock",
  new mongoose.Schema({
    title: String,
    code: String,
    solution: String,
    accessCount: { type: Number, default: 0 },
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
  res.json(codeblock);
  if (codeblock.accessCount === 0) {
    codeblock.accessCount = 1;
  }
  codeblock.save();
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("code_update", (data) => {
    socket.broadcast.emit("code_update", data);
  });

  socket.on("disconnect", () => {
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
