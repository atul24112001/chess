import React, { useEffect, useState } from "react";
import Chessboard from "../components/Chessboard";
import useSocket from "../hooks/useSocket";
import { events } from "../components/helper/events";
import { Chess, Color } from "chess.js";
import { Button } from "../components/helper/Button";

export default function Game() {
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [color, setColor] = useState<Color>("w");
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [winner, setWinner] = useState<null | Color>(null);
  const moveSound = new Audio("move.wav");

  const socket = useSocket();
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
            break;
          case events.MOVE_PICE:
            moveSound.play();
            chess.move(message.payload);
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
      })
    );
  };

  return (
    <div className="flex justify-center items-center ">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Chessboard
          board={board}
          setBoard={setBoard}
          color={color}
          socket={socket}
          chess={chess}
          moveSound={moveSound}
        />
        <div className="">
          <div className="flex justify-center">
            {winner ? (
              <div className="text-2xl font-bold text-center">
                {winner == color ? "Congrats, You won!" : "You Lose!"}
              </div>
            ) : (
              <>
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
        </div>
      </div>
    </div>
  );
}
