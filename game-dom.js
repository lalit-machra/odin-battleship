import { disableStartingMenu, initGameBoard, initGameBoardForShipPlacement, determineShipLoc } from "./game-dom-helper.js";
import { proximityHandler } from "./game-logic.js";

const player = document.querySelector("#player");
const gameMode = document.querySelector('input[type="radio"]:checked');
const gameStartBtn = document.querySelector(".gameStartBtn");
let playerArr = [];
let playerObjArr = [];
gameStartBtn.addEventListener("click", async () => {
  disableStartingMenu();
  playerArr.push(player.value);
  await playerPlaceShips(playerArr);
  if (gameMode.value === 'pvc') {
    playerArr.push("Computer");
  }
  playerObjArr = initGameBoard(playerArr, playerObjArr);
  await computerPlaceShips(playerObjArr);
  handleTurns(playerObjArr);
});


let compHitTargets = [];
let compNextTargets = [];
let sameAxisNext = [];
let bothSidesTargetPresent;
let proximityShipLocs = [];
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
      let computerGameboard = playerObjArr[1].gameBoard;
      await handleRound(player2Board, computerGameboard);
    // }
  } else {
    // if (playerObjArr[1].gameBoard.allShipsSunk() === true) {
    //   console.log("all ships of player2 sank");
    //   gameEnd = true;
    // } else {
      let playerGameboard = playerObjArr[0].gameBoard;
      turnInfo.innerText = `${playerObjArr[1].name}'s turn`;
      if (player1Board.classList.contains("disabled")) { player1Board.classList.remove("disabled"); }
      player2Board.classList.add("disabled");
      if (gameMode.value === 'pvc') {
        let shipSunkStatus;
        if (compHitTargets.length !== 0) {
          shipSunkStatus = playerGameboard.board[+compHitTargets[0][0]][+compHitTargets[0][1]][0]["ship"].sunk;
          if (shipSunkStatus) {
            proximityShipLocs.push(proximityHandler(compHitTargets));
            let sunkShipCell;
            for (let i = 0; i < compHitTargets.length; i++) {
              sunkShipCell = player1Board.querySelector(`[data-loc="${compHitTargets[i]}"]`);
              if (sunkShipCell.childElementCount === 1) sunkShipCell.innerHTML = '';
              sunkShipCell.classList.add("shipSunkCell");
            }
            compHitTargets = [];
            compNextTargets = [];
            sameAxisNext = [];
          }
        }
        // Add all valid neighbours (Level1) to nextTargets
        if (compHitTargets.length === 1 && compNextTargets.length === 0) {
          let xHit = +compHitTargets[0][0];
          let yHit = +compHitTargets[0][1];
          if ((xHit >= 0 && xHit <= 9)
            && (yHit - 1 >= 0 && yHit - 1 <= 9)
            && !proximityShipLocs.includes((xHit).toString() + (yHit - 1).toString())) {
              compNextTargets.push((xHit).toString() + (yHit - 1).toString());
          }
          if ((xHit >= 0 && xHit <= 9)
            && (yHit + 1 >= 0 && yHit + 1 <= 9)
            && !proximityShipLocs.includes((xHit).toString() + (yHit + 1).toString())) {
              compNextTargets.push((xHit).toString() + (yHit + 1).toString());
          }
          if ((xHit - 1 >= 0 && xHit - 1 <= 9)
            && (yHit >= 0 && yHit <= 9)
            && !proximityShipLocs.includes((xHit - 1).toString() + (yHit).toString())) {
              compNextTargets.push((xHit - 1).toString() + (yHit).toString());
          }
          if ((xHit + 1 >= 0 && xHit + 1 <= 9)
            && (yHit >= 0 && yHit <= 9)
            && !proximityShipLocs.includes((xHit + 1).toString() + (yHit).toString())) {
              compNextTargets.push((xHit + 1).toString() + (yHit).toString());
          }
        }

        // Add next elements that are in same axis as previously hit targets in Level1
        if (compHitTargets.length > 1 && compNextTargets.length === 0 && sameAxisNext.length === 0) {
          let xIndex0 = +compHitTargets[0][0];
          let yIndex0 = +compHitTargets[0][1];
          shipSunkStatus = playerObjArr[0].gameBoard.board[xIndex0][yIndex0][0]["ship"].sunk;
          let diffX, diffY, newPos;
          if (compHitTargets.length === 2) {
            diffX = xIndex0 - +compHitTargets[1][0];
            diffY = yIndex0 - +compHitTargets[1][1];
            newPos = (+compHitTargets[1][0] - diffX).toString() + (+compHitTargets[1][1] - diffY).toString();
            if ((newPos[0] >= 0 && newPos[0] <= 9)
              && (newPos[1] >= 0 && newPos[1] <= 9)) {
              if (!proximityShipLocs.includes(newPos)) {
                sameAxisNext.push(newPos);
                compNextTargets.push(newPos);
                bothSidesTargetPresent = false;
              }
            }
          } else if (compHitTargets.length === 3) {
            for (let i = 1; i < compHitTargets.length; i++) {
              diffX = xIndex0 - +compHitTargets[i][0];
              diffY = yIndex0 - +compHitTargets[i][1];
              newPos = (+compHitTargets[i][0] - diffX).toString() + (+compHitTargets[i][1] - diffY).toString();
              if ((newPos[0] >= 0 && newPos[0] <= 9)
                && (newPos[1] >= 0 && newPos[1] <= 9)) {
                if (!proximityShipLocs.includes(newPos)) {
                  sameAxisNext.push(newPos);
                  compNextTargets.push(newPos);
                  bothSidesTargetPresent = true;
                }
              }
            }
          }
        } else if (compNextTargets.length === 0 && sameAxisNext.length !== 0) {
          // Continue adding elements which are along same axis as long as they keep hitting the ship
          console.log("hello");
          let diffX, diffY, newPos;
          if (bothSidesTargetPresent === false) {
            let lastX = +sameAxisNext[sameAxisNext.length - 1][0];
            let lastY= +sameAxisNext[sameAxisNext.length - 1][1];
            if (sameAxisNext[sameAxisNext.length - 1] === compHitTargets[compHitTargets.length - 1]) {
              diffX = +compHitTargets[0][0] - lastX;
              diffY = +compHitTargets[0][1] - lastY;
              if (diffX === 0) {
                if (diffY > 0) {  // if diff was positive, next loc should be on left of current one
                  newPos = (lastX).toString() + (lastY - 1).toString();
                } else {   // if diff was negative, next loc should be on right of current one
                  newPos = (lastX).toString() + (lastY + 1).toString();
                }
              } else if (diffY === 0) {
                if (diffX > 0) {
                  newPos = (lastX - 1).toString() + (lastY).toString();
                } else {
                  newPos = (lastX + 1).toString() + (lastY).toString();
                }
              }
              console.log(compHitTargets);
              console.log(newPos);
              if (!proximityShipLocs.includes(newPos)) {
                sameAxisNext.push(newPos);
                compNextTargets.push(newPos);
              }
            }
          } else if (bothSidesTargetPresent === true) {
            for (let i = sameAxisNext.length - 2; i < sameAxisNext.length; i++) {
              let lastX = +sameAxisNext[i][0];
              let lastY = +sameAxisNext[i][1];
              if (compHitTargets.includes(sameAxisNext[i])) {
                diffX = +compHitTargets[0][0] - lastX;
                diffY = +compHitTargets[0][1] - lastY;
                if (diffX === 0) {
                  if (diffY > 0) {  // if diff was positive, next loc should be on left of current one
                    newPos = (lastX).toString() + (lastY - 1).toString();
                  } else {   // if diff was negative, next loc should be on right of current one
                    newPos = (lastX).toString() + (lastY + 1).toString();
                  }
                } else if (diffY === 0) {
                  if (diffX > 0) {
                    newPos = (lastX - 1).toString() + (lastY).toString();
                  } else {
                    newPos = (lastX + 1).toString() + (lastY).toString();
                  }
                }
                if (!proximityShipLocs.includes(newPos)) {
                  sameAxisNext.push(newPos);
                  compNextTargets.push(newPos);
                }
              }
            }
          }
        }

        await handleComputerRound(player1Board, playerGameboard, compHitTargets, compNextTargets, proximityShipLocs);
      } else {
        await handleRound(player1Board, playerGameboard);
      }
    // }
  }
  turn++;
  handleTurns(playerObjArr, turn, gameEnd);
}

