import { NextFunction, Request, Response } from "express";
import { sendError, verifyToken } from "../utils/functions";
import { prisma } from "../utils/database";
import { ExpressRequest } from "../../types";

export const checkAuth = async (
  req: ExpressRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return sendError(res, "Unauthorized", 401);
    }

    const payload = verifyToken(token);

    const user = await prisma.user.findFirst({
      where: {
        id: payload.id,
      },
    });

    if (!user || user.token !== token) {
      return sendError(res, "Unauthorized! Invalid token", 401);
    }

    req.currentUser = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    next();
  } catch (error) {
    sendError(res);
  }
};
