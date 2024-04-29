import { WebSocketServer } from "ws";
import http from "http";
import { config } from "dotenv";
import { GameManager } from "./brain/GameManager";
import { Redis } from "ioredis";

async function main() {
  config();

  const PORT = process.env.PORT || 3000; // Default to port 3000 if PORT is not defined in .env
  const redis = new Redis({
    host: "164.68.103.23",
    port: 6379,
    password: process.env.REDIS_PASSWORD,
  });
  const data = await redis.get("PING");
  console.log({ data });
  const gameManager = new GameManager(redis);
  const server = http.createServer();
  const wss = new WebSocketServer({ server });

  wss.on("connection", function connection(ws) {
    gameManager.addUser(ws);

    ws.on("disconnect", () => gameManager.removerUser(ws));
  });

  server.listen(PORT, () => {
    console.log(`WebSocket server is running on port ${PORT}`);
  });
}

main();
