type GameType = {
  id: string;
  result: "win" | "loss" | "draw";
  message: string;
  createdAt: string;
};

type MoveType = {
  id: string;
  from: string;
  to: string;
  by: string;
};
