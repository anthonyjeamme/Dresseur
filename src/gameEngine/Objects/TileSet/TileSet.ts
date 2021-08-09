import { loadTileSet } from "../../loader/loader"
import { Tile } from "../Tile/Tile"

export class TileSet {
  id: string = null
  title: string = null
  tiles: { [key: string]: Tile } = null
  img: HTMLImageElement = null

  constructor({ id, title, tiles, img }) {
    this.id = id
    this.title = title
    this.img = img

    this.tiles = Object.keys(tiles)
      .map(id => ({ id, tile: new Tile({ ...tiles[id], id }, this) }))
      .reduce((tiles, { id, tile }) => {
        tiles[id] = tile
        return tiles
      }, {})
  }

  getTile(id: string): Tile {
    return this.tiles[id]
  }

  getImage(): HTMLImageElement {
    return this.img
  }

  toJSON() {
    return {
      imageUrl: this.img.src,
      tile: this.title,
      tiles: this.tiles,
    }
  }
  async clone() {
    return new TileSet(await loadTileSet(this.id))
  }
}
