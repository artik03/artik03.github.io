import { DisplayPiece } from "./App";
import { useState, useEffect, useRef } from "react";

interface GameBoardProps {
  currentPiece: DisplayPiece;
  startMove: Function;
  moveFunction: React.MutableRefObject<Function | null>;
  setRotationOfPiece: React.Dispatch<React.SetStateAction<number | undefined>>;
  newPoints: React.MutableRefObject<number>;
  resetValuesInGameBoardComponent: React.MutableRefObject<Function | undefined>;
}

interface Tile {
  color: string | undefined;
}

const rowIsFull: number[][] = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8],
  [9, 10, 11, 12, 13, 14, 15, 16, 17],
  [18, 19, 20, 21, 22, 23, 24, 25, 26],
  [27, 28, 29, 30, 31, 32, 33, 34, 35],
  [36, 37, 38, 39, 40, 41, 42, 43, 44],
  [45, 46, 47, 48, 49, 50, 51, 52, 53],
  [54, 55, 56, 57, 58, 59, 60, 61, 62],
  [63, 64, 65, 66, 67, 68, 69, 70, 71],
  [72, 73, 74, 75, 76, 77, 78, 79, 80],
  [81, 82, 83, 84, 85, 86, 87, 88, 89],
  [90, 91, 92, 93, 94, 95, 96, 97, 98],
  [99, 100, 101, 102, 103, 104, 105, 106, 107],
]; /** not for the actual gameboard, only used in functions*/

//----used to stop pieces from going into next line----
const rightBorder: number[] = [8, 17, 26, 35, 44, 53, 62, 71, 80, 89, 98, 107];
const leftBorder: number[] = [0, 9, 18, 27, 36, 45, 54, 63, 72, 81, 90, 99];
//---------

