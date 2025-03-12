import { Chessboard } from "react-chessboard";
import { useRef } from "react";

import socket from "../socket/socket";
import useAuthStore from "../zustand/useAuthStore";

import GameOverModal from "../components/GameOverModal";
import { useChess } from "../context/ChessContext";
import CreateJoinSec from "../components/room_right_section/CreateJoinSec";
import RoomInfoSec from "../components/room_right_section/RoomInfoSec";
const PlayingChess = () => {
  const {
    gameState,
    customSquareStyles,
    fen,
    onDrop,
    squareThatPieceCanMoveTo,
    promotionMove,
    you,
    roomInfo,
    friend,
  } = useChess();

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
          <div className="rounded-md overflow-hidden relative">
            <Chessboard
              customSquareStyles={customSquareStyles}
              position={fen}
              onPieceDrop={onDrop}
              onSquareClick={squareThatPieceCanMoveTo}
              onPromotionPieceSelect={promotionMove}
              boardOrientation={`${you?.color === "w" ? "white" : "black"}`}
            />
            <p className="text-red-700"></p>

            {/* <GameOverModal /> */}
          </div>
        </div>

        {/* right section  */}
        <div className="bg-gray-900 rounded-md flex-grow flex-shrink max-w-[26rem] p-3">
          <div className="flex flex-col gap-6 h-full">
            {/* Room Info Section */}
            {roomInfo ? (
              <RoomInfoSec />
            ) : (
              <CreateJoinSec
                createRoom={createRoom}
                joinRoom={joinRoom}
                inputRef={inputRef}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayingChess;
