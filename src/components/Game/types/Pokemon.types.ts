import { TArea } from "../../../gameEngine/Types/Math/Position"

export type TPokemon = {
  id: string
  level: number
}

export type TPokedex = {
  knownPokemons: {}
}

export type TPokemonData = {
  evolution: {
    level: number
  }
  characteristic: {
    attack: number
    defense: number
    types: TPokemonType[]
  }
  skills: TPokemonSkill[]
  spawnZones: TPokemonSpawnZone[]
}

export type TPokemonType = "water" | "plant" | "fire"

export type TPokemonSkill = {
  name: string
  minLevel: number
  type: TPokemonType
  caracteristics: {
    attack: number
  }
  sideEffects: TSideEffect[]
}

export type TSideEffect = {}

export type TPokemonSpawnZone = {
  areas: TPokemonSpawnZoneArea[]
  levels: {
    min: number
    max: number
  }
}
export type TPokemonSpawnZoneArea = {
  map: string
  sector: string
  zone: TArea[]
}
