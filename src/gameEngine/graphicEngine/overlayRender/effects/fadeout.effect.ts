import { TEffectRenderer } from "../useOverlayRender"

export const fadeoutEffect: TEffectRenderer = (
  ctx,
  ratio,
  { height, width }
) => {
  ctx.fillStyle = `rgba(0,0,0,${Math.max(0, 1 - ratio)})`
  ctx.fillRect(0, 0, width, height)
}
