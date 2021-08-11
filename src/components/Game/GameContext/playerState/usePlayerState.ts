import { useRef } from "react"
import { TPosition } from "../../../../gameEngine/Types/Math/Position"
import { TPokedex, TPokemon } from "../../types/Pokemon.types"

export const usePlayerState = (initialState): TPlayerStateHook => {
  const playerStateRef = useRef<TPlayerState>(initialState)

  const get = () => playerStateRef.current

  return {
    get,
  }
}

export type TPlayerStateHook = {
  get: () => TPlayerState
}

export type TPlayerState = {
  physics: {
    direction: "left" | "right" | "up" | "down"
    walking: boolean
  }

  bag: {
    size: number
    items: TGameItem[]
  }
  pokemons: TPokemon[]
  pokedex: TPokedex
  movementDisabled?: boolean
  location: {
    map: string
    position: TPosition
  }
}

export type TGameItem = {}
