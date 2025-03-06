import { Chess, Square } from "chess.js";
import { useEffect, useMemo, useState } from "react";

export const useChessLogic = () => {
  const [game, setGame] = useState(new Chess()); // initialize the chess game
  const [hightLightSquares, setHightLightSquares] = useState<string[]>([]); // for preview move
  const [gameState, setGameState] = useState<string>("playing");

  // ========== function ========== //
  // custom square styles (show square that piece can move to)
  const squareThatPieceCanMoveTo = (square: Square) => {
    const moves = game.moves({ square: square, verbose: true });

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
        "radial-gradient(circle, transparent 60%, rgba(0, 0, 0, 0.2) 65%)",
      borderRadius: "50%",
    };

    const styles: Record<string, React.CSSProperties> = {};

    hightLightSquares.forEach((square) => {
      styles[square] = highlightStyle;
    });

    return styles;
  };

  // make a move
  const makeAMove = (move: {
    from: string;
    to: string;
    promotion?: string;
  }) => {
    try {
      // react immutable
      const gameCopy = new Chess(game.fen());
      const result = gameCopy.move(move);

      // valid move
      if (result) {
        setGame(gameCopy);
        return true;
      }

      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  };
  const onDrop = (sourceSquare: string, targetSquare: string) => {
    // move
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (!move) return false;

    // clear the preview
    setHightLightSquares([]);

    return true;
  };

  const updateGameStatus = () => {
    let newStatus = "";

    if (game.isCheck()) {
      newStatus = "Check！";
    }

    if (game.isCheckmate()) {
      newStatus =
        "Check Mate ! Game Over , " +
        (game.turn() === "w" ? "Black" : "White") +
        "Win！";
    } else if (game.isDraw()) {
      newStatus = "Tie !";
    }

    setGameState(newStatus);
  };

  useEffect(() => {
    updateGameStatus();
  }, [game]);

  // ========== variable ========== //
  const customSquareStyles = useMemo(addMovePreview, [hightLightSquares]);

  return {
    game,
    gameState,
    onDrop,
    squareThatPieceCanMoveTo,
    customSquareStyles,
  };
};
