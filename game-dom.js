import { Player } from "./game-logic.js";

const player = document.querySelector("#player");
const gameMode = document.querySelector('input[type="radio"]:checked');
const gameStartBtn = document.querySelector(".gameStartBtn");
gameStartBtn.addEventListener("click", () => {
  disableStartingMenu();
  gameStartBtn.disabled = true;
  let playerArr = [];
  playerArr.push(player.value);
  if (gameMode.value === 'pvc') {
    playerArr.push("Computer");
  }
  initializeGameBoard(playerArr);
});

function disableStartingMenu() {
  const radioPvc = document.querySelector("#pvc");
  const radioPvp = document.querySelector("#pvp");
  radioPvc.disabled = true;
  radioPvp.disabled = true;
  player.disabled = true;
  gameStartBtn.disabled = true;
}

function initializeGameBoard(playerArr) {
  let player, playerDiv, playerNameSpan;
  for (let i = 0; i < playerArr.length; i++) {
    player = new Player(playerArr[i]);
    playerDiv = document.querySelector(`.gameboards .player${i + 1}Board`);
    playerNameSpan = document.querySelector(`.gameboards .player${i + 1}Name`);
    displayGameboard(player, playerDiv, playerNameSpan);
  }
}

function displayGameboard(player, playerDiv, playerNameSpan) {
  let gameBoard = player.gameBoard.board;
  console.log(gameBoard);
  let rowDiv, columnDiv;
  for (let i = 0; i < gameBoard.length; i++) {
    console.log(i);
    rowDiv = document.createElement("div");
    rowDiv.classList.add("rowDiv");
    for (let j = 0; j < gameBoard[i].length; j++) {
      columnDiv = document.createElement("div");
      columnDiv.classList.add("columnDiv");
      rowDiv.appendChild(columnDiv);
    }
    playerDiv.appendChild(rowDiv);
  }
  playerNameSpan.innerText = player.name;
  return;
}