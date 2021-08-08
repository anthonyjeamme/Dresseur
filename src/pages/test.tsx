import firebase from "firebase/app"
import "firebase/firestore"
import { string } from "prop-types"

import React, { useEffect, useRef, useState } from "react"
import { renderTileMap } from "../gameEngine/graphicEngine/graphicEngine"
// import {
//   renderMap,
//   renderTile,
//   renderTileMap,
// } from "../gameEngine/graphicEngine/graphicEngine"

import { useResourceLoader } from "../gameEngine/loader/loader"

const Test = () => {
  const gameResources = useResourceLoader()

  const canvasRef = useRef<HTMLCanvasElement>()
  const [loaded, setLoaded] = useState(false)
  // const sectorRef = useRef<any>()

  useEffect(() => {
    // gameResources
    //   .loadSector("ks1slznh")
    //   .then(() => {
    //     console.log("Sector loaded ")
    //     setLoaded(true)
    //   })
    //   .catch(() => {
    //     console.log("Problem when loading sector")
    //   })
  }, [])

  // useEffect(() => {
  //   loadSector("ks1slznh")
  //     .then(sectorLoad => {
  //       sectorRef.current = sectorLoad

  //       setLoaded(true)
  //       draw()
  //     })
  //     .catch(() => {
  //       console.log("Problem when loading zone ")
  //     })
  // }, [])

  const test = async () => {
    const data = (
      await firebase.firestore().collection("sectors").doc("ks1slznh").get()
    ).data()

    const objects = []

    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        objects.push({
          position: {
            x: 15 * 30 + 64 * x + Math.round(Math.random() * 32),
            y: 18 * 20 + 64 * y + Math.round(Math.random() * 32),
          },
          tile: { tileSet: "ks1rp7n3", tile: "ls1rwj72" },
        })
      }
    }

    const up = {
      ...data,
      map: {
        tileMap: data.map.tileMap,
        objects: [...objects],
      },
    }

    await firebase.firestore().collection("sectors").doc("ks1slznh").set(up)

    // await firebase
    //   .firestore()
    //   .collection("tilesets")
    //   .doc("ks1rp7n3")
    //   .set({
    //     tiles: {
    //       ls1rwj72: {
    //         walkable: true,
    //         animation: { frameDuration: 400 },
    //         frames: [{ coords: [0, 0, 32 * 2, 32 * 3] }],
    //       },
    //     },
    //     name: "AA",
    //     imageUrl:
    //       "https://firebasestorage.googleapis.com/v0/b/attestation-covid-19-79574.appspot.com/o/res%2Fobjects%2Fobjects.png?alt=media&token=ab8f6f97-8303-4817-b06c-62de1f0fb308",
    //   })
  }

  useEffect(() => {
    if (loaded) {
      draw()
    }
  }, [loaded])

  const draw = () => {
    const ctx = canvasRef.current.getContext("2d")

    renderTileMap(ctx, gameResources.getSector("ks1slznh").map.tileMap)

    requestAnimationFrame(draw)
  }

  // const draw = () => {
  //   const ctx = canvasRef.current.getContext("2d")

  //   renderTileMap(ctx, sectorRef.current.sector.map.tileMap)

  //   window.requestAnimationFrame(draw)
  // }

  const height = 300
  const width = 400

  const zoom = 2

  return (
    <div
      className="test"
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <button
        onClick={() => {
          test()
        }}
      >
        TEST
      </button>
      <canvas
        ref={canvasRef}
        height={height}
        width={width}
        style={{
          height: height * zoom,
          width: width * zoom,
          border: "2px solid black",
        }}
      />
    </div>
  )
}
export default Test

const random = array => array[Math.floor(Math.random() * array.length)]
