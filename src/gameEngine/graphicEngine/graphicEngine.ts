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
  } catch {}

  ctx.translate(position.x, position.y)
  ctx.translate(-window.innerWidth / 8, -window.innerHeight / 8)
}

const drawTile = (
  tile: Tile,
  position: TPosition,
  name: string,
  ctx: CanvasRenderingContext2D
) => {
  const { coords }: { coords: number[] } = tile.json[name]

  if (!coords) {
    throw `Unknown tile name '${name}'`
    return
  }

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
