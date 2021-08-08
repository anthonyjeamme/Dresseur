import React, { useEffect, useRef } from "react"
import {
  render,
  renderMap,
  renderObjects,
  renderTileMap,
} from "../../gameEngine/graphicEngine/graphicEngine"
import { useResourceLoader } from "../../gameEngine/loader/loader"
import { Scene } from "../../gameEngine/Objects/Scene/Scene"
import { Tile } from "../../gameEngine/Objects/Tile/Tile"
import { TPosition } from "../../gameEngine/Types/Math/Position"
import { useKeyboardAction } from "../../io/useKeyboardAction"

import "./Game.scss"

export const isBrowser = () => typeof window !== "undefined"

const ZOOM = 2

const gradient = [
  {
    position: 0.1,
    color: [28, 26, 64],
  },
  {
    position: 0.18,
    color: [58, 67, 120],
  },

  {
    position: 0.2,
    color: [92, 106, 151],
  },

  {
    position: 0.23,
    color: [191, 190, 186],
  },

  {
    position: 0.5,
    color: [204, 204, 204],
  },
  {
    position: 0.82,
    color: [193, 190, 184],
  },

  {
    position: 0.9,
    color: [58, 67, 120],
  },
  {
    position: 1,
    color: [28, 26, 64],
  },
]

const getBetweenNumber = (a, b, ratio) => a + (b - a) * ratio
const getBetweenColor = ([r1, g1, b1], [r2, g2, b2], ratio) => [
  Math.round(getBetweenNumber(r1, r2, ratio)),
  Math.round(getBetweenNumber(g1, g2, ratio)),
  Math.round(getBetweenNumber(b1, b2, ratio)),
]

