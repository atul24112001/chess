import { Response } from "express";
import { ExpressRequest } from "../../../types";
import { sendError, sendResponse } from "../../utils/functions";
import { prisma } from "../../utils/database";

export async function getGames(req: ExpressRequest, res: Response) {
  try {
    const totalGames = await prisma.game.count({
      where: {
        OR: [
          { blackPlayerId: req.currentUser?.id || "" },
          { whitePlayerId: req.currentUser?.id || "" },
        ],
      },
    });
    const gamesData = await prisma.game.findMany({
      where: {
        OR: [
          { blackPlayerId: req.currentUser?.id || "" },
          { whitePlayerId: req.currentUser?.id || "" },
        ],
        status: { notIn: ["IN_PROGRESS"] },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: 0,
      take: 5,
    });
    const games: {
      id: string;
      result: "win" | "loss" | "draw";
      message: string;
      createdAt: Date;
    }[] = [];

    for (const game of gamesData) {
      const myColor =
        game.blackPlayerId === req.currentUser?.id
          ? "BLACK_WINS"
          : "WHITE_WINS";
      games.push({
        id: game.id,
        result:
          game.winner == "DRAW"
            ? "draw"
            : game.winner == myColor
              ? "win"
              : "loss",
        message: "Check Mate",
        createdAt: game.updatedAt,
      });
    }

    sendResponse(res, games, "Success", 200, totalGames);
  } catch (error) {
    sendError(res);
  }
}
