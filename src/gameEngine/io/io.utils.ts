import { TActionBindings, TInputKeyMap } from "./io.types"

export const getInputKeyMap = (
  actionBindings: TActionBindings
): TInputKeyMap => {
  const keysMap = {}

  for (const [action, keys] of Object.entries(actionBindings))
    for (const key of keys) {
      if (keysMap[key]) keysMap[key].push(action)
      else keysMap[key] = [action]
    }

  return keysMap
}
