import { Router } from "express";
import { checkAuth } from "../middlewares";
import { getGameDetails, getGames } from "../controllers/game";

export const gameRoute = Router();

gameRoute.get("/", checkAuth, getGames);
gameRoute.get("/:id", checkAuth, getGameDetails);
