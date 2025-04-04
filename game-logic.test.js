import { Ship, GameBoard } from './game-logic.js';

// Tests for Ship class
describe('Ship testing', () => {
  let ship1 = new Ship(3);
  beforeEach(() => {
    ship1.hits = 0;
    ship1.sunk = false;
  });

  test('ship length', () => {
    expect(ship1.length).toBe(3);
  });
  test('ship hits', () => {
    expect(ship1.hits).toBe(0);
  });
  test('ship sunk status', () => {
    expect(ship1.sunk).toBe(false);
  });

  test('hit the ship', () => {
    ship1.hit();
    ship1.hit();
    ship1.hit();
    ship1.hit();
    ship1.hit();
    ship1.hit();
    ship1.hit();
    expect(ship1.hits).toBeLessThanOrEqual(ship1.length);
  });

  test('ship is sunken', () => {
    ship1.hit();
    ship1.hit();
    ship1.hit();
    expect(ship1.sunk).toBe(true);
  });
});

// Tests for gameBoard
describe('Gameboard testing', () => {
  let player = 'scot44';
  let gameBoard = new GameBoard(player);
  test('place the ship', () => {
    expect(gameBoard.placeShip([[0, 2], [0, 3]])).toBe(true);
    expect(gameBoard.placeShip([[1, 2], [1, 3], [1, 4]])).toBe(false);
    expect(gameBoard.placeShip([[0, 1], [0, -3]])).toBe(false);
    expect(gameBoard.placeShip([[0, 2], [0, 3]])).toBe(false);
    expect(gameBoard.placeShip([[2, 3], [2, 4], [0, 2]])).toBe(false);   // one cell already occupied
    expect(gameBoard.placeShip([[2, 3], [2, 5], [2, 6]])).toBe(false);   // not consecutive
    expect(gameBoard.placeShip([[2, 3], [3, 4], [4, 5]])).toBe(false);   // not consecutive
    expect(gameBoard.placeShip([[2, 3], [2, 4], [3, 4]])).toBe(false);   // not consecutive
    expect(gameBoard.placeShip([[9, 2], [9, 3], [9, 4]])).toBe(true);
    expect(gameBoard.placeShip([[1, 5], [2, 5], [3, 5], [4, 5]])).toBe(true);
    expect(gameBoard.placeShip([[7, 6], [7, 5], [7, 4], [7, 3]])).toBe(true);
    expect(gameBoard.placeShip([[3, 8], [2, 8], [1, 8]])).toBe(true);
    expect(gameBoard.placeShip([[0, 7], [0, 8], [0, 9]])).toBe(false);
    expect(gameBoard.placeShip([[9, 5], [9, 6], [9, 7]])).toBe(false);
    expect(gameBoard.placeShip([[8, 1], [8, 2]])).toBe(false);
  });

  test('receive attack', () => {
    expect(gameBoard.receiveAttack([4, 5])).toBe(true);
    expect(gameBoard.receiveAttack([0, 0])).toBe(false);
    expect(gameBoard.receiveAttack([4, 5])).toBeNull();
    expect(gameBoard.receiveAttack([0, 0])).toBeNull();
    expect(gameBoard.receiveAttack([3, 8])).toBe(true);
    expect(gameBoard.receiveAttack([2, 8])).toBe(true);
    expect(gameBoard.receiveAttack([2, 8])).toBeNull();
    expect(gameBoard.receiveAttack([1, 8])).toBe(true);
  });

  test('all ships sunken', () => {
    expect(gameBoard.allShipsSunk()).toBe(false);
    gameBoard.receiveAttack([0, 2]);
    gameBoard.receiveAttack([7, 3]);
    gameBoard.receiveAttack([0, 3]);
    gameBoard.receiveAttack([7, 4]);
    gameBoard.receiveAttack([9, 3]);
    gameBoard.receiveAttack([9, 2]);
    gameBoard.receiveAttack([3, 5]);
    gameBoard.receiveAttack([7, 5]);
    gameBoard.receiveAttack([1, 5]);
    gameBoard.receiveAttack([9, 4]);
    gameBoard.receiveAttack([2, 5]);
    gameBoard.receiveAttack([7, 6]);
    expect(gameBoard.allShipsSunk()).toBe(true);
  });
});