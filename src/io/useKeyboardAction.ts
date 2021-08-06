import { useEffect, useRef } from "react"

const useKeyMapper = () => {
  const keyMapRef = useRef({})

  useEffect(() => {
    const handleKeyDown = e => {
      keyMapRef.current[e.key] = true
    }

    const handleKeyUp = e => {
      keyMapRef.current[e.key] = false
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  return {
    getKey: (key: string) => keyMapRef.current[key],
  }
}

export const useKeyboardAction = () => {
  const keyMapper = useKeyMapper()

  const keyBinding = {
    ACTION_GO_UP: ["ArrowUp", "z"],
    ACTION_GO_DOWN: ["ArrowDown", "s"],
    ACTION_GO_LEFT: ["ArrowLeft", "q"],
    ACTION_GO_RIGHT: ["ArrowRight", "d"],
  }

  return {
    isActive: (action: TAction) => {
      const bind = keyBinding[action]

      for (const key of bind) {
        if (keyMapper.getKey(key)) return true
      }
      return false
    },
  }
}

export type TAction =
  | "ACTION_GO_UP"
  | "ACTION_GO_DOWN"
  | "ACTION_GO_LEFT"
  | "ACTION_GO_RIGHT"
