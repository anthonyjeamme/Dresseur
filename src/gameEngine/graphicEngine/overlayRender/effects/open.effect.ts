import { easeInOut } from "../../../../components/utils/math"
import { TEffectRenderer } from "../useOverlayRender"

export const openEffect: TEffectRenderer = (ctx, ratio, { height, width }) => {
  const circleSize = Math.max(
    0,
    easeInOut(ratio) * Math.max(height / 2, width / 2) * 1.42
  )

  if (circleSize === 0) {
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, width, height)
    return
  }

  const x = Math.round(width / 2)
  const y = Math.round(height / 2)

  var gradient = ctx.createRadialGradient(x, y, 0, x, y, circleSize)
  gradient.addColorStop(1, "transparent")
  gradient.addColorStop(1, "black")
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
}
