import React, { useEffect, useRef } from "react"
import { render } from "../../gameEngine/graphicEngine/graphicEngine"
import { Scene } from "../../gameEngine/Objects/Scene/Scene"
import { Tile } from "../../gameEngine/Objects/Tile/Tile"
import { TPosition } from "../../gameEngine/Types/Math/Position"
import { useKeyboardAction } from "../../io/useKeyboardAction"

import "./Game.scss"

export const isBrowser = () => typeof window !== "undefined"

const lights = [
  {
    position: { x: 650, y: 670 },
    color: [255, 255, 100],
    intensity: 0.5,
    radius: 70,
    innerRadius: 10,
  },
  {
    position: { x: 350, y: 810 },
    color: [255, 255, 100],
    intensity: 0.5,
    radius: 70,
    innerRadius: 10,
  },
  {
    position: { x: 955, y: 810 },
    color: [255, 255, 100],
    intensity: 0.5,
    radius: 70,
    innerRadius: 10,
  },
  {
    position: { x: 200, y: 200 },
    color: [255, 0, 0],
    intensity: 0.4,
    radius: 50,
    innerRadius: 10,
  },
]

const ZOOM = 4

const map = [
  [
    "grass",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
  ],
  [
    "grass",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
  ],
  [
    "grass",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
  ],
  [
    "grass",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
  ],
  [
    "grass",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
  ],
  [
    "grass",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
  ],
  [
    "grass",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
  ],
  [
    "grass",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
  ],
  [
    "grass",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
  ],
  [
    "grass",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
  ],
  [
    "grass",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
  ],
  [
    "grass",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
  ],
  [
    "grass",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
  ],
  [
    "grass",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
  ],
  [
    "grass",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
  ],
  [
    "grass",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
  ],
  [
    "grass",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
  ],
  [
    "grass",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
  ],
  [
    "grass",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
  ],
  [
    "grass",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
  ],
  [
    "grass",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
  ],
  [
    "grass",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
  ],
  [
    "grass",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
  ],
  [
    "grass",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
  ],
  [
    "grass",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
  ],
  [
    "grass",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
  ],
  [
    "grass",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
  ],
  [
    "grass",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
  ],
  [
    "grass",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
  ],
  [
    "grass",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
  ],
  [
    "grass",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
  ],
  [
    "grass",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
  ],
  [
    "grass",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
  ],
  [
    "grass",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
    "ground",
  ],
]

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>()

  const keyboard = useKeyboardAction()

  const positionRef = useRef({ x: 96 + 32, y: 64 })
  const vitesseRef = useRef({ x: 0, y: 0 })

  const currentZoom = useRef(ZOOM)

  const timeRef = useRef({ h: 1 })
  const hourRef = useRef<HTMLDivElement>()

  const lastDirection = useRef(0)

  const tilesRef = useRef([])

  const sceneRef = useRef(new Scene())

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

  useEffect(() => {
    const tile = new Tile("/res/tiles/ground/ground.png", {
      grass: {
        coords: [0, 0, 32, 32],
      },
      water: {
        coords: [32 * 4, 0, 32, 32],
      },
      grassWaterleft: {
        coords: [0, 32, 32, 32],
      },
      ground: {
        coords: [32, 0, 32, 32],
      },
    })

    tilesRef.current.push(tile)

    tile.load().then(() => {
      console.log("LOADED")
    })
  }, [])

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

    if (map[tileCoord.y] && map[tileCoord.y][tileCoord.x]) {
      if (map[tileCoord.y][tileCoord.x] !== "marble") {
        positionRef.current = nextPosition
      } else {
        vitesseRef.current = { x: 0, y: 0 }
      }
    } else {
      vitesseRef.current = { x: 0, y: 0 }
    }
  }

  const gameLoop = () => {
    recomputePosition()

    const ctx = canvasRef.current.getContext("2d")
    ctx.imageSmoothingEnabled = false

    const drawTile = (tile: Tile, position: TPosition, name: string) => {
      const { coords }: number[] = tile.json[name]

      if (!coords) {
        throw `Unknown tile name '${name}'`
        return
      }

      ctx.drawImage(tile.image, ...coords, position.x, position.y, 32, 32)
    }

    ctx["imageSmoothingEnabled"] = false /* standard */
    ctx["mozImageSmoothingEnabled"] = false /* Firefox */
    ctx["oImageSmoothingEnabled"] = false /* Opera */
    ctx["webkitImageSmoothingEnabled"] = false /* Safari */
    ctx["msImageSmoothingEnabled"] = false /* IE */

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

    const tileCoords = {
      ground: { x: 30, y: 64 + 64 + 32, w: 64, h: 64 },
      grass: { x: 30, y: 64, w: 64, h: 64 },
      marble: { x: 30, y: 64 + 64 + 32 + 96 + 32, w: 64, h: 64 },
      groundGrassLeft: {
        x: 200,
        y: 160,
        w: 32,
        h: 32,
      },
      groundGrassTop: {
        x: 216,
        y: 130,
        w: 32,
        h: 32,
      },
    }

    // ctx.translate(window.innerWidth, window.innerHeight)

    render(sceneRef.current, ctx, positionRef.current)

    ctx.translate(
      window.innerWidth / currentZoom.current / 2,
      window.innerHeight / currentZoom.current / 2
    )

    const TILE_SIZE = 64 / 8

    ctx.translate(-positionRef.current.x, -positionRef.current.y)

    // if (tilesRef.current.length > 0) {
    //   for (let y = 0; y < 50; y++) {
    //     for (let x = 0; x < 50; x++) {
    //       if (x === 0) {
    //         drawTile(
    //           tilesRef.current[0],
    //           {
    //             x: x * 32,
    //             y: y * 32,
    //           },
    //           "water"
    //         )
    //       } else if (x === 1) {
    //         drawTile(
    //           tilesRef.current[0],
    //           {
    //             x: x * 32,
    //             y: y * 32,
    //           },
    //           "grassWaterleft"
    //         )
    //       } else {
    //         if (y === 5) {
    //           drawTile(
    //             tilesRef.current[0],
    //             {
    //               x: x * 32,
    //               y: y * 32,
    //             },
    //             "ground"
    //           )
    //         } else
    //           drawTile(
    //             tilesRef.current[0],
    //             {
    //               x: x * 32,
    //               y: y * 32,
    //             },
    //             "grass"
    //           )
    //       }
    //     }
    //   }
    // }

    for (let i = 0; i < 10; i++) {
      ctx.drawImage(barrImg, 64 + i * 32, 0)
    }

    // ctx.globalCompositeOperation = "lighter";

    // ctx.translate(-positionRef.current.x, -positionRef.current.y)

    // ctx.globalCompositeOperation = "darker";
    // ctx.fillStyle = `rgba(0,0,0, ${0.3})`;
    // // ctx.fillRect(0, 0, window.innerWidth / 2, window.innerHeight)

    // // var gradient = ctx.createLinearGradient(0, 0, 1000, 0);
    // // gradient.addColorStop(0, "rgba(0,0,0,0.6)");
    // // gradient.addColorStop(1, "transparent");
    // // ctx.fillStyle = gradient;
    // // ctx.fillRect(0, 0, 2000, window.innerHeight)

    // var gradient = ctx.createRadialGradient(110, 90, 30, 100, 100, 70);

    // ctx.globalCompositeOperation = "lighter";
    // // Add three color stops
    // gradient.addColorStop(0, 'rgba(255,255,200,0.2)');
    // gradient.addColorStop(1, 'transparent');

    // // Set the fill style and draw a rectangle
    // ctx.fillStyle = gradient;
    // ctx.fillRect(20, 20, 160, 160);

    ctx.translate(positionRef.current.x, positionRef.current.y)

    ctx.save()

    ctx.translate(-positionRef.current.x, -positionRef.current.y)

    // ctx.globalCompositeOperation = "lighter"
    // for (const light of lights) {
    //   const x = light.position.x
    //   const y = light.position.y
    //   const radius = light.radius

    //   var gradient = ctx.createRadialGradient(
    //     x,
    //     y,
    //     light.innerRadius,
    //     x,
    //     y,
    //     light.radius + Math.round(Math.random() * 20)
    //   )
    //   gradient.addColorStop(
    //     0,
    //     `rgba(${light.color.join(",")},${
    //       light.intensity + (Math.random() / 30 - 1 / 30)
    //     })`
    //   )
    //   gradient.addColorStop(1, `rgba(${light.color.join(",")},${0})`)
    //   ctx.fillStyle = gradient
    //   ctx.fillRect(
    //     light.position.x - radius - 50,
    //     light.position.y - radius - 50,
    //     radius * 2 + 100,
    //     radius * 2 + 100
    //   )
    // }
    ctx.translate(positionRef.current.x, positionRef.current.y)

    ctx.restore()

    const frame = Math.round(new Date().getTime() / 60) % 6

    ctx.fillStyle = "rgba(0,0,0,0.5)"
    ctx.scale(1, 0.5)
    ctx.beginPath()
    ctx.arc(-10, -2, 7, 0, 2 * Math.PI)
    ctx.lineWidth = 1
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
      -25,
      -60,
      30,
      60
    )

    ctx.translate(-10, 0)
    ctx.scale(1, 0.5)

    var gradient = ctx.createRadialGradient(0, 0, 2, 0, 0, 12)
    // Add three color stops
    gradient.addColorStop(0, "rgba(0,0,0,0.4)")
    gradient.addColorStop(1, "transparent")

    // Set the fill style and draw a rectangle
    ctx.fillStyle = gradient
    // ctx.fillRect(-100, -100, 200, 200)

    ctx.scale(1, 2)
    ctx.translate(10, 0)

    ctx.translate(
      -window.innerWidth / currentZoom.current / 2,
      -window.innerHeight / currentZoom.current / 2
    )

    ctx.save()

    const getDark = () => {
      if (timeRef.current.h < 5) return 0.8
      if (timeRef.current.h < 6) return 0.6
      if (timeRef.current.h < 7) return 0.4
      if (timeRef.current.h < 8) return 0.2

      if (timeRef.current.h > 22) return 0.8
      if (timeRef.current.h > 21) return 0.6
      if (timeRef.current.h > 20) return 0.4
      if (timeRef.current.h > 19) return 0.2

      return 0
    }

    // ctx.restore()

    // ctx.globalCompositeOperation = "luminosity";
    // ctx.globalAlpha = 0.5
    // ctx.fillStyle = "#000000"
    // ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
    // ctx.fillStyle = "#ffffff"
    // ctx.fillRect(100, 100, 100, 100)
    // ctx.fillStyle = "#ffff00"
    // ctx.fillRect(200, 300, 50, 50)
    // ctx.restore()

    // ctx.save()

    // ctx.globalCompositeOperation = "luminosity";
    // ctx.fillStyle = "black"
    // ctx.globalAlpha = 0.7
    // ctx.fillRect(0, 0, 400, window.innerHeight)

    // ctx.fillStyle = "rgba(128,128,128, 1)"
    // ctx.fillRect(200, 200, 200, 200)

    // ctx.restore()

    drawShadows(ctx)
  }

  const drawShadows = (ctx: CanvasRenderingContext2D) => {
    // for (let y = 0; y < canvasRef.current.height; y++) {
    //   for (let x = 0; x < canvasRef.current.width; x++) {
    //     ctx.fillStyle = `rgba(0,0,0,${y / canvasRef.current.height})`
    //     ctx.fillRect(x, y, 1, 1)
    //   }
    // }
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
