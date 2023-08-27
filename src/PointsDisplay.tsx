import { useEffect, useState } from "react";

interface PointsDisplayProps {
  newPoints: React.MutableRefObject<number>;
}

export default function PointsDisplay({ newPoints }: PointsDisplayProps) {
  const [points, setPoints] = useState<number>(0);
  const [displayNewPoins, setDisplayNewPoints] = useState<number>(0);

  useEffect(() => {
    if (newPoints.current == 0) {
      setDisplayNewPoints(0);
    } else {
      setDisplayNewPoints(newPoints.current);
      setPoints((prev) =>
        newPoints.current == -1 ? 0 : prev + newPoints.current
      ); // if reset than == -1 so it nulifies it
      setTimeout(() => {
        newPoints.current = 0;
        setDisplayNewPoints(0);
      }, 1300);
    }
  }, [newPoints.current]);

  return (
    <div id="points-display">
      <span id="total-points">{`YOUR SCORE: \n ${points}`}</span>
      {displayNewPoins && displayNewPoins != -1 ? (
        <span id="new-points">{`+${displayNewPoins}`} </span>
      ) : null}
    </div>
  );
}
