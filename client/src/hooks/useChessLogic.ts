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
  const [fen, setFen] = useState(game.fen());

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
    console.log(sourceSquare + " " + targetSquare);
    // check is your turn
    if (game.turn() !== you?.color || roomInfo?.roomState !== "start")
      return false;

    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q", // promo
      });

      if (!move) return false;

      // set fen
      setFen(game.fen());

      // clear the highlight
      setHightLightSquares([]);

      // send data
      socket.emit("chess:move", {
        player: you,
        roomId: roomInfo?.roomId,
        move,
      });
      console.log("Send move from client");

      updateGameStatus();

      return true;
    } catch (error) {
      console.error("Error occurred when moving the piece: ", error);
      return false;
    }
  };
  // opponent make a move
  const opponentMakeAMove = (from: string, to: string) => {
    try {
      const move = game.move({
        from: from,
        to: to,
        promotion: "q", // promo
      });

      if (!move) return false;

      // set fen
      setFen(game.fen());

      updateGameStatus();
    } catch (e) {
      console.error("Error occurred when moving the piece: ", e);
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

  // useEffect(() => {
  //   updateGameStatus();
  // }, [game]);

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

    socket.on("chess:moved", (moveData: { from: string; to: string }) => {
      const { from, to } = moveData;

      opponentMakeAMove(from, to);
    });

    return () => {
      console.log("Cleaning up socket events...");
      socket.off("room:created");
      socket.off("room:joined");
      socket.off("chess:moved");
    };
  }, []); // maybe modify

  // ========== variable ========== //
  const customSquareStyles = useMemo(addMovePreview, [hightLightSquares]);

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
  };
};
