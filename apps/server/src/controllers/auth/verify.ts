import { Request, Response } from "express";
import { sendError, sendResponse } from "../../utils/functions";
import { ExpressRequest } from "../../../types";

export async function verify(req: ExpressRequest, res: Response) {
  try {
    if (req.currentUser) {
      return sendResponse(
        res,
        [req.currentUser],
        "User verified successfully!"
      );
    }
    sendError(res, "Access denied!", 401);
  } catch (error) {
    sendError(res);
  }
}
