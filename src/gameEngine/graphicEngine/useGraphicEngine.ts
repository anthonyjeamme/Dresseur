import { useGameContext } from "../../components/Game/GameContext/GameContext"
import { renderTileMap } from "./graphicEngine"
import {
  centerCanvas,
  getRendererCtx,
  getRendererSize,
} from "./graphicEngine.utils"

import { useOverlayRender } from "./overlayRender/useOverlayRender"
import { useRendererReferences } from "./utils/useRenderedReferences"

export const useGraphicEngine = (): TGraphicEngine => {
  const gameContext = useGameContext()
  const renderers = useRendererReferences()
  const overlayRender = useOverlayRender(renderers)

  const render = () => {
    if (!canDraw()) return

    clearRenderers()

    const sectors = gameContext.gameResources.getSectorIds()

    const ctx = renderers.baseCanvasRef.current.getContext("2d")

    centerCanvas(renderers.baseCanvasRef, ctx, () => {
      const x = Math.round(gameContext.playerState.get().location.position.x)
      const y = Math.round(gameContext.playerState.get().location.position.y)

      ctx.translate(-x, -y)

      for (const sectorId of sectors) {
        const sector = gameContext.gameResources.getSector(sectorId)

        // console.log(sectorId)

        if (sector) {
          ctx.translate(
            sector.globalPosition.x * 32 * 32,
            sector.globalPosition.y * 32 * 32
          )
          // console.log(sector.globalPosition.x * 32 * 32)

          renderTileMap(ctx, sector.map.tileMap)

          ctx.translate(
            -sector.globalPosition.x * 32 * 32,
            -sector.globalPosition.y * 32 * 32
          )
        }
      }

      ctx.translate(x, y)

      ctx.fillStyle = "red"

      const { direction, walking } = gameContext.playerState.get().physics

      const iDirection =
        direction === "down"
          ? 0
          : direction === "up"
          ? 1
          : direction === "left"
          ? 2
          : 3

      const frame = Math.round(new Date().getTime() / 60) % 6

      ctx.drawImage(
        gameContext.gameResources.getPlayerImage(),

        walking ? 30 * frame : 0,

        //   (keyboard.isActive("ACTION_GO_DOWN") ? 60 : 0) + 60 * frame,
        // lastDirection.current

        iDirection * 60,
        30,
        60,
        -15,
        -60,
        30,
        60
      )
    })

    overlayRender.render()
  }

  const canDraw = () =>
    !Object.values(renderers).find(renderer => !renderer.current)

  const clearRenderers = () => {
    Object.values(renderers).forEach(renderer => {
      const ctx = getRendererCtx(renderer)
      const { height, width } = getRendererSize(renderer)
      ctx.clearRect(0, 0, width, height)
    })
  }

  const params = {
    pixel_size: 3,
  }

  return {
    params,
    renderers,
    render,
  }
}

export type TGraphicEngine = {
  params: {
    pixel_size: number
  }
  renderers: {
    baseCanvasRef: React.MutableRefObject<HTMLCanvasElement>
    shadowCanvasRef: React.MutableRefObject<HTMLCanvasElement>
    overlayCanvasRef: React.MutableRefObject<HTMLCanvasElement>
  }
  render: () => void
}
