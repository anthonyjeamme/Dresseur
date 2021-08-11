import { TEffectRenderer } from "../useOverlayRender"

export const fadeinEffect: TEffectRenderer = (
  ctx,
  ratio,
  { height, width }
) => {
  ctx.fillStyle = `rgba(0,0,0,${ratio})`
  ctx.fillRect(0, 0, width, height)
}
