import { Chess } from "chess.js";

export class ChessManager {
  constructor() {
    this.chessGame = new Chess();
  }

  move(color, move) {
    // check if the player turn is right
    if (color !== this.chessGame.turn()) return;

    console.log(`From: ${move.from}, To: ${move.to}`);

    const resultMove = this.chessGame.move({ from: move.from, to: move.to }); // modify => promotion

    if (!resultMove) return false;

    return resultMove;
  }
}
