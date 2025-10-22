import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  },
});

export function getReceiverSocketId(userId){
  return userSocketMap[userId];
};

const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  // 🚀 Corrected line
  const { userId } = socket.handshake.query;

  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOlineUsers", Object.keys(userSocketMap)); // renvoie à tous les clients

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
    // Supprimer l'utilisateur de la map
    for (const key in userSocketMap) {
      if (userSocketMap[key] === socket.id) delete userSocketMap[key];
    }
    io.emit("getOlineUsers", Object.keys(userSocketMap));
  });

  socket.on("sendMessage", (messageData) => {
    console.log(" Message reçu:", messageData);
    io.emit("receiveMessage", messageData);
  });
});

export { io, app, server };
     