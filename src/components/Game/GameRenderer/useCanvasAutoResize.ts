import { MutableRefObject, useEffect } from "react"
import { TGraphicEngine } from "../../../gameEngine/graphicEngine/useGraphicEngine"

export const useCanvasAutoResize = (
  canvasList: MutableRefObject<HTMLCanvasElement>[],
  graphicEngine: TGraphicEngine
) => {
  const handleResizeCanvas = () => {
    for (const canvasRef of canvasList) {
      canvasRef.current.height = Math.floor(
        (canvasRef.current.clientHeight /
          (graphicEngine.params.pixel_size / window.devicePixelRatio)) *
          (navigator.userAgentData.mobile ? 2 : 1)
      )
      canvasRef.current.width = Math.floor(
        (canvasRef.current.clientWidth /
          (graphicEngine.params.pixel_size / window.devicePixelRatio)) *
          (navigator.userAgentData.mobile ? 2 : 1)
      )
    }
  }

  useEffect(() => {
    handleResizeCanvas()

    window.addEventListener("resize", handleResizeCanvas)

    return () => {
      window.removeEventListener("resize", handleResizeCanvas)
    }
  }, [])
}