async function handleRound(oppGameboard, oppGameBoardObj) {
  let attackPos;
  let clicked = false;
  return new Promise((resolve) => oppGameboard.onclick = (e) => {
    if (!clicked) {
      attackPos = e.target.getAttribute("data-loc");
      if (attackPos !== null) {
        if (handleAttack(attackPos, oppGameboard, oppGameBoardObj) !== null) {
          clicked = true;
          setTimeout(() => resolve(), 500);
        }
      }
    }
  });
}

async function handleComputerRound(oppGameboard, oppGameBoardObj, hitTargets, nextTargets, proximityShipLocs) {
  let attackPos, currAttack;
  if (nextTargets.length === 0) {
    attackPos = Math.floor(10 * Math.random()).toString() + Math.floor(10 * Math.random()).toString();
  } else {
    attackPos = nextTargets.shift();
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      currAttack = handleAttack(attackPos, oppGameboard, oppGameBoardObj);
      while (currAttack === null || proximityShipLocs.includes(attackPos)) {
        attackPos = Math.floor(10 * Math.random()).toString() + Math.floor(10 * Math.random()).toString();  // new attackPos
        currAttack = handleAttack(attackPos, oppGameboard, oppGameBoardObj);
      }
      if (currAttack === true) {
        if (nextTargets.length !== 0) {
          // If next target position is not along same axis, remove all further positions as they are in different axis
          if (attackPos[0] !== nextTargets[0][0]
            && attackPos[1] !== nextTargets[0][1]
          ) {
            nextTargets.splice(0, nextTargets.length);
          } else {   // if next position is along same axis, remove all positions after that as they are in different axis
            if (nextTargets.length > 1) {
              nextTargets.splice(1, nextTargets.length - 1);
            }
          }
        }
        hitTargets.push(attackPos);
      }
      setTimeout(() => resolve(), 500);
    }, 1500);
  });
}

