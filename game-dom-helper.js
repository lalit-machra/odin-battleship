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

function initGameBoard(playerArr, playerObjArr) {
  let player, playerDiv, playerNameSpan;
  for (let i = 0; i < playerArr.length; i++) {
    if (playerObjArr[0] !== undefined && playerObjArr[0].name === playerArr[i]) {
      player = playerObjArr[0];
    } else {
      player = new Player(playerArr[i]);
      playerObjArr.push(player);
    }
    playerDiv = document.querySelector(`.gameboards .player${i + 1}Board`);
    playerNameSpan = document.querySelector(`.gameboards .player${i + 1}Name`);
    displayGameboard(player, playerDiv, true, playerNameSpan);
  }
  return playerObjArr;
}

function initGameBoardForShipPlacement(playerName, playerDiv, playerObjArr) {
  let player = new Player(playerName);
  displayGameboard(player, playerDiv, false);
  playerObjArr.push(player);
  return playerObjArr;
}

function displayGameboard(player, playerDiv, playerShipsPlaced, playerNameSpan=null) {
  let gameBoard = player.gameBoard.board;
  let rowDiv, columnDiv;
  if (playerShipsPlaced && player.name !== 'Computer') {
    let placeAllShips = document.querySelector(".placeAllShips");
    let player1Board = document.querySelector(".placeAllShips .player1Board");
    playerDiv.innerHTML = player1Board.innerHTML;
    placeAllShips.innerHTML = '';
    let neighbours = playerDiv.querySelectorAll('.neighbour');
    neighbours.forEach((neighbour) => {
      neighbour.classList.remove('neighbour');
    })
  } else {
    for (let i = 0; i < gameBoard.length; i++) {
      rowDiv = document.createElement("div");
      rowDiv.classList.add("rowDiv");
      for (let j = 0; j < gameBoard[i].length; j++) {
        columnDiv = document.createElement("div");
        columnDiv.classList.add("columnDiv");
        columnDiv.setAttribute('data-loc', `${i}${j}`);
        rowDiv.appendChild(columnDiv);
      }
      playerDiv.appendChild(rowDiv);
    }
  }
  
  if (playerNameSpan) playerNameSpan.innerText = player.name;
  return;
}

function determineShipLoc(loc, length) {
  let locX, locY;
  let locArr = [];
  if (length == 2) {
    let newLoc;
    locX = +loc[0];
    locY = +loc[1];
    if (locY - 1 >= 0 && locY - 1 <= 9) {   // 1 cell on left of loc
      newLoc = (locX).toString() + (locY - 1).toString();
      locArr.push(newLoc);
      locArr.push(loc);
    } else {   // 1 cell on right of loc
      newLoc = (locX).toString() + (locY + 1).toString();
      locArr.push(loc);
      locArr.push(newLoc);
    }
  } else if (length == 3) {
    let newLoc1, newLoc2;
    locX = +loc[0];
    locY = +loc[1];
    if ((locY - 1 >= 0 && locY - 1 <= 9)
      && (locY + 1 >= 0 && locY + 1 <= 9)) {   // 1 cell on left and 1 on right of loc
        newLoc1 = (locX).toString() + (locY - 1).toString();
        newLoc2 = (locX).toString() + (locY + 1).toString();
        locArr.push(newLoc1);
        locArr.push(loc);
        locArr.push(newLoc2);
    } else if (locY - 1 >= 0 && locY - 1 <= 9) {   // both cells on left of loc
        newLoc1 = (locX).toString() + (locY - 1).toString();
        newLoc2 = (locX).toString() + (locY - 2).toString();
        locArr.push(newLoc2);
        locArr.push(newLoc1);
        locArr.push(loc);
    } else if (locY + 1 >= 0 && locY + 1 <= 9) {  // both cells on right of loc
        newLoc1 = (locX).toString() + (locY + 1).toString();
        newLoc2 = (locX).toString() + (locY + 2).toString();
        locArr.push(loc);
        locArr.push(newLoc1);
        locArr.push(newLoc2);
    }
  } else if (length == 4) {
    let newLoc1, newLoc2, newLoc3;
    locX = +loc[0];
    locY = +loc[1];
    if ((locY - 1 >= 0 && locY - 1 <= 9)
      && (locY - 2 >= 0 && locY - 2 <= 9)
      && (locY + 1 >= 0 && locY + 1 <= 9)) {   // 2 cells on left and 1 on right of loc
        newLoc1 = (locX).toString() + (locY - 1).toString();
        newLoc2 = (locX).toString() + (locY - 2).toString();
        newLoc3 = (locX).toString() + (locY + 1).toString();
        locArr.push(newLoc2);
        locArr.push(newLoc1);
        locArr.push(loc);
        locArr.push(newLoc3);
    } else if ((locY - 1 >= 0 && locY - 1 <= 9)
      && (locY + 1 >= 0 && locY + 1 <= 9)) {   // 1 cell on left and 2 on right of loc
        newLoc1 = (locX).toString() + (locY - 1).toString();
        newLoc2 = (locX).toString() + (locY + 2).toString();
        newLoc3 = (locX).toString() + (locY + 1).toString();
        locArr.push(newLoc1);
        locArr.push(loc);
        locArr.push(newLoc3);
        locArr.push(newLoc2);
    } else if (locY + 1 >= 0 && locY + 1 <= 9) {   // all 3 cells on right of loc
        newLoc1 = (locX).toString() + (locY + 1).toString();
        newLoc2 = (locX).toString() + (locY + 2).toString();
        newLoc3 = (locX).toString() + (locY + 3).toString();
        locArr.push(loc);
        locArr.push(newLoc1);
        locArr.push(newLoc2);
        locArr.push(newLoc3);
    } else if ((locY - 1 >= 0 && locY - 1 <= 9)
      && (locY - 2 >= 0 && locY - 2 <= 9)) {   // all 3 cells on left of loc
      newLoc1 = (locX).toString() + (locY - 1).toString();
      newLoc2 = (locX).toString() + (locY - 2).toString();
      newLoc3 = (locX).toString() + (locY - 3).toString();
      locArr.push(newLoc3);
      locArr.push(newLoc2);
      locArr.push(newLoc1);
      locArr.push(loc);
    }
  }
  if (locArr.length !== 0) return locArr;
  else return null;
}

export { disableStartingMenu, initGameBoard, initGameBoardForShipPlacement, determineShipLoc };