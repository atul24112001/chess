import GameDetailsComponent from "@/view/GameDetails";
import axios from "axios";
import { cookies } from "next/headers";
import React from "react";

export default async function GameDetails({
  params,
}: {
  params: { id: string };
}) {
  let moves: undefined | MoveType[];

  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (accessToken && params.id) {
    moves = await axios
      .get(`${process.env.FRONTEND_URL}/api/game/${params.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken || ""}`,
        },
      })
      .then(({ data }) => data?.data)
      .catch((err: any) => console.log(err));
  }

  return <GameDetailsComponent ssrMoves={moves} id={params.id} />;
}
