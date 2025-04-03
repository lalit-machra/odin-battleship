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
      await handleRound(player2Board, playerObjArr[1].gameBoard);
    // }
  } else {
    // if (playerObjArr[1].gameBoard.allShipsSunk() === true) {
    //   console.log("all ships of player2 sank");
    //   gameEnd = true;
    // } else {
      turnInfo.innerText = `${playerObjArr[1].name}'s turn`;
      if (player1Board.classList.contains("disabled")) { player1Board.classList.remove("disabled"); }
      player2Board.classList.add("disabled");
      if (gameMode.value === 'pvc') {
        await handleComputerRound(player1Board, playerObjArr[0].gameBoard);
      } else {
        await handleRound(player1Board, playerObjArr[0].gameBoard);
      }
    // }
  }
  turn++;
  handleTurns(playerObjArr, turn, gameEnd);
}

async function handleRound(oppGameboard, oppGameBoardObj) {
  let attackPos;
  return new Promise((resolve) => oppGameboard.onclick = (e) => {
    attackPos = e.target.getAttribute("data-loc");
    if (attackPos !== null) {
      if (handleAttack(attackPos, oppGameboard, oppGameBoardObj)) {
        resolve();
      }
    }
  });
}

async function handleComputerRound(oppGameboard, oppGameBoardObj) {
  let attackPos = Math.floor(10 * Math.random()).toString() + Math.floor(10 * Math.random()).toString();
  return new Promise((resolve) => {
    setTimeout(() => {
      while (handleAttack(attackPos, oppGameboard, oppGameBoardObj) === false) {
        attackPos = Math.floor(10 * Math.random()).toString() + Math.floor(10 * Math.random()).toString();  // new attackPos
      }
      resolve();
    }, 1500);
  });
}

function handleAttack(attackPos, oppGameboard, oppGameBoardObj) {
  let attackCell = oppGameboard.querySelector(`.columnDiv[data-loc='${attackPos}']`);
  let attackStatus = oppGameBoardObj.receiveAttack(attackPos);
  let prevCell;
  if (attackStatus === null) {   // already attacked position
    return false;
  } else {
    if (attackStatus === true) {   // it hit a ship
      attackCell.classList.add('attacked');
    } else {   // it missed
      attackCell.classList.add('missed');
    }
    // Remove + sign from previous target cell
    prevCell = oppGameboard.querySelector('.columnDiv.latest');
    if (prevCell) prevCell.classList.remove('latest');
    // Add + sign to current cell
    attackCell.classList.add('latest');
    return true;
  }
}