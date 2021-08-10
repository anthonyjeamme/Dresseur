export type TTile = {
  id: string
  type: TTileType

  physics: {
    walk: {
      enabled: boolean
      xFactor: number
      yFactor: number
    }
  }
}

export type TTileType = "base" | "over"
