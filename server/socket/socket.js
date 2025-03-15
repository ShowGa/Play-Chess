import { v4 as uuidv4 } from "uuid";

import { ChessManager } from "../chess_class/ChessManager.js";

let gameRooms = new Map();
// {
//   roomId,
//   players: [{ userId, username, color }],
//   roomState: "waiting",
//   gameManager: new ChessManager(),
// }

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
        players: [{ userId, username, color: null }],
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

      // random color
      const secPlayerColor = Math.random() < 0.5 ? "w" : "b";

      roomFound.players.push({ userId, username, color: secPlayerColor });
      roomFound.roomState = "start";
      // change first player color
      roomFound.players[0].color = secPlayerColor === "w" ? "b" : "w";

      socket.join(roomForJoining);

      const { gameManager, ...roomInfo } = roomFound;
      io.to(roomForJoining).emit("room:joined", roomInfo);
    });

    socket.on("chess:move", (data) => {
      /*
        ========= "data" structure ==========
        {
          userId:
          username:
          color:
          move: {from, to, promotion}
        }
      */

      // const
      const color = data.player.color;
      const move = data.move;
      const roomId = data.roomId;

      // get the room game first
      const gameRoomFound = gameRooms.get(roomId);

      // check if the turn is for the current request
      const resultMove = gameRoomFound.gameManager.move(color, move);

      if (!resultMove) return;

      const resultMoveData = {
        from: resultMove.from,
        to: resultMove.to,
        promotion: resultMove.promotion,
      };

      socket.to(roomId).emit("chess:moved", resultMoveData); // modify => to the opponent

      // check if the game checker => see if the game is over
      const stateData = gameRoomFound.gameManager.gameStateMessageData(
        gameRoomFound.players
      );

      if (stateData) {
        if (stateData.gameover) {
          gameRoomFound.roomState = "gameover";
        }
        io.to(roomId).emit("chess:game-state-change", stateData);
      }
    });

    socket.on("message:send", (message) => {
      // find if the room is exist
      const roomFound = gameRooms.get(message.roomId);

      if (!roomFound) return;

      // just straightly send to the room member
      socket.to(roomFound.roomId).emit("message:receive", message);
    });

    socket.on("emote:send", (data) => {
      // find if the room exists
      const roomFound = gameRooms.get(data.roomId);

      if (!roomFound) return;

      // send the emote to other room members
      socket.to(roomFound.roomId).emit("emote:receive", {
        sender: data.sender,
        emoteUrl: data.emoteUrl,
      });
    });

    socket.on("chess:rematch-request", (data) => {
      const { sender, roomId } = data;

      const roomFound = gameRooms.get(roomId);

      if (!roomFound) return;
      if (roomFound.roomState !== "gameover") return;

      // check if the sender is in the room
      const senderFound = roomFound.players.find(
        (player) => player.userId === sender
      );

      if (!senderFound) return;

      // roomFound rematch state => for later checking confirmation validity
      roomFound.rematchRequested = true;
      roomFound.roomState = "rematch-pending";

      // send rematch confirmation
      const rematchConfirmationData = {
        ...data,
        message: `${sender} wants to rematch.`,
      };

      socket
        .to(roomId)
        .emit("chess:rematch-confirmation", rematchConfirmationData);
    });

    socket.on("chess:rematch-confirmation", (data) => {
      const { sender, roomId, accept } = data;

      const roomFound = gameRooms.get(roomId);

      if (!roomFound) return;

      // check rematchRequested
      if (!roomFound.rematchRequested) return;
      if (roomFound.roomState !== "rematch-pending") return;

      // check if the sender is in the room
      const senderFound = roomFound.players.find(
        (player) => player.userId === sender
      );

      if (!senderFound) return;

      if (accept) {
        roomFound.gameManager.rematch();

        // reset rematchRequested
        roomFound.rematchRequested = false;
        roomFound.roomState = "start";

        // swap player colors
        roomFound.players.forEach((player) => {
          player.color = player.color === "w" ? "b" : "w";
        });

        // send to both players in the room => use io ?
        const { gameManager, ...roomInfo } = roomFound;
        io.to(roomId).emit("room:updated", roomInfo);
        io.to(roomId).emit("chess:game-restart", accept);
      } else {
        // send the decline result to the other player
        roomFound.rematchRequested = false;
        roomFound.roomState = "gameover";
        socket.to(roomId).emit("chess:game-restart", accept);
      }
    });
  });
};
