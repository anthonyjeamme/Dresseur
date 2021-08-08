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
    // const data = (
    //   await firebase.firestore().collection("sectors").doc("ks1slznh").get()
    // ).data()

    // console.log(data.map.tileMap[0].cells[0])

    // const up = {
    //   ...data,
    //   map: {
    //     tileMap: data.map.tileMap.map(({ cells }) => ({
    //       cells: cells.map(() => ({
    //         base: { tileSet: "ks1rp7n1", tile: "ks1ruxbr" },
    //         over: [],
    //       })),
    //     })),
    //   },
    // }

    // await firebase.firestore().collection("sectors").doc("ks1slznh").set(up)

    await firebase
      .firestore()
      .collection("tilesets")
      .doc("ks1rp7n1")
      .set({
        tiles: {
          ks1rwj72: {
            walkable: true,
            animation: { frameDuration: 400 },
            frames: [{ coords: [32, 0, 32, 32] }],
          },
          ks1ruxbr: {
            walkable: true,
            animation: { frameDuration: 400 },
            frames: [{ coords: [0, 0, 32, 32] }],
          },
          ks1rw2zq: {
            animation: { frameDuration: 200 },
            frames: [
              { coords: [128, 0, 32, 32] },
              { coords: [128, 32, 32, 32] },
              { coords: [128, 64, 32, 32] },
            ],
          },
          ks1rw95y1: {
            walkable: true,
            animation: { frameDuration: 400 },
            frames: [{ coords: [160, 0, 32, 32] }],
          },
          ks1rw95y2: {
            over: true,
            animation: { frameDuration: 400 },
            frames: [{ coords: [160, 32, 32, 32] }],
          },
          ks1rw95y3: {
            over: true,
            animation: { frameDuration: 400 },
            frames: [{ coords: [192, 0, 32, 32] }],
          },
          ks1rw95y4: {
            over: true,
            animation: { frameDuration: 400 },
            frames: [{ coords: [192, 32, 32, 32] }],
          },
          ks1rw95y5: {
            over: true,
            animation: { frameDuration: 400 },
            frames: [{ coords: [192, 64, 32, 32] }],
          },

          ks1rw95y6: {
            animation: { frameDuration: 400 },
            frames: [{ coords: [192 + 32, 0, 32, 32] }],
          },
          ks1rw95y7: {
            walkable: true,
            animation: { frameDuration: 400 },
            frames: [{ coords: [192 - 32, 64, 32, 32] }],
          },
          A1: {
            over: true,
            animation: { frameDuration: 400 },
            frames: [{ coords: [0, 3 * 32, 32, 32] }],
          },
          A2: {
            over: true,
            animation: { frameDuration: 400 },
            frames: [{ coords: [32, 3 * 32, 32, 32] }],
          },
          A3: {
            over: true,
            animation: { frameDuration: 400 },
            frames: [{ coords: [0, 4 * 32, 32, 32] }],
          },
          A4: {
            over: true,
            animation: { frameDuration: 400 },
            frames: [{ coords: [32, 4 * 32, 32, 32] }],
          },
          A5: {
            over: true,
            animation: { frameDuration: 400 },
            frames: [{ coords: [0, 5 * 32, 32, 32] }],
          },
          A6: {
            over: true,
            animation: { frameDuration: 400 },
            frames: [{ coords: [32, 5 * 32, 32, 32] }],
          },
          // A3: {
          //   over: true,
          //   animation: { frameDuration: 400 },
          //   frames: [{ coords: [32 * 2, 5 * 32, 32, 32] }],
          // },
          // A4: {
          //   over: true,
          //   animation: { frameDuration: 400 },
          //   frames: [{ coords: [0, 3 * 32, 32, 32] }],
          // },
          // A5: {
          //   over: true,
          //   animation: { frameDuration: 400 },
          //   frames: [{ coords: [32, 4 * 32, 32, 32] }],
          // },
          // A6: {
          //   over: true,
          //   animation: { frameDuration: 400 },
          //   frames: [{ coords: [32 * 2, 5 * 32, 32 * 2, 32 * 3] }],
          // },
        },
        name: "AA",
        imageUrl:
          "https://firebasestorage.googleapis.com/v0/b/attestation-covid-19-79574.appspot.com/o/res%2FtileSets%2Fks1rp7n1%2Fground.png?alt=media&token=dd6395d6-ccbf-4a71-aa16-bb1bc6eff378",
      })
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
