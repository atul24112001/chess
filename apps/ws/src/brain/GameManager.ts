import { WebSocket } from "ws";
import { messages } from "./messages";
import { Game } from "./Game";
import { Redis } from "ioredis";
import { Color } from "chess.js";

export type Player = { id: string; socket: WebSocket };

export class GameManager {
  private games: { [key: string]: Game };
  private pendingUser: Player | null;
  private users: WebSocket[];
  private redis: Redis;

  constructor(redis: Redis) {
    this.games = {};
    this.pendingUser = null;
    this.users = [];
    this.redis = redis;
  }

  addUser(socket: WebSocket) {
    this.users.push(socket);
    this.addHandler(socket);
  }

  gameDisconnectHandler(
    gameId: string,
    player: Player,
    winner: Color,
    loserId: string
  ) {
    this.redis.publish(
      "winner",
      JSON.stringify({
        id: gameId,
        message: "Opponent disconnected",
        winner,
        winnerId: player.id,
        loserId,
      })
    );
  }

  removerUser(socket: WebSocket) {
    for (let gameId in this.games) {
      const game = this.games[gameId];
      if (game) {
        if (game.player1.socket === socket) {
          this.gameDisconnectHandler(
            game.id,
            game.player2,
            "b",
            game.player1.id
          );
        } else if (game.player2.socket === socket) {
          this.gameDisconnectHandler(
            game.id,
            game.player1,
            "w",
            game.player2.id
          );
        }
        delete this.games[gameId];
      }
    }
    this.users = this.users.filter((user) => user !== socket);
  }

  private createGame(socket: WebSocket, user: any) {
    if (this.pendingUser) {
      const newGame = new Game(
        this.pendingUser,
        { id: user.id, socket },
        this.redis
      );
      this.pendingUser = null;
      this.games[newGame.id] = newGame;
      // console.log(this.games);
    } else {
      this.pendingUser = { id: user.id, socket };
    }
  }

  // private findGame(socket: WebSocket) {
  //   // const game = this.games.find(
  //   //   (game: Game) => game.player1.socket === socket || game.player2.socket === socket
  //   // );
  //   return game;
  // }

  private addHandler(socket: WebSocket) {
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString());
      console.log(message.payload);
      const game = this.games[message.payload?.id || ""];

      switch (message.type) {
        case messages.INIT_GAME:
          this.createGame(socket, message.payload);
          break;
        case messages.MOVE_PICE:
          if (game) {
            game.makeMove(socket, message.payload.move);
          }
          break;
        case messages.RESIGN:
          if (game) {
            game.gameEnded(socket, "Resignation");
            delete this.games[message.payload.id];
          }
        case messages.TIME_OUT:
          if (game) {
            game.gameEnded(socket, "Timeout");
            delete this.games[message.payload.id];
          }
        default:
          break;
      }
    });
  }
}
