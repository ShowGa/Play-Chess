import { v4 as uuidv4 } from "uuid";

import { ChessManager } from "../chess_class/ChessManager.js";

// 儲存遊戲室資料，使用 Map 存儲
let gameRooms = new Map();

export const socketIoHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // modify => login system
    socket.on("room:create", (data) => {
      // create roomId
      const roomId = uuidv4();

      // extract data
      const { userId, username } = data; // modify => game rule system

      // create room
      const chessRoom = {
        roomId,
        players: [{ userId, username }],
        roomState: "waiting",
        gameManager: new ChessManager(),
      };

      // add game room into Map
      gameRooms.set(roomId, chessRoom);

      // join the roomId into socket
      socket.join(roomId);

      // send back room-created
      const { gameManager, ...roomInfo } = chessRoom;

      socket.emit("room:created", roomInfo); // for sending to friends
    });

    socket.on("room:join", (data) => {
      const { userId, username, roomForJoining } = data;

      // find the room
      const roomFound = gameRooms.get(roomForJoining);

      if (!roomFound) {
        socket.emit("error", { message: "Room not found." });
        return;
      }
      if (roomFound.players.length >= 2) {
        socket.emit("error", { message: "Room is full." });
        return;
      }

      roomFound.players.push({ userId, username });
      roomFound.roomState = "start";

      socket.join(roomForJoining);

      const { gameManager, ...roomInfo } = roomFound;
      io.to(roomForJoining).emit("room:joined", roomInfo);
    });
  });
};
