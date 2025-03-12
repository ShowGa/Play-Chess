import { FaLeaf } from "react-icons/fa";
import { useChess } from "../context/ChessContext";

const GameOverModal = () => {
  const { gameState, you, friend, setShowGameOverModal } = useChess();

  const isWinner = gameState?.winner?.userId === you?.userId;
  const isDraw = !gameState?.winner;

  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
      <div className="relative bg-gray-900 rounded-lg shadow-lg w-[20rem] overflow-hidden">
        {/* close modal button */}
        <button
          onClick={() => {
            setShowGameOverModal(false);
          }}
          className="absolute right-3 top-3 text-white text-xl"
        >
          X
        </button>

        {/* Header */}
        <div className="p-4 text-center border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">
            {isDraw ? "Draw" : isWinner ? "You Won!" : "You Lost"}
          </h2>
        </div>

        {/* Players Section */}
        <div className="p-6">
          <div className="flex items-center justify-evenly mb-6">
            {/* Player 1 */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-2xl">♟️</span>
              </div>
              <div className="text-left">
                <p className="text-white font-semibold">{you?.username}</p>
                <p className="text-gray-400 text-sm">
                  {you?.color === "w" ? "White" : "Black"}
                </p>
              </div>
            </div>

            {/* VS */}
            <span className="text-gray-500 font-bold">VS</span>

            {/* Player 2 */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-2xl">♟️</span>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">{friend?.username}</p>
                <p className="text-gray-400 text-sm">
                  {friend?.color === "w" ? "White" : "Black"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="p-4 flex flex-col gap-2">
          <button className="w-full bg-[#82bf56] hover:bg-[#75ad4d] text-white py-3 px-4 rounded-lg font-semibold transition-colors">
            Rematch
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button className="bg-gray-800 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors">
              New Bot
            </button>
            <button className="bg-gray-800 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors">
              Game Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;