const getColorFromGradient = (gradient, position) => {
  if (position < 0 || position > 1) throw `Out of gradient range`

  if (position <= gradient[0].position) return gradient[0].color

  for (let i = 0; i < gradient.length; i++) {
    const step = gradient[i]

    if (position <= step.position) {
      const previousStep = gradient[i - 1]
      const nextStep = step

      const ratio =
        (position - previousStep.position) /
        (nextStep.position - previousStep.position)

      return getBetweenColor(previousStep.color, nextStep.color, ratio)
    }
  }
}

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>()
  const shadowCanvasRef = useRef<HTMLCanvasElement>()

  const gameResources = useResourceLoader()

  const load = async () => {
    await gameResources.loadMap("05DGp5hRkJZvaMp4MCoT")
    await gameResources.loadSector({ x: 0, y: 0 })
  }

  useEffect(() => {
    load()
  }, [])

  const keyboard = useKeyboardAction()

  const positionRef = useRef({ x: 96 + 32, y: 64 })
  const vitesseRef = useRef({ x: 0, y: 0 })
  const lastLoopDateTime = useRef(new Date().getTime())

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
    gameLoop()
    // const interval = setInterval(gameLoop, 20)
    const hourInterval = setInterval(timeLoop, 600)
    return () => {
      // clearInterval(interval)
      clearInterval(hourInterval)
    }
  }, [])

  const recomputePosition = () => {
    const dt = new Date().getTime() - lastLoopDateTime.current

    const nextPosition = { x: positionRef.current.x, y: positionRef.current.y }

    const MAX_SPEED = 2.5
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

    nextPosition.x = nextPosition.x + (vitesseRef.current.x * dt) / 20
    nextPosition.y = nextPosition.y + (vitesseRef.current.y * dt) / 20

    const tileCoord = {
      x: Math.floor(Math.round(nextPosition.x) / 32),
      y: Math.floor(Math.round(nextPosition.y) / 32),
    }

    const sector = gameResources.getSectorFromCoords({ x: 0, y: 0 })

    try {
      const { walkable } =
        sector.map.tileMap[tileCoord.y].cells[tileCoord.x].base

      if (walkable) {
        positionRef.current = {
          x: Math.round(nextPosition.x),
          y: Math.round(nextPosition.y),
        }
      }
    } catch {
      //
    }

    lastLoopDateTime.current = new Date().getTime()
  }

  const gameLoop = () => {
    recomputePosition()

    const shadowCtx = shadowCanvasRef.current.getContext("2d")

    const getDayColor = () => {
      const position =
        new Date().getTime() / 1000 / 60 -
        Math.floor(new Date().getTime() / 1000 / 60)

      const ambianceColor = getColorFromGradient(gradient, position)

      console.log(ambianceColor)

      return `rgba(${ambianceColor.join(",")})`
    }

    shadowCtx.fillStyle = getDayColor()
    shadowCtx.fillRect(
      0,
      0,
      shadowCanvasRef.current.width,
      shadowCanvasRef.current.height
    )

    const ctx = canvasRef.current.getContext("2d")

    ctx.save()
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

    const sectors = gameResources.getSectorIds()

    ctx.translate(-positionRef.current.x, -positionRef.current.y)

    ctx.translate(
      Math.round(canvasRef.current.width / 2),
      Math.round(canvasRef.current.height / 2)
    )

    for (const sectorId of sectors) {
      const sector = gameResources.getSector(sectorId)

      if (sector) {
        ctx.translate(
          sector.globalPosition.x * 32 * 32,
          sector.globalPosition.y * 32 * 32
        )

        renderTileMap(ctx, sector.map.tileMap)
        renderObjects(
          ctx,
          sector.map.objects.filter(
            ({ position }) => position.y < positionRef.current.y
          )
        )

        ctx.translate(
          -sector.globalPosition.x * 32 * 32,
          -sector.globalPosition.y * 32 * 32
        )
      }
    }

    ctx.restore()
    const frame = Math.round(new Date().getTime() / 60) % 6

    ctx.translate(
      Math.round(canvasRef.current.width / 2),
      Math.round(canvasRef.current.height / 2)
    )

    ctx.fillStyle = "rgba(25, 12, 70, 0.4)"

    ctx.scale(1, 0.5)
    ctx.beginPath()
    ctx.arc(0, 0, 10, 0, 2 * Math.PI)
    ctx.fill()

    ctx.scale(1, 2)

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

    ctx.translate(-positionRef.current.x, -positionRef.current.y)

    ctx.translate(
      Math.round(canvasRef.current.width / 2),
      Math.round(canvasRef.current.height / 2)
    )

    for (const sectorId of sectors) {
      const sector = gameResources.getSector(sectorId)

      if (sector) {
        ctx.translate(
          sector.globalPosition.x * 32 * 32,
          sector.globalPosition.y * 32 * 32
        )

        renderObjects(
          ctx,
          sector.map.objects.filter(
            ({ position }) => position.y >= positionRef.current.y
          )
        )

        ctx.translate(
          -sector.globalPosition.x * 32 * 32,
          -sector.globalPosition.y * 32 * 32
        )
      }
    }

    ctx.translate(
      -Math.round(canvasRef.current.width / 2),
      -Math.round(canvasRef.current.height / 2)
    )

    ctx.translate(positionRef.current.x, positionRef.current.y)

    ctx.restore()

    window.requestAnimationFrame(gameLoop)
  }

  useEffect(() => {
    canvasRef.current.height = window.innerHeight / currentZoom.current
    canvasRef.current.width = window.innerWidth / currentZoom.current
    shadowCanvasRef.current.height = window.innerHeight / currentZoom.current
    shadowCanvasRef.current.width = window.innerWidth / currentZoom.current

    const handleWindowResize = () => {
      canvasRef.current.height = window.innerHeight / currentZoom.current
      canvasRef.current.width = window.innerWidth / currentZoom.current
      shadowCanvasRef.current.height = window.innerHeight / currentZoom.current
      shadowCanvasRef.current.width = window.innerWidth / currentZoom.current
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
        style={{}}
      />

      <canvas ref={shadowCanvasRef} id="shadow-canvas" />

      {/* <canvas
        style={{
          position: "fixed",
          zIndex: 2,
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          // filter: "grayscale(80%)",
          backgroundColor: "transparent",
          backgroundImage:
            "linear-gradient(to bottom, transparent 0%, black 100%)",
        }}
      /> */}
    </div>
  )
}

export default Game
