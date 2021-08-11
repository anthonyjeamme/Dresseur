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

/**
 * WARNING Do not use this function directly. Prefer to use useUserInteractions.
 **/
export const useKeyboard = (keyboardUserConfiguration: TActionBindings) => {
  const inputKeyMapRef = useRef<TInputKeyMap>({})

  useEffect(() => {
    inputKeyMapRef.current = getInputKeyMap(keyboardUserConfiguration)
  }, [keyboardUserConfiguration])

  const keyDownRef = useRef<{ [key: string]: boolean }>({})

  const eventListenersRef = useRef<
    {
      [action in TUserAction]?: TInteractionEventCallback[]
    }
  >({})

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

  const handleKeyDown = (e: KeyboardEvent) => {
    if (keyDownRef.current[e.key]) return
    keyDownRef.current[e.key] = true

    const action = inputKeyMapRef.current[e.key]

    if (!action?.length) return

    if (eventListenersRef.current[action])
      for (const callback of eventListenersRef.current[action])
        callback({
          action,
        })
  }

  const handleKeyUp = (e: KeyboardEvent) => {
    delete keyDownRef.current[e.key]
  }

  const handleBlur = () => {
    keyDownRef.current = {}
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    window.addEventListener("blur", handleBlur)

    return () => {
      window.removeEventListener("keyup", handleKeyUp)
      window.removeEventListener("keydown", handleKeyUp)
      window.removeEventListener("blur", handleBlur)
    }
  })
  const getKey = (key: string) => keyDownRef.current[key]

  const isActive = (e: TUserAction) => {
    for (const key of keyboardUserConfiguration[e]) {
      if (getKey(key)) return true
    }

    return false
  }

  return {
    addEventListener,
    removeEventListener,
    isActive,
  }
}
