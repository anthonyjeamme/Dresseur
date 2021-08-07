import firebase from "firebase/app"
import "firebase/firestore"
import { useRef } from "react"
import { Sector } from "../Objects/Sector/Sector"

import { TSector } from "../Objects/Sector/Sector.types"
import { TileSet } from "../Objects/TileSet/TileSet"
import { TPosition } from "../Types/Math/Position"
import { loadImage } from "./loader.utils"

export const useResourceLoader = () => {
  const sectorsRef = useRef<{ [id: string]: TSector }>({})
  const resourcesRef = useRef<any>({
    tileSets: {},
  })

  const freeSector = async (id: string) => {
    sectorsRef.current[id] = undefined
  }

  const loadSector = async (id: string) => {
    if (sectorsRef.current[id]) {
      console.log(`sector ${id} already loaded`)
      // return
    }

    const { sector, dependencies } = await _loadSector(id, resourcesRef.current)

    sectorsRef.current[id] = new Sector(sector)

    for (const tileSetId of Object.keys(dependencies.tileSets)) {
      resourcesRef.current.tileSets[tileSetId] =
        dependencies.tileSets[tileSetId]
    }
  }

  const getSector = (id: string) => {
    return sectorsRef.current[id]
  }

  const getTile = (tileSetId: string, tileId: string) => {
    return resourcesRef.current.tileSets[tileSetId].getTile(tileId)
  }

  const getResources = () => {
    return resourcesRef.current
  }

  const getSectorFromCoords = (position: TPosition) => {
    for (const sectorId of Object.keys(sectorsRef.current)) {
      const sector = sectorsRef.current[sectorId]

      if (
        sector.globalPosition.x === position.x &&
        sector.globalPosition.y === position.y
      ) {
        return {
          ...sector,
          id: sectorId,
        }
      }
    }
    return null
  }
  const getSectorIds = () => {
    return Object.keys(sectorsRef.current)
  }

  return {
    getSectorIds,
    getTile,
    freeSector,
    loadSector,
    getSector,
    getResources,
    getSectorFromCoords,
  }
}

export const _loadSector = async (id: string, resources): Promise<any> => {
  const beforeDateTime = new Date().getTime()

  const sector = (
    await firebase.firestore().collection("sectors").doc(id).get()
  ).data() as TSector

  const dependencies = await loadSectorDependencies(sector, resources)

  console.log(
    `[LOADER] sector [${id}] loaded in ${
      new Date().getTime() - beforeDateTime
    }ms`
  )

  return {
    id,
    sector: {
      ...sector,
      map: {
        tileMap: sector.map.tileMap.map(line => ({
          cells: line.cells.map(({ tile, tileSet }) =>
            dependencies.tileSets[tileSet].getTile(tile)
          ),
        })),
      },
    },
    dependencies,
  }
}

export const loadSectorDependencies = async (sector: TSector, resources) => {
  const tileSets = (
    await Promise.all(
      sector.dependencies.tileSets.map(id => {
        if (resources.tileSets[id]) {
          console.log(`tileset ${id} already loaded`)
          return resources.tileSets[id]
        }
        return loadTileSet(id)
      })
    )
  ).reduce((object, tileSet: TileSet) => {
    object[tileSet.id] = tileSet
    return object
  }, {}) as {
    [key: string]: TileSet
  }

  return {
    tileSets,
  }
}

export const loadTileSet = async id => {
  const { imageUrl, title, tiles } = (
    await firebase.firestore().collection("tilesets").doc(id).get()
  ).data()

  const img = await loadImage(imageUrl)

  return new TileSet({
    id,
    title,
    tiles,
    img,
  })
}
