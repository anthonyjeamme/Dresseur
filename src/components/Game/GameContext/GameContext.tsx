import React, { useRef } from "react"
import {
  TOverlayHook,
  useOverlayEffect,
} from "../../../gameEngine/graphicEngine/overlayRender/useOverlayEffect"
import {
  TResourceLoaderContext,
  useResourceLoader,
} from "../../../gameEngine/loader/loader"
import { TPosition } from "../../../gameEngine/Types/Math/Position"
import { TPlayerStateHook, usePlayerState } from "./playerState/usePlayerState"

const gameContext = React.createContext(null)

export const useGameContext = () => React.useContext<TGameContext>(gameContext)

export const GameContextProvider = ({ children }) => {
  const overlayEffect = useOverlayEffect()
  const playerState = usePlayerState(initialState)
  const gameResources = useResourceLoader()

  const setPlayerPositionTo = (map: string, position: TPosition) => {
    // LOAD

    playerState.get().location = {
      map,
      position,
    }
  }

  return (
    <gameContext.Provider
      value={{ overlayEffect, playerState, setPlayerPositionTo, gameResources }}
    >
      {children}
    </gameContext.Provider>
  )
}

type TGameContext = {
  overlayEffect: TOverlayHook
  playerState: TPlayerStateHook
  setPlayerPositionTo: (mapId: string, position: TPosition) => void
  gameResources: TResourceLoaderContext
}

const initialState = {
  location: {
    position: {
      x: 0,
      y: 0,
    },
  },
}
