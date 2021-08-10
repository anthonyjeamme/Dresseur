export const getRendererCtx = (
  renderer: React.MutableRefObject<HTMLCanvasElement>
) => {
  return renderer.current.getContext("2d")
}

export const getRendererSize = (
  renderer: React.MutableRefObject<HTMLCanvasElement>
) => {
  const { clientHeight: height, clientWidth: width } = renderer.current

  return {
    height,
    width,
  }
}

export const getCanvasSize = (
  renderer: React.MutableRefObject<HTMLCanvasElement>
) => {
  const { height, width } = renderer.current
  return {
    height,
    width,
  }
}

export const centerCanvas = (
  renderer: React.MutableRefObject<HTMLCanvasElement>,
  ctx: CanvasRenderingContext2D,
  func
) => {
  const { height, width } = getCanvasSize(renderer)

  const d_height = Math.round(height / 2)
  const d_width = Math.round(width / 2)

  ctx.translate(d_width, d_height)

  func()

  ctx.translate(-d_width, -d_height)
}
