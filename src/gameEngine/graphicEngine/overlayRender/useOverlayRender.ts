import { useGameContext } from "../../../components/Game/GameContext/GameContext"
import { now } from "../../../components/utils/time"
import { TSize } from "../../Types/Math/Position"
import {
  centerCanvas,
  getCanvasSize,
  getRendererCtx,
} from "../graphicEngine.utils"
import { TRendererReferences } from "../utils/useRenderedReferences"
import { closeEffect } from "./effects/close.effect"
import { openEffect } from "./effects/open.effect"

export const useOverlayRender = (renderers: TRendererReferences) => {
  const gameContext = useGameContext()

  const render = () => {
    const renderer = renderers.overlayCanvasRef

    const effect = gameContext.overlayEffect.getCurrentOverlayOffect()

    if (!effect) return

    if (!effects[effect.name]) {
      throw `Effect ${effect.name} doesn't exists`
    }

    const ctx = getRendererCtx(renderer)
    const { height, width } = getCanvasSize(renderer)

    const ratio = Math.min(1, (now() - effect.startTime) / effect.duration)

    if (ratio >= 1) effect.state = "finished"

    centerCanvas(renderer, ctx, () => {
      try {
        effects[effect.name](ctx, ratio, { height, width })
      } catch (err) {
        console.log(
          `[OVERLAY EFFECT] an error occured when rendering effect : `,
          err
        )
      }
    })
  }

  const effects = {
    open: openEffect,
    close: closeEffect,
  }

  return { render }
}

export type TEffectRenderer = (
  ctx: CanvasRenderingContext2D,
  ratio: number,
  canvasSize: TSize
) => void
