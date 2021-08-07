import firebase from "firebase/app"
import "firebase/firestore"

import React, { useEffect } from "react"

import uniqid from "uniqid"
import {
  loadSector,
  loadSectorDependencies,
  loadTileSet,
} from "../gameEngine/loader/loader"

const Test = () => {
  const sector: TSector = {
    globalPosition: {
      x: 0,
      y: 0,
    },
    size: {
      x: 32,
      y: 32,
    },
    map: {
      tileMap: Array.from(new Array(32)).map(() => ({
        cells: Array.from(new Array(32)).map(() => ({
          tile: "ks1ruxbr",
          tileSet: "ks1rp7n1",
        })),
      })),
    },
    dependencies: {
      tileSets: ["ks1rp7n1"],
    },
  }

  useEffect(() => {
    firebase.firestore().collection("sectors").doc("ks1slznh").set(sector)

    // loadSector("ks1slznh")
    //   .then(sectorLoad => {
    //     console.log("Zone loaded")
    //     console.log(sectorLoad)
    //   })
    //   .catch(() => {
    //     console.log("Problem when loading zone ")
    //   })
  }, [])

  return <div className="test"></div>
}
export default Test

type TSector = {
  globalPosition: any
  size: any
  map: any
  dependencies: {
    tileSets: string[]
  }
}
