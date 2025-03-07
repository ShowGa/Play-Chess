import express from "express";
import { Server } from "socket.io";

const PORT = 8080;

// config
const app = express();
const expressServer = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export const io = new Server(expressServer, { cors: { origin: "*" } });
