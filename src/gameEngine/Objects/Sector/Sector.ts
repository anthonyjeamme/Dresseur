import { Tile } from "../Tile/Tile"

export class Sector {
  dependencies = null
  globalPosition = null
  map = null
  size = null
  constructor({ dependencies, globalPosition, map, size }) {
    this.dependencies = dependencies
    this.globalPosition = globalPosition
    this.map = map
    this.size = size
  }

  toJSON() {
    return {
      dependencies: this.dependencies,
      size: this.size,
      globalPosition: this.globalPosition,
      map: {
        ...this.map,
        tileMap: this.map.tileMap.map(line => ({
          ...line,
          cells: line.cells.map((tile: Tile) => {
            return tile.getPath()
          }),
        })),
      },
    }
  }
}
