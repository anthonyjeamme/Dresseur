import { useEffect, useRef } from "react"

export const useRendererReferences = (): TRendererReferences => {
  const baseCanvasRef = useRef<HTMLCanvasElement>()
  const shadowCanvasRef = useRef<HTMLCanvasElement>()
  const overlayCanvasRef = useRef<HTMLCanvasElement>()

  useEffect(() => {
    cleanCanvasEvents(baseCanvasRef.current)
    cleanCanvasEvents(shadowCanvasRef.current)
    cleanCanvasEvents(overlayCanvasRef.current)
  }, [])

  return {
    baseCanvasRef,
    shadowCanvasRef,
    overlayCanvasRef,
  }
}

export type TRendererReferences = {
  baseCanvasRef: React.MutableRefObject<HTMLCanvasElement>
  shadowCanvasRef: React.MutableRefObject<HTMLCanvasElement>
  overlayCanvasRef: React.MutableRefObject<HTMLCanvasElement>
}

const cleanCanvasEvents = (canvas: HTMLCanvasElement) => {
  canvas.oncontextmenu = e => e.preventDefault()
}
