import React, { useEffect, useState } from "react";
import Chessboard, { MoveType } from "../components/Chessboard";
import useSocket from "../hooks/useSocket";
import { events } from "../components/helper/events";
import { Chess, Color } from "chess.js";
import { Button } from "../components/helper/Button";
import { DragDropContext, DragStart, DropResult } from "react-beautiful-dnd";
import { Each } from "../components/helper/each";
import { useUser } from "@repo/store/useUser";

export default function Game() {
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [color, setColor] = useState<Color | undefined>();
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [winner, setWinner] = useState<null | Color>(null);
  const moveSound = new Audio("/move.wav");
  const [movesTracker, setMovesTracker] = useState<MoveType[]>([]);
  const [gameId, setGameId] = useState<undefined | string>();
  const [startTime, setStartTime] = useState(60);

  const user = useUser();

  const socket = useSocket();

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;

    if (gameStarted && !winner) {
      timeout = setInterval(() => {
        if (color == chess.turn()) {
          setStartTime((prev) => prev - 1);
        }
      }, 1000);
    }

    return () => {
      if (timeout) {
        clearInterval(timeout);
      }
    };
  }, [gameStarted, color, chess, winner]);

  useEffect(() => {
    if (startTime <= 0) {
      socket?.send(
        JSON.stringify({
          type: "time_out",
          payload: {
            id: gameId,
            userId: user.id,
          },
        })
      );
    }
  }, [startTime]);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event: any) => {
        const message = JSON.parse(event.data);

        switch (message.type) {
          case events.INIT_GAME:
            setWaitingForOpponent(false);
            setGameStarted(true);
            setBoard(chess.board());
            setColor(message.payload.color == "white" ? "w" : "b");
            setGameId(message.payload.id);
            break;
          case events.MOVE_PICE:
            moveSound.play();
            chess.move(message.payload);
            setMovesTracker((prev) => [...prev, message.payload]);
            setBoard(chess.board());
          case events.GAME_OVER:
            setWinner(message.payload.winner);
          default:
            break;
        }
      };
    }
  }, [socket]);

  const playGameHandler = () => {
    if (waitingForOpponent || !socket) {
      return;
    }
    setWaitingForOpponent(true);

    socket.send(
      JSON.stringify({
        type: events.INIT_GAME,
        payload: user,
      })
    );
  };

  if (!socket) {
    return <div className="text-center">Connecting..</div>;
  }

  const resignHandler = () => {
    socket.send(
      JSON.stringify({
        type: events.RESIGN,
        payload: {
          id: gameId,
        },
      })
    );
  };

  return (
    <div className="pt-[5%]  flex justify-center items-center ">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Chessboard
          setMovesTracker={setMovesTracker}
          board={board}
          setBoard={setBoard}
          color={color}
          socket={socket}
          gameStarted={gameStarted}
          chess={chess}
          moveSound={moveSound}
          gameId={gameId}
        />
        <div className="">
          <div className="flex justify-center">
            {winner ? (
              <div className="text-2xl font-bold text-center">
                {winner == color ? "Congrats, You won!" : "You Lose!"}
              </div>
            ) : (
              <>
                {Math.floor(startTime / 60)}:{startTime % 60}
                {!gameStarted ? (
                  <Button fullWidth onClick={playGameHandler}>
                    {waitingForOpponent ? "Waiting for opponent.." : "Play"}
                  </Button>
                ) : (
                  <Button fullWidth onClick={resignHandler}>
                    Resign
                  </Button>
                )}
              </>
            )}
          </div>
          <div className="mt-2">
            <Each
              of={movesTracker}
              render={(move, index) => {
                return (
                  <div
                    className={`flex justify-between px-4 cursor-pointer py-1 mb-2 rounded-md items-center gap-3 text-xl font-semibold ${index % 2 == (color == "w" ? 0 : 1) ? "bg-[#0bff4022]" : "bg-[#ff000035]"}`}
                  >
                    <span className="font-bold">{index + 1}.</span>
                    <span className="font-semibold">{move.from}</span>
                    <span className="font-semibold">{move.to}</span>
                  </div>
                );
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
