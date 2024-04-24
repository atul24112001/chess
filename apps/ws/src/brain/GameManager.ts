import { WebSocket } from "ws";
import { messages } from "./messages";
import { Game } from "./Game";

export class GameManager {
  private games: Game[];
  private pendingUser: WebSocket | null;
  private users: WebSocket[];

  constructor() {
    this.games = [];
    this.pendingUser = null;
    this.users = [];
  }

  addUser(socket: WebSocket) {
    this.users.push(socket);
    this.addHandler(socket);
  }

  removerUser(scoket: WebSocket) {
    this.users = this.users.filter((user) => user !== scoket);
    // Stop the game as user left
  }

  private createGame(socket: WebSocket) {
    if (this.pendingUser) {
      const newGame = new Game(this.pendingUser, socket);
      this.pendingUser = null;
      this.games.push(newGame);
    } else {
      this.pendingUser = socket;
    }
  }

  private findGame(socket: WebSocket) {
    const game = this.games.find(
      (game: Game) => game.player1 === socket || game.player2 === socket
    );
    return game;
  }

  private addHandler(socket: WebSocket) {
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString());
      const game = this.findGame(socket);

      switch (message.type) {
        case messages.INIT_GAME:
          this.createGame(socket);
          break;
        case messages.MOVE_PICE:
          if (game) {
            game.makeMove(socket, message.payload);
          }
          break;
        case messages.RESIGN:
          if (game) {
            game.resign(socket);
            this.games = this.games.filter(
              (g) => g.player1 == socket || g.player2 == socket
            );
          }
        default:
          break;
      }
    });
  }
}
