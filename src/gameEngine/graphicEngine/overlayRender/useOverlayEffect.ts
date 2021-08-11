import { useRef } from "react"
import { timeout } from "../../../components/utils/time"

export const useOverlayEffect = (): TOverlayHook => {
  const currentOverlayOffectRef = useRef<TOverlayEffect>(null)

  const getCurrentOverlayOffect = () => currentOverlayOffectRef.current
  const setCurrentOverlayOffect = (overlayEffect: TOverlayEffect) => {
    currentOverlayOffectRef.current = {
      ...overlayEffect,
      startTime: new Date().getTime(),
      state: "running",
    }
  }

  const play = async (name: TOverlayEffectType, duration: number = 1000) => {
    if (getCurrentOverlayOffect()?.state === "running") {
      throw `already running an effect`
      return
    }

    setCurrentOverlayOffect({
      name,
      duration,
    })

    await timeout(duration)

    while (getCurrentOverlayOffect().state !== "finished") {
      await timeout(20)
    }
  }

  return {
    play,
    getCurrentOverlayOffect,
    setCurrentOverlayOffect,
  }
}

export type TOverlayHook = {
  play: (name: TOverlayEffectType, duration?: number) => Promise<void>
  getCurrentOverlayOffect: () => TOverlayEffect
  setCurrentOverlayOffect: (effect: TOverlayEffect) => void
}

export type TOverlayEffectType = "open" | "close" | "fadein" | "fadeout"

export type TOverlayEffect = {
  name: string
  params?: any
  startTime?: number
  state?: "running" | "finished"
  duration?: number
}
