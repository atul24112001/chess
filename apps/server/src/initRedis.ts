import { Redis } from "ioredis";
import { prisma } from "./utils/database";

export const initRedis = (callback: () => void) => {
  const redis = new Redis();
  const channels = ["create_game", "winner", "move", "draw"];
  for (let channel of channels) {
    redis.subscribe(channel, (err, count) => {
      if (err) {
        console.error(`Error subscribing to channel ${channel}:`, err);
        return;
      }
      console.log(`Subscribed to ${count} channel(s)`);
    });
  }

  redis.on("message", async (channel, message) => {
    const data = JSON.parse(message);
    switch (channel) {
      case "create_game":
        await createGameHandler(data);
        break;
      case "winner":
        await winnerHandler(data);
        break;
      case "move":
        await moveHandler(data);
        break;
      case "draw":
        await drawHandler(data);
        break;
      default:
        break;
    }
  });
};

async function createGameHandler(data: any) {
  try {
    await prisma.game.create({
      data: {
        id: data.id,
        blackPlayerId: data.p2,
        whitePlayerId: data.p1,
        createdAt: data.startTime,
      },
    });
  } catch (error) {
    console.log(error);
    console.log({ type: "Error while creating game", data });
  }
}

async function drawHandler(data: any) {
  try {
    await prisma.game.update({
      where: {
        id: data.id,
      },
      data: {
        winner: "DRAW",
        status: "COMPLETED",
      },
    });
  } catch (error) {
    console.log(error);
    console.log({ type: "Error while creating move", data });
  }
}

async function winnerHandler(data: any) {
  try {
    await prisma.user.update({
      where: {
        id: data.winnerId,
      },
      data: {
        rating: {
          increment: 10,
        },
      },
    });

    await prisma.user.update({
      where: {
        id: data.loserId,
      },
      data: {
        rating: {
          decrement: 10,
        },
      },
    });
    await prisma.game.update({
      where: {
        id: data.id,
      },
      data: {
        winner: data.winner,
        status: "COMPLETED",
        message: data.message,
      },
    });
  } catch (error) {
    console.log(error);
    console.log({ type: "Error while creating move", data });
  }
}

async function moveHandler(data: any) {
  try {
    await prisma.move.create({
      data: {
        from: data.from,
        to: data.to,
        gameId: data.id,
        userId: data.userId,
      },
    });
  } catch (error) {
    console.log(error);
    console.log({ type: "Error while creating move", data });
  }
}
