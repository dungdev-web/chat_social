const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("send-message", (text) => {
    // ❌ io.emit("receive-message", text);

    // ✅ CHỈ gửi cho người khác
    socket.broadcast.emit("receive-message", text);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(3001, () => {
  console.log("Socket server running on http://localhost:3001");
});
