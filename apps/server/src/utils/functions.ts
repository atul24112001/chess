import { Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const sendError = (
  res: Response,
  message: string = "Internal server error.",
  statusCode: number = 500
) => {
  return res.status(statusCode).json({
    message,
  });
};

export const sendResponse = (
  res: Response,
  data: any[],
  message: string = "Success",
  statusCode: number = 200,
  total: number | undefined = undefined
) => {
  const response: any = {
    message,
    data,
  };
  if (total) {
    response["total"] = total;
  }
  return res.status(statusCode).json(response);
};

export const generateToken = (payload: any) => {
  return jwt.sign(payload, process.env.SECRET as string, { expiresIn: "30d" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.SECRET as string) as any;
};

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

export const verifyHah = (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};
