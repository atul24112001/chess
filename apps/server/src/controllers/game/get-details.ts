import { Response } from "express";
import { ExpressRequest } from "../../../types";
import { sendError, sendResponse } from "../../utils/functions";
import { prisma } from "../../utils/database";

export async function getGameDetails(req: ExpressRequest, res: Response) {
  try {
    const game = await prisma.game.findFirst({
      where: {
        OR: [
          { blackPlayerId: req.currentUser?.id || "" },
          { whitePlayerId: req.currentUser?.id || "" },
        ],
        id: req.params.id,
        status: { notIn: ["IN_PROGRESS"] },
      },
      include: {
        moves: true,
      },
    });
    if (!game) {
      return sendError(res, "Game not found!", 404);
    }

    const moves: any[] = [];

    for (const move of game.moves) {
      moves.push({
        id: move.id,
        by: move.userId === req.currentUser?.id ? "me" : "opponent",
        from: move.from,
        to: move.to,
      });
    }

    sendResponse(res, moves);
  } catch (error) {
    console.log(error);
    sendError(res);
  }
}
