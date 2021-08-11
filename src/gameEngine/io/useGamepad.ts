import { useEffect, useRef } from "react"
import {
  TActionBindings,
  TInputKeyMap,
  TInteractionAddEventListener,
  TInteractionEventCallback,
  TInteractionRemoveEventListener,
  TUserAction,
} from "./io.types"
import { getInputKeyMap } from "./io.utils"

export const useGamepad = (
  gamepadUserConfiguration: TActionBindings<string>
) => {
  const inputKeyMapRef = useRef<TInputKeyMap>({})
  const keyDownRef = useRef<{ [key: string]: boolean }>({})
  const intervalRef = useRef(null)
  const eventListenersRef = useRef<
    {
      [action in TUserAction]?: TInteractionEventCallback[]
    }
  >({})

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const detectionLoop = () => {
    const gamepad = getCurrentGamepad()

    if (!gamepad) {
      clearInterval(intervalRef.current)
      return
    }

    const buttonDown = {}

    for (const [index, button] of Object.entries(gamepad.buttons)) {
      if (button.pressed) {
        if (!keyDownRef.current[index.toString()]) {
          if (inputKeyMapRef.current[index])
            for (const action of inputKeyMapRef.current[index]) {
              if (eventListenersRef.current[action]?.length) {
                for (const callback of eventListenersRef.current[action]) {
                  callback({})
                }
              }
            }
        }

        buttonDown[index.toString()] = true
      }
    }

    keyDownRef.current = buttonDown
  }

  useEffect(() => {
    inputKeyMapRef.current = getInputKeyMap(gamepadUserConfiguration)
  }, [gamepadUserConfiguration])

  const currentGamepadIndexRef = useRef<string>(null)

  const addEventListener: TInteractionAddEventListener = (event, callback) => {
    if (!eventListenersRef.current[event]) eventListenersRef.current[event] = []
    eventListenersRef.current[event].push(callback)
  }

  const removeEventListener: TInteractionRemoveEventListener = (
    event,
    callback
  ) => {
    eventListenersRef.current[event] = eventListenersRef.current[event].filter(
      _callback => _callback !== callback
    )
  }

  const handleGamepadConnected = (e: GamepadEvent) => {
    console.log(`New gamepad [${e.gamepad.index}] connected`)
    currentGamepadIndexRef.current = e.gamepad.index.toString()
    intervalRef.current = setInterval(detectionLoop, 20)
  }

  const handleGamepadDisconnected = (e: GamepadEvent) => {
    if (e.gamepad.index.toString() === currentGamepadIndexRef.current) {
      console.log(`Gamepad [${e.gamepad.index}] diconnected`)
      currentGamepadIndexRef.current = null
      clearInterval(intervalRef.current)
    }
  }

  useEffect(() => {
    window.addEventListener("gamepadconnected", handleGamepadConnected)
    window.addEventListener("gamepaddisconnected", handleGamepadDisconnected)

    return () => {
      window.removeEventListener("gamepadconnected", handleGamepadConnected)
      window.removeEventListener(
        "gamepaddisconnected",
        handleGamepadDisconnected
      )
    }
  }, [])

  const getCurrentGamepad = (): Gamepad => {
    const gamepad = navigator.getGamepads()[currentGamepadIndexRef.current]
    return gamepad || null
  }

  const isActive = (action: TUserAction) => {
    if (currentGamepadIndexRef.current === null) return false
    const gamepad = getCurrentGamepad()
    for (const keyString of gamepadUserConfiguration[action]) {
      const key = parseInt(keyString, 10)
      if (gamepad.buttons[key].pressed) return true
    }
    return false
  }

  return { addEventListener, removeEventListener, isActive }
}
