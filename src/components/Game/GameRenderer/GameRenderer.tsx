import React from "react"
import { TGraphicEngine } from "../../../gameEngine/graphicEngine/useGraphicEngine"

import { useCanvasAutoResize } from "./useCanvasAutoResize"

import "./GameRenderer.scss"

const GameRenderer = ({ graphicEngine }: TGameRendererProps) => {
  useCanvasAutoResize(
    [
      graphicEngine.renderers.baseCanvasRef,
      graphicEngine.renderers.shadowCanvasRef,
      graphicEngine.renderers.overlayCanvasRef,
    ],
    graphicEngine
  )

  return (
    <div className="GameRenderer">
      <canvas id="base-canvas" ref={graphicEngine.renderers.baseCanvasRef} />
      <canvas
        id="shadow-canvas"
        ref={graphicEngine.renderers.shadowCanvasRef}
      />
      <div className="game-ui" />
      <canvas
        id="overlay-canvas"
        ref={graphicEngine.renderers.overlayCanvasRef}
      />
    </div>
  )
}

export default GameRenderer

type TGameRendererProps = {
  graphicEngine: TGraphicEngine
}
