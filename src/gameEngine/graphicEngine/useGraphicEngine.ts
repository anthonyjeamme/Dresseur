import { getRendererCtx, getRendererSize } from "./graphicEngine.utils"
import { useOverlayRender } from "./overlayRender/useOverlayRender"
import { useRendererReferences } from "./utils/useRenderedReferences"

export const useGraphicEngine = (): TGraphicEngine => {
  const renderers = useRendererReferences()
  const overlayRender = useOverlayRender(renderers)

  const render = () => {
    if (!canDraw()) return

    clearRenderers()

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
