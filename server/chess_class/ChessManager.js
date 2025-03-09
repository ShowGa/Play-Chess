import { Chess } from "chess.js";

export class ChessManager {
  constructor() {
    this.chessGame = new Chess();
  }

  move(color, move) {
    // check if the player turn is right
    if (color !== this.chessGame.turn()) return;

    const { from, to, promotion } = move;

    console.log(`From: ${from}, To: ${to}, Promotion: ${promotion}`);

    const resultMove = this.chessGame.move({
      from,
      to,
      promotion,
    }); // modify => promotion

    if (!resultMove) return false;

    return resultMove;
  }
}
