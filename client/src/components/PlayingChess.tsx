import { Chessboard } from "react-chessboard";
import { useChessLogic } from "../hooks/useChessLogic";

const PlayingChess = () => {
  const {
    game,
    gameState,
    customSquareStyles,
    onDrop,
    squareThatPieceCanMoveTo,
  } = useChessLogic();

  console.log(gameState);

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
            />
            <p className="text-red-700">{gameState}</p>
          </div>
        </div>
        <div className="bg-gray-900 rounded-md flex-grow flex-shrink max-w-[26rem] "></div>
      </div>
    </div>
  );
};

export default PlayingChess;
