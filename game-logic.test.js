import { Ship } from './game-logic.js';

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