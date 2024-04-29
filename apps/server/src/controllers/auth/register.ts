import { Response } from "express";
import {
  generateToken,
  hashPassword,
  sendError,
  sendResponse,
} from "../../utils/functions";
import { prisma } from "../../utils/database";
import { authBody } from ".";
import { ExpressRequest } from "../../../types";

export async function register(req: ExpressRequest, res: Response) {
  try {
    const body = await authBody.validate(req.body);
    const existingUser = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });

    if (existingUser) {
      return sendError(res, "Email already exist", 400);
    }

    const password = await hashPassword(body.password);

    const newUser = await prisma.user.create({
      data: {
        email: body.email,
        password,
        name: body.name || crypto.randomUUID(),
      },
    });

    const token = generateToken({
      id: newUser.id,
    });

    await prisma.user.update({
      where: { id: newUser.id },
      data: {
        token,
      },
    });

    return sendResponse(res, [{ token }], "Registration successful!");
  } catch (error) {
    console.log(error);
    sendError(res);
  }
}
