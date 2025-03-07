import express from "express";
import http from "http";
import { Server } from "socket.io";
import { socketIoHandler } from "./socket/socket.js";

const PORT = 8080;

// config
const app = express();
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export const io = new Server(server, { cors: { origin: "*" } });

socketIoHandler(io);
