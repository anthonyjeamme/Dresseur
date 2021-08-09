import React, { useEffect, useRef } from "react"
import { TileSet } from "../../../../gameEngine/Objects/TileSet/TileSet"
import { TPosition, TSize } from "../../../../gameEngine/Types/Math/Position"
import useIsMounted from "../../../../utils/useIsMounted"
import { useTileSetEditorContext } from "../TilesetEditor"

import "./TilesetEditorContent.scss"

const PIXEL_SIZE = 3

const TilesetEditorContent = ({
  tileset,
  currentTileRef,
  handleSelectTile,
}: {
  tileset: TileSet
  currentTileRef: React.MutableRefObject<any>
  handleSelectTile: (props: TPosition & TSize, push: boolean) => void
}) => {
  const { img } = useTileSetEditorContext()

  const rootRef = useRef<HTMLDivElement>()
  const canvasRef = useRef<HTMLCanvasElement>()
  const positionRef = useRef<TPosition>({
    x: Math.round(img.width / 2),
    y: Math.round(img.height / 2),
  })
  const draggingRef = useRef<boolean>(false)

  const selectionRef = useRef<TSelection>(null)

  const isMounted = useIsMounted()

  const currentHoverTile = useRef<TPosition>(null)

  const getCanvasSize = () => {
    const { height, width } = canvasRef.current
    return { height, width }
  }

  const getCtx = () => {
    return canvasRef.current.getContext("2d")
  }

  const getCanvasOffset = () => {
    const { height, width } = getCanvasSize()

    const d_height = Math.round(height / 2) - Math.round(positionRef.current.y)
    const d_width = Math.round(width / 2) - Math.round(positionRef.current.x)

    return {
      d_height,
      d_width,
    }
  }

  const center = func => {
    const ctx = getCtx()

    const { d_height, d_width } = getCanvasOffset()

    ctx.translate(d_width, d_height)

    func()

    ctx.translate(-d_width, -d_height)
  }

  const resizeCanvas = () => {
    canvasRef.current.height = Math.round(rootRef.current.clientHeight / 3)
    canvasRef.current.width = Math.round(rootRef.current.clientWidth / 3)
  }

  useEffect(() => {
    gameLoop()
  }, [])

  const gameLoop = () => {
    if (!isMounted()) return
    drawTile()
    window.requestAnimationFrame(gameLoop)
  }

  const drawTile = () => {
    const ctx = getCtx()
    const canvasSize = getCanvasSize()
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height)

    center(() => {
      ctx.drawImage(img, 0, 0)
      if (currentHoverTile.current) {
        ctx.fillStyle = "rgba(255,0,0,0.3)"
        ctx.fillRect(
          currentHoverTile.current.x * 32,
          currentHoverTile.current.y * 32,
          32,
          32
        )
      }

      if (selectionRef.current) {
        const { x, y, width, height } = getSelection(selectionRef.current)

        ctx.fillStyle = "rgba(255,0,0,0.3)"
        ctx.fillRect(x, y, width, height)
      }

      if (currentTileRef.current) {
        // console.log("TODO")
        const tile = tileset.tiles[currentTileRef.current]

        const frames = tile.frames

        for (const frame of frames) {
          ctx.strokeStyle = "red"
          ctx.lineWidth = 1
          const [x, y, width, height] = frame.coords

          ctx.strokeRect(x + 1, y + 1, width - 2, height - 2)
        }
      }
    })
  }

  const getSelection = (selection: TSelection) => {
    const x = Math.min(selection.from.x, selection.to.x) * 32
    const y = Math.min(selection.from.y, selection.to.y) * 32

    const width = Math.abs(selection.from.x - selection.to.x) * 32 + 32
    const height = Math.abs(selection.from.y - selection.to.y) * 32 + 32

    return {
      x,
      y,
      width,
      height,
    }
  }

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    if (draggingRef.current) return

    if (e.shiftKey) {
      positionRef.current.x -= (e.deltaY / 100) * 3 * 4
    } else {
      positionRef.current.y += (e.deltaY / 100) * 3 * 4
    }
  }

  const handleMouseMove = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const getPositionInCanvas = () => {
      const { clientX, clientY } = e

      const { d_height, d_width } = getCanvasOffset()

      return {
        x: Math.floor(clientX / PIXEL_SIZE) - d_width,
        y:
          Math.floor((clientY - rootRef.current.offsetTop) / PIXEL_SIZE) -
          d_height,
      }
    }

    const getCurrentTile = () => {
      const { x, y } = getPositionInCanvas()

      return {
        x: Math.floor(x / 32),
        y: Math.floor(y / 32),
      }
    }

    if (selectionRef.current) {
      selectionRef.current.to = getCurrentTile()
    }

    if (draggingRef.current) {
      positionRef.current.x -= e.movementX / PIXEL_SIZE
      positionRef.current.y -= e.movementY / PIXEL_SIZE
    } else {
      currentHoverTile.current = getCurrentTile()
    }
  }

  useEffect(() => {
    resizeCanvas()

    window.addEventListener("resize", resizeCanvas)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <div className="TilesetEditorContent" ref={rootRef}>
      <canvas
        onMouseUp={e => {
          if (e.button === 1) {
            draggingRef.current = false
          } else if (e.button === 0) {
            handleSelectTile(getSelection(selectionRef.current), e.shiftKey)
            selectionRef.current = null
          }
        }}
        onMouseLeave={() => {
          draggingRef.current = false
          currentHoverTile.current = null
        }}
        onMouseDown={e => {
          if (e.button === 1) {
            draggingRef.current = true
          } else if (e.button === 0) {
            selectionRef.current = {
              from: currentHoverTile.current,
              to: currentHoverTile.current,
            }
          }
        }}
        ref={canvasRef}
        onContextMenu={e => {
          e.preventDefault()
        }}
        onWheel={handleWheel}
        onMouseMove={handleMouseMove}
      />
    </div>
  )
}

export default TilesetEditorContent

type TSelection = {
  from: TPosition
  to: TPosition
}
