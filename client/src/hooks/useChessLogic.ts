import { Chess, Square } from "chess.js";
import { useEffect, useMemo, useState } from "react";
import socket from "../socket/socket";
import { ChessMove, Player, RoomInfo, stateData } from "../types/types";
import useAuthStore from "../zustand/useAuthStore";

export const useChessLogic = () => {
  // ========== Game State ========== //
  const [game, setGame] = useState(new Chess()); // initialize the chess game
  const [hightLightSquares, setHightLightSquares] = useState<string[]>([]); // for preview move
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(
    null
  );
  const [gameState, setGameState] = useState<stateData | null>(null);
  const [fen, setFen] = useState(game.fen());
  const [checkedPiece, setCheckedPiece] = useState<Square | undefined>(
    undefined
  );

  // ========== Room State ========== //
  const [roomInfo, setRoomInfo] = useState<RoomInfo | null>(null);
  const [you, setYou] = useState<Player | undefined>(undefined);
  const [friend, setFriend] = useState<Player | undefined>(undefined);

  console.log(gameState);

  // ========== Zustand state ========== //
  const { user } = useAuthStore();

  // ========== Game function ========== //
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
  const addStyleToSquare = () => {
    const highlightStyle = {
      background:
        "radial-gradient(circle, transparent 60%, rgba(0, 0, 0, 0.2) 65%)",
      borderRadius: "50%",
    };

    const lastMoveStyle = {
      backgroundColor: "rgba(255, 158, 0, 0.4)",
    };

    const checkedPieceStyle = {
      backgroundColor: "rgba(255, 0, 0, 0.6)",
    };

    const styles: Record<string, React.CSSProperties> = {};

    hightLightSquares.forEach((square) => {
      styles[square] = highlightStyle;
    });

    if (lastMove) {
      styles[lastMove.from] = lastMoveStyle;
      styles[lastMove.to] = lastMoveStyle;
    }

    if (checkedPiece) {
      styles[checkedPiece] = checkedPieceStyle;
    }

    return styles;
  };
  // make a move
  const movePiece = (moveData: ChessMove) => {
    try {
      const move = game.move(moveData);

      if (!move) return false;

      setFen(game.fen());
      setCheckedPiece(undefined);
      // updateGameStatus();

      return move;
    } catch (e) {
      // show the checked piece when the move is invalid and the gameState is check
      showCheckedPiece();

      console.error("Error occurred when moving the piece: ", e);
      return false;
    }
  };

  const handleMove = (
    from: string,
    to: string,
    promotion?: string,
    isOpponentMove = false
  ) => {
    const move = movePiece({ from, to, promotion });

    if (!move) return false;

    // setLastMove
    setLastMove({ from, to });

    // reset the game state
    setGameState(null);

    if (!isOpponentMove) {
      socket.emit("chess:move", {
        player: you,
        roomId: roomInfo?.roomId,
        move,
      });
    }

    return true;
  };

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    // check is your turn
    if (game.turn() !== you?.color || roomInfo?.roomState !== "start")
      return false;

    setHightLightSquares([]);

    return handleMove(sourceSquare, targetSquare);
  };
  // opponent make a move
  const opponentMakeAMove = (from: string, to: string, promotion: string) => {
    handleMove(from, to, promotion, true);
  };

  const promotionMove = (
    piece: string | undefined,
    promoteFromSquare: string | undefined,
    promoteToSquare: string | undefined
  ) => {
    if (!piece || !promoteFromSquare || !promoteToSquare) return false;

    const promoPiece = promotionConverter(piece);

    return handleMove(promoteFromSquare, promoteToSquare, promoPiece);
  };

  const promotionConverter = (promo: string) => {
    if (promo === "wQ" || promo === "bQ") {
      return "q";
    } else if (promo === "wN" || promo === "bN") {
      return "n";
    } else if (promo === "wR" || promo === "bR") {
      return "r";
    } else if (promo === "wB" || promo === "bB") {
      return "b";
    } else {
      return "";
    }
  };

  const showCheckedPiece = () => {
    if (gameState?.gameState !== "check") return;

    const turn = game.turn();

    const checkedPiece = game
      .board()
      .flat()
      .find((piece) => {
        return piece && piece?.color === turn && piece?.type === "k";
      });

    // square of the checked piece
    const square = checkedPiece?.square;

    setCheckedPiece(square);

    setTimeout(() => {
      setCheckedPiece(undefined);
    }, 2000);
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
  };

  // socket.io effect
  useEffect(() => {
    if (!socket) return;

    socket.on("room:created", (roomInfo: RoomInfo) => {
      setRoomInfo(roomInfo);
      setYou(roomInfo.players[0]);
    });

    socket.on("room:joined", (roomInfo: RoomInfo) => {
      setRoomInfo(roomInfo);

      roomInfo.players.forEach((player) => {
        if (player.userId === user?.userId) {
          setYou(player);
        } else {
          setFriend(player);
        }
      });
    });

    socket.on(
      "chess:moved",
      (moveData: { from: string; to: string; promotion: string }) => {
        const { from, to, promotion } = moveData;

        opponentMakeAMove(from, to, promotion);
      }
    );

    socket.on("chess:game-state-change", (stateData: stateData) => {
      setGameState(stateData);
    });

    return () => {
      console.log("Cleaning up socket events...");
      socket.off("room:created");
      socket.off("room:joined");
      socket.off("chess:moved");
      socket.off("chess:game-state-change");
    };
  }, []); // maybe modify

  // ========== variable ========== //
  const customSquareStyles = useMemo(addStyleToSquare, [
    hightLightSquares,
    lastMove,
    checkedPiece,
  ]);

  return {
    game,
    gameState,
    customSquareStyles,
    fen,
    you,
    roomInfo,
    friend,
    onDrop,
    squareThatPieceCanMoveTo,
    promotionMove,
  };
};
