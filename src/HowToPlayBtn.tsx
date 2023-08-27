import { useState } from "react";

export default function HowToPlayBtn() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <button
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        HOW TO PLAY!
      </button>
      {isModalOpen && (
        <div id="how-to-play-screen-container">
          <div id="how-to-play-screen">
            <h1>HOW TO PLAY</h1>
            <h2>CONTROLS</h2>
            <ul>
              <li>For a piece to move right, press → </li>
              <li>For a piece to move left, press ← </li>
              <li>For a piece to fall faster, press ↓ </li>
              <li>To rotate a piece, press r</li>
            </ul>

            <h2>POINTS</h2>
            <ul>
              <li>+50 When piece falls</li>
              <li>+300 for every destroyed row</li>
            </ul>

            <p>Tip: Cells in row row are destroyed when row is fully filled.</p>
            <hr />
            <button
              onClick={() => {
                setIsModalOpen(false);
              }}
            >
              OKAY
            </button>
          </div>
        </div>
      )}
    </>
  );
}
