import { useEffect, useState, useRef } from "react";
import GameBoardContainer from "./GameBoardContainer";
import NextPieceContainer from "./NextPieceContainer";
import ErrorContainer from "./ErrorContainer";
//import ModalContainer from "./ModalContainer";
import PointsDisplay from "./PointsDisplay";
import { v4 as uuidv4 } from "uuid";
import HowToPlayBtn from "./HowToPlayBtn";

interface Piece {
  shape: number[][];
  color: string | undefined;
  id: string | null;
}

export interface DisplayPiece {
  shape: number[];
  color: string | undefined;
  id: string | null;
}

const shapesOfPieces = [
  // tPiece :
  [
    [1, 3, 4, 5],
    [1, 4, 5, 7],
    [3, 4, 5, 7],
    [1, 3, 4, 7],
  ],
  // lightningPiece :
  [
    [1, 2, 3, 4],
    [1, 4, 5, 8],
    [4, 5, 6, 7],
    [0, 3, 4, 7],
  ],
  // lPiece :
  [
    [2, 3, 4, 5],
    [1, 4, 7, 8],
    [3, 4, 5, 6],
    [0, 1, 4, 7],
  ],
  // squarePiece :
  [
    [0, 1, 3, 4],
    [0, 1, 3, 4],
    [0, 1, 3, 4],
    [0, 1, 3, 4],
  ],
  // linePiece :
  [
    [3, 4, 5],
    [1, 4, 7],
    [3, 4, 5],
    [1, 4, 7],
  ],
];
const colorsOfPieces = ["red", "green", "blue", "yellow"];

function App() {
  //----------initialize --------------------------------------

  const isGameActive = useRef(false);

  const piece = useRef<Piece>({
    shape: [[], [], []],
    color: undefined,
    id: null, // when the new piece was created and it was the same as the piece before it caused bugs
  });

  const tempPiece = useRef<Piece>(
    piece.current
  ); /*used to temporarily store piece value since the currentPiece shoulb be set as nextPiece but a bit later*/

  const [nextPiece, setNextPiece] = useState<DisplayPiece>({
    shape: [],
    color: undefined,
    id: null,
  });

  const [currentPiece, setCurrentPiece] = useState<DisplayPiece>({
    shape: [],
    color: undefined,
    id: null,
  });

  //----- timer (countdown) variables ----
  const [count, setCount] = useState(4);
  const countRef = useRef(3);
  const countdownTimer = useRef<number | undefined>(undefined); // setInterval obj
  //--------

  const [rotationOfPiece, setRotationOfPiece] = useState<number | undefined>(
    undefined
  ); // holds values 0 | 1 | 2 | 3 --> according to these the current piece is displayed

  const [rotationEffectTrigger, setRotationEffectTrigger] = useState(false);
  /* this is needed because when one piece falls with rotation 0 and the other 
  one is created defaultly with rotation 0, the value is same, 
  thus useEffect triggering displaying current piece is not launched and doesnt show in UI*/

  const moveFunction = useRef<Function | null>(null); // needed to start it from this (App component)
  const resetValuesInGameBoardComponent = useRef<Function | undefined>(
    undefined
  );

  const newPoints = useRef<number>(0);

  /*--------------------------------------------------*/

  const resetGame = () => {
    if (!isGameActive.current) {
      return;
    }
    isGameActive.current = false;

    piece.current = {
      shape: [[], [], []],
      color: undefined,
      id: null,
    };

    displayNextPiece();
    setRotationOfPiece(undefined);
    if (resetValuesInGameBoardComponent.current)
      resetValuesInGameBoardComponent.current();
  };

  /** button functions game ------------------------- */

  const handleStart = () => {
    if (isGameActive.current) return;
    isGameActive.current = true;

    createPiece();
    displayNextPiece();
    startCountdown();

    setTimeout(() => {
      startMove();
    }, 4000);
  };

  /*-------------------------------------------------------- */
  const startMove = () => {
    tempPiece.current = { ...piece.current };
    setRotationOfPiece(0);
    setRotationEffectTrigger((prev) => !prev);
    createPiece();
    displayNextPiece();
    if (moveFunction.current) {
      moveFunction.current();
    }
  };

  /**---------------------countdown ---------------- */

  const startCountdown = () => {
    resetCountdown();

    countdownTimer.current = setInterval(() => {
      if (countRef.current === -1 || !isGameActive.current) {
        resetCountdown();
        return;
      } else {
        setCount(countRef.current);
        countRef.current--;
      }
    }, 1000);
  };

  const resetCountdown = () => {
    clearInterval(countdownTimer.current);
    countRef.current = 3;
    setCount(4);
  };

  /*--------------------piece create/display  ------------------------*/

  // next piece

  const createPiece = () => {
    piece.current = {
      shape: shapesOfPieces[Math.floor(Math.random() * 5)],
      color: colorsOfPieces[Math.floor(Math.random() * 4)],
      id: uuidv4(),
    };
    displayNextPiece();
  };

  const displayNextPiece = () => {
    setNextPiece({
      shape: piece.current.shape[0],
      color: piece.current.color,
      id: piece.current.id,
    });
  };

  // current piece

  useEffect(() => {
    if (rotationOfPiece !== undefined) {
      setCurrentPiece({
        shape: tempPiece.current.shape[rotationOfPiece],
        color: tempPiece.current.color,
        id: uuidv4(),
      });
    } else {
      setCurrentPiece({
        shape: [],
        color: undefined,
        id: null,
      });
    }
  }, [rotationOfPiece, rotationEffectTrigger]);

  //--------------------------------------------------------------

  return (
    <>
      <main>
        <nav>
          <button id="play-btn" onClick={() => handleStart()}>
            PLAY!
          </button>
          <button id="reset-btn" onClick={() => resetGame()}>
            RESET!
          </button>

          <HowToPlayBtn />
        </nav>
        <GameBoardContainer
          moveFunction={moveFunction}
          startMove={startMove}
          currentPiece={currentPiece}
          setRotationOfPiece={setRotationOfPiece}
          newPoints={newPoints}
          resetValuesInGameBoardComponent={resetValuesInGameBoardComponent}
        />
        <NextPieceContainer nextPiece={nextPiece} />

        {count < 4 ? (
          <div id="timer-display">{count === 0 ? "START!" : `${count}`}</div>
        ) : (
          <PointsDisplay newPoints={newPoints} />
        )}
      </main>

      {/* <ModalContainer />*/}

      <ErrorContainer />
    </>
  );
}

export default App;
