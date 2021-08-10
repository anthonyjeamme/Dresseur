import { easeInOut } from "../../../../components/utils/math"
import { TEffectRenderer } from "../useOverlayRender"

export const openEffect: TEffectRenderer = (ctx, ratio, { height, width }) => {
  const circleSize = Math.max(
    0,
    easeInOut(ratio) * Math.max(height / 2, width / 2) * 1.42
  )

  if (circleSize === 0) {
    ctx.fillStyle = "black"
    ctx.fillRect(-height, -height, height * 2, width * 2)
    return
  }

  var gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, circleSize)
  gradient.addColorStop(1, "transparent")
  gradient.addColorStop(1, "black")
  ctx.fillStyle = gradient
  ctx.fillRect(-Math.ceil(width / 2), -Math.ceil(height / 2), width, height)
}
