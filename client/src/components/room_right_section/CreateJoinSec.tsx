import React from "react";

const CreateJoinSec = ({
  createRoom,
  joinRoom,
  inputRef,
}: {
  createRoom: () => void;
  joinRoom: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-white text-2xl font-bold text-center">Play Chess</h2>

      <button
        className="flex items-center bg-[#82bf56] hover:bg-[#75ad4d] text-white p-4 rounded-lg transition-colors"
        onClick={createRoom}
      >
        <div className="bg-white/20 p-2 rounded-lg mr-4">
          <span className="text-2xl">🎮</span>
        </div>
        <div className="text-left">
          <div className="text-xl font-semibold">Create Room</div>
          <div className="text-sm text-white/80">Start a new game room</div>
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
            <div className="text-sm text-white/80">Enter a room ID to join</div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default CreateJoinSec;
