"use client";

import { useEffect, useState } from "react";
import { Each } from "@/components/helper/each";
import { useClient } from "@/hooks/useClient";

export default function GameDetailsComponent({
  id,
  ssrMoves,
}: {
  id: string;
  ssrMoves: undefined | MoveType[];
}) {
  const apiClient = useClient();
  const [moves, setMoves] = useState<MoveType[]>(ssrMoves || []);

  useEffect(() => {
    if (!ssrMoves) {
      (async () => {
        const { data } = await apiClient.get(`/game/${id}`);
        setMoves(data.data);
      })();
    }
  }, [ssrMoves]);

  return (
    <div className="m-auto pt-5 w-[90%] md:w-[70%] lg:w-[50%]">
      <div>
        <div className="font-bold text-3xl mb-3">Match details</div>
      </div>
      <div className="border-2">
        <div className="flex justify-between items-center gap-10 bg-[#739552] border-b-2 p-2 font-semibold">
          <div className="w-10">S no.</div>
          <div className="w-16">Move by</div>
          <div className="flex-1 text-right">From</div>
          <div className="flex-1 text-right">To</div>
        </div>
        <Each
          of={moves}
          render={(move, index) => {
            return (
              <div className="flex justify-between items-center gap-10 border-b-2 p-2 font-semibold">
                <div className="w-8">{index + 1}.</div>
                <div className="w-16">{move.by}</div>
                <div className="flex-1 text-right">{move.from}</div>
                <div className="flex-1 text-right">{move.to}</div>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}
