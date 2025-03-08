import { Chess, Square } from "chess.js";
import { useEffect, useMemo, useState } from "react";
import socket from "../socket/socket";
import { Player, RoomInfo } from "../types/types";
import useAuthStore from "../zustand/useAuthStore";

export const useChessLogic = () => {
  // ========== Game State ========== //
  const [game, setGame] = useState(new Chess()); // initialize the chess game
  const [hightLightSquares, setHightLightSquares] = useState<string[]>([]); // for preview move
  const [gameState, setGameState] = useState<string>("playing");

  // ========== Room State ========== //
  const [roomInfo, setRoomInfo] = useState<RoomInfo | null>(null);
  const [you, setYou] = useState<Player | undefined>(undefined);
  const [friend, setFriend] = useState<Player | undefined>(undefined);

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
  const onDrop = (sourceSquare: string, targetSquare: string) => {
    // 確認是否為當前玩家的回合
    if (game.turn() !== you?.color) return false;

    try {
      // update the game board
      const gameCopy = new Chess(game.fen());
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q", // promo
      });

      if (!move) return false;

      // update game
      setGame(gameCopy);

      // clear the highlight
      setHightLightSquares([]);

      // send data
      socket.emit("chess:move", { player: you, move });

      return true;
    } catch (error) {
      console.error("Error occurred when moving the piece: ", error);
      return false;
    }
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

  // socket.io effect
  useEffect(() => {
    if (!socket) return;

    socket.on("room:created", (roomInfo: RoomInfo) => {
      setRoomInfo(roomInfo);
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
  }, [socket]);

  // ========== variable ========== //
  const customSquareStyles = useMemo(addMovePreview, [hightLightSquares]);

  return {
    game,
    gameState,
    customSquareStyles,
    you,
    roomInfo,
    friend,
    onDrop,
    squareThatPieceCanMoveTo,
  };
};
