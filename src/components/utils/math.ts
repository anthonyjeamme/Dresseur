import { TPosition } from "../../gameEngine/Types/Math/Position"

export const positionAreEqual = (a: TPosition, b: TPosition) =>
  a.x === b.x && a.y === b.y

export const easeInOut = (t: number) => {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
}
