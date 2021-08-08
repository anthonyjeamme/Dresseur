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

const ZOOM = 3

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

const lights = [
  {
    position: { x: 32 * 10, y: 32 * 10 },
    color: [230, 214, 174],
    intensity: 1,
  },
  {
    position: { x: 32 * 14, y: 32 * 10 },
    color: [230, 255, 174],
    intensity: 0.8,
  },
  {
    position: { x: 32 * 18, y: 32 * 10 },
    color: [255, 214, 174],
    intensity: 0.8,
  },
]

const getBetweenNumber = (a, b, ratio) => a + (b - a) * ratio
const getBetweenColor = ([r1, g1, b1], [r2, g2, b2], ratio) => [
  Math.round(getBetweenNumber(r1, r2, ratio)),
  Math.round(getBetweenNumber(g1, g2, ratio)),
  Math.round(getBetweenNumber(b1, b2, ratio)),
]

const getGameTime = () => {
  const position =
    new Date().getTime() / 1000 / 60 / 60 -
    Math.floor(new Date().getTime() / 1000 / 60 / 60)

  const dayTime = position * 60 * 24

  return {
    h: Math.floor(dayTime / 60),
    m: Math.max(0, Math.round(dayTime % 59)),
  }
}

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

  const mobileButtonRef = useRef({
    u: false,
    d: false,
    l: false,
    r: false,
  })

  useEffect(() => {
    load()
  }, [])

  const keyboard = useKeyboardAction()

  const positionRef = useRef({ x: 96 + 32, y: 64 })
  const vitesseRef = useRef({ x: 0, y: 0 })
  const lastLoopDateTime = useRef(new Date().getTime())

  const currentZoom = useRef(ZOOM)

  const timeRef = useRef(getGameTime())
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
    const { h, m } = getGameTime()

    hourRef.current.innerHTML = `${`0${h}`.slice(-2)}h${`0${m}`.slice(-2)}`
  }

  useEffect(() => {
    gameLoop()
    // const interval = setInterval(gameLoop, 20)
    return () => {
      // clearInterval(interval)
    }
  }, [])

  const recomputePosition = () => {
    const dt = new Date().getTime() - lastLoopDateTime.current

    const nextPosition = { x: positionRef.current.x, y: positionRef.current.y }

    const MAX_SPEED = 2.5
    const speed = 10

    if (keyboard.isActive("ACTION_GO_UP") || mobileButtonRef.current.u) {
      lastDirection.current = 1
      vitesseRef.current.y = Math.max(vitesseRef.current.y - 0.4, -MAX_SPEED)
    }
    if (keyboard.isActive("ACTION_GO_DOWN") || mobileButtonRef.current.d) {
      lastDirection.current = 0
      vitesseRef.current.y = Math.min(vitesseRef.current.y + 0.4, MAX_SPEED)
    }

    if (
      !keyboard.isActive("ACTION_GO_UP") &&
      !keyboard.isActive("ACTION_GO_DOWN") &&
      !mobileButtonRef.current.u &&
      !mobileButtonRef.current.d
    ) {
      if (vitesseRef.current.y > -0.4 && vitesseRef.current.y < 0.4)
        vitesseRef.current.y = 0
      else if (vitesseRef.current.y > 0) {
        vitesseRef.current.y -= 0.6
      } else if (vitesseRef.current.y < 0) {
        vitesseRef.current.y += 0.6
      }
    }

    if (keyboard.isActive("ACTION_GO_LEFT") || mobileButtonRef.current.l) {
      lastDirection.current = 2
      vitesseRef.current.x = Math.max(vitesseRef.current.x - 0.4, -MAX_SPEED)
    }
    if (keyboard.isActive("ACTION_GO_RIGHT") || mobileButtonRef.current.r) {
      lastDirection.current = 3
      vitesseRef.current.x = Math.min(vitesseRef.current.x + 0.4, MAX_SPEED)
    }

    if (
      !keyboard.isActive("ACTION_GO_LEFT") &&
      !keyboard.isActive("ACTION_GO_RIGHT") &&
      !mobileButtonRef.current.l &&
      !mobileButtonRef.current.r
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

  const centered = (ctx, func) => {
    ctx.translate(
      Math.round(canvasRef.current.width / 2),
      Math.round(canvasRef.current.height / 2)
    )

    func()

    ctx.translate(
      -Math.round(canvasRef.current.width / 2),
      -Math.round(canvasRef.current.height / 2)
    )
  }

  const positionTranslated = (ctx, func) => {
    ctx.translate(-positionRef.current.x, -positionRef.current.y)
    func()
    ctx.translate(positionRef.current.x, positionRef.current.y)
  }

  const gameLoop = () => {
    recomputePosition()

    const shadowCtx = shadowCanvasRef.current.getContext("2d")

    timeLoop()

    const getDayColor = () => {
      const position =
        0.1 ||
        new Date().getTime() / 1000 / 60 / 60 -
          Math.floor(new Date().getTime() / 1000 / 60 / 60)

      const ambianceColor = getColorFromGradient(gradient, position)

      return `rgba(${ambianceColor.join(",")})`
    }

    shadowCtx.fillStyle = getDayColor()
    shadowCtx.fillRect(
      0,
      0,
      shadowCanvasRef.current.width,
      shadowCanvasRef.current.height
    )

    function easeInOut(t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
    }

    centered(shadowCtx, () => {
      shadowCtx.scale(1, 0.5)

      const angle =
        lastDirection.current === 3
          ? 0
          : lastDirection.current === 0
          ? 1
          : lastDirection.current === 2
          ? 2
          : 3
      const rotation = (angle * Math.PI) / 2

      shadowCtx.rotate(rotation)

      var gradient = shadowCtx.createRadialGradient(20 + 20, 0, 20, 60, 0, 60)
      gradient.addColorStop(0, `rgba(255,255,255,1)`)

      for (var t = 0; t <= 1; t += 0.05) {
        gradient.addColorStop(t, `rgba( 255,255,255, ${1 - easeInOut(t) * 1})`)
      }

      gradient.addColorStop(1, `rgba(255,255,255, 0)`)
      shadowCtx.fillStyle = gradient
      shadowCtx.fillRect(-300, -300, 600, 600)

      shadowCtx.rotate(-rotation)
      shadowCtx.scale(1, 2)
    })

    for (const light of lights) {
      // console.log(light)

      centered(shadowCtx, () => {
        positionTranslated(shadowCtx, () => {
          shadowCtx.translate(light.position.x, light.position.y)

          var gradient = shadowCtx.createRadialGradient(0, 0, 20, 0, 0, 100)
          gradient.addColorStop(
            0,
            `rgba(${light.color.join(",")}, ${light.intensity})`
          )

          for (var t = 0; t <= 1; t += 0.1) {
            gradient.addColorStop(
              t,
              `rgba( ${light.color.join(",")}, ${
                light.intensity - easeInOut(t) * light.intensity
              })`
            )
          }

          gradient.addColorStop(1, `rgba(${light.color.join(",")}, 0)`)
          shadowCtx.fillStyle = gradient
          shadowCtx.fillRect(-100, -100, 200, 200)

          shadowCtx.translate(-light.position.x, -light.position.y)
        })
      })
    }

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
        keyboard.isActive("ACTION_GO_RIGHT") ||
        mobileButtonRef.current.d ||
        mobileButtonRef.current.u ||
        mobileButtonRef.current.l ||
        mobileButtonRef.current.r
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

      <div className="hours" ref={hourRef}></div>

      <canvas
        ref={canvasRef}
        onContextMenu={e => {
          e.preventDefault()
        }}
        style={{}}
      />

      <canvas ref={shadowCanvasRef} id="shadow-canvas" />

      <div className="mobile-buttons">
        <div>
          <button
            onTouchStart={() => {
              mobileButtonRef.current.u = true
            }}
            onTouchEnd={() => {
              mobileButtonRef.current.u = false
            }}
          >
            UP
          </button>
        </div>
        <div>
          <button
            onTouchStart={() => {
              mobileButtonRef.current.l = true
            }}
            onTouchEnd={() => {
              mobileButtonRef.current.l = false
            }}
          >
            L
          </button>
          <button
            onTouchStart={() => {
              mobileButtonRef.current.d = true
            }}
            onTouchEnd={() => {
              mobileButtonRef.current.d = false
            }}
          >
            D
          </button>
          <button
            onTouchStart={() => {
              mobileButtonRef.current.r = true
            }}
            onTouchEnd={() => {
              mobileButtonRef.current.r = false
            }}
          >
            R
          </button>
        </div>
      </div>
    </div>
  )
}

export default Game
