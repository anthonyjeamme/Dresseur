import { defaultInputUserConfiguration } from "./defaultProfile"
import {
  TInputUserConfiguration,
  TInteractionAddEventListener,
  TInteractionRemoveEventListener,
  TUserAction,
} from "./io.types"
import { useGamepad } from "./useGamepad"
import { useKeyboard } from "./useKeyboard"

export const useUserInteractions = (
  inputUserConfiguration: TInputUserConfiguration = defaultInputUserConfiguration
): TUserInteractionsHook => {
  const keyboard = useKeyboard(inputUserConfiguration.keyboard)
  const gamepad = useGamepad(inputUserConfiguration.gamepad)

  const isActive = (userAction: TUserAction) => {
    const mobileInput = document.getElementById("mobile-buttons-current")

    if (mobileInput && mobileInput.value === userAction) return true

    keyboard.isActive(userAction) || gamepad.isActive(userAction)
  }

  const addEventListener: TInteractionAddEventListener = (...props) => {
    keyboard.addEventListener(...props)
    gamepad.addEventListener(...props)
  }

  const removeEventListener: TInteractionRemoveEventListener = (...props) => {
    keyboard.removeEventListener(...props)
    gamepad.removeEventListener(...props)
  }

  return {
    isActive,
    addEventListener,
    removeEventListener,
  }
}

export type TUserInteractionsHook = {
  isActive: (userAction: TUserAction) => boolean
  addEventListener: TInteractionAddEventListener
  removeEventListener: TInteractionRemoveEventListener
}
