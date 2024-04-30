"use client";

import { Color, PieceSymbol, Square } from "chess.js";
import { Draggable } from "react-beautiful-dnd";

type Props = {
  item: { square: Square; type: PieceSymbol; color: Color };
  src: string;
  alt: string;
  className: string;
  index: number;
};

export default function DraggablePiece({
  item,
  src,
  alt,
  className,
  index,
}: Props) {
  return (
    <Draggable index={index} draggableId={item.square}>
      {(provided) => {
        return (
          <img
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            className={className}
            alt={alt}
            src={src}
          />
        );
      }}
    </Draggable>
  );
}
