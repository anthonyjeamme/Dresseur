import { TileSet } from "../TileSet/TileSet"

export class Tile {
  tileset: TileSet
  id: string

  constructor(tileset: TileSet, id: string) {
    this.tileset = tileset
    this.id = id
  }

  getImage() {
    return this.tileset.definition.img
  }

  getCoords() {
    return this.tileset.definition.tiles[this.id].coords
  }
}
