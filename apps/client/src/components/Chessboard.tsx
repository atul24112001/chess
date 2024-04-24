import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { useEffect, useMemo, useState } from "react";
import { events } from "./helper/events";
import { Each } from "./helper/each";

type Props = {
  socket: WebSocket;
  chess: Chess;
  color: Color;
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  setBoard: (
    board: ({
      square: Square;
      type: PieceSymbol;
      color: Color;
    } | null)[][]
  ) => void;
  moveSound: HTMLAudioElement;
};

const arr = ["a", "b", "c", "d", "e", "f", "g", "h"];

const DEFAULT_MOVE = { from: "", to: "" };

export default function Chessboard({
  color,
  socket,
  chess,
  board,
  setBoard,
  moveSound,
}: Props) {
  const [from, setFrom] = useState<Square | null>(null);
  const [move, setMove] = useState(DEFAULT_MOVE);

  const captureSound = new Audio("capture.wav");

  useEffect(() => {
    console.log({ move, turn: chess.turn(), color });
    if (move.from && move.to) {
      try {
        socket.send(
          JSON.stringify({
            type: events.MOVE_PICE,
            payload: move,
          })
        );
        const captured = chess.move(move).captured;
        if (captured) {
          captureSound.play();
        } else {
          moveSound.play();
        }
        setBoard(chess.board());
        setMove(DEFAULT_MOVE);
      } catch (error) {
        console.log(error);
        setFrom(null);
        setMove(DEFAULT_MOVE);
        console.log("Invalid move.");
      }
    }
  }, [move]);

  return (
    <div className={color == "b" ? "rotate-180" : ""}>
      <Each
        of={board}
        render={(row, index) => {
          return (
            <div className="grid grid-cols-8">
              <Each
                of={row}
                render={(box, jndex) => {
                  return (
                    <div
                      onClick={() => {
                        if (from) {
                          setMove({
                            from,
                            to:
                              box?.square ||
                              (`${arr[jndex]}${8 - index}` as Square),
                          });
                          setFrom(null);
                        } else {
                          if (box && box.color !== color) {
                            return;
                          }
                          setFrom(
                            box?.square ||
                              (`${arr[jndex]}${8 - index}` as Square)
                          );
                        }
                      }}
                      className={`w-16 h-16 ${
                        (jndex + index) % 2 == 0 ? " bg-white" : "bg-green-500"
                      }`}
                    >
                      {box && (
                        <img
                          className={color == "b" ? "rotate-180" : ""}
                          alt={box.square}
                          src={`${box.color}${box.type.toLowerCase()}.png`}
                        />
                      )}
                    </div>
                  );
                }}
              />
            </div>
          );
        }}
      />
    </div>
  );
}
