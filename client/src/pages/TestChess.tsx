import { Chessboard } from "react-chessboard";
import { Chess, Square } from "chess.js";
import { useMemo, useState } from "react";

const TestChess = () => {
  const [chess, setChess] = useState(new Chess());
  const [hightLightSquares, setHightLightSquares] = useState<string[]>([]);

  console.log(hightLightSquares);

  // ========== function ========== //
  // custom square styles (show square that piece can move to)
  const squareThatPieceCanMoveTo = (square: Square) => {
    const moves = chess.moves({ square: square, verbose: true });

    if (moves.length === 0) {
      setHightLightSquares([]);
      return;
    }

    const newHighLightSq = moves.map((move) => move.to);
    setHightLightSquares(newHighLightSq);
  };
  const addMovePreview = () => {
    const highlightStyle = {
      background:
        "radial-gradient(circle, rgba(0, 0, 0,0.15) 30%, transparent 0%)",
      borderRadius: "50%",
    };

    const styles: Record<string, React.CSSProperties> = {};

    hightLightSquares.forEach((square) => {
      styles[square] = highlightStyle;
    });

    return styles;
  };

  // ========== variable ========== //
  const customSquareStyles = useMemo(addMovePreview, [hightLightSquares]);

  return (
    <div className="py-10 pl-[15rem] min-h-[100vh] h-1 bg-gray-800">
      <div className="flex gap-4 h-full w-full">
        <div className="flex-shrink flex-grow max-w-[42rem] h-full w-full">
          <div className="rounded-md overflow-hidden">
            <Chessboard
              onSquareClick={squareThatPieceCanMoveTo}
              customSquareStyles={customSquareStyles}
            />
          </div>
        </div>
        <div className="bg-gray-900 rounded-md flex-grow flex-shrink max-w-[26rem] "></div>
      </div>
    </div>
  );
};

export default TestChess;
