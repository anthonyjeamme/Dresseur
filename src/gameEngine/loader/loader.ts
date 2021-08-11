import firebase from "firebase/app"
import "firebase/firestore"

import { useRef } from "react"

import { positionAreEqual } from "../../components/utils/math"
import { Sector } from "../Objects/Sector/Sector"

import { TSector } from "../Objects/Sector/Sector.types"
import { TileSet } from "../Objects/TileSet/TileSet"
import { TPosition } from "../Types/Math/Position"
import { loadImage } from "./loader.utils"

export const useResourceLoader = (): TResourceLoaderContext => {
  const sectorsRef = useRef<{ [id: string]: TSector }>({})
  const resourcesRef = useRef<any>({
    tileSets: {},
  })

  const loadingList = useRef<string[]>([])

  const mapRef = useRef<any>()

  const freeSector = async (id: string) => {
    sectorsRef.current[id] = undefined
  }

  const loadSector = async (position: TPosition) => {
    if (!mapRef.current) return
    const findSector = mapRef.current.sectors.find(sector =>
      positionAreEqual(sector.position, position)
    )

    if (!findSector) {
      // console.log(`[LOADER] No sector exists at (${position.x},${position.y})`)
      return
    }

    const { id } = findSector

    if (sectorsRef.current[id]) {
      console.log(`[LOADER] Sector ${id} already loaded`)
      return
    }

    if (loadingList.current.includes(id)) {
      console.log("already loading")
      return
    }

    loadingList.current.push(id)

    const { sector, dependencies } = await _loadSector(id, resourcesRef.current)

    sectorsRef.current[id] = new Sector(sector)

    for (const tileSetId of Object.keys(dependencies.tileSets)) {
      resourcesRef.current.tileSets[tileSetId] =
        dependencies.tileSets[tileSetId]
    }

    loadingList.current = loadingList.current.filter(_ => _ !== id)
  }

  const getSector = (id: string) => {
    return sectorsRef.current[id]
  }

  const getTile = (tileSetId: string, tileId: string) => {
    if (!resourcesRef.current.tileSets[tileSetId]) {
      console.log("CANT FINd", tileSetId)
    }

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

  const loadMap = async (mapId: string) => {
    const map = (
      await firebase.firestore().collection("maps").doc(mapId).get()
    ).data()

    mapRef.current = map
  }

  return {
    loadMap,
    getSectorIds,
    getTile,
    freeSector,
    loadSector,
    getSector,
    getResources,
    getSectorFromCoords,
  }
}

export type TResourceLoaderContext = {
  loadMap: any
  getSectorIds: any
  getTile: any
  freeSector: any
  loadSector: any
  getSector: any
  getResources: any
  getSectorFromCoords: any
}

export const _loadSector = async (id: string, resources): Promise<any> => {
  const beforeDateTime = new Date().getTime()

  const sector = (
    await firebase.firestore().collection("sectors").doc(id).get()
  ).data() as TSector

  const dependencies = await loadSectorDependencies(sector, resources)

  console.log(
    `[LOADER] Sector [${id}] loaded in ${
      new Date().getTime() - beforeDateTime
    }ms`
  )

  return {
    id,
    sector: {
      ...sector,
      map: {
        objects: sector.map.objects.map(({ position, tile, origin }) => ({
          position,
          origin,
          tile: dependencies.tileSets[tile.tileSet].getTile(tile.tile),
        })),
        tileMap: sector.map.tileMap.map(line => ({
          cells: line.cells.map(({ tile, tileSet, base, over }) => {
            return {
              base: dependencies.tileSets[base.tileSet].getTile(base.tile),
              over: over.map(({ tileSet, tile }) =>
                dependencies.tileSets[tileSet].getTile(tile)
              ),
            }
          }),
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

export const loadTileSetData = async (id: string) => {
  return (
    await firebase.firestore().collection("tilesets").doc(id).get()
  ).data()
}

export const loadTileSet = async (id: string) => {
  const { imageUrl, title, tiles } = await loadTileSetData(id)

  console.log("load", id)

  const img = await loadImage(imageUrl)

  return new TileSet({
    id,
    title,
    tiles,
    img,
  })
}
