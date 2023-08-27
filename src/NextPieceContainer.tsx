import { DisplayPiece } from "./App";
import { v4 as uuidv4 } from "uuid";

interface NextPieceContainerProps {
  nextPiece: DisplayPiece;
}

const numbers: number[] = [...Array(9)];

export default function NextPieceContainer({
  nextPiece,
}: NextPieceContainerProps) {
  return (
    <div id="next-piece-board">
      <span>NEXT PIECE:</span>
      <span id="next-piece-tiles">
        {numbers.map((_, index) => (
          <div
            key={`next-piece-tile-${index}-${uuidv4()}`}
            id={`${index}`}
            className={nextPiece.shape.includes(index) ? nextPiece.color : ""}
          />
        ))}
      </span>
    </div>
  );
}
