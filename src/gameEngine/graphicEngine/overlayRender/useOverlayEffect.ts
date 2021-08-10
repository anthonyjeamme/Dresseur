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

  const play = async (name: "open" | "close") => {
    if (getCurrentOverlayOffect()?.state === "running") {
      throw `already running an effect`
      return
    }

    const duration = 1000

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
  play: (name: "open" | "close") => Promise<void>
  getCurrentOverlayOffect: () => TOverlayEffect
  setCurrentOverlayOffect: (effect: TOverlayEffect) => void
}

export type TOverlayEffect = {
  name: string
  params?: any
  startTime?: number
  state?: "running" | "finished"
  duration?: number
}
