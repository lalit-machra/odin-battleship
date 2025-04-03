import { disableStartingMenu, initGameBoard } from "./game-dom-helper.js";

const player = document.querySelector("#player");
const gameMode = document.querySelector('input[type="radio"]:checked');
const gameStartBtn = document.querySelector(".gameStartBtn");
let playerArr = [];
gameStartBtn.addEventListener("click", () => {
  disableStartingMenu();
  playerArr.push(player.value);
  if (gameMode.value === 'pvc') {
    playerArr.push("Computer");
  }
  let playerObjArr = initGameBoard(playerArr);
  handleTurns(playerObjArr);
});

async function handleTurns(playerObjArr, turn=1, gameEnd=false) {
  if (gameEnd === true) {
    return;
  }
  const player1Board = document.querySelector('.player1Board');
  const player2Board = document.querySelector('.player2Board');
  const turnInfo = document.querySelector('.turnInfo');
  turnInfo.innerText = '';
  if (turn % 2 === 0) {
    // if (playerObjArr[0].gameBoard.allShipsSunk() === true) {
    //   console.log("all ships of player1 sank");
    //   gameEnd = true;
    // } else {
      turnInfo.innerText = `${playerObjArr[0].name}'s turn`;
      if (player2Board.classList.contains("disabled")) { player2Board.classList.remove("disabled"); }
      player1Board.classList.add("disabled");
      await handleRound(player2Board);
    // }
  } else {
    // if (playerObjArr[0].gameBoard.allShipsSunk() === true) {
    //   console.log("all ships of player2 sank");
    //   gameEnd = true;
    // } else {
      turnInfo.innerText = `${playerObjArr[1].name}'s turn`;
      if (player1Board.classList.contains("disabled")) { player1Board.classList.remove("disabled"); }
      player2Board.classList.add("disabled");
      await handleRound(player1Board);
    // }
  }
  turn++;
  handleTurns(playerObjArr, turn, gameEnd);
}

async function handleRound(oppGameboard) {
  return new Promise((resolve) => oppGameboard.onclick = () => resolve());
}