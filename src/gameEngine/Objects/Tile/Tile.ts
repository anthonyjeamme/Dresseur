import { TileSet } from "../TileSet/TileSet"
import { TileCoords } from "./TileCoord/TileCoord"

export class Tile {
  #id: string
  #animation: any
  #frames: TTileFrame[]
  #tileset: TileSet

  message: "Super"

  constructor({ id, animation, frames }, tileset: TileSet) {
    this.#id = id
    this.#animation = animation
    this.#frames = frames.map(frame => ({
      coords: new TileCoords(frame.coords),
    }))
    this.#tileset = tileset
  }

  getId() {
    return this.#id
  }

  getAnimationProps() {
    return this.#animation
  }

  getFramesLength() {
    return this.#frames.length
  }

  getFrame(index: number): TTileFrame {
    if (!this.#frames[index])
      throw `cannot get ${index} from in tile ${this.#id}`

    return this.#frames[index]
  }

  getImg(): HTMLImageElement {
    return this.#tileset.getImage()
  }

  getPath() {
    return {
      tile: this.#id,
      tileSet: this.#tileset.id,
    }
  }
}

type TTileFrame = {
  coords: TileCoords
}
