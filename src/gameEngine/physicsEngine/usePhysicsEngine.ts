import { useRef } from "react"
import { useGameContext } from "../../components/Game/GameContext/GameContext"
import { TUserInteractionsHook } from "../io/useUserInteractions"

export const usePhysicsEngine = (
  userInteractions: TUserInteractionsHook
): TPhysicsEngine => {
  const gameContext = useGameContext()
  const lastTimeoutRef = useRef<number>(new Date().getTime())

  const executeLoop = () => {
    const dt = (new Date().getTime() - lastTimeoutRef.current) / 1000
    lastTimeoutRef.current = new Date().getTime()

    if (gameContext.playerState.get().movementDisabled) return

    if (userInteractions.isActive("down")) {
      gameContext.playerState.get().location.position.y += dt * 100
    }
    if (userInteractions.isActive("up")) {
      gameContext.playerState.get().location.position.y -= dt * 100
    }
    if (userInteractions.isActive("left")) {
      gameContext.playerState.get().location.position.x -= dt * 100
    }
    if (userInteractions.isActive("right")) {
      gameContext.playerState.get().location.position.x += dt * 100
    }
  }

  return {
    executeLoop,
  }
}

type TPhysicsEngine = {
  executeLoop: () => void
}
