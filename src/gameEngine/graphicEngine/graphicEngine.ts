import { Scene } from "../Objects/Scene/Scene"
import { Tile } from "../Objects/Tile/Tile"
import { TPosition } from "../Types/Math/Position"

export const render = (
  scene: Scene,
  ctx: CanvasRenderingContext2D,
  position: TPosition
) => {
  // TODO

  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

  ctx.translate(window.innerWidth / 8, window.innerHeight / 8)

  ctx.translate(-position.x, -position.y)

  try {
    renderTiles(scene, ctx)
  } catch (err) {
    console.log(err)
  }

  ctx.translate(position.x, position.y)
  ctx.translate(-window.innerWidth / 8, -window.innerHeight / 8)
}

export const drawTile = (
  tile: Tile,
  position: TPosition,
  name: string,
  ctx: CanvasRenderingContext2D
) => {
  // @ts-ignore
  const { coords }: { coords: number[] } = tile.json[name]

  if (!coords) {
    throw `Unknown tile name '${name}'`
    return
  }

  // @ts-ignore
  ctx.drawImage(tile.image, ...coords, position.x, position.y, 32, 32)
}

const renderTiles = (scene: Scene, ctx: CanvasRenderingContext2D) => {
  for (let y = 0; y < scene.map.length; y++) {
    for (let x = 0; x < scene.map[y]?.length; x++) {
      const cell = scene.getCell({ x, y })

      drawTile(cell.tile, { x: x * 32, y: y * 32 }, cell.id, ctx)
    }
  }
}

export const renderMap = (ctx: CanvasRenderingContext2D, map: Tile[][]) => {
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 3; x++) {
      renderTile(ctx, map[y][x], { x: x * 32, y: y * 32 })
    }
  }
}

export const renderObjects = (ctx: CanvasRenderingContext2D, objects) => {
  // console.log(objects)

  const sorted = objects.sort((a, b) => a.position.y - b.position.y)

  for (const object of sorted) {
    ctx.translate(-object.origin.x, -object.origin.y)

    // console.log(object.origin)

    ctx.fillStyle = "rgba(25, 12, 70, 0.25)"
    ctx.scale(1, 0.5)
    ctx.beginPath()
    ctx.arc(
      object.position.x + 32,
      object.position.y * 2 + 32 * 3 * 2 - 4,
      16,
      0,
      2 * Math.PI
    )
    ctx.fill()
    ctx.scale(1, 2)

    renderTile(ctx, object.tile, object.position, { h: 32 * 3, w: 32 * 2 })

    ctx.translate(object.origin.x, object.origin.y)
  }
}

export const renderTileMap = (
  ctx: CanvasRenderingContext2D,
  map: { cells: { base: Tile; over: Tile[] }[] }[]
) => {
  for (let y = 0; y < 32; y++) {
    for (let x = 0; x < 32; x++) {
      try {
        renderTile(ctx, map[y].cells[x].base, {
          x: x * 32,
          y: y * 32,
        })
      } catch (err) {
        console.log("err", err)
      }

      for (const over of map[y].cells[x].over) {
        renderTile(ctx, over, {
          x: x * 32,
          y: y * 32,
        })
      }
    }
  }
}

export const renderTile = (
  ctx: CanvasRenderingContext2D,
  tile: Tile,
  position: TPosition,
  size = { h: 32, w: 32 }
) => {
  if (!tile?.getAnimationProps) return

  const frame =
    Math.round(new Date().getTime() / tile.getAnimationProps().frameDuration) %
    tile.getFramesLength()

  ctx.drawImage(
    tile.getImg(),
    ...tile.getFrame(frame).coords.get(),
    position.x,
    position.y,
    size.w,
    size.h
  )
}
