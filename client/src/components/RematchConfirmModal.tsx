// useChess

import { useChess } from "../context/ChessContext";

const RematchRequestModal = () => {
  const { rematchMessage, handleRematchConfirmation } = useChess();

  if (!rematchMessage) return null;

  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
      <div className="bg-gray-900 rounded-lg shadow-lg w-[20rem] overflow-hidden">
        {/* Header */}
        <div className="p-4 text-center border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">Rematch Request</h2>
        </div>

        {/* Message Section */}
        <div className="p-6 text-center">
          <p className="text-white text-lg">{rematchMessage}</p>
        </div>

        {/* Buttons */}
        <div className="p-4 flex justify-between">
          <button
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
            onClick={() => handleRematchConfirmation(false)}
          >
            Decline
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
            onClick={() => handleRematchConfirmation(true)}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default RematchRequestModal;
