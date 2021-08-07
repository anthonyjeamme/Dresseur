import React, { useEffect, useState, useRef } from "react"

import Topbar from "./Topbar/Topbar"

import { TSector } from "../../../gameEngine/Objects/Sector/Sector.types"
import { TPosition } from "../../../gameEngine/Types/Math/Position"
import { loadSector } from "../../../gameEngine/loader/loader"
import { Tile } from "../../../gameEngine/Objects/Tile/Tile"
import useIsMounted from "../../../utils/useIsMounted"

import "./MapEditor.scss"
import { TileSet } from "../../../gameEngine/Objects/TileSet/TileSet"

const MapEditor = ({}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const positionRef = useRef<TPosition>({ x: 0, y: 0 })
  const isMounted = useIsMounted()

  const currentTileRef = useRef({ tileSet: null, tile: null })

  const [loadingStatus, setLoadingStatus] = useState("loading")
  const sectorDataRef = useRef<{
    id: string
    sector: TSector
    sectorDependencies: {
      tileSets: TileSet[]
    }
  }>(null)

  const [tileSets, setTileSets] = useState<any>([])

  const mapRef = useRef([])
  const getTileSet = id => {
    return sectorDataRef.current.sectorDependencies.tileSets.find(
      tileSet => tileSet.definition.id === id
    )
  }

  useEffect(() => {
    loadSector("ks1slznh")
      .then(sectorData => {
        const { tileMap } = sectorData.sector.map

        sectorDataRef.current = sectorData

        setTileSets(sectorData.sectorDependencies.tileSets)

        mapRef.current = tileMap.map(({ cells }) =>
          cells.map(cell => new Tile(getTileSet(cell.tileSet), cell.tile))
        )

        setLoadingStatus("loaded")
        startGameLoop()
      })
      .catch()
  }, [])

  const currentMouseOver = useRef(null)

  const mouseStatusRef = useRef({
    isDragging: false,
    clickIdDown: false,
  })

  useEffect(() => {
    canvasRef.current.height = Math.round((window.innerHeight - 38) / 4)
    canvasRef.current.width = Math.round(window.innerWidth / 4)
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

    for (let y = 0; y < 32; y++) {
      for (let x = 0; x < 32; x++) {
        const cell = mapRef.current[y][x]

        const [ox, oy, ow, oh] = cell.getCoords()

        ctx.drawImage(cell.getImage(), ox, oy, ow, oh, x * 32, y * 32, 32, 32)
      }
    }

    if (currentMouseOver.current && currentTileRef.current.tile) {
      const { tileSet, tile } = currentTileRef.current

      ctx.fillStyle = "rgba(255,0,0,0.1)"

      const cell = new Tile(getTileSet(tileSet), tile)
      console.log(currentMouseOver.current.position.x)

      const [ox, oy, ow, oh] = cell.getCoords()
      ctx.globalAlpha = 0.7
      ctx.drawImage(
        cell.getImage(),
        ox,
        oy,
        ow,
        oh,
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
      positionRef.current.x -= e.movementX / 4
      positionRef.current.y -= e.movementY / 4
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
      x: Math.floor(e.clientX / 4 / 32 + positionRef.current.x / 32),
      y: Math.floor((e.clientY - 38) / 4 / 32 + positionRef.current.y / 32),
    }

    return mousePosition
  }

  const handleClick = e => {
    if (e.ctrlKey) return

    const clickPosition = getMousePosition(e)

    writeCell(clickPosition)
  }

  const writeCell = (position: TPosition) => {
    if (!currentTileRef.current.tile) return
    if (position.x < 0 || position.x > 31 || position.y < 0 || position.y > 31)
      return

    const { tileSet, tile } = currentTileRef.current

    mapRef.current[position.y][position.x] = new Tile(getTileSet(tileSet), tile)
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
      <Topbar />

      <div className="content">
        <canvas ref={canvasRef} />

        <div className="Sidebar">
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
          ))}
        </div>
      </div>
    </div>
  )
}

export default MapEditor

const DisplayTile = ({ tileSet, tile, handleClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d")

    const [ox, oy, ow, oh] = tile.coords

    ctx.drawImage(tileSet.definition.img, ox, oy, ow, oh, 0, 0, 32, 32)
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
