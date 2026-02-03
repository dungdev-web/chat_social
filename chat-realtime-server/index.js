const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
const PORT = process.env.PORT ;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// uid -> socketId
const users = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // ======================
  // REGISTER USER
  // ======================
  socket.on("register", (uid) => {
    users.set(uid, socket.id);
    console.log("Register:", uid);
  });

  // ======================
  // CHAT
  // ======================
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
  });
  socket.on("typing", ({ roomId }) => {
    socket.to(roomId).emit("user-typing");
  });

  socket.on("stop-typing", ({ roomId }) => {
    socket.to(roomId).emit("user-stopped-typing");
  });

  socket.on("send-message", ({ roomId, message }) => {
    socket.to(roomId).emit("receive-message", message);
  });

  // ======================
  // CALL AUDIO (WebRTC signaling)
  // ======================

  // ======================
  // CALL AUDIO (WEBRTC SIGNALING)
  // ======================

  socket.on("call-user", ({ from, to, offer }) => {
    const toSocket = users.get(to);
    if (toSocket) {
      io.to(toSocket).emit("incoming-call", { from, offer });
    }
  });

  socket.on("answer-call", ({ to, answer }) => {
    const toSocket = users.get(to);
    if (toSocket) {
      io.to(toSocket).emit("call-answered", { answer });
    }
  });

  socket.on("ice-candidate", ({ to, candidate }) => {
    const toSocket = users.get(to);
    if (toSocket) {
      io.to(toSocket).emit("ice-candidate", { candidate });
    }
  });

  socket.on("end-call", ({ to }) => {
    const toSocket = users.get(to);
    if (toSocket) {
      io.to(toSocket).emit("call-ended");
    }
  });

  socket.on("reject-call", ({ to }) => {
    const toSocket = users.get(to);
    if (toSocket) {
      io.to(toSocket).emit("call-rejected");
    }
  });

  // ======================
  // DISCONNECT
  // ======================
  socket.on("disconnect", () => {
    for (const [uid, sid] of users.entries()) {
      if (sid === socket.id) {
        users.delete(uid);
        console.log("User disconnected:", uid);
      }
    }
  });
});

server.listen(PORT, () => {
  console.log("✅ Socket server running on http://localhost:3001");
});
