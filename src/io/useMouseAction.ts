// Useful ?

export const useMouseAction = () => {
  const onMouseDown = (e: React.MouseEvent<any, MouseEvent>) => {}
  const onMouseUp = (e: React.MouseEvent<any, MouseEvent>) => {}

  return {
    onMouseDown,
    onMouseUp,
  }
}
