class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0;
    this.sunk = false;
  }

  hit() {
    if (!this.sunk) {
      this.hits += 1;
      this.#isSunk();
    }
  }

  #isSunk() {
    if (this.hits === this.length) {
      this.sunk = true;
    }
  }
}

function makeGameboard() {
  // 10x10 game board
  let gameBoard = [];
  for (let i = 0; i < 10; i++) {
    gameBoard.push([]);
    for (let j = 0; j < 10; j++) {
      gameBoard[i].push([]);
    }
  }
  return gameBoard;
}

class GameBoard {
  constructor(playerName) {
    this.owner = playerName;
    this.board = makeGameboard();
    this.shipLocations = [];
    this.hitShots = [];
    this.missedShots = [];
  }

  placeShip(locArr) {
    // check if all loc values are valid or not
    let currX, currY, prevX, prevY, diffX, diffY, prevDiffX, prevDiffY;
    for (let i = 0; i < locArr.length; i++) {
      currX = locArr[i][0];
      currY = locArr[i][1];
      // checking for all values to be in range 0 to 9
      if ((currX < 0 || currX > 9)
       || (currY < 0 || currY > 9)) {
        return false;
      } else {
        // checking if place is empty or not
        if (this.board[currX][currY].length !== 0) {
          return false;
        } else {
          // checking for consecutive places
          if (i === 0) {
            // loop runs for first time, set prevX and prevY
            prevX = currX;
            prevY = currY;
          } else {
            diffX = currX - prevX;
            diffY = currY - prevY;
            prevX = currX;
            prevY = currY;
            // one of diffX and diffY should be 0 and other should be 1
            if ((Math.abs(diffX) === 0 && Math.abs(diffY) === 1)
             || (Math.abs(diffX) === 1 && Math.abs(diffY) === 0)) {
              if (i === 1) {
                // loop runs for second time, set prevDiffX and prevDiffY
                prevDiffX = diffX;
                prevDiffY = diffY;
              } else {
                if ((diffX !== prevDiffX) || (diffY !== prevDiffY)) {
                  return false;
                }
              }
            } else {
              return false;
            }
          }
        }
      }
    }

    // if the program reaches here, means all checks are passed, so place a
    // ship at the specified location
    let newShip = new Ship(locArr.length);
    let newObj = {'ship': newShip};
    let shipLocStr;
    for (let i = 0; i < locArr.length; i++) {
      this.board[locArr[i][0]][locArr[i][1]].push(newObj);
      shipLocStr = locArr[i][0].toString() + locArr[i][1].toString();
      this.shipLocations.push(shipLocStr);
    }
    return true;
  }

  receiveAttack(loc) {
    let locStr = loc[0].toString() + loc[1].toString();
    if (this.hitShots.includes(locStr) || this.missedShots.includes(locStr)) {
      return null;
    } else {
      // ship is hit
      if (this.board[loc[0]][loc[1]].length !== 0) {
        this.hitShots.push(locStr);
        let hitShip = this.board[loc[0]][loc[1]][0]["ship"];
        hitShip.hit();
        return true;
      } else {
        this.missedShots.push(locStr);
        return false;
      }
    }
  }

  allShipsSunk() {
    let currShip;
    for (let i = 0; i < this.shipLocations.length; i++) {
      currShip = this.shipLocations[i];
      if (!this.hitShots.includes(currShip)) {
        return false;
      }
    }
    return true;
  }
}

export { Ship, GameBoard }