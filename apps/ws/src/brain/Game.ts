import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { messages } from "./messages";
import { Redis } from "ioredis";
import { Player } from "./GameManager";

export class Game {
  public id: string;
  public player1: Player;
  public player2: Player;
  public board: Chess;
  private startTime: Date;
  public redis: Redis;

  constructor(p1: Player, p2: Player, redis: Redis) {
    this.player1 = p1;
    this.player2 = p2;
    this.board = new Chess();
    this.startTime = new Date();
    this.id = crypto.randomUUID();
    this.redis = redis;

    this.player1.socket.send(
      JSON.stringify({
        type: messages.INIT_GAME,
        payload: {
          id: this.id,
          color: "white",
          startTime: this.startTime,
        },
      })
    );
    this.player2.socket.send(
      JSON.stringify({
        type: messages.INIT_GAME,
        payload: {
          id: this.id,
          color: "black",
          startTime: this.startTime,
        },
      })
    );
    this.redis.publish(
      "create_game",
      JSON.stringify({
        id: this.id,
        p1: this.player1.id,
        p2: this.player2.id,
        startTime: this.startTime,
      })
    );
  }

  makeMove(socket: WebSocket, move: { from: string; to: string }) {
    const turn = this.board.turn();

    if (turn == "w" && socket !== this.player1.socket) {
      console.log("Move blocked p1");
      return;
    }

    if (turn == "b" && socket !== this.player2.socket) {
      console.log("Move blocked p2");
      return;
    }
    try {
      this.board.move(move);
      this.redis.publish(
        "move",
        JSON.stringify({
          id: this.id,
          userId: turn == "b" ? this.player2.id : this.player1.id,
          ...move,
        })
      );
    } catch (error) {
      console.log(error);
      return;
    }

    if (this.board.isGameOver()) {
      const draw = this.board.isDraw();
      this.player1.socket.send(
        JSON.stringify({
          type: messages.GAME_OVER,
          payload: {
            winner: draw ? "d" : turn,
          },
        })
      );
      this.player2.socket.send(
        JSON.stringify({
          type: messages.GAME_OVER,
          payload: {
            winner: draw ? "d" : turn,
          },
        })
      );

      this.redis.publish(
        draw ? "draw" : "winner",
        JSON.stringify({
          id: this.id,
          winnerId: turn == "b" ? this.player2.id : this.player1.id,
          loserId: turn == "b" ? this.player1.id : this.player2.id,
          winner: turn == "b" ? "BLACK_WINS" : "WHITE_WINS",
          message: "Checkmate",
        })
      );
    }
    if (turn == "w") {
      this.player2.socket.send(
        JSON.stringify({
          type: messages.MOVE_PICE,
          payload: move,
        })
      );
    } else {
      this.player1.socket.send(
        JSON.stringify({
          type: messages.MOVE_PICE,
          payload: move,
        })
      );
    }
  }

  gameEnded(socket: WebSocket, reason: string) {
    const gameEndedBy = socket == this.player1.socket ? "p1" : "p2";
    this.redis.publish(
      "winner",
      JSON.stringify({
        id: this.id,
        winner: gameEndedBy == "p1" ? "BLACK_WINS" : "WHITE_WINS",
        message: reason,
        winnerId: gameEndedBy == "p1" ? this.player2.id : this.player1.id,
        loserId: gameEndedBy == "p1" ? this.player1.id : this.player2.id,
      })
    );

    this.player1.socket.send(
      JSON.stringify({
        type: messages.GAME_OVER,
        payload: {
          winner: gameEndedBy == "p1" ? "b" : "w",
        },
      })
    );

    this.player2.socket.send(
      JSON.stringify({
        type: messages.GAME_OVER,
        payload: {
          winner: gameEndedBy == "p1" ? "b" : "w",
        },
      })
    );
  }
}
