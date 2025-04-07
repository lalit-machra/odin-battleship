import { disableStartingMenu, initGameBoard, initGameBoardForShipPlacement } from "./game-dom-helper.js";

const player = document.querySelector("#player");
const gameMode = document.querySelector('input[type="radio"]:checked');
const gameStartBtn = document.querySelector(".gameStartBtn");
let playerArr = [];
let playerObjArr = [];
gameStartBtn.addEventListener("click", async () => {
  disableStartingMenu();
  playerArr.push(player.value);
  await placeShips(playerArr);
  if (gameMode.value === 'pvc') {
    playerArr.push("Computer");
  }
  playerObjArr = initGameBoard(playerArr, playerObjArr);
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

async function placeShips(playerArr) {
  const placeAllShips = document.querySelector('.placeAllShips');
  const shipsDiv = document.createElement("div");
  shipsDiv.classList.add("ships");
  const player1Board = document.createElement("div");
  player1Board.classList.add("player1Board");
  
  placeAllShips.appendChild(shipsDiv);
  placeAllShips.appendChild(player1Board);

  playerObjArr = initGameBoardForShipPlacement(playerArr[0], player1Board, playerObjArr);

  const columnDivs = document.querySelectorAll('.placeAllShips .columnDiv');
  columnDivs.forEach((column) => {
    column.addEventListener('dragover', (ev) => {
      ev.preventDefault();
      ev.dataTransfer.dropEffect = "copy";
    });
    column.addEventListener('dragenter', (ev) => {
      column.classList.add('hovered');
    })
    column.addEventListener('dragleave', (ev) => {
      column.classList.remove('hovered');
    })
    column.addEventListener('drop', (ev) => {
      ev.preventDefault();
    })
  });

  const img1 = document.createElement("img")
  img1.src = './img/battleship1.png';
  const img2 = document.createElement("img")
  img2.src = './img/battleship2.png';
  const img3 = document.createElement("img")
  img3.src = './img/battleship3.png';
  const img4 = document.createElement("img")
  img4.src = './img/battleship4.png';
  shipsDiv.appendChild(img1);
  shipsDiv.appendChild(img2);
  shipsDiv.appendChild(img3);
  shipsDiv.appendChild(img4);

  const launchGameBtn = document.createElement('button');
  launchGameBtn.classList.add("launchGameBtn");
  return new Promise((resolve) => {
    launchGameBtn.onclick = () => resolve();
  });
}