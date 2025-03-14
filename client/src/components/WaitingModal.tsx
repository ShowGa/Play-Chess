const WaitingModal = () => {
  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
      <div className="bg-gray-900 rounded-lg shadow-lg w-[20rem] overflow-hidden">
        {/* Header */}
        <div className="p-4 text-center border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">Rematching...</h2>
        </div>

        {/* Loading Animation */}
        <div className="p-8 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            {/* add delay */}
            <div className="w-3 h-3 bg-white rounded-full bounce delay-1"></div>
            <div className="w-3 h-3 bg-white rounded-full bounce delay-2"></div>
            <div className="w-3 h-3 bg-white rounded-full bounce"></div>
          </div>
          <p className="text-white text-lg">Waiting for response...</p>
        </div>
      </div>
    </div>
  );
};

export default WaitingModal;
