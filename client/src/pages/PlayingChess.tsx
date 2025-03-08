import { Chessboard } from "react-chessboard";
import { useChessLogic } from "../hooks/useChessLogic";
import { useEffect, useRef, useState } from "react";

import socket from "../socket/socket";
import useAuthStore from "../zustand/useAuthStore";

const PlayingChess = () => {
  const {
    game,
    gameState,
    customSquareStyles,
    onDrop,
    squareThatPieceCanMoveTo,
    you,
    roomInfo,
    friend,
  } = useChessLogic();

  console.log(roomInfo);

  // ========== Zustand state ========== //
  const { user } = useAuthStore();

  // ========== useRef ========== //
  const inputRef = useRef<HTMLInputElement>(null);

  // ====== Room function ====== //
  const createRoom = () => {
    const data = {
      userId: user?.userId,
      username: user?.username,
    };

    socket.emit("room:create", data);
  };

  const joinRoom = () => {
    if (!inputRef?.current?.value) {
      console.log("Please enter the room to join !");
      return;
    }

    const data = {
      userId: user?.userId,
      username: user?.username,
      roomForJoining: inputRef.current.value,
    };

    if (inputRef) socket.emit("room:join", data);
  };

  return (
    <div className="py-10 pl-[15rem] min-h-[100vh] h-1 bg-gray-800">
      <div className="flex gap-4 h-full w-full">
        <div className="flex-shrink flex-grow max-w-[42rem] h-full w-full">
          <div className="rounded-md overflow-hidden">
            <Chessboard
              customSquareStyles={customSquareStyles}
              position={game.fen()}
              onPieceDrop={onDrop}
              onSquareClick={squareThatPieceCanMoveTo}
              boardOrientation={`${you?.color === "w" ? "white" : "black"}`}
            />
            <p className="text-red-700">{gameState}</p>
          </div>
        </div>
        <div className="bg-gray-900 rounded-md flex-grow flex-shrink max-w-[26rem] ">
          <button
            className="text-white border-2 p-2 rounded-md"
            onClick={createRoom}
          >
            Create Room
          </button>
          <button
            className="text-white border-2 p-2 rounded-md"
            onClick={joinRoom}
          >
            Join Room
          </button>
          <input type="text" ref={inputRef} />
        </div>
      </div>
    </div>
  );
};

export default PlayingChess;
