import React, { useRef } from "react"
import {
  TOverlayHook,
  useOverlayEffect,
} from "../../../gameEngine/graphicEngine/overlayRender/useOverlayEffect"
import { usePlayerState } from "./playerState/usePlayerState"

const gameContext = React.createContext(null)

export const useGameContext = () => React.useContext<TGameContext>(gameContext)

export const GameContextProvider = ({ children }) => {
  const overlayEffect = useOverlayEffect()
  const playerState = usePlayerState(initialState)

  return (
    <gameContext.Provider value={{ overlayEffect, playerState }}>
      {children}
    </gameContext.Provider>
  )
}

type TGameContext = {
  overlayEffect: TOverlayHook
}

const initialState = {}