function handleAttack(attackPos, oppGameboard, oppGameBoardObj) {
  let attackCell = oppGameboard.querySelector(`.columnDiv[data-loc='${attackPos}']`);
  let attackStatus = oppGameBoardObj.receiveAttack(attackPos);
  let prevCell;
  if (attackStatus === null) {   // already attacked position
    return null;
  } else {
    // Remove + sign from previous target cell
    prevCell = oppGameboard.querySelector('.columnDiv.latest');
    if (prevCell) prevCell.classList.remove('latest');

    if (attackStatus === true) {   // it hit a ship
      attackCell.classList.add('attacked');
      // Add + sign to current cell
      attackCell.classList.add('latest');
      return true;
    } else {   // it missed
      attackCell.classList.add('missed');
      // Add + sign to current cell
      attackCell.classList.add('latest');
      return false;
    }
  }
}

async function playerPlaceShips(playerArr) {
  const placeAllShips = document.querySelector('.placeAllShips');
  const shipsDiv = document.createElement("div");
  shipsDiv.classList.add("ships");
  const player1Board = document.createElement("div");
  player1Board.classList.add("player1Board");
  
  placeAllShips.appendChild(shipsDiv);
  placeAllShips.appendChild(player1Board);
  const launchGameBtn = document.createElement('button');
  launchGameBtn.innerText = 'Launch Game';
  launchGameBtn.classList.add("launchGameBtn");
  launchGameBtn.setAttribute("disabled", true);
  placeAllShips.appendChild(launchGameBtn);

  playerObjArr = initGameBoardForShipPlacement(playerArr[0], player1Board, playerObjArr);
  let playerGameBoard = playerObjArr[0].gameBoard;

  let shipLen;
  const columnDivs = document.querySelectorAll('.placeAllShips .columnDiv');
  columnDivs.forEach((cell) => {
    let shipLocArray = [];

    cell.addEventListener('dragstart', (e) => {
      e.dataTransfer.dropEffect = "move";
    });

    cell.addEventListener('dragenter', (e) => {
      let shipLength = shipLen;
      let shipLoc = cell.getAttribute('data-loc');
      shipLocArray = determineShipLoc(shipLoc, shipLength);
      shipLocArray.forEach((loc) => {
        setTimeout(() => {
          let eachCell = document.querySelector(`[data-loc="${loc}"]`);
          if (!eachCell.classList.contains('hovered')) eachCell.classList.add('hovered');
        }, 1);
      });
    });

    cell.addEventListener('dragleave', () => {
      shipLocArray.forEach((loc) => {
        let eachCell = document.querySelector(`[data-loc="${loc}"]`);
        if (eachCell.classList.contains('hovered')) eachCell.classList.remove('hovered');
      });
    });

    cell.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    
    cell.addEventListener('drop', (e) => {
      e.preventDefault();
      let shipClass = e.dataTransfer.getData("text");
      let reqShip = document.querySelector(`.${shipClass}`);
      
      if (playerGameBoard.placeShip(shipLocArray)) {
        reqShip.setAttribute("draggable", false);
        for (let i = 0; i < shipLocArray.length; i++) {
          let cell = document.querySelector(`[data-loc="${shipLocArray[i]}"]`);
          cell.classList.add('shipPlaced');
        }
        let startingCell = document.querySelector(`[data-loc="${shipLocArray[0]}"]`);
        startingCell.appendChild(reqShip);
        let neighbours = proximityHandler(shipLocArray);
        for (let j = 0; j < neighbours.length; j++) {
          let neighbourCell = document.querySelector(`[data-loc="${neighbours[j]}"]`);
          neighbourCell.classList.add("neighbour");
        }
        let allShipPlacedCells = document.querySelectorAll('.shipPlaced');
        if (allShipPlacedCells.length === 12) {
          launchGameBtn.removeAttribute("disabled");
          return new Promise((resolve) => resolve());
        }
      } else {
        for (let i = 0; i < shipLocArray.length; i++) {
          let cell = document.querySelector(`[data-loc="${shipLocArray[i]}"]`);
          if (cell.classList.contains('hovered')) cell.classList.remove('hovered');
        }
      }
    });
  });

  const img1 = document.createElement("img")
  img1.src = './img/battleship1.png';
  img1.classList.add('battleship1');
  img1.setAttribute('data-length', 3);
  img1.addEventListener('dragstart', (e) => {
    shipLen = img1.getAttribute('data-length');
    e.dataTransfer.setData("text", img1.classList[0]);
  });

  const img2 = document.createElement("img")
  img2.src = './img/battleship2.png';
  img2.classList.add('battleship2');
  img2.setAttribute('data-length', 4);
  img2.addEventListener('dragstart', (e) => {
    shipLen = img2.getAttribute('data-length');
    e.dataTransfer.setData("text", img2.classList[0]);
  });

  const img3 = document.createElement("img")
  img3.src = './img/battleship3.png';
  img3.classList.add('battleship3');
  img3.setAttribute('data-length', 3);
  img3.addEventListener('dragstart', (e) => {
    shipLen = img3.getAttribute('data-length');
    e.dataTransfer.setData("text", img3.classList[0]);
  });

  const img4 = document.createElement("img")
  img4.src = './img/battleship4.png';
  img4.classList.add('battleship4');
  img4.setAttribute('data-length', 2);
  img4.addEventListener('dragstart', (e) => {
    shipLen = img4.getAttribute('data-length');
    e.dataTransfer.setData("text", img4.classList[0]);
  });

  shipsDiv.appendChild(img1);
  shipsDiv.appendChild(img2);
  shipsDiv.appendChild(img3);
  shipsDiv.appendChild(img4);

  return new Promise((resolve) => {
    launchGameBtn.onclick = () => resolve();
  });
}

async function computerPlaceShips(playerObjArr) {
  let computerArr = playerObjArr[1];
  let shipLengths = [3, 4 , 3, 2];
  let shipLocation, shipPlace, posX, posY, pos;
  shipLengths.forEach((length) => {
    do {
      do {
        posX = Math.floor((Math.random() * 10));
        posY = Math.floor((Math.random() * 10));
        pos = posX.toString() + posY.toString();
      } while ((posX < 0 || posX > 9) || (posY < 0 || posY > 9))
      shipLocation = determineShipLoc(pos, length);
      shipPlace = computerArr.gameBoard.placeShip(shipLocation);
    } while(shipLocation === null || shipPlace === false)
  });
  console.log(`Ship Position: ${computerArr.gameBoard.shipLocations}`);
  return new Promise((resolve) => resolve());
}