import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "../apiClient";
import { Each } from "../components/helper/each";

type Move = {
  id: string;
  from: string;
  to: string;
  by: string;
};

export default function GameDetails() {
  const [moves, setMoves] = useState<Move[]>([]);
  const params = useParams();
  useEffect(() => {
    (async () => {
      const { data } = await apiClient.get(`/game/${params.id}`);
      setMoves(data.data);
    })();
  }, []);
  return (
    <div className="m-auto mt-5 w-[90%] md:w-[70%] lg:w-[50%]">
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
