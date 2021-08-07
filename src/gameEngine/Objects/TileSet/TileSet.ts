export class TileSet {
  definition = null

  constructor(definition) {
    this.definition = definition
  }

  getImage() {
    return this.definition.image
  }
}
