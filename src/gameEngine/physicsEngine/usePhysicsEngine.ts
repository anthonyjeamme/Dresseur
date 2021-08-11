import { useRef } from "react"
import { useGameContext } from "../../components/Game/GameContext/GameContext"
import { TUserInteractionsHook } from "../io/useUserInteractions"
import { TPosition } from "../Types/Math/Position"

export const usePhysicsEngine = (
  userInteractions: TUserInteractionsHook,
  trigger: (data: any) => void
): TPhysicsEngine => {
  const gameContext = useGameContext()
  const lastTimeoutRef = useRef<number>(new Date().getTime())

  const executeLoop = () => {
    const dt = (new Date().getTime() - lastTimeoutRef.current) / 1000
    lastTimeoutRef.current = new Date().getTime()

    if (gameContext.playerState.get().movementDisabled) return

    const { x, y } = gameContext.playerState.get().location.position

    const nextPosition: TPosition = { x, y }

    if (userInteractions.isActive("down")) {
      nextPosition.y += dt * 100
      gameContext.playerState.get().physics.direction = "down"
    }
    if (userInteractions.isActive("up")) {
      nextPosition.y -= dt * 100
      gameContext.playerState.get().physics.direction = "up"
    }
    if (userInteractions.isActive("left")) {
      nextPosition.x -= dt * 100
      gameContext.playerState.get().physics.direction = "left"
    }
    if (userInteractions.isActive("right")) {
      nextPosition.x += dt * 100
      gameContext.playerState.get().physics.direction = "right"
    }

    if (
      userInteractions.isActive("down") ||
      userInteractions.isActive("up") ||
      userInteractions.isActive("left") ||
      userInteractions.isActive("right")
    ) {
      const tileCoord = {
        x: Math.floor(Math.round(nextPosition.x) / 32),
        y: Math.floor(Math.round(nextPosition.y) / 32),
      }

      const sector = gameContext.gameResources.getSectorFromCoords({
        x: 0,
        y: 0,
      })

      const walkable =
        sector.map.tileMap[tileCoord.y].cells[tileCoord.x].base?.physics?.walk

      if (walkable) {
        if (tileCoord.x === 17 && tileCoord.y === 17) {
          trigger(null)

          return
        }

        gameContext.playerState.get().location.position = nextPosition

        gameContext.playerState.get().physics.walking = true
      }
    } else {
      gameContext.playerState.get().physics.walking = false
    }
  }

  return {
    executeLoop,
  }
}

type TPhysicsEngine = {
  executeLoop: () => void
}
