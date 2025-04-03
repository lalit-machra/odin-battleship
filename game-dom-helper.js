import { Player } from "./game-logic.js";

function disableStartingMenu() {
  const radioPvc = document.querySelector("#pvc");
  const radioPvp = document.querySelector("#pvp");
  const player = document.querySelector("#player");
  const gameStartBtn = document.querySelector(".gameStartBtn");
  radioPvc.disabled = true;
  radioPvp.disabled = true;
  player.disabled = true;
  gameStartBtn.disabled = true;
  return;
}

function initGameBoard(playerArr) {
  let player, playerDiv, playerNameSpan;
  let playerObjArr = [];
  for (let i = 0; i < playerArr.length; i++) {
    player = new Player(playerArr[i]);
    playerDiv = document.querySelector(`.gameboards .player${i + 1}Board`);
    playerNameSpan = document.querySelector(`.gameboards .player${i + 1}Name`);
    displayGameboard(player, playerDiv, playerNameSpan);
    playerObjArr.push(player);
  }
  return playerObjArr;
}

function displayGameboard(player, playerDiv, playerNameSpan) {
  let gameBoard = player.gameBoard.board;
  let rowDiv, columnDiv;
  for (let i = 0; i < gameBoard.length; i++) {
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

export { disableStartingMenu, initGameBoard };