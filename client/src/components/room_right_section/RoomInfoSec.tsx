import { useChess } from "../../context/ChessContext";

import { PiShareNetworkFill } from "react-icons/pi";
import { BsFillSendFill } from "react-icons/bs";
import { BsEmojiSunglassesFill } from "react-icons/bs";

const RoomInfoSec = () => {
  const { roomInfo, you, friend } = useChess();

  return (
    <>
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-white text-lg font-semibold mb-3">Players</h3>
        <div className="flex flex-col gap-2">
          {you && (
            <div className="flex items-center gap-2 text-white">
              <span className="bg-green-500 w-2 h-2 rounded-full"></span>
              <span>
                {you.username} (You) - {you.color === "w" ? "White" : "Black"}
              </span>
            </div>
          )}
          {friend && (
            <div className="flex items-center gap-2 text-white">
              <span className="bg-green-500 w-2 h-2 rounded-full"></span>
              <span>
                {friend.username} - {friend.color === "w" ? "White" : "Black"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* chat section */}
      <div className="flex-grow flex flex-col gap-2">
        {/* chat messages */}
        {/* make the message box not to expend */}
        <div className="text-white max-h-[60vh] overflow-auto p-2">
          <p>Hello</p>
          <p>Hello</p>
          <p>Hello</p>
          <p>Hello</p>
          <p>Hello</p>
          <p>Hello</p>
          <p>Hello</p>
          <p>Hello</p>
          <p>Hello</p>
          <p>Hello</p>
          <p>Hello</p>
          <p>Hello</p>
          <p>Hello</p>
          <p>Hello</p>
          <p>Hello</p>
          <p>Hello</p>
          <p>Hello</p>
          <p>Hello</p>
          <p>Hello</p>
          <p>Hello</p>
          <p>Hello</p>
          <p>Hello</p>
          <p>Hello</p>
          <p>Hello</p>
          <p>Hello</p>
          <p>Hello</p>
          <p>Hello</p>
          <p>Hello</p>
          <p>Hello</p>
          <p>Hello</p>
        </div>

        {/* input section */}
        <div className="flex items-center gap-2 bg-gray-800 p-2 pr-4 rounded-lg">
          <input
            type="text"
            placeholder="Message"
            className="flex-grow bg-transparent border-none outline-none text-white"
          />

          <button className="text-gray-400 text-2xl font-semibold hover:text-white self-end">
            <BsEmojiSunglassesFill />
          </button>
          <button className="text-gray-400 text-2xl font-semibold hover:text-white">
            <BsFillSendFill />
          </button>
        </div>
      </div>

      {/* functional buttons */}
      <div>
        <div className="flex items-center">
          <button
            onClick={() =>
              navigator.clipboard.writeText(roomInfo?.roomId || "")
            }
          >
            <p className="text-white text-2xl font-semibold">
              <PiShareNetworkFill />
            </p>
          </button>
        </div>
      </div>
    </>
  );
};

export default RoomInfoSec;
