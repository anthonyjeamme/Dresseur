import { getRendererCtx, getRendererSize } from "../graphicEngine.utils"
import { TRendererReferences } from "../utils/useRenderedReferences"

export const useShadowRender = (renderers: TRendererReferences) => {
  //

  const render = () => {
    const ctx = getRendererCtx(renderers.overlayCanvasRef)

    const { width, height } = getRendererSize(renderers.overlayCanvasRef)

    ctx.clearRect(0, 0, width, height)

    ctx.fillStyle = getDayColor()
    ctx.fillRect(0, 0, width, height)
  }

  return {
    render,
  }
}

const getDayColor = () => {
  const position =
    new Date().getTime() / 1000 / 60 / 60 -
    Math.floor(new Date().getTime() / 1000 / 60 / 60)

  const ambianceColor = getColorFromGradient(gradient, 0.9)

  return `rgba(${ambianceColor.join(",")})`
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

const getBetweenNumber = (a, b, ratio) => a + (b - a) * ratio
const getBetweenColor = ([r1, g1, b1], [r2, g2, b2], ratio) => [
  Math.round(getBetweenNumber(r1, r2, ratio)),
  Math.round(getBetweenNumber(g1, g2, ratio)),
  Math.round(getBetweenNumber(b1, b2, ratio)),
]
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
