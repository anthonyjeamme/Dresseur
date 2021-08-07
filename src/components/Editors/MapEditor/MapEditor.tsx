import React, { useEffect, useState, useRef } from "react"

import Topbar from "./Topbar/Topbar"

import uniqid from "uniqid"

import firebase from "firebase/app"
import "firebase/firestore"

import { TPosition } from "../../../gameEngine/Types/Math/Position"
import useIsMounted from "../../../utils/useIsMounted"

import "./MapEditor.scss"
import { useResourceLoader } from "../../../gameEngine/loader/loader"
import {
  renderTile,
  renderTileMap,
} from "../../../gameEngine/graphicEngine/graphicEngine"
import { TileSet } from "../../../gameEngine/Objects/TileSet/TileSet"
import { Tile } from "../../../gameEngine/Objects/Tile/Tile"

const MapEditor = ({}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const positionRef = useRef<TPosition>({ x: 0, y: 0 })
  const isMounted = useIsMounted()

  const gameResources = useResourceLoader()
  const [loaded, setLoaded] = useState(false)

  const [sideBarOpened, setSideBarOpened] = useState(true)

  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === "b" && e.ctrlKey) {
        setSideBarOpened(sideBarOpened => !sideBarOpened)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const load = async () => {
    await gameResources.loadSector("ks1slznh")
    await gameResources.loadSector("ks1slzni")
    await gameResources.loadSector("ks1slznj")
    await gameResources.loadSector("ks1slznk")
    await gameResources.loadSector("ks259j72")
    await gameResources.loadSector("ks259m9x")
    await gameResources.loadSector("ks259ocl")
  }

  useEffect(() => {
    load()
      .then(() => {
        console.log(`Sector loaded`)

        setLoaded(true)
        startGameLoop()
      })
      .catch(err => {
        console.log(`Error loading sector`)
      })
  }, [])

  const currentTileRef = useRef({ tileSet: null, tile: null })

  const currentMouseOver = useRef(null)

  const mouseStatusRef = useRef({
    isDragging: false,
    clickIdDown: false,
  })

  useEffect(() => {
    canvasRef.current.height = Math.round((window.innerHeight - 38) / 2)
    canvasRef.current.width = Math.round(window.innerWidth / 2)
  }, [])

  const startGameLoop = () => {
    mapLoop()
  }

  const mapLoop = () => {
    if (!isMounted()) return
    const ctx = canvasRef.current.getContext("2d")

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    ctx.save()
    ctx.translate(
      -Math.round(positionRef.current.x),
      -Math.round(positionRef.current.y)
    )

    const sectors = gameResources.getSectorIds()

    for (const sectorId of sectors) {
      const sector = gameResources.getSector(sectorId)

      if (sector) {
        ctx.translate(
          sector.globalPosition.x * 32 * 32,
          sector.globalPosition.y * 32 * 32
        )

        renderTileMap(ctx, sector.map.tileMap)

        ctx.translate(
          -sector.globalPosition.x * 32 * 32,
          -sector.globalPosition.y * 32 * 32
        )
      }
    }

    if (currentMouseOver.current && currentTileRef.current.tile) {
      const { tileSet, tile } = currentTileRef.current

      ctx.fillStyle = "rgba(255,0,0,0.1)"

      // const cell = new Tile(getTileSet(tileSet), tile)

      ctx.globalAlpha = 0.7

      ctx.fillRect(
        currentMouseOver.current.position.x,
        currentMouseOver.current.position.y,

        32,
        32
      )

      ctx.globalAlpha = 1
    }

    ctx.restore()

    window.requestAnimationFrame(mapLoop)
  }

  const handleMouseDown = () => {
    mouseStatusRef.current.clickIdDown = true
  }
  const handleMouseUp = () => {
    mouseStatusRef.current.clickIdDown = false
  }
  const handleMouseMove = e => {
    const mousePosition = getMousePosition(e)

    if (mouseStatusRef.current.clickIdDown && e.ctrlKey) {
      positionRef.current.x -= e.movementX / 2
      positionRef.current.y -= e.movementY / 2
    } else if (mouseStatusRef.current.clickIdDown) {
      writeCell(mousePosition)
    }

    currentMouseOver.current = {
      position: {
        x: mousePosition.x * 32,
        y: mousePosition.y * 32,
      },
    }
  }

  const getMousePosition = e => {
    const mousePosition: TPosition = {
      x: Math.floor(e.clientX / 2 / 32 + positionRef.current.x / 32),
      y: Math.floor((e.clientY - 38) / 2 / 32 + positionRef.current.y / 32),
    }

    return mousePosition
  }

  const handleClick = e => {
    if (e.ctrlKey) return

    const clickPosition = getMousePosition(e)

    writeCell(clickPosition)
  }

  const findCurrentSector = (position: TPosition) => {
    const x = Math.floor(position.x / 32)
    const y = Math.floor(position.y / 32)

    return gameResources.getSectorFromCoords({ x, y })
  }

  const createSector = async position => {
    const result = window.prompt("Créer le secteur ?")

    if (result === "y") {
      console.log(position)
      console.log("CREER")

      await firebase
        .firestore()
        .collection("sectors")
        .doc(uniqid())
        .set({
          ...gameResources.getSector("ks1slznh").toJSON(),
          globalPosition: position,
        })
    }
  }

  const writeCell = (position: TPosition) => {
    const sector = findCurrentSector(position)

    if (!sector) {
      createSector({
        x: Math.floor(position.x / 32),
        y: Math.floor(position.y / 32),
      })

      return
    }

    if (!currentTileRef.current.tile) return

    const { tileSet, tile } = currentTileRef.current

    const x = position.x - sector.globalPosition.x * 32
    const y = position.y - sector.globalPosition.y * 32

    if (
      gameResources.getTile(tileSet, tile).getId() ===
      sector.map.tileMap[y].cells[x].getId()
    )
      return

    sector.map.tileMap[y].cells[x] = gameResources.getTile(tileSet, tile)
  }

  useEffect(() => {
    canvasRef.current.addEventListener("mousedown", handleMouseDown)
    canvasRef.current.addEventListener("mouseup", handleMouseUp)
    canvasRef.current.addEventListener("mousemove", handleMouseMove)
    canvasRef.current.addEventListener("click", handleClick)

    return () => {
      canvasRef.current.removeEventListener("mousedown", handleMouseDown)
      canvasRef.current.removeEventListener("mouseup", handleMouseUp)
      canvasRef.current.removeEventListener("mousemove", handleMouseMove)
      canvasRef.current.removeEventListener("click", handleClick)
    }
  }, [])

  return (
    <div className="MapEditor">
      <Topbar
        handleSave={async () => {
          for (const sectorId of gameResources.getSectorIds()) {
            await firebase
              .firestore()
              .collection("sectors")
              .doc(sectorId)
              .set(gameResources.getSector(sectorId).toJSON())
          }
          console.log("SAVED")
        }}
      />

      <div className="content">
        <canvas ref={canvasRef} />

        {loaded && (
          <div className={`Sidebar ${sideBarOpened ? "active" : ""}`}>
            <button
              onClick={() => {
                gameResources.loadSector("ks1slzni")
              }}
            >
              LOAD 1x0
            </button>

            <button
              onClick={() => {
                gameResources.loadSector("ks1slznj")
              }}
            >
              LOAD 0x1
            </button>
            <button
              onClick={() => {
                gameResources.loadSector("ks1slznk")
              }}
            >
              LOAD 1x1
            </button>

            {Object.values(gameResources.getResources().tileSets).map(
              // @ts-ignore
              (tileSet: TileSet) => (
                <div key={tileSet.id} className="tileset">
                  <div>tileset : {tileSet.id}</div>

                  <div className="tiles">
                    {Object.values(tileSet.tiles).map(tile => (
                      <DisplayTile
                        key={tile.getId()}
                        tile={tile}
                        handleClick={() => {
                          currentTileRef.current = tile.getPath()
                        }}
                      />
                    ))}
                  </div>
                </div>
              )
            )}

            {/* 

          {Object.values(tileSets).map((tileSet, i) => (
            <div className="TileSet" key={i}>
              {Object.keys(tileSet.definition.tiles).map(tile => (
                <DisplayTile
                  key={tile}
                  handleClick={() => {
                    console.log({
                      tile,
                      tileSet: tileSet.definition.id,
                    })

                    currentTileRef.current = {
                      tile,
                      tileSet: tileSet.definition.id,
                    }
                  }}
                  tileSet={tileSet}
                  tile={tileSet.definition.tiles[tile]}
                />
              ))}
            </div>
          ))} */}
          </div>
        )}
      </div>
    </div>
  )
}

export default MapEditor

const DisplayTile = ({
  tile,
  handleClick,
}: {
  tile: Tile
  handleClick: any
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d")

    renderTile(ctx, tile, { x: 0, y: 0 })

    // const [ox, oy, ow, oh] = tile.coords

    // ctx.drawImage(tileSet.definition.img, ox, oy, ow, oh, 0, 0, 32, 32)
  }, [])

  console.log(tile)
  return (
    <div className="DisplayTile" role="button" onClick={handleClick}>
      <canvas
        ref={canvasRef}
        height={32}
        width={32}
        style={{
          height: 32 * 2,
          width: 32 * 2,
        }}
      ></canvas>
    </div>
  )
}
