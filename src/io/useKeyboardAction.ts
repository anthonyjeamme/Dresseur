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

  const gamePadBinding = {
    ACTION_GO_UP: [12],
    ACTION_GO_DOWN: [13],
    ACTION_GO_LEFT: [14],
    ACTION_GO_RIGHT: [15],
  }

  const gamepadRef = useRef<number>(null)

  useEffect(() => {
    window.addEventListener("gamepadconnected", function (e) {
      console.log(
        "Contrôleur n°%d connecté : %s. %d boutons, %d axes.",
        e.gamepad.index,
        e.gamepad.id,
        e.gamepad.buttons.length,
        e.gamepad.axes.length
      )

      gamepadRef.current = e.gamepad.index
    })
    window.addEventListener("gamepaddisconnected", e => {
      if (gamepadRef.current === e.gamepad.index) {
        gamepadRef.current = null
      }
    })
  }, [])

  return {
    isActive: (action: TAction) => {
      const bind = keyBinding[action]

      for (const key of bind) {
        if (keyMapper.getKey(key)) return true
      }

      if (gamepadRef.current !== null) {
        const gamepad = navigator.getGamepads()[gamepadRef.current]

        const buttons = []

        for (let i_button = 0; i_button < gamepad.buttons.length; i_button++) {
          if (gamepad.buttons[i_button].pressed) {
            buttons.push(i_button)
          }
        }

        for (const but of buttons) {
          if (gamePadBinding[action].includes(but)) return true
        }

        const [xaxis, yaxis] = gamepad.axes

        if (xaxis > 0.2 && action === "ACTION_GO_RIGHT") return true
        if (xaxis < -0.2 && action === "ACTION_GO_LEFT") return true
        if (yaxis > 0.2 && action === "ACTION_GO_DOWN") return true
        if (yaxis < -0.2 && action === "ACTION_GO_UP") return true
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
