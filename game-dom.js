import { disableStartingMenu, initializeGameBoard } from "./game-dom-helper.js";

const player = document.querySelector("#player");
const gameMode = document.querySelector('input[type="radio"]:checked');
const gameStartBtn = document.querySelector(".gameStartBtn");
gameStartBtn.addEventListener("click", () => {
  disableStartingMenu();
  let playerArr = [];
  playerArr.push(player.value);
  if (gameMode.value === 'pvc') {
    playerArr.push("Computer");
  }
  initializeGameBoard(playerArr);
});
