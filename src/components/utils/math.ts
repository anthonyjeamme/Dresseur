import { TPosition } from "../../gameEngine/Types/Math/Position"

export const positionAreEqual = (a: TPosition, b: TPosition) =>
  a.x === b.x && a.y === b.y
