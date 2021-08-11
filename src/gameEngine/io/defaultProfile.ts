import { TInputUserConfiguration } from "./io.types"

export const defaultInputUserConfiguration: TInputUserConfiguration = {
  keyboard: {
    up: ["z", "ArrowUp"],
    down: ["s", "ArrowDown"],
    left: ["q", "ArrowLeft"],
    right: ["d", "ArrowRight"],
    interact: ["e"],
    menu: ["Esc"],
  },
  gamepad: {
    up: ["12"],
    down: ["13"],
    left: ["14"],
    right: ["15"],
    interact: ["0"],
    menu: ["9"],
  },
}
