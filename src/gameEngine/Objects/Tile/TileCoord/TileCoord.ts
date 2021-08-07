/*
 *
 */
export class TileCoords {
  #coords: TTileCoords

  constructor(coords: TTileCoords) {
    this.#coords = coords
  }

  toJSON() {
    return this.#coords
  }

  get() {
    return this.#coords
  }
}

type TTileCoords = [number, number, number, number]
