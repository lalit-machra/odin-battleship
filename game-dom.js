import { disableStartingMenu, initGameBoard, initGameBoardForShipPlacement } from "./game-dom-helper.js";
import { proximityHandler } from "./game-logic.js";

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


let compHitTargets = [];
let compNextTargets = [];
let sameAxisNext = [];
let bothSidesTargetPresent;
let proximityShipLocs = []
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
        // Add all valid neighbours (Level1) to nextTargets
        if (compHitTargets.length === 1 && compNextTargets.length === 0) {
          let xHit = +compHitTargets[0][0];
          let yHit = +compHitTargets[0][1];
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
        }

        // Add next elements that are in same axis as previously hit targets in Level1
        if (compHitTargets.length > 1 && compNextTargets.length === 0 && sameAxisNext.length === 0) {
          let xIndex0 = +compHitTargets[0][0];
          let yIndex0 = +compHitTargets[0][1];
          let diffX, diffY, newPos;
          if (compHitTargets.length === 2) {
            diffX = xIndex0 - +compHitTargets[1][0];
            diffY = yIndex0 - +compHitTargets[1][0];
            newPos = (+compHitTargets[i][0] - diffX).toString() + (+compHitTargets[i][1] - diffY).toString();
            if (!proximityShipLocs.includes(newPos)) {
              sameAxisNext.push(newPos);
              compNextTargets.push(newPos);
              bothSidesTargetPresent = false;
            } else {
              // ship sank
              proximityShipLocs = proximityHandler(compHitTargets);
              compHitTargets = [];
              compNextTargets = [];
              sameAxisNext = [];
            }
          } else if (compHitTargets.length === 3) {
            let shipSank = true;
            for (let i = 1; i < compHitTargets.length; i++) {
              diffX = xIndex0 - +compHitTargets[i][0];
              diffY = yIndex0 - +compHitTargets[i][0];
              newPos = (+compHitTargets[i][0] - diffX).toString() + (+compHitTargets[i][1] - diffY).toString();
              if (!proximityShipLocs.includes(newPos)) {
                shipSank = false;
                sameAxisNext.push(newPos);
                compNextTargets.push(newPos);
                bothSidesTargetPresent = true;
              }
            }
            
            if (shipSank) {
              // ship sank
              proximityShipLocs = proximityHandler(compHitTargets);
              compHitTargets = [];
              compNextTargets = [];
              sameAxisNext = [];
            }
          }
        } else if (compNextTargets === 0 && sameAxisNext.length !== 0) {
          // Continue adding elements which are along same axis as long as they keep hitting the ship
          if (bothSidesTargetPresent === false) {
            let lastX = sameAxisNext[sameAxisNext.length - 1][0];
            let lastY= sameAxisNext[sameAxisNext.length - 1][1];
            if (sameAxisNext[sameAxisNext.length - 1] === compHitTargets[compHitTargets.length - 1]) {
              diffX = +compHitTargets[0][0] - lastX;
              diffY = +compHitTargets[0][1] - lastY;
              if (diffX === 0) {
                newPos = (lastX).toString() + (lastY - 1).toString();
              } else if (diffY === 0) {
                newPos = (lastX - 1).toString() + (lastY).toString();
              }
              if (!proximityShipLocs.includes(newPos)) {
                sameAxisNext.push(newPos);
                compNextTargets.push(newPos);
              } else {
                // ship sank
                proximityShipLocs = proximityHandler(compHitTargets);
                compHitTargets = [];
                compNextTargets = [];
                sameAxisNext = [];
              }
            } else {
              // ship sank
              proximityShipLocs = proximityHandler(compHitTargets);
              compHitTargets = [];
              compNextTargets = [];
              sameAxisNext = [];
            }
          } else if (bothSidesTargetPresent === true) {
            let sank = true;
            for (let i = sameAxisNext.length - 2; i < sameAxisNext.length; i++) {
              let lastX = sameAxisNext[i][0];
              let lastY = sameAxisNext[i][1];
              if (compHitTargets.includes(sameAxisNext[i])) {
                sank = false;
                diffX = +compHitTargets[0][0] - lastX;
                diffY = +compHitTargets[0][1] - lastY;
                if (diffX === 0) {
                  newPos = (lastX).toString() + (lastY - 1).toString();
                } else if (diffY === 0) {
                  newPos = (lastX - 1).toString() + (lastY).toString();
                }
                if (!proximityShipLocs.includes(newPos)) {
                  sameAxisNext.push(newPos);
                  compNextTargets.push(newPos);
                }
              }
            }
            if (sank) {
              // ship sank
              proximityShipLocs = proximityHandler(compHitTargets);
              compHitTargets = [];
              compNextTargets = [];
              sameAxisNext = [];
            }
          }
        }

        await handleComputerRound(player1Board, playerObjArr[0].gameBoard, compHitTargets, compNextTargets, proximityShipLocs);
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
      if (handleAttack(attackPos, oppGameboard, oppGameBoardObj) !== null) {
        resolve();
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
      while (currAttack === null || proximityShipLocs.includes(currAttack)) {
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
      resolve();
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