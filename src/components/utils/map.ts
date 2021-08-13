import { TPosition } from "../../gameEngine/Types/Math/Position"

export const findSectorCoordsFromPosition = (position: TPosition) => {
  const x = Math.floor(position.x / 32 / 32),
    y = Math.floor(position.y / 32 / 32)
  return { x, y }
}
