export type TSector = {
  globalPosition: any
  size: any
  map: any
  dependencies: {
    tileSets: string[]
  }
  toJSON: () => any
}
