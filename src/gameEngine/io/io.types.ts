export type TInputKeyMap = {
  [key: string]: TUserAction
}

export type TUserActions = {
  [key in TUserAction]?: boolean
}

export type TUserAction = "up" | "down" | "left" | "right" | "interact" | "menu"

export type TActionBindings<T = string> = {
  [key in TUserAction]: T[]
}

export type TInputUserConfiguration = {
  keyboard: TActionBindings
  gamepad: TActionBindings
}

export type TInteractionAddEventListener = (
  event: TUserAction,
  callback: TInteractionEventCallback
) => any

export type TInteractionRemoveEventListener = (
  event: TUserAction,
  callback: TInteractionEventCallback
) => any

export type TInteractionEvent = {
  action: TUserAction
}

export type TInteractionEventCallback = (event: TInteractionEvent) => void