export default function GameBoardContainer({
  currentPiece,
  startMove,
  moveFunction,
  setRotationOfPiece,
  newPoints,
  resetValuesInGameBoardComponent,
}: GameBoardProps) {
  //-----------------------

  const selectedTilesRef = useRef<number[]>([3, 4, 5, 12, 13, 14, 21, 22, 23]);
  const occupiedTilesRef = useRef<number[]>([]);
  const activeTilesRef = useRef<number[]>([]);
  const currentPieceCopy = useRef<DisplayPiece>(currentPiece);

  const [gameBoard, setGameBoard] = useState<Tile[]>(
    [...Array(108)].map(() => ({
      color: undefined,
    }))
  );

  const timeout = useRef<number | undefined>(undefined); // setTimeout obj
  const moveTimeInterval = useRef<number>(500);

  const [destroyFullLineTrigger, setDestroyFullLineTrigger] =
    useState<boolean>(false);

  const fallAfterDestroyTimout = useRef<number>(20);

  const [displayGameOver, setDisplayGameOver] = useState<boolean>(false);

  //---------------------------------------------------------------

  const move = async () => {
    timeout.current = setTimeout(() => {
      // not interval so the duration can be altered.. not a promise because it needs name so i can be cleared in reset
      if (canMove()) {
        // every half second selected tiles are all moved one line down (their value is + 9 since row is 9 tiles wide)
        selectedTilesRef.current = selectedTilesRef.current.map(
          (value) => value + 9
        );
        updateActiveTiles();

        move();
      } else {
        occupiedTilesRef.current = occupiedTilesRef.current.concat(
          activeTilesRef.current
        );
        setGameBoard((prevBoard) => {
          const newBoard = [...prevBoard];
          for (let i = 0; i < activeTilesRef.current.length; i++) {
            newBoard[activeTilesRef.current[i]].color =
              currentPieceCopy.current.color;
          }
          return newBoard;
        });

        setDestroyFullLineTrigger((prev) => !prev);

        fallAfterDestroyTimout.current = 20;
        moveTimeInterval.current = 500;
        newPoints.current = 50; // points are added after every piece that successfully fell

        console.log("move started");

        startMove();
        selectedTilesRef.current = [3, 4, 5, 12, 13, 14, 21, 22, 23];
      }
    }, moveTimeInterval.current);

    return () => clearTimeout(timeout.current);
  };

  moveFunction.current = move; // accessed from parent component

  //----------------------reset------------------------------------
  resetValuesInGameBoardComponent.current = () => {
    endGame();
    newPoints.current = -1;
    selectedTilesRef.current = [3, 4, 5, 12, 13, 14, 21, 22, 23];
    activeTilesRef.current = [];
    occupiedTilesRef.current = [];
    updateGameBoard();
    setDisplayGameOver(false);
  };

  //-------------------------------------------------------------

  const updateGameBoard = () => {
    setGameBoard((prevGameBoard) => {
      return prevGameBoard.map((tile, index) => ({
        color: activeTilesRef.current.includes(index) // if it is one of the tiles on which the current piece is it should be its color
          ? currentPieceCopy.current.color
          : occupiedTilesRef.current.includes(index) // if its occupied already it should keep its color.. all other tiles should be without coolor
          ? tile.color
          : undefined,
      }));
    });
  };

  const updateActiveTiles = () => {
    activeTilesRef.current = selectedTilesRef.current.filter((_, index) =>
      currentPieceCopy.current.shape.includes(index)
    );

    updateGameBoard();
  };

  const canMove = () => {
    const checkOne = activeTilesRef.current.every(
      (num) => !occupiedTilesRef.current.includes(num + 9)
    );
    const checkTwo = !activeTilesRef.current.some((num) => num > 98);
    return checkOne && checkTwo;
  }; // check for every active tile if there is occupied underneath it or if gameboard ends

  const linesFall = async (deletedRow: number) => {
    for (let r = deletedRow - 1; r > 0; r--) {
      //for all rows above deleted
      for (let d = 8; d >= 0; d--) {
        // for every div in row

        let indexOfCurrentTile = r * 9 + d;
        if (!occupiedTilesRef.current.includes(indexOfCurrentTile)) continue;

        const currentTileColor = gameBoard[indexOfCurrentTile].color;

        let tileToFallIndex = indexOfCurrentTile + 9;

        while (
          !occupiedTilesRef.current.includes(tileToFallIndex + 9) &&
          tileToFallIndex + 9 < 108
        ) {
          tileToFallIndex += 9;
        }
        occupiedTilesRef.current = [
          ...occupiedTilesRef.current,
          tileToFallIndex,
        ];

        let newGameBoard = [...gameBoard];
        newGameBoard[tileToFallIndex].color = currentTileColor;
        newGameBoard[indexOfCurrentTile].color = undefined;
        setGameBoard(newGameBoard);

        occupiedTilesRef.current = occupiedTilesRef.current.filter(
          (num) => num != indexOfCurrentTile
        );
        updateGameBoard();

        await new Promise((resolve) =>
          setTimeout(resolve, fallAfterDestroyTimout.current - (11 - r) * 1.81)
        );
      }
    }
    setDestroyFullLineTrigger((prev) => !prev);
  };

  const destroyFullLine = () => {
    for (let i = 0; i < 12; i++) {
      //check every row
      if (rowIsFull[i].every((num) => occupiedTilesRef.current.includes(num))) {
        occupiedTilesRef.current = occupiedTilesRef.current.filter(
          (num) => !rowIsFull[i].includes(num)
        );
        updateGameBoard();
        newPoints.current = 300;
        linesFall(i);
        return;
      }
    }
    if (isGameOver()) endGame();
  };

  const isGameOver = () => {
    return occupiedTilesRef.current.some((number) => number < 27);
  };

  const endGame = () => {
    clearTimeout(fallAfterDestroyTimout.current);
    clearTimeout(timeout.current);
    setRotationOfPiece(undefined);
    setDisplayGameOver(true);
    fallAfterDestroyTimout.current = 20;
    moveTimeInterval.current = 500;
  };

  useEffect(() => {
    currentPieceCopy.current = currentPiece;
    updateActiveTiles();
  }, [currentPiece.id]);

  //--------------------------for rotation check--------------

  function areSelectedTilesInTwoRows(arr: number[]) {
    const firstThree = arr.slice(0, 3); //since its 3x3 square its enough to check first three

    for (let i = 0; i < 12; i++) {
      const rowArray = rowIsFull[i];
      const isSubset = firstThree.every((num) => rowArray.includes(num));

      if (isSubset) {
        return false;
      }
    }
    return true;
  }

  //--------------------------------------------------------------

  useEffect(() => {
    destroyFullLine();
  }, [destroyFullLineTrigger]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (currentPiece.shape == undefined) return;

      if (event.key === "ArrowRight") {
        if (
          !activeTilesRef.current.some(
            (prevNum) =>
              rightBorder.includes(prevNum) ||
              occupiedTilesRef.current.includes(prevNum + 1)
          )
        ) {
          selectedTilesRef.current = selectedTilesRef.current.map(
            (num) => num + 1
          );
          updateActiveTiles();
        }
      }

      if (event.key === "ArrowLeft") {
        if (
          !activeTilesRef.current.some(
            (prevNum) =>
              leftBorder.includes(prevNum) ||
              occupiedTilesRef.current.includes(prevNum - 1)
          )
        ) {
          selectedTilesRef.current = selectedTilesRef.current.map(
            (num) => num - 1
          );
          updateActiveTiles();
        }
      }

      if (event.key === "r") {
        if (
          selectedTilesRef.current.some((num) =>
            occupiedTilesRef.current.includes(num)
          )
        )
          return; //cant rotate into already occupied piece
        if (areSelectedTilesInTwoRows(selectedTilesRef.current)) return; //cant rotate into gameboard edge

        setRotationOfPiece((prevRotation) => {
          if (prevRotation == undefined) {
            return prevRotation;
          } else {
            return prevRotation === 3 ? 0 : prevRotation + 1; //TO DO ---------------------------
          }
        });
      }

      if (event.key === "ArrowDown") {
        moveTimeInterval.current = 50;
        fallAfterDestroyTimout.current = 0;
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  //------------------------------------------------------------------

  return (
    <>
      <div id="game-board">
        {gameBoard.map((Tile, index) => (
          <div
            key={`game-board-tile-${index}`}
            className={Tile.color}
            id={`${index}`}
          />
        ))}
        {displayGameOver ? <span id="game-over-text">GAME OVER</span> : null}
      </div>
    </>
  );
}
