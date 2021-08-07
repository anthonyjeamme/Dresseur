import firebase from "firebase/app"
import "firebase/firestore"

import { TSector } from "../Objects/Sector/Sector.types"
import { TileSet } from "../Objects/TileSet/TileSet"

export const loadSector = async (id: string) => {
  const beforeDateTime = new Date().getTime()

  const sector = (
    await firebase.firestore().collection("sectors").doc(id).get()
  ).data() as TSector

  const sectorDependencies = await loadSectorDependencies(sector)

  console.log(
    `[LOADER] sector [${id}] loaded in ${
      new Date().getTime() - beforeDateTime
    }ms`
  )

  return {
    id,
    sector,
    sectorDependencies,
  }
}

export const loadSectorDependencies = async (sector: TSector) => {
  const tileSets = await Promise.all(
    sector.dependencies.tileSets.map(loadTileSet)
  )

  return {
    tileSets,
  }
}

export const loadTileSet = async id => {
  const tileSet = (
    await firebase.firestore().collection("tilesets").doc(id).get()
  ).data()

  const img = await loadImage(tileSet.imageUrl)

  return new TileSet({
    id,
    ...tileSet,
    img,
  })
}

export const loadImage = (url: string) =>
  new Promise((resolve, reject) => {
    const image = document.createElement("img")

    image.onload = () => {
      resolve(image)
    }
    image.onerror = () => {
      reject(null)
    }
    image.src = url
  })
