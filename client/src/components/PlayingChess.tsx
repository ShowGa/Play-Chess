import { Chessboard } from "react-chessboard";

const PlayingChess = () => {
  return (
    <div className="py-10 pl-[15rem] min-h-[100vh] h-1 bg-gray-800">
      <div className="flex gap-4 h-full w-full">
        <div className="flex-shrink flex-grow max-w-[42rem] h-full w-full">
          <div className="rounded-md overflow-hidden">
            <Chessboard />
          </div>
        </div>
        <div className="bg-gray-900 rounded-md flex-grow flex-shrink max-w-[26rem] "></div>
      </div>
    </div>
  );
};

export default PlayingChess;
