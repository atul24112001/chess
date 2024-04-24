import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { messages } from "./messages";

export class Game {
  public player1: WebSocket;
  public player2: WebSocket;
  public board: Chess;
  private startTime: Date;

  constructor(p1: WebSocket, p2: WebSocket) {
    this.player1 = p1;
    this.player2 = p2;
    this.board = new Chess();
    this.startTime = new Date();

    this.player1.send(
      JSON.stringify({
        type: messages.INIT_GAME,
        payload: {
          color: "white",
        },
      })
    );
    this.player2.send(
      JSON.stringify({
        type: messages.INIT_GAME,
        payload: {
          color: "black",
        },
      })
    );
  }

  makeMove(socket: WebSocket, move: { from: string; to: string }) {
    console.log(typeof this.board.moves);
    const turn = this.board.turn();

    if (turn == "w" && socket !== this.player1) {
      console.log("Move blocked p1");
      return;
    }

    if (turn == "b" && socket !== this.player2) {
      console.log("Move blocked p2");
      return;
    }
    try {
      //validate the typeof move using zod
      this.board.move(move);
    } catch (error) {
      console.log(error);
      return;
    }

    if (this.board.isGameOver()) {
      this.player1.send(
        JSON.stringify({
          type: messages.GAME_OVER,
          payload: {
            winner: turn == "b" ? "black" : "white",
          },
        })
      );
      this.player2.send(
        JSON.stringify({
          type: messages.GAME_OVER,
          payload: {
            winner: turn == "w" ? "black" : "white",
          },
        })
      );

      return;
    }
    if (turn == "w") {
      this.player2.send(
        JSON.stringify({
          type: messages.MOVE_PICE,
          payload: move,
        })
      );
    } else {
      this.player1.send(
        JSON.stringify({
          type: messages.MOVE_PICE,
          payload: move,
        })
      );
    }
  }

  resign(socket: WebSocket) {
    const resignedBy = socket == this.player1 ? "p1" : "p2";
    this.player1.send(
      JSON.stringify({
        type: messages.GAME_OVER,
        payload: {
          winner: resignedBy == "p1" ? "b" : "w",
        },
      })
    );
    this.player2.send(
      JSON.stringify({
        type: messages.GAME_OVER,
        payload: {
          winner: resignedBy == "p1" ? "b" : "w",
        },
      })
    );
  }
}
