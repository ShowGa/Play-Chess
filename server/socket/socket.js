import { v4 as uuidv4 } from "uuidv4";
import { io } from "..";

// 儲存遊戲室資料，使用 Map 存儲
let gameRooms = new Map();

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // modify => login system
  socket.on("create-room", (data) => {
    // create roomId
    const roomId = uuidv4();

    // extract data
    const { userId, username } = data;

    // create room
    const chessRoom = {
      name: roomId,
      players: [{ userId, username }],
      roomState: "waiting",
      gameManager: null,
    };

    // add game room into Map
    gameRooms.set(roomId, chessRoom);

    // join the roomId into socket
    socket.join(roomId);

    // send back room-created
    socket.emit("room-created", { roomId }); // for sending to friends
  });
});
