import React, { useEffect, useRef } from "react"
import {
  render,
  renderMap,
  renderTileMap,
} from "../../gameEngine/graphicEngine/graphicEngine"
import { useResourceLoader } from "../../gameEngine/loader/loader"
import { Scene } from "../../gameEngine/Objects/Scene/Scene"
import { Tile } from "../../gameEngine/Objects/Tile/Tile"
import { TPosition } from "../../gameEngine/Types/Math/Position"
import { useKeyboardAction } from "../../io/useKeyboardAction"

import "./Game.scss"

export const isBrowser = () => typeof window !== "undefined"

const ZOOM = 3

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>()

  const gameResources = useResourceLoader()

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
  }, [])

  const keyboard = useKeyboardAction()

  const positionRef = useRef({ x: 96 + 32, y: 64 })
  const vitesseRef = useRef({ x: 0, y: 0 })

  const currentZoom = useRef(ZOOM)

  const timeRef = useRef({ h: 1 })
  const hourRef = useRef<HTMLDivElement>()

  const lastDirection = useRef(0)

  const tilesRef = useRef([])

  // const sceneRef = useRef(new Scene())

  let img = null,
    tileImg = null,
    houseImg = null,
    guyImg = null,
    testImg = null,
    joeImg = null,
    barrImg = null

  if (isBrowser()) {
    img = document.createElement("img")
    img.src = "/images/ground.png"
    tileImg = document.createElement("img")
    tileImg.src = "/images/tile.png"
    houseImg = document.createElement("img")
    houseImg.src = "/images/house.png"
    guyImg = document.createElement("img")
    guyImg.src = "/images/guy.png"
    testImg = document.createElement("img")
    testImg.src = "/images/test-tile.png"
    joeImg = document.createElement("img")
    joeImg.src = "/images/joe.png"
    barrImg = document.createElement("img")
    barrImg.src = "/images/barr.png"
  }

  const timeLoop = () => {
    timeRef.current.h = (timeRef.current.h + 1) % 24
    hourRef.current.innerHTML = `${timeRef.current.h}h00`
  }

  useEffect(() => {
    const interval = setInterval(gameLoop, 20)
    const hourInterval = setInterval(timeLoop, 600)
    return () => {
      clearInterval(interval)
      clearInterval(hourInterval)
    }
  }, [])

  const recomputePosition = () => {
    const nextPosition = { x: positionRef.current.x, y: positionRef.current.y }

    const MAX_SPEED = 2
    const speed = 10

    if (keyboard.isActive("ACTION_GO_UP")) {
      lastDirection.current = 1
      vitesseRef.current.y = Math.max(vitesseRef.current.y - 0.4, -MAX_SPEED)
    }
    if (keyboard.isActive("ACTION_GO_DOWN")) {
      lastDirection.current = 0
      vitesseRef.current.y = Math.min(vitesseRef.current.y + 0.4, MAX_SPEED)
    }

    if (
      !keyboard.isActive("ACTION_GO_UP") &&
      !keyboard.isActive("ACTION_GO_DOWN")
    ) {
      if (vitesseRef.current.y > -0.4 && vitesseRef.current.y < 0.4)
        vitesseRef.current.y = 0
      else if (vitesseRef.current.y > 0) {
        vitesseRef.current.y -= 0.6
      } else if (vitesseRef.current.y < 0) {
        vitesseRef.current.y += 0.6
      }
    }

    if (keyboard.isActive("ACTION_GO_LEFT")) {
      lastDirection.current = 2
      vitesseRef.current.x = Math.max(vitesseRef.current.x - 0.4, -MAX_SPEED)
    }
    if (keyboard.isActive("ACTION_GO_RIGHT")) {
      lastDirection.current = 3
      vitesseRef.current.x = Math.min(vitesseRef.current.x + 0.4, MAX_SPEED)
    }

    if (
      !keyboard.isActive("ACTION_GO_LEFT") &&
      !keyboard.isActive("ACTION_GO_RIGHT")
    ) {
      if (vitesseRef.current.x > -0.4 && vitesseRef.current.x < 0.4)
        vitesseRef.current.x = 0
      else if (vitesseRef.current.x > 0) {
        vitesseRef.current.x -= 0.4
      } else if (vitesseRef.current.x < 0) {
        vitesseRef.current.x += 0.4
      }
    }

    nextPosition.x = nextPosition.x + vitesseRef.current.x
    nextPosition.y = nextPosition.y + vitesseRef.current.y

    const tileCoord = {
      x: Math.floor(nextPosition.x / 64),
      y: Math.floor(nextPosition.y / 64),
    }

    positionRef.current = {
      x: Math.round(nextPosition.x),
      y: Math.round(nextPosition.y),
    }
  }

  const gameLoop = () => {
    recomputePosition()

    const ctx = canvasRef.current.getContext("2d")

    ctx.save()
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

    const sectors = gameResources.getSectorIds()

    ctx.translate(-positionRef.current.x, -positionRef.current.y)

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

    // const ctx = canvasRef.current.getContext("2d")
    // ctx.imageSmoothingEnabled = false

    // const drawTile = (tile: Tile, position: TPosition, name: string) => {
    //   const { coords }: number[] = tile.json[name]

    //   if (!coords) {
    //     throw `Unknown tile name '${name}'`
    //     return
    //   }

    //   ctx.drawImage(tile.image, ...coords, position.x, position.y, 32, 32)
    // }

    // ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

    // const tileCoords = {
    //   ground: { x: 30, y: 64 + 64 + 32, w: 64, h: 64 },
    //   grass: { x: 30, y: 64, w: 64, h: 64 },
    //   marble: { x: 30, y: 64 + 64 + 32 + 96 + 32, w: 64, h: 64 },
    //   groundGrassLeft: {
    //     x: 200,
    //     y: 160,
    //     w: 32,
    //     h: 32,
    //   },
    //   groundGrassTop: {
    //     x: 216,
    //     y: 130,
    //     w: 32,
    //     h: 32,
    //   },
    // }

    // // ctx.translate(window.innerWidth, window.innerHeight)

    // render(sceneRef.current, ctx, positionRef.current)

    // ctx.translate(
    //   window.innerWidth / currentZoom.current / 2,
    //   window.innerHeight / currentZoom.current / 2
    // )

    // const TILE_SIZE = 64 / 8

    // ctx.translate(-positionRef.current.x, -positionRef.current.y)

    // // for (let i = 0; i < 10; i++) {
    // //   ctx.drawImage(barrImg, 64 + i * 32, 0)
    // // }

    // // ctx.globalCompositeOperation = "lighter";

    // // ctx.translate(-positionRef.current.x, -positionRef.current.y)

    // // ctx.globalCompositeOperation = "darker";
    // // ctx.fillStyle = `rgba(0,0,0, ${0.3})`;
    // // // ctx.fillRect(0, 0, window.innerWidth / 2, window.innerHeight)

    // // // var gradient = ctx.createLinearGradient(0, 0, 1000, 0);
    // // // gradient.addColorStop(0, "rgba(0,0,0,0.6)");
    // // // gradient.addColorStop(1, "transparent");
    // // // ctx.fillStyle = gradient;
    // // // ctx.fillRect(0, 0, 2000, window.innerHeight)

    // // var gradient = ctx.createRadialGradient(110, 90, 30, 100, 100, 70);

    // // ctx.globalCompositeOperation = "lighter";
    // // // Add three color stops
    // // gradient.addColorStop(0, 'rgba(255,255,200,0.2)');
    // // gradient.addColorStop(1, 'transparent');

    // // // Set the fill style and draw a rectangle
    // // ctx.fillStyle = gradient;
    // // ctx.fillRect(20, 20, 160, 160);

    // ctx.translate(positionRef.current.x, positionRef.current.y)

    // ctx.save()

    // ctx.translate(-positionRef.current.x, -positionRef.current.y)

    // // ctx.globalCompositeOperation = "lighter"
    // // for (const light of lights) {
    // //   const x = light.position.x
    // //   const y = light.position.y
    // //   const radius = light.radius

    // //   var gradient = ctx.createRadialGradient(
    // //     x,
    // //     y,
    // //     light.innerRadius,
    // //     x,
    // //     y,
    // //     light.radius + Math.round(Math.random() * 20)
    // //   )
    // //   gradient.addColorStop(
    // //     0,
    // //     `rgba(${light.color.join(",")},${
    // //       light.intensity + (Math.random() / 30 - 1 / 30)
    // //     })`
    // //   )
    // //   gradient.addColorStop(1, `rgba(${light.color.join(",")},${0})`)
    // //   ctx.fillStyle = gradient
    // //   ctx.fillRect(
    // //     light.position.x - radius - 50,
    // //     light.position.y - radius - 50,
    // //     radius * 2 + 100,
    // //     radius * 2 + 100
    // //   )
    // // }

    // ctx.restore()

    const frame = Math.round(new Date().getTime() / 60) % 6

    // ctx.fillStyle = "rgba(0,0,0,0.5)"
    // ctx.scale(1, 0.5)
    // ctx.beginPath()
    // ctx.arc(-10, -2, 7, 0, 2 * Math.PI)
    // ctx.lineWidth = 1
    // ctx.fill()
    // ctx.scale(1, 2)

    ctx.restore()

    ctx.translate(
      Math.round(canvasRef.current.width / 2),
      Math.round(canvasRef.current.height / 2)
    )

    ctx.drawImage(
      joeImg,

      keyboard.isActive("ACTION_GO_DOWN") ||
        keyboard.isActive("ACTION_GO_UP") ||
        keyboard.isActive("ACTION_GO_LEFT") ||
        keyboard.isActive("ACTION_GO_RIGHT")
        ? 30 * frame
        : 0,

      //   (keyboard.isActive("ACTION_GO_DOWN") ? 60 : 0) + 60 * frame,
      lastDirection.current * 60,
      30,
      60,
      -15,
      -60,
      30,
      60
    )

    ctx.translate(
      -Math.round(canvasRef.current.width / 2),
      -Math.round(canvasRef.current.height / 2)
    )

    ctx.restore()
  }

  useEffect(() => {
    canvasRef.current.height = window.innerHeight / currentZoom.current
    canvasRef.current.width = window.innerWidth / currentZoom.current

    const handleWindowResize = () => {
      canvasRef.current.height = window.innerHeight / currentZoom.current
      canvasRef.current.width = window.innerWidth / currentZoom.current
    }

    const handleWheel = e => {
      return
      let zoom = currentZoom.current

      if (e.deltaY < 0) {
        zoom++
      } else {
        zoom--
      }

      currentZoom.current = Math.min(6, Math.max(2, zoom))

      canvasRef.current.height = window.innerHeight / currentZoom.current
      canvasRef.current.width = window.innerWidth / currentZoom.current
    }

    window.addEventListener("wheel", handleWheel)
    window.addEventListener("resize", handleWindowResize)
    return () => {
      window.removeEventListener("wheel", handleWheel)
      window.removeEventListener("resize", handleWindowResize)
    }
  }, [])

  return (
    <div className="Game">
      {/* <audio src="/audio/music_jeu.mp3" loop={true} autoPlay={true} /> */}

      <div className="hours" ref={hourRef}>
        01h00
      </div>

      <canvas
        ref={canvasRef}
        onContextMenu={e => {
          e.preventDefault()
        }}
      />
    </div>
  )
}

export default Game
