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

export { Ship }