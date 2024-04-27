import { Router } from "express";
import { login, register, verify } from "../controllers/auth";
import { checkAuth } from "../middlewares";

export const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/register", register);
authRouter.get("/verify", checkAuth, verify);
