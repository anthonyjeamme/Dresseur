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
    gameResources
      .loadSector("ks1slznh")
      .then(() => {
        console.log("Sector loaded ")
        setLoaded(true)
      })
      .catch(() => {
        console.log("Problem when loading sector")
      })
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
          console.log(
            JSON.parse(JSON.stringify(gameResources.getSector("ks1slznh")))
          )
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
