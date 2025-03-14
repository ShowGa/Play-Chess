import { Chess } from "chess.js";

export class ChessManager {
  constructor() {
    this.chessGame = new Chess("3k4/8/2Q2N2/4R3/8/2R5/8/3K4 w - - 0 1");
  }

  move(color, move) {
    // check if the player turn is right
    if (color !== this.chessGame.turn()) return;

    const { from, to, promotion } = move;

    const resultMove = this.chessGame.move({
      from,
      to,
      promotion,
    }); // modify => promotion

    if (!resultMove) return false;

    return resultMove;
  }

  gameStateMessageData(players) {
    const gameState = this.gameStateChecker();

    // if checker is null , no need to execute the following code (no need to emit this data to client)
    if (!gameState || gameState === "normal") return null;

    const turn = this.chessGame.turn();
    const gameover = this.chessGame.isGameOver();

    let messageData = {
      gameState,
      // checkedPiece: null,
      gameover,
      winner: null,
    };

    if (gameState === "check") {
      return messageData;
    } else if (gameState === "checkmate") {
      const winner = players.find((p) => {
        return p.color !== turn;
      });

      messageData = {
        ...messageData,
        winner,
      };

      return messageData;
    }
  }

  // modify the logic
  gameStateChecker() {
    if (this.chessGame.isCheckmate()) return "checkmate";
    if (this.chessGame.isCheck()) return "check";
    if (this.chessGame.isDraw()) return "tie";
    return "normal";
  }

  rematch() {
    this.chessGame.reset();
  }
}
