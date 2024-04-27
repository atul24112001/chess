import {  Response } from "express";
import {
  generateToken,
  sendError,
  sendResponse,
  verifyHah,
  verifyToken,
} from "../../utils/functions";
import { prisma } from "../../utils/database";
import { authBody } from ".";
import { ExpressRequest } from "../../../types";

export async function login(req: ExpressRequest, res: Response) {
  try {
    const body = await authBody.validate(req.body);
    const existingUser = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });

    if (!existingUser) {
      return sendError(res, "Invalid email address", 401);
    }

    const correctPassword = await verifyHah(
      body.password,
      existingUser.password
    );
    if (!correctPassword) {
      return sendError(res, "Invalid password", 401);
    }

    const token = generateToken({
      id: existingUser.id,
    });

    await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        token,
      },
    });

    return sendResponse(res, [{ token }], "Login successful!");
  } catch (error) {
    sendError(res);
  }
}
