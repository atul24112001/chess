import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { authRouter } from "./routes/auth";
import { Redis } from "ioredis";
import { initRedis } from "./initRedis";
import { gameRoute } from "./routes/game";
import morgan from "morgan";

config();
const PORT = process.env.PORT || "8000";
const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(cors());

app.use(morgan("dev"));

app.use("/api/auth", authRouter);
app.use("/api/game", gameRoute);

app.listen(PORT, () => {
  initRedis(() => {
    console.log("Server is running on port " + PORT);
  });
});
