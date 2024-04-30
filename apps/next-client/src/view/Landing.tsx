"use client";

import { Button } from "@/components/helper/Button";
import { useEffect, useState } from "react";
import { Each } from "@/components/helper/each";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useClient } from "@/hooks/useClient";

// export

export default function Landing({
  ssrGames,
}: {
  ssrGames: undefined | GameType[];
}) {
  const apiClient = useClient();
  const [games, setGames] = useState<GameType[]>(ssrGames || []);
  const user = useUser();

  const router = useRouter();

  useEffect(() => {
    if (user && !ssrGames) {
      (async () => {
        const { data } = await apiClient.get("/game");
        setGames(data.data);
      })();
    }
  }, [user]);

  const handlePlayOnline = () => {
    router.push("/game/random");
  };

  return (
    <div className="py-[5%]  px-[5%] lg:px-[10%] grid grid-cols-1 md:grid-cols-2 gap-5">
      <img className=" m-auto" src="/chessboard.png" />
      <div className="flex flex-col gap-2 justify-center items-center text-white">
        <div className="font-bold text-3xl">Play chess online on #3 site!</div>
        <Button onClick={handlePlayOnline}>Play Online</Button>
        <div className="w-full mt-4">
          <div className="font-bold text-2xl">Recent matches</div>
          <div className="flex justify-between items-center gap-3 text-xl font-bold py-2">
            <span className="w-16">Match</span>
            <span className="flex-1">Result</span>
            <span className="flex-1">Date</span>
            <span>Description</span>
          </div>
          <Each
            of={games}
            render={(render, index) => {
              return (
                <div
                  onClick={() => router.push(`/game/${render.id}`)}
                  className={`flex justify-between px-4 cursor-pointer py-1 mb-2 rounded-md items-center gap-3 text-xl font-semibold ${render.result == "win" ? "bg-[#0bff4022]" : "bg-[#ff000035]"}`}
                >
                  <span className="w-16">{index + 1}.</span>
                  <span className={`flex-1`}>{render.result}</span>
                  <span className={`flex-1`}>
                    {new Date(render.createdAt).toDateString()}
                  </span>
                  <span>{render.message}</span>
                </div>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}
