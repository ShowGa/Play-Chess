import { Chessboard } from "react-chessboard";
import { useChessLogic } from "../hooks/useChessLogic";
import { useRef } from "react";

import socket from "../socket/socket";
import useAuthStore from "../zustand/useAuthStore";

import GameOverModal from "../components/GameOverModal";

const PlayingChess = () => {
  const {
    // game,
    gameState,
    customSquareStyles,
    fen,
    onDrop,
    squareThatPieceCanMoveTo,
    promotionMove,
    you,
    roomInfo,
    friend,
  } = useChessLogic();

  console.log(roomInfo);
  console.log("==== Friend ====" + friend);

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
        <div className="bg-gray-900 rounded-md flex-grow flex-shrink max-w-[26rem] p-6">
          <div className="flex flex-col gap-6">
            {/* Room Info Section */}
            {roomInfo ? (
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-white text-lg font-semibold mb-2">
                  Room Info
                </h3>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={roomInfo.roomId}
                    readOnly
                    className="bg-gray-700 text-white px-3 py-2 rounded flex-1 text-sm"
                  />
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(roomInfo.roomId)
                    }
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm transition-colors"
                  >
                    Copy ID
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <h2 className="text-white text-2xl font-bold text-center">
                  Play Chess
                </h2>

                <button
                  className="flex items-center bg-[#82bf56] hover:bg-[#75ad4d] text-white p-4 rounded-lg transition-colors"
                  onClick={createRoom}
                >
                  <div className="bg-white/20 p-2 rounded-lg mr-4">
                    <span className="text-2xl">🎮</span>
                  </div>
                  <div className="text-left">
                    <div className="text-xl font-semibold">Create Room</div>
                    <div className="text-sm text-white/80">
                      Start a new game room
                    </div>
                  </div>
                </button>

                <div className="flex flex-col gap-2">
                  <div className="relative">
                    <input
                      type="text"
                      ref={inputRef}
                      placeholder="Enter Room ID"
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-lg transition-colors w-full"
                    onClick={joinRoom}
                  >
                    <div className="text-center">
                      <div className="text-xl font-semibold">Join Room</div>
                      <div className="text-sm text-white/80">
                        Enter a room ID to join
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Players Info Section */}
            {roomInfo && (
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-white text-lg font-semibold mb-3">
                  Players
                </h3>
                <div className="flex flex-col gap-2">
                  {you && (
                    <div className="flex items-center gap-2 text-white">
                      <span className="bg-green-500 w-2 h-2 rounded-full"></span>
                      <span>
                        {you.username} (You) -{" "}
                        {you.color === "w" ? "White" : "Black"}
                      </span>
                    </div>
                  )}
                  {friend && (
                    <div className="flex items-center gap-2 text-white">
                      <span className="bg-green-500 w-2 h-2 rounded-full"></span>
                      <span>
                        {friend.username} -{" "}
                        {friend.color === "w" ? "White" : "Black"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayingChess;
