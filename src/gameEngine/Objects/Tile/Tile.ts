import { TileSet } from "../TileSet/TileSet"
import { TileCoords } from "./TileCoord/TileCoord"

export class Tile {
  #id: string
  #animation: any
  #frames: TTileFrame[]
  #tileset: TileSet
  over: boolean
  walkable: boolean

  message: "Super"

  constructor({ id, animation, frames, over, walkable }, tileset: TileSet) {
    this.#id = id
    this.walkable = walkable || false
    this.#animation = animation
    this.over = over || false
    this.#frames = frames.map(frame => ({
      coords: new TileCoords(frame.coords),
    }))
    this.#tileset = tileset
  }

  getFrames() {
    return this.#frames
  }

  cleanFrames() {
    this.#frames = []
    console.log("CLEANED")
  }

  updateFrame(index: number, coords: TileCoords) {
    if (index >= this.#frames.length) throw `updateFrame error : overflow`

    this.#frames[index].coords = coords
  }

  setFrames(coords: TileCoords[]) {
    this.#frames = coords.map(coords => ({ coords }))
  }

  pushFrame(coords: TileCoords) {
    this.#frames.push({ coords })
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

  toJSON() {
    return {
      id: this.#id,
      animation: this.#animation,
      frames: this.#frames,
      over: this.over,
      walkable: this.walkable,
    }
  }

  clone() {
    return new Tile(this.toJSON(), this.#tileset)
  }
}

type TTileFrame = {
  coords: TileCoords
}
