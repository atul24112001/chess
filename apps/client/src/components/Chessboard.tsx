import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { events } from "./helper/events";
import { Each } from "./helper/each";
import DraggablePiece from "./DragablePiece";
import {
  DragDropContext,
  DragStart,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";

export type MoveType = { from: string; to: string };
type Props = {
  socket: WebSocket;
  chess: Chess;
  color?: Color;
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
  gameStarted: boolean;
  setMovesTracker: Dispatch<SetStateAction<MoveType[]>>;
  gameId?: string;
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
  gameStarted,
  setMovesTracker,
  gameId,
}: Props) {
  const [from, setFrom] = useState<Square | null>(null);
  const [move, setMove] = useState(DEFAULT_MOVE);
  const [validMoves, setValidMoves] = useState<Square[]>([]);

  const captureSound = new Audio("/capture.wav");

  useEffect(() => {
    if (from) {
      const newValidMoves = chess
        .moves({ verbose: true, square: from })
        .map((move) => move.to);
      setValidMoves(newValidMoves);
    }
  }, [from]);

  useEffect(() => {
    if (move.from && move.to && gameStarted && gameId) {
      try {
        socket.send(
          JSON.stringify({
            type: events.MOVE_PICE,
            payload: {
              move,
              id: gameId,
            },
          })
        );
        const captured = chess.move(move).captured;
        if (captured) {
          captureSound.play();
        } else {
          moveSound.play();
        }
        setBoard(chess.board());
        setMovesTracker((prev) => [...prev, move]);
        setMove(DEFAULT_MOVE);
        setValidMoves([]);
      } catch (error) {
        console.log(error);
        setFrom(null);
        setMove(DEFAULT_MOVE);
        console.log("Invalid move.");
      }
    }
  }, [move]);

  const onDragStart = (dragStart: DragStart) => {
    setFrom(dragStart.draggableId as Square);
  };

  const onDragEnd = (p: DropResult) => {
    setMove({ from: from || "", to: p.destination?.droppableId || "" });
  };

  const isRotated = color === "b";

  const chessBoard = useMemo(() => {
    if (!color) {
      return <img className=" m-auto" src="/chessboard.png" />;
    }
    return (
      <Each
        of={isRotated ? board.slice().reverse() : board}
        render={(row, index) => {
          index = isRotated ? index + 1 : 8 - index;
          return (
            <div className="grid grid-cols-8">
              <Each
                of={isRotated ? row.slice().reverse() : row}
                render={(box, jndex) => {
                  jndex = isRotated ? 7 - (jndex % 8) : jndex % 8;
                  const currentSquare = `${arr[jndex]}${index}` as Square;
                  const isValidMove = validMoves.includes(currentSquare);

                  return (
                    <Droppable droppableId={currentSquare}>
                      {(provided, snapshot) => {
                        return (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            onClick={() => {
                              if (from && box?.color != color) {
                                setMove({
                                  from,
                                  to: box?.square || currentSquare,
                                });
                                setFrom(null);
                              } else {
                                if (box && box.color !== color) {
                                  return;
                                }
                                setFrom(box?.square || currentSquare);
                              }
                            }}
                            className={`w-16 h-16  xl:w-20  xl:h-20 relative ${
                              (jndex + index) % 2 == 0
                                ? "bg-white"
                                : "bg-[#739552]"
                            } ${snapshot.isDraggingOver ? "opacity-80" : ""} transition-all duration-200`}
                          >
                            {((arr[jndex] == "a" && color === "w") ||
                              (arr[jndex] == "h" && color === "b")) && (
                              <div className="absolute bottom-0 left-1 text-black">
                                {index}
                              </div>
                            )}
                            {((index == 1 && color === "w") ||
                              (index == 8 && color === "b")) && (
                              <div className="absolute bottom-0 right-1 text-black">
                                {arr[jndex]}
                              </div>
                            )}
                            {isValidMove && (
                              <div className="absolute w-16 h-16 md:w-20 md:h-20 flex justify-center items-center">
                                <div
                                  className={`w-[10px] z-10 h-[10px] rounded-full opacity-30  ${box ? "bg-red-400" : "bg-gray-700"}`}
                                ></div>
                              </div>
                            )}

                            {box && (
                              <DraggablePiece
                                className=""
                                alt={box.square}
                                item={box}
                                src={`/${box.color}${box.type.toLowerCase()}.png`}
                                index={parseInt(`${index}${jndex}`)}
                              />
                            )}
                            {provided.placeholder}
                          </div>
                        );
                      }}
                    </Droppable>
                  );
                }}
              />
            </div>
          );
        }}
      />
    );
  }, [isRotated, color, board, validMoves]);

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div>{chessBoard}</div>
    </DragDropContext>
  );
}
