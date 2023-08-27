export default function ModalContainer() {
  return (
    <div id="modal">
      <div id="modal-content">
        <p>THIS ACTION WILL DELETE ALL DATA ABOUT YOUR PREVIOUS GAMES.</p>
        <p>Do you want to continue?</p>
        <button id="cancel-reset">Cancel</button>
        <button id="continue-reset">RESET!</button>
      </div>
    </div>
  );
}
